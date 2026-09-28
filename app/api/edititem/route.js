import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';
import { getAuthUser } from '@/lib/auth';
import { sanitizeString, isValidId } from '@/lib/sanitize';

export async function POST(request) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const name = sanitizeString(formData.get('name'), 100);
    const description = sanitizeString(formData.get('description'), 2000);
    const question = sanitizeString(formData.get('question'), 200);
    const rawType = sanitizeString(formData.get('type'), 10);
    const type = rawType === 'Found' ? 'Found' : 'Lost';

    if (!isValidId(id)) {
      return NextResponse.json({ message: 'Invalid item ID' }, { status: 400 });
    }

    const updates = {
      ...(name && { name }),
      ...(description && { description }),
      ...(question && { question }),
      ...(type && { type }),
    };

    const conn = await connectToDatabase();
    if (conn && mongoose.Types.ObjectId.isValid(id)) {
      const existing = await Item.findOne({ _id: id });
      if (existing) {
        // IDOR CHECK: Only the creator can edit this item
        if (String(existing.createdBy) !== authUser.userId) {
          return NextResponse.json(
            { message: 'Forbidden: You do not have permission to edit this listing.' },
            { status: 403 }
          );
        }

        const updated = await Item.findOneAndUpdate({ _id: id }, updates, { new: true }).lean();
        dataStore.updateItem(id, updates);

        return NextResponse.json({
          message: 'Item updated successfully',
          item: { ...updated, _id: String(updated._id) },
        });
      }
    }

    // In-memory verification
    const inMem = dataStore.findItemById(id);
    if (!inMem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }
    if (String(inMem.createdBy) !== authUser.userId) {
      return NextResponse.json(
        { message: 'Forbidden: You do not have permission to edit this listing.' },
        { status: 403 }
      );
    }

    const updated = dataStore.updateItem(id, updates);
    return NextResponse.json({ message: 'Item updated successfully', item: updated });
  } catch (error) {
    console.error('Secure edititem error:', error);
    return NextResponse.json({ message: 'Failed to update item' }, { status: 500 });
  }
}
