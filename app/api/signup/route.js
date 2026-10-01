import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { dataStore } from '@/lib/dataStore';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeString, isValidEmail } from '@/lib/sanitize';

export async function POST(request) {
  // Rate limit: 10 registrations per 15 minutes per IP
  const rateLimit = checkRateLimit(request, {
    prefix: 'auth_signup',
    maxRequests: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { message: `Too many registration attempts. Please try again in ${rateLimit.resetIn} seconds.` },
      { status: 429 }
    );
  }

  try {
    const data = await request.json();
    const firstname = sanitizeString(data?.firstname, 50);
    const lastname = sanitizeString(data?.lastname, 50);
    const email = sanitizeString(data?.email, 100).toLowerCase();
    const number = sanitizeString(data?.number, 30);
    const password = typeof data?.password === 'string' ? data.password : '';

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (conn) {
      const existing = await User.findOne({ email });
      if (existing) {
        return NextResponse.json(
          { message: 'User with this email already exists. Please log in.' },
          { status: 409 }
        );
      }

      // Password hashing is handled automatically by UserSchema.pre('save')
      const newUser = new User({
        firstname,
        lastname,
        email,
        number: number || '+1 (555) 000-0000',
        password,
        date: new Date(),
      });

      await newUser.save();
      return NextResponse.json('Done');
    }

    if (process.env.MONGODB_URI) {
      return NextResponse.json(
        { message: 'Database connection failed. Please ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0).' },
        { status: 500 }
      );
    }

    // Fallback store only for local dev when MONGODB_URI is not set
    const existing = dataStore.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { message: 'User with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    dataStore.addUser({
      firstname,
      lastname,
      email,
      number: number || '+1 (555) 000-0000',
      password,
      date: new Date().toISOString(),
    });

    return NextResponse.json('Done');
  } catch (error) {
    console.error('Secure signup error:', error);
    return NextResponse.json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
