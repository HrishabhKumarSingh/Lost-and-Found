import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const items = await Item.find({ createdBy: String(id) }).sort({ createdAt: -1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json(items.map((i) => ({ ...i, _id: String(i._id) })));
      }
    }
  } catch (err) {
    console.error('mylistings error:', err);
  }

  const items = dataStore.getItems().filter((i) => i.createdBy === id);
  return NextResponse.json(items);
}
