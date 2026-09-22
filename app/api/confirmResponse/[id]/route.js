import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { response } = await request.json();

    const updated = dataStore.updateAnswerResponse(id, response);

    if (!updated) {
      return NextResponse.json({ message: 'Answer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Response updated', answer: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update response' }, { status: 500 });
  }
}
