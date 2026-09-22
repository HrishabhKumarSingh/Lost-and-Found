import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const { item_id } = await request.json();
    dataStore.deleteItem(item_id);
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete item' }, { status: 500 });
  }
}
