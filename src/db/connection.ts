import mongoose from "mongoose";

const MONGODB_URI =  "mongodb+srv://dippal513:hunter51302@review.xjwleqe.mongodb.net/?retryWrites=true&w=majority&appName=REVIEW";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then(mongoose => {
      console.log("Database connection established");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
