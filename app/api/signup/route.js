import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const data = await request.json();
    const { firstname, lastname, email, number, password } = data;

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (conn) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return NextResponse.json(
          { message: 'User with this email already exists. Please log in.' },
          { status: 409 }
        );
      }

      await User.create({
        firstname,
        lastname,
        email: email.toLowerCase(),
        number: number || '+1 (555) 000-0000',
        password,
      });

      return NextResponse.json('Done');
    }

    // Fallback if DB not available
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
    });

    return NextResponse.json('Done');
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
