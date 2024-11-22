// lib/mongoDbSingleton.ts
import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

class MongoDbSingleton {
  private static instance: MongoDbSingleton;
  private conn: Connection | null = null;
  private promise: Promise<Connection> | null = null;

  private constructor() {}

  // Get the singleton instance of MongoDbSingleton
  public static getInstance(): MongoDbSingleton {
    if (!MongoDbSingleton.instance) {
      MongoDbSingleton.instance = new MongoDbSingleton();
    }
    return MongoDbSingleton.instance;
  }

  // Connect to the database or use existing connection
  public async connect() {
    if (this.conn) {
      console.log("Using existing mongoose connection");
      return this.conn;
    }

    if (!this.promise) {
      console.log("Establishing new mongoose connection...");
      this.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
        console.log("Connected to MongoDB");
        this.conn = mongooseInstance.connection;
        return this.conn;
      });
    }

    return this.promise;
  }
}

export const mongoDbSingleton = MongoDbSingleton.getInstance();
