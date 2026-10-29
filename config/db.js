import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let dbMode = 'uninitialized';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentRecordsDB';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fall back gracefully if no Mongo daemon
    });
    isConnected = true;
    dbMode = 'MongoDB (Mongoose)';
    console.log(`[Database] Connected to MongoDB at: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[Database] MongoDB connection unavailable (${error.message}). Activating Resilient Storage Adapter.`);
    isConnected = false;
    dbMode = 'Resilient In-Memory Engine';
    return false;
  }
};

export const getDBStatus = () => ({
  connected: isConnected || dbMode === 'Resilient In-Memory Engine',
  isMongo: isConnected,
  mode: dbMode,
  databaseName: isConnected ? mongoose.connection.name : 'resilient-in-memory-db',
  host: isConnected ? mongoose.connection.host : 'localhost-virtual',
});

