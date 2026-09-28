import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';
import { getAuthUser } from '@/lib/auth';
import { isValidId } from '@/lib/sanitize';

export async function POST(request) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const itemId = body?.item_id;

    if (!isValidId(itemId)) {
      return NextResponse.json({ message: 'Invalid item ID' }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (conn && mongoose.Types.ObjectId.isValid(itemId)) {
      const existing = await Item.findOne({ _id: itemId });
      if (existing) {
        // IDOR / ACCESS CONTROL CHECK: Only the item creator can delete it
        if (String(existing.createdBy) !== authUser.userId) {
          return NextResponse.json(
            { message: 'Forbidden: You do not have permission to delete this listing.' },
            { status: 403 }
          );
        }

        await Item.deleteOne({ _id: existing._id });
        return NextResponse.json({ message: 'Item deleted successfully' });
      }
    }

    // Fallback store verification
    const inMem = dataStore.findItemById(itemId);
    if (!inMem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    if (String(inMem.createdBy) !== authUser.userId) {
      return NextResponse.json(
        { message: 'Forbidden: You do not have permission to delete this listing.' },
        { status: 403 }
      );
    }

    dataStore.deleteItem(itemId);
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Secure deleteitem error:', error);
    return NextResponse.json({ message: 'Failed to delete item' }, { status: 500 });
  }
}
