import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function GET(request, { params }) {
  const { id } = params;
  const item = dataStore.findItemById(id);

  if (!item) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }

  const answers = dataStore.getAnswersByItemId(id);

  return NextResponse.json({
    Item: [item],
    Answers: answers,
  });
}
