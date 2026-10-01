import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import Answer from '@/models/Answer';
import { dataStore } from '@/lib/dataStore';
import { getAuthUser } from '@/lib/auth';
import { isValidId } from '@/lib/sanitize';

export async function GET(request, { params }) {
  const { id } = params;

  if (!isValidId(id)) {
    return NextResponse.json({ message: 'Invalid item ID' }, { status: 400 });
  }

  const authUser = getAuthUser(request);

  try {
    const conn = await connectToDatabase();
    if (conn && mongoose.Types.ObjectId.isValid(id)) {
      const item = await Item.findOne({ _id: id }).lean();

      if (item) {
        const sanitizedItem = {
          ...item,
          _id: String(item._id),
          date: item.date || item.createdAt,
          createdAt: item.createdAt || item.date,
        };
        const isOwner = authUser && String(item.createdBy) === authUser.userId;

        let visibleAnswers = [];
        if (isOwner) {
          // Owner can review all claim answers
          const answers = await Answer.find({ itemId: String(item._id) })
            .sort({ createdAt: -1 })
            .lean();
          visibleAnswers = (answers || []).map((a) => ({
            ...a,
            _id: String(a._id),
            date: a.date || a.createdAt,
            createdAt: a.createdAt || a.date,
          }));
        } else if (authUser) {
          // Claimant can only see their own submitted answer
          const ownAnswers = await Answer.find({
            itemId: String(item._id),
            givenBy: authUser.userId,
          }).lean();
          visibleAnswers = (ownAnswers || []).map((a) => ({
            ...a,
            _id: String(a._id),
            date: a.date || a.createdAt,
            createdAt: a.createdAt || a.date,
          }));
        }

        return NextResponse.json({
          Item: [sanitizedItem],
          Answers: visibleAnswers,
        });
      }
    }
  } catch (err) {
    console.error('Secure item/[id] error:', err);
  }

  // Fallback to dataStore
  const inMemItem = dataStore.findItemById(id);
  if (!inMemItem) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }

  const isOwner = authUser && String(inMemItem.createdBy) === authUser.userId;
  let visibleAnswers = [];
  if (isOwner) {
    visibleAnswers = dataStore.getAnswersByItemId(id);
  } else if (authUser) {
    visibleAnswers = dataStore.getAnswersByItemId(id).filter((a) => a.givenBy === authUser.userId);
  }

  return NextResponse.json({
    Item: [inMemItem],
    Answers: visibleAnswers,
  });
}
