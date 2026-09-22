import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const question = formData.get('question');
    const type = formData.get('type') || 'Lost';
    const createdBy = formData.get('createdBy') || 'user_demo_1';

    const fallbackPictures =
      type === 'Lost'
        ? [{ img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60' }]
        : [{ img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60' }];

    const itemPictures = fallbackPictures;

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

      // Also add to dataStore cache
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
    console.error('postitem error:', error);
    return NextResponse.json({ message: 'Failed to create item' }, { status: 500 });
  }
}
