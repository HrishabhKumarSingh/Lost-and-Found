import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function GET(request, { params }) {
  const { id } = params;
  const items = dataStore.getItems().filter((i) => i.createdBy === id);
  return NextResponse.json(items);
}
