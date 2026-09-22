import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const body = await request.json();

    const conn = await connectToDatabase();
    if (conn) {
      await Message.create({
        name: body.name || 'Anonymous',
        email: body.email || '',
        message: body.message || '',
      });
    }

    dataStore.addMessage(body);
    return NextResponse.json({ message: 'Message received. We will get back to you soon!' });
  } catch (error) {
    console.error('sendmessage error:', error);
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
  }
}
