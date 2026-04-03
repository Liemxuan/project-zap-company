import { MongoClient } from "mongodb";

// Module-level connection singleton
let cachedClient: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

/**
 * Returns a globally cached MongoClient instance for the application.
 * Utilizes a singleton pattern to prevent connection pool exhaustion.
 */
export async function getGlobalMongoClient(uri: string): Promise<MongoClient> {
    if (cachedClient) {
        return cachedClient;
    }

    if (!clientPromise) {
        clientPromise = new MongoClient(uri, { 
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 100,
            minPoolSize: 10 
        }).connect().catch(err => {
            console.error("[Global MongoClient] Connection failed:", err);
            clientPromise = null;
            throw err;
        });
    }

    cachedClient = await clientPromise;
    return cachedClient;
}
