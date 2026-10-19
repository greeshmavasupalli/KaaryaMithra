import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed/seed.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed database if fresh deployment or empty
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[KaaryaMithra Server] Initializing fresh database with seed data...');
        await seedDatabase();
      }
    } catch (seedErr) {
      console.warn('[KaaryaMithra Server] Notice during seed check:', seedErr.message);
    }

    app.listen(PORT, () => {
      console.log(`[KaaryaMithra Server] Running on port ${PORT}`);
      console.log(`[KaaryaMithra Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('[KaaryaMithra Server] Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

