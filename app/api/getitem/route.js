import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(request) {
  // Rate limit: 120 feed requests per minute per IP
  const rateLimit = checkRateLimit(request, {
    prefix: 'feed_get',
    maxRequests: 120,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { message: 'Rate limit exceeded. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const items = await Item.find({ status: true })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      if (items && items.length > 0) {
        const sanitized = items.map((i) => ({
          _id: String(i._id),
          name: i.name,
          description: i.description,
          question: i.question,
          type: i.type,
          status: i.status,
          itemPictures: i.itemPictures || [],
          createdAt: i.createdAt,
        }));
        return NextResponse.json({ postitems: sanitized });
      }
    }
  } catch (err) {
    console.error('Secure getitem error:', err);
  }

  const items = dataStore.getItems().filter((i) => i.status !== false);
  return NextResponse.json({
    postitems: items,
  });
}
