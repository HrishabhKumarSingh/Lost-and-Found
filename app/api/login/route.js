import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { dataStore } from '@/lib/dataStore';
import { signToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeString, isValidEmail } from '@/lib/sanitize';

export async function POST(request) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const rateLimit = checkRateLimit(request, {
    prefix: 'auth_login',
    maxRequests: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { message: `Too many login attempts. Please try again in ${rateLimit.resetIn} seconds.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const email = sanitizeString(body?.email, 100).toLowerCase();
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    let user = null;
    let isMatch = false;

    if (conn) {
      // Must explicitly select password because select: false is set on schema
      user = await User.findOne({ email }).select('+password');
      if (user) {
        isMatch = await user.comparePassword(password);
      }
    }

    // Fallback for pre-seeded in-memory demo store
    if (!user || !isMatch) {
      const demoUser = dataStore.findUserByEmail(email);
      if (demoUser) {
        if (demoUser.password && (demoUser.password.startsWith('$2a$') || demoUser.password.startsWith('$2b$'))) {
          isMatch = bcrypt.compareSync(password, demoUser.password);
        } else {
          isMatch = demoUser.password === password;
        }
        if (isMatch) {
          user = demoUser;
        }
      }
    }

    if (!user || !isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signToken(user);

    const userSafe = {
      _id: String(user._id),
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      number: user.number,
    };

    return NextResponse.json({
      jwt_token: token,
      user: userSafe,
    });
  } catch (error) {
    console.error('Secure login error:', error);
    return NextResponse.json(
      { message: 'Unable to process login. Please try again.' },
      { status: 500 }
    );
  }
}
