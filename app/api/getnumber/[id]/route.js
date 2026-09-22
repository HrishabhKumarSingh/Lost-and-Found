import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { dataStore } from '@/lib/dataStore';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      let user = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id).lean();
      }
      if (!user) {
        user = await User.findOne({ _id: id }).lean();
      }

      if (user && user.number) {
        return NextResponse.json({ number: user.number });
      }
    }
  } catch (err) {
    console.error('getnumber error:', err);
  }

  const user = dataStore.findUserById(id);
  if (!user) {
    return NextResponse.json({ number: '+1 (555) 789-0123' });
  }
  return NextResponse.json({ number: user.number || '+1 (555) 789-0123' });
}
