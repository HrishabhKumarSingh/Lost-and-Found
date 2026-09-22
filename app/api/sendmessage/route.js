import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const body = await request.json();
    dataStore.addMessage(body);
    return NextResponse.json({ message: 'Message received. We will get back to you soon!' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
  }
}
