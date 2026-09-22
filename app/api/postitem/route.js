import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const question = formData.get('question');
    const type = formData.get('type') || 'Lost';
    const createdBy = formData.get('createdBy') || 'user_demo_1';

    // Collect image files or mock placeholder images
    const rawFiles = formData.getAll('itemPictures');
    let itemPictures = [];

    // Fallback pictures based on item type
    const fallbackPictures = type === 'Lost'
      ? [{ img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60' }]
      : [{ img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60' }];

    itemPictures = fallbackPictures;

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
    return NextResponse.json({ message: 'Failed to create item' }, { status: 500 });
  }
}
