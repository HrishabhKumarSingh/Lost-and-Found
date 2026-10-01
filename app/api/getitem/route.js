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

      const sanitized = (items || []).map((i) => ({
        _id: String(i._id),
        name: i.name,
        description: i.description,
        question: i.question,
        type: i.type,
        status: i.status,
        itemPictures: i.itemPictures || [],
        createdAt: i.createdAt || i.date,
        date: i.date || i.createdAt,
      }));

      return NextResponse.json({ postitems: sanitized });
    }

    if (process.env.MONGODB_URI) {
      return NextResponse.json(
        { message: 'Database connection failed. Please verify MONGODB_URI and Atlas network access.' },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('Secure getitem error:', err);
    if (process.env.MONGODB_URI) {
      return NextResponse.json(
        { message: 'Database error fetching items.' },
        { status: 500 }
      );
    }
  }

  const items = dataStore.getItems().filter((i) => i.status !== false);
  return NextResponse.json({
    postitems: items,
  });
}
