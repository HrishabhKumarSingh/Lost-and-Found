import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const { item_id } = await request.json();

    const conn = await connectToDatabase();
    if (conn) {
      if (mongoose.Types.ObjectId.isValid(item_id)) {
        await Item.findByIdAndDelete(item_id);
      } else {
        await Item.findOneAndDelete({ _id: item_id });
      }
    }

    dataStore.deleteItem(item_id);
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('deleteitem error:', error);
    return NextResponse.json({ message: 'Failed to delete item' }, { status: 500 });
  }
}
