import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Answer from '@/models/Answer';
import { dataStore } from '@/lib/dataStore';
import { getAuthUser } from '@/lib/auth';
import { isValidId } from '@/lib/sanitize';

export async function POST(request, { params }) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const body = await request.json();
    const rawResponse = body?.response;

    if (!isValidId(id)) {
      return NextResponse.json({ message: 'Invalid response ID' }, { status: 400 });
    }

    if (rawResponse !== 'Yes' && rawResponse !== 'No') {
      return NextResponse.json(
        { message: 'Invalid response status. Allowed values are Yes or No.' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (conn && mongoose.Types.ObjectId.isValid(id)) {
      const answerDoc = await Answer.findOne({ _id: id });
      if (answerDoc) {
        // STRICT ACCESS CONTROL: Only the owner of the item (belongsTo) can moderate this response
        if (String(answerDoc.belongsTo) !== authUser.userId) {
          return NextResponse.json(
            { message: 'Forbidden: Only the item owner can moderate this claim response.' },
            { status: 403 }
          );
        }

        answerDoc.response = rawResponse;
        await answerDoc.save();

        return NextResponse.json({
          message: 'Response updated successfully',
          answer: { ...answerDoc.toObject(), _id: String(answerDoc._id) },
        });
      }
    }

    // In-memory fallback verification
    const inMem = dataStore.getAnswers().find((a) => a._id === id);
    if (!inMem) {
      return NextResponse.json({ message: 'Answer not found' }, { status: 404 });
    }
    if (String(inMem.belongsTo) !== authUser.userId) {
      return NextResponse.json(
        { message: 'Forbidden: Only the item owner can moderate this claim response.' },
        { status: 403 }
      );
    }

    const updated = dataStore.updateAnswerResponse(id, rawResponse);
    return NextResponse.json({ message: 'Response updated successfully', answer: updated });
  } catch (error) {
    console.error('Secure confirmResponse error:', error);
    return NextResponse.json({ message: 'Failed to update response' }, { status: 500 });
  }
}
