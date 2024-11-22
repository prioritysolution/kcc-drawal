// lib/connectToDatabase.ts
import { mongoDbSingleton } from "./MongoDbSingleTon";

export async function connectToDatabase() {
  try {
    const db = await mongoDbSingleton.connect();
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("MongoDB connection error");
  }
}
