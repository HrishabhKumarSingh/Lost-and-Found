import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const items = await Item.find().sort({ createdAt: -1 }).lean();
      if (items && items.length > 0) {
        const sanitized = items.map((i) => ({ ...i, _id: String(i._id) }));
        return NextResponse.json({ postitems: sanitized });
      }
    }
  } catch (err) {
    console.error('MongoDB getitem error:', err);
  }

  // Fallback to in-memory items
  const items = dataStore.getItems();
  return NextResponse.json({
    postitems: items,
  });
}
