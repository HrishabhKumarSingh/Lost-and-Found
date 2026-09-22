import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    let user = null;

    if (conn) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    // Fallback to dataStore if not found in MongoDB or if connection failed
    if (!user) {
      user = dataStore.findUserByEmail(email);
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials. If new, please sign up or use demo@example.com / password123' },
        { status: 401 }
      );
    }

    if (user.password && user.password !== password) {
      return NextResponse.json(
        { message: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    const userSafe = {
      _id: String(user._id),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      number: user.number,
    };

    return NextResponse.json({
      jwt_token: `token_${user._id}_${Date.now()}`,
      user: userSafe,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login processing error' },
      { status: 500 }
    );
  }
}
