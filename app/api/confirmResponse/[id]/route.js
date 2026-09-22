import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Answer from '@/models/Answer';
import { dataStore } from '@/lib/dataStore';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { response } = await request.json();

    const conn = await connectToDatabase();
    if (conn) {
      let updated = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        updated = await Answer.findByIdAndUpdate(id, { response }, { new: true }).lean();
      }
      if (!updated) {
        updated = await Answer.findOneAndUpdate({ _id: id }, { response }, { new: true }).lean();
      }

      if (updated) {
        dataStore.updateAnswerResponse(id, response);
        return NextResponse.json({
          message: 'Response updated',
          answer: { ...updated, _id: String(updated._id) },
        });
      }
    }

    const updated = dataStore.updateAnswerResponse(id, response);
    if (!updated) {
      return NextResponse.json({ message: 'Answer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Response updated', answer: updated });
  } catch (error) {
    console.error('confirmResponse error:', error);
    return NextResponse.json({ message: 'Failed to update response' }, { status: 500 });
  }
}
