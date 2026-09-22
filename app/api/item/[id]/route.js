import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Item from '@/models/Item';
import Answer from '@/models/Answer';
import { dataStore } from '@/lib/dataStore';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      let item = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        item = await Item.findById(id).lean();
      }
      if (!item) {
        item = await Item.findOne({ _id: id }).lean();
      }

      if (item) {
        const answers = await Answer.find({ itemId: id }).sort({ createdAt: -1 }).lean();
        const sanitizedItem = { ...item, _id: String(item._id) };
        const sanitizedAnswers = (answers || []).map((a) => ({ ...a, _id: String(a._id) }));

        return NextResponse.json({
          Item: [sanitizedItem],
          Answers: sanitizedAnswers,
        });
      }
    }
  } catch (err) {
    console.error('item/[id] MongoDB error:', err);
  }

  // Fallback to dataStore
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
