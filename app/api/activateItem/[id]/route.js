import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function POST(request, { params }) {
  const { id } = params;
  const item = dataStore.updateItem(id, { status: true });
  if (!item) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Item reactivated successfully', item });
}
