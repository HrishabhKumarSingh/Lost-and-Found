import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Answer from '@/models/Answer';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const data = await request.json();
    const { itemId, question, answer, givenBy, belongsTo } = data;

    if (!itemId || !answer) {
      return NextResponse.json({ message: 'Answer is required' }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (conn) {
      const newAnswer = await Answer.create({
        itemId: String(itemId),
        question,
        answer,
        givenBy: String(givenBy),
        belongsTo: String(belongsTo),
        response: 'Moderation',
      });

      const sanitized = {
        ...newAnswer.toObject(),
        _id: String(newAnswer._id),
      };

      dataStore.addAnswer(sanitized);

      return NextResponse.json({ message: 'Answer submitted successfully', answer: sanitized });
    }

    const newAnswer = dataStore.addAnswer({
      itemId,
      question,
      answer,
      givenBy,
      belongsTo,
    });

    return NextResponse.json({ message: 'Answer submitted successfully', answer: newAnswer });
  } catch (error) {
    console.error('submitAnswer error:', error);
    return NextResponse.json({ message: 'Failed to submit answer' }, { status: 500 });
  }
}
