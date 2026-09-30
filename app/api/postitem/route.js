import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';
import { getAuthUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeString } from '@/lib/sanitize';

export async function POST(request) {
  // Require authentication
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { message: 'Unauthorized. Please log in to post an item.' },
      { status: 401 }
    );
  }

  // Rate limit: max 20 item posts per 15 minutes
  const rateLimit = checkRateLimit(request, {
    prefix: 'post_item',
    maxRequests: 20,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { message: `Too many submissions. Please wait ${rateLimit.resetIn} seconds before posting again.` },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const name = sanitizeString(formData.get('name'), 100);
    const description = sanitizeString(formData.get('description'), 2000);
    const question = sanitizeString(formData.get('question'), 200);
    const rawType = sanitizeString(formData.get('type'), 10);
    const type = rawType === 'Found' ? 'Found' : 'Lost';

    if (!name || !description || !question) {
      return NextResponse.json(
        { message: 'Name, description, and security question are required.' },
        { status: 400 }
      );
    }

    // STRICT ACCESS CONTROL: Force createdBy to be the authenticated user's ID
    const createdBy = authUser.userId;

    // Process uploaded photos
    const rawFiles = formData.getAll('itemPictures');
    const itemPictures = [];

    for (const file of rawFiles) {
      if (file && typeof file === 'object' && typeof file.arrayBuffer === 'function' && file.size > 0) {
        if (file.size <= 5 * 1024 * 1024) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const mimeType = file.type || 'image/jpeg';
          const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;
          itemPictures.push({ img: base64Data });
        }
      } else if (typeof file === 'string' && file.trim()) {
        itemPictures.push({ img: file.trim() });
      }
    }

    // If no user pictures were uploaded, apply contextual fallback images
    if (itemPictures.length === 0) {
      const fallbackPictures =
        type === 'Lost'
          ? [{ img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60' }]
          : [{ img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60' }];
      itemPictures.push(...fallbackPictures);
    }

    const conn = await connectToDatabase();
    if (conn) {
      const newItem = await Item.create({
        name,
        description,
        question,
        type,
        status: true,
        createdBy,
        itemPictures,
      });

      const sanitized = {
        ...newItem.toObject(),
        _id: String(newItem._id),
      };

      dataStore.addItem(sanitized);
      return NextResponse.json({ message: 'Item created successfully', item: sanitized });
    }

    const newItem = dataStore.addItem({
      name,
      description,
      question,
      type,
      createdBy,
      itemPictures,
    });

    return NextResponse.json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    console.error('Secure postitem error:', error);
    return NextResponse.json({ message: 'Failed to create item' }, { status: 500 });
  }
}
