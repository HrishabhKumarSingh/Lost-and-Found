import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';
import { dataStore } from '@/lib/dataStore';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeString, isValidEmail } from '@/lib/sanitize';

export async function POST(request) {
  // Rate limit: 5 inquiries per 15 minutes per IP
  const rateLimit = checkRateLimit(request, {
    prefix: 'contact_msg',
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { message: `Too many inquiries sent. Please wait ${rateLimit.resetIn} seconds before sending another message.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const name = sanitizeString(body?.name, 50);
    const email = sanitizeString(body?.email, 100).toLowerCase();
    const message = sanitizeString(body?.message, 1000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (conn) {
      await Message.create({ name, email, message });
    }

    dataStore.addMessage({ name, email, message });
    return NextResponse.json({ message: 'Message received. We will get back to you soon!' });
  } catch (error) {
    console.error('Secure sendmessage error:', error);
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
  }
}
