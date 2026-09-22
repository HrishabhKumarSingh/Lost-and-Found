import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const name = formData.get('name');
    const description = formData.get('description');
    const question = formData.get('question');
    const type = formData.get('type');

    const updated = dataStore.updateItem(id, {
      ...(name && { name }),
      ...(description && { description }),
      ...(question && { question }),
      ...(type && { type }),
    });

    if (!updated) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item updated successfully', item: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update item' }, { status: 500 });
  }
}
