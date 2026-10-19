import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skilldost';

  try {
    // Attempt local or configured MongoDB instance with a 3.5s timeout
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3500,
    });
    console.log(`[SkillDost DB] Connected to MongoDB at ${primaryUri}`);
    return mongoose.connection;
  } catch (err) {
    console.warn(`[SkillDost DB] Warning: Could not connect to primary MongoDB (${err.message}).`);
    console.log('[SkillDost DB] Initializing zero-setup in-memory MongoDB fallback...');

    try {
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'skilldost',
        },
      });
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[SkillDost DB] Successfully connected to zero-setup MongoMemoryServer at ${memUri}`);
      return mongoose.connection;
    } catch (memErr) {
      console.error('[SkillDost DB] Fatal: Failed to initialize in-memory fallback:', memErr);
      throw memErr;
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
    }
  } catch (err) {
    console.error('[SkillDost DB] Error during disconnect:', err.message);
  }
};
