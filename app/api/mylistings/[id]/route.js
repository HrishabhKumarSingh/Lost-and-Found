import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';
import { getAuthUser } from '@/lib/auth';
import { isValidId } from '@/lib/sanitize';

export async function GET(request, { params }) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  const { id } = params;

  if (!isValidId(id)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  // Access control: User can only access their own listings dashboard
  if (authUser.userId !== id) {
    return NextResponse.json(
      { message: 'Forbidden: You cannot access listings belonging to another user.' },
      { status: 403 }
    );
  }

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const items = await Item.find({ createdBy: String(id) }).sort({ createdAt: -1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json(items.map((i) => ({ ...i, _id: String(i._id) })));
      }
    }
  } catch (err) {
    console.error('Secure mylistings error:', err);
  }

  const items = dataStore.getItems().filter((i) => i.createdBy === id);
  return NextResponse.json(items);
}
