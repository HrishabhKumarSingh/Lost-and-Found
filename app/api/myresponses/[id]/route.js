import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function GET(request, { params }) {
  const { id } = params;
  const answers = dataStore.getAnswersByGivenBy(id);
  return NextResponse.json(answers);
}
