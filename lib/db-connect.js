import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Debug logging (remove after fixing)
console.log("MONGODB_URI exists:", !!MONGODB_URI);
console.log(
  "Environment variables:",
  Object.keys(process.env).filter((key) => key.includes("MONGODB"))
);

// Only throw error when actually trying to connect, not at module load time
async function validateMongoURI() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  await validateMongoURI();

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
