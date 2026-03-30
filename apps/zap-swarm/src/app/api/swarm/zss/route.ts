import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";

// Preload the env from core
dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

export async function GET() {
    let client: MongoClient | null = null;
    try {
        const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
        client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        await client.connect();
        const db = client.db("olympus");

        // Count all ZSS intercepts (Infinite Loops + Concurrency Tripwires)
        const count = await db.collection("SYS_OS_zss_audit").countDocuments();

        return NextResponse.json({ count });
    } catch (error: any) {
        logger.error("ZSS audit query failed", { error: error.message });
        return NextResponse.json({ error: `MongoDB query failed: ${error.message}` }, { status: 500 });
    } finally {
        if (client) await client.close();
    }
}
