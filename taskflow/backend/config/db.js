import mongoose from 'mongoose';

/**
 * Connect to MongoDB database using Mongoose
 * Reads MONGO_URI from environment variables.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI || mongoURI.trim() === '') {
      console.log('ℹ️  No MONGO_URI provided in .env.');
      console.log('⚡ Running with built-in storage adapter (Demo / Offline mode).');
      return false;
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚡ Running with built-in storage adapter (Fallback mode).');
    return false;
  }
};

export default connectDB;
