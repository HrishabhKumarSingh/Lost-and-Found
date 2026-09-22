import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function POST(request) {
  try {
    const data = await request.json();
    const { itemId, question, answer, givenBy, belongsTo } = data;

    if (!itemId || !answer) {
      return NextResponse.json({ message: 'Answer is required' }, { status: 400 });
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
    return NextResponse.json({ message: 'Failed to submit answer' }, { status: 500 });
  }
}
