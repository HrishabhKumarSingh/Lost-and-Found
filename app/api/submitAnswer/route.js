import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Answer from '@/models/Answer';
import Item from '@/models/Item';
import { dataStore } from '@/lib/dataStore';
import { getAuthUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeString, isValidId } from '@/lib/sanitize';

export async function POST(request) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { message: 'Unauthorized. Please log in to submit a claim.' },
      { status: 401 }
    );
  }

  // Rate limit: 15 claim answers per 15 minutes per IP
  const rateLimit = checkRateLimit(request, {
    prefix: 'submit_answer',
    maxRequests: 15,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { message: `Too many submissions. Please wait ${rateLimit.resetIn} seconds before submitting again.` },
      { status: 429 }
    );
  }

  try {
    const data = await request.json();
    const itemId = data?.itemId;
    const answer = sanitizeString(data?.answer, 500);

    if (!isValidId(itemId) || !answer) {
      return NextResponse.json(
        { message: 'Item ID and answer are required' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (conn) {
      const itemQuery = mongoose.Types.ObjectId.isValid(itemId) ? { _id: itemId } : { _id: itemId };
      const itemDoc = await Item.findOne(itemQuery);

      if (!itemDoc) {
        return NextResponse.json({ message: 'Item not found' }, { status: 404 });
      }

      // Check if user is trying to claim their own item
      if (String(itemDoc.createdBy) === authUser.userId) {
        return NextResponse.json(
          { message: 'You cannot submit a claim for an item you listed yourself.' },
          { status: 400 }
        );
      }

      // Check for duplicate answer by this user
      const existingAnswer = await Answer.findOne({
        itemId: String(itemId),
        givenBy: authUser.userId,
      });

      if (existingAnswer) {
        return NextResponse.json(
          { message: 'You have already submitted an answer for this item.' },
          { status: 409 }
        );
      }

      const newAnswer = await Answer.create({
        itemId: String(itemId),
        question: itemDoc.question,
        answer,
        givenBy: authUser.userId,
        belongsTo: String(itemDoc.createdBy),
        response: 'Moderation',
        date: new Date(),
      });

      const sanitized = {
        ...newAnswer.toObject(),
        _id: String(newAnswer._id),
      };

      dataStore.addAnswer(sanitized);
      return NextResponse.json({ message: 'Answer submitted successfully', answer: sanitized });
    }

    if (process.env.MONGODB_URI) {
      return NextResponse.json(
        { message: 'Database connection failed. Check MongoDB Atlas status.' },
        { status: 500 }
      );
    }

    // Fallback store
    const itemInMem = dataStore.findItemById(itemId);
    if (!itemInMem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }
    if (String(itemInMem.createdBy) === authUser.userId) {
      return NextResponse.json(
        { message: 'You cannot submit a claim for an item you listed yourself.' },
        { status: 400 }
      );
    }

    const newAnswer = dataStore.addAnswer({
      itemId,
      question: itemInMem.question,
      answer,
      givenBy: authUser.userId,
      belongsTo: String(itemInMem.createdBy),
      date: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Answer submitted successfully', answer: newAnswer });
  } catch (error) {
    console.error('Secure submitAnswer error:', error);
    return NextResponse.json({ message: 'Failed to submit answer' }, { status: 500 });
  }
}
