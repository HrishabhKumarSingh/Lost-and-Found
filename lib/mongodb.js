import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[MongoDB] MONGODB_URI environment variable is not defined.');
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
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      cached.conn = null;
      console.error('[MongoDB] Connection error:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error('[MongoDB] Failed to resolve connection:', e.message);
    return null;
  }
}

export default connectToDatabase;
