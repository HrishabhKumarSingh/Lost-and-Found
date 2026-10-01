import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase, { getLastMongoError } from '@/lib/mongodb';
import User from '@/models/User';
import Item from '@/models/Item';
import Answer from '@/models/Answer';

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json({
      connected: false,
      status: 'MISSING_ENV_VARIABLE',
      message: 'MONGODB_URI is not set in environment variables. If running on Vercel, add MONGODB_URI in Project Settings > Environment Variables, and then REDEPLOY.',
    });
  }

  // Mask credentials for safety
  const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        connected: false,
        status: 'CONNECTION_FAILED',
        uri: maskedUri,
        lastError: getLastMongoError(),
        message: 'connectToDatabase returned null. Check lastError above.',
      });
    }

    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const readyState = mongoose.connection.readyState;

    const userCount = await User.countDocuments();
    const itemCount = await Item.countDocuments();
    const answerCount = await Answer.countDocuments();

    return NextResponse.json({
      connected: readyState === 1,
      status: stateMap[readyState] || 'unknown',
      uri: maskedUri,
      database: mongoose.connection.db?.databaseName || 'unknown',
      counts: {
        users: userCount,
        items: itemCount,
        answers: answerCount,
      },
      message: 'MongoDB Atlas is successfully connected and saving data.',
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      status: 'ERROR',
      uri: maskedUri,
      errorName: error.name,
      errorMessage: error.message,
      lastError: getLastMongoError(),
      message: 'Failed to connect to MongoDB Atlas. Check your username, password, and IP whitelist (0.0.0.0/0).',
    }, { status: 500 });
  }
}
