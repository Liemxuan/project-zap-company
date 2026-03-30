import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    // Real implementation should probably take tenantId as query or header, defaulting to ZVN
    const col = db.collection("ZVN_SYS_OS_job_queue");

    // Aggregate to find unique sessions/threads
    const sessions = await col.aggregate([
      {
        $group: {
          _id: "$historyContext.sessionId",
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          count: { $sum: 1 } // Approximates "turns" or context depth based on queued jobs
        }
      },
      {
        $match: {
          _id: { $ne: null }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 50
      }
    ]).toArray();

    const formattedSessions = sessions.map(s => ({
      id: s._id,
      status: s.status,
      turns: s.count,
      createdAt: s.createdAt
    }));

    return NextResponse.json({ success: true, sessions: formattedSessions });
  } catch (error: any) {
    logger.error(`[api/swarm/sessions] Error:`, error);
    return NextResponse.json({ error: `Failed to fetch sessions: ${error.message}` }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
