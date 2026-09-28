import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Answer from '@/models/Answer';
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

  // Access control: User can only access their own claim responses
  if (authUser.userId !== id) {
    return NextResponse.json(
      { message: 'Forbidden: You cannot access responses belonging to another user.' },
      { status: 403 }
    );
  }

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const answers = await Answer.find({ givenBy: String(id) }).sort({ createdAt: -1 }).lean();
      if (answers && answers.length > 0) {
        return NextResponse.json(answers.map((a) => ({ ...a, _id: String(a._id) })));
      }
    }
  } catch (err) {
    console.error('Secure myresponses error:', err);
  }

  const answers = dataStore.getAnswersByGivenBy(id);
  return NextResponse.json(answers);
}
