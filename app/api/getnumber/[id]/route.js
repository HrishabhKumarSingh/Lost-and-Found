import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Answer from '@/models/Answer';
import { dataStore } from '@/lib/dataStore';
import { getAuthUser } from '@/lib/auth';
import { isValidId } from '@/lib/sanitize';

export async function GET(request, { params }) {
  const authUser = getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(
      { message: 'Unauthorized. Please log in to view contact details.' },
      { status: 401 }
    );
  }

  const { id } = params;

  if (!isValidId(id)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const isOwnerThemselves = authUser.userId === id;
    let hasApprovedClaim = false;

    const conn = await connectToDatabase();
    if (conn) {
      if (!isOwnerThemselves) {
        // Verify claimant has an APPROVED response for an item belonging to this owner
        const approvedAnswer = await Answer.findOne({
          belongsTo: String(id),
          givenBy: authUser.userId,
          response: 'Yes',
        });
        hasApprovedClaim = !!approvedAnswer;
      }

      // PRIVACY ENFORCEMENT: If neither the owner nor an approved claimant, block access!
      if (!isOwnerThemselves && !hasApprovedClaim) {
        return NextResponse.json(
          { message: 'Forbidden: You must have an approved claim to view this contact number.' },
          { status: 403 }
        );
      }

      if (mongoose.Types.ObjectId.isValid(id)) {
        const owner = await User.findOne({ _id: id }).lean();
        if (owner && owner.number) {
          return NextResponse.json({ number: owner.number });
        }
      }
    }

    // In-memory verification fallback
    if (!isOwnerThemselves) {
      const approvedInMem = dataStore.getAnswers().some(
        (a) => a.belongsTo === id && a.givenBy === authUser.userId && a.response === 'Yes'
      );
      if (!approvedInMem) {
        return NextResponse.json(
          { message: 'Forbidden: You must have an approved claim to view this contact number.' },
          { status: 403 }
        );
      }
    }

    const inMemUser = dataStore.findUserById(id);
    if (!inMemUser) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ number: inMemUser.number });
  } catch (err) {
    console.error('Secure getnumber error:', err);
    return NextResponse.json({ message: 'Failed to retrieve contact number' }, { status: 500 });
  }
}
