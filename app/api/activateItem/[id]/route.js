import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';

export async function POST(request, { params }) {
  const { id } = params;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      let item = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        item = await Item.findByIdAndUpdate(id, { status: true }, { new: true }).lean();
      }
      if (!item) {
        item = await Item.findOneAndUpdate({ _id: id }, { status: true }, { new: true }).lean();
      }

      if (item) {
        dataStore.updateItem(id, { status: true });
        return NextResponse.json({
          message: 'Item reactivated successfully',
          item: { ...item, _id: String(item._id) },
        });
      }
    }
  } catch (err) {
    console.error('activateItem error:', err);
  }

  const item = dataStore.updateItem(id, { status: true });
  if (!item) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Item reactivated successfully', item });
}
