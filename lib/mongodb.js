import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastError: null };
}

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    cached.lastError = 'MONGODB_URI environment variable is missing';
    console.warn('[MongoDB]', cached.lastError);
    return null;
  }

  // If already connected, reuse connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If disconnected or never connected, initiate connection
  if (!cached.promise || mongoose.connection.readyState === 0) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('[MongoDB] Successfully connected to MongoDB Atlas.');
      cached.lastError = null;
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      cached.conn = null;
      cached.lastError = err.message;
      console.error('[MongoDB] Connection error:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    cached.lastError = null;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.lastError = e.message;
    console.error('[MongoDB] Failed to resolve connection:', e.message);
    return null;
  }
}

export function getLastMongoError() {
  return cached?.lastError || null;
}

export default connectToDatabase;
