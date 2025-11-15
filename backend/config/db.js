 
import mongoose from "mongoose";

const getMongoUri = () =>
  process.env.MONGODB_URI  || null;

const connectDB = async () => {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("MongoDB URI is not provided — set MONGODB_URI (or DB_URL / MONGO_URI) in backend/.env");
  }
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
