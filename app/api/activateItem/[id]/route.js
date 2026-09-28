import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';
import { getAuthUser } from '@/lib/auth';
import { isValidId } from '@/lib/sanitize';

export async function POST(request, { params }) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  const { id } = params;

  if (!isValidId(id)) {
    return NextResponse.json({ message: 'Invalid item ID' }, { status: 400 });
  }

  try {
    const conn = await connectToDatabase();
    if (conn && mongoose.Types.ObjectId.isValid(id)) {
      const item = await Item.findOne({ _id: id });
      if (item) {
        // IDOR CHECK: Only the creator can reactivate this item
        if (String(item.createdBy) !== authUser.userId) {
          return NextResponse.json(
            { message: 'Forbidden: You do not have permission to reactivate this listing.' },
            { status: 403 }
          );
        }

        item.status = true;
        await item.save();

        dataStore.updateItem(id, { status: true });
        return NextResponse.json({
          message: 'Item reactivated successfully',
          item: { ...item.toObject(), _id: String(item._id) },
        });
      }
    }

    const inMem = dataStore.findItemById(id);
    if (!inMem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }
    if (String(inMem.createdBy) !== authUser.userId) {
      return NextResponse.json(
        { message: 'Forbidden: You do not have permission to reactivate this listing.' },
        { status: 403 }
      );
    }

    const item = dataStore.updateItem(id, { status: true });
    return NextResponse.json({ message: 'Item reactivated successfully', item });
  } catch (err) {
    console.error('Secure activateItem error:', err);
    return NextResponse.json({ message: 'Failed to reactivate item' }, { status: 500 });
  }
}
