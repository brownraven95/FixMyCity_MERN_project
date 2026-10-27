import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fixmycity";
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");

  try {
    console.log(`📡 Connecting to MongoDB (${maskedUri})...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout for cloud handshake
    });
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection error: ${error.message}`);
    console.log(`Attempting in-memory database fallback...`);

    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log(`✅ Connected to in-memory fallback MongoDB: ${memUri}`);
    } catch (memError) {
      console.error(`❌ Could not start MongoDB fallback: ${memError.message}`);
      console.error(`👉 Ensure your MongoDB Atlas IP Access List has 0.0.0.0/0 (Allow from Anywhere) enabled!`);
      // Keep server alive so logs and health checks can be inspected
    }
  }
};
