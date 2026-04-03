import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

// Ensure globalThis has the cachedMongoClient property (especially for Next.js hot reload)
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Returns a globally cached connected MongoClient instance.
 * Automatically enforces connection pooling across Serverless functions and Hot-Reloads.
 */
export async function getGlobalMongoClient(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 100, // Explicitly enforce a max pool size 
    });
    // Cache the promise (not the resolved client) to prevent cache stampedes
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}
