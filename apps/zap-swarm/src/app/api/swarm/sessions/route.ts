import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

// All tenant job queue collections to aggregate sessions from
const TENANT_COLLECTIONS = ["ZVN_SYS_OS_job_queue", "OLYMPUS_SWARM_SYS_OS_job_queue"];

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    await client.connect();
    const db = client.db(DB_NAME);

    const aggregatePipeline = [
      { $group: { _id: "$historyContext.sessionId", status: { $first: "$status" }, createdAt: { $first: "$createdAt" }, count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
      { $sort: { createdAt: -1 } },
      { $limit: 50 }
    ];

    // Merge sessions from all tenant collections
    const allResults = await Promise.all(
      TENANT_COLLECTIONS.map(colName => 
        db.collection(colName).aggregate(aggregatePipeline).toArray().catch(() => [])
      )
    );

    // Flatten, dedupe by sessionId (keep most recent), re-sort
    const sessionMap = new Map<string, any>();
    for (const results of allResults) {
      for (const s of results) {
        const existing = sessionMap.get(s._id);
        if (!existing || new Date(s.createdAt) > new Date(existing.createdAt)) {
          sessionMap.set(s._id, s);
        }
      }
    }

    const formattedSessions = Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)
      .map(s => ({ id: s._id, status: s.status, turns: s.count, createdAt: s.createdAt }));

    return NextResponse.json({ success: true, sessions: formattedSessions });
  } catch (error: any) {
    logger.error(`[api/swarm/sessions] Error:`, error);
    return NextResponse.json({ error: `Failed to fetch sessions: ${error.message}` }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

