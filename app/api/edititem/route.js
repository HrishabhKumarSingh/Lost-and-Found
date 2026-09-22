import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const name = formData.get('name');
    const description = formData.get('description');
    const question = formData.get('question');
    const type = formData.get('type');

    const updates = {
      ...(name && { name }),
      ...(description && { description }),
      ...(question && { question }),
      ...(type && { type }),
    };

    const conn = await connectToDatabase();
    if (conn) {
      let updated = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        updated = await Item.findByIdAndUpdate(id, updates, { new: true }).lean();
      }
      if (!updated) {
        updated = await Item.findOneAndUpdate({ _id: id }, updates, { new: true }).lean();
      }

      if (updated) {
        dataStore.updateItem(id, updates);
        return NextResponse.json({
          message: 'Item updated successfully',
          item: { ...updated, _id: String(updated._id) },
        });
      }
    }

    const updated = dataStore.updateItem(id, updates);
    if (!updated) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item updated successfully', item: updated });
  } catch (error) {
    console.error('edititem error:', error);
    return NextResponse.json({ message: 'Failed to update item' }, { status: 500 });
  }
}
