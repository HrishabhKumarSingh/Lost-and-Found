import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function GET(request, { params }) {
  const { id } = params;
  const user = dataStore.findUserById(id);
  if (!user) {
    return NextResponse.json({ number: '+1 (555) 019-2834' });
  }
  return NextResponse.json({ number: user.number || '+1 (555) 019-2834' });
}
