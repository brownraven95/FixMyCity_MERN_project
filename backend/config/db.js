import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB connection failed (${error.message}). Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`✅ Connected to in-memory MongoDB fallback: ${uri}`);
    } catch (memError) {
      console.error(`❌ MongoDB connection error: ${memError.message}`);
      process.exit(1);
    }
  }
};
