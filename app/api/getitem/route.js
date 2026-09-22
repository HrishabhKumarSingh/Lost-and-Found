import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  const items = dataStore.getItems();
  return NextResponse.json({
    postitems: items,
  });
}
