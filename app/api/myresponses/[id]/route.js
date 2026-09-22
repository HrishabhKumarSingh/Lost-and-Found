import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Answer from '@/models/Answer';
import { dataStore } from '@/lib/dataStore';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const answers = await Answer.find({ givenBy: String(id) }).sort({ createdAt: -1 }).lean();
      if (answers && answers.length > 0) {
        return NextResponse.json(answers.map((a) => ({ ...a, _id: String(a._id) })));
      }
    }
  } catch (err) {
    console.error('myresponses error:', err);
  }

  const answers = dataStore.getAnswersByGivenBy(id);
  return NextResponse.json(answers);
}
