import { NextResponse } from 'next/server';
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

    const user = dataStore.findUserByEmail(email);

    if (!user) {
      // For convenience during demo/testing: if user does not exist yet,
      // create them on the fly or reject with clean message
      return NextResponse.json(
        { message: 'Invalid credentials. If new, please sign up or use demo@example.com / password123' },
        { status: 401 }
      );
    }

    if (user.password && user.password !== password) {
      return NextResponse.json(
        { message: 'Incorrect password. Try password123' },
        { status: 401 }
      );
    }

    const userSafe = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      number: user.number,
    };

    return NextResponse.json({
      jwt_token: `mock_token_${user._id}_${Date.now()}`,
      user: userSafe,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Login processing error' },
      { status: 500 }
    );
  }
}
