import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[SkillDost Server] Running on http://localhost:${PORT}`);
      console.log(`[SkillDost Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('[SkillDost Server] Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
