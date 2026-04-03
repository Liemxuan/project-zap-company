export const revalidate = 1;
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../lib/mongo";
import { NextRequest, NextResponse } from "next/server";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

// All tenant job queue collections to aggregate sessions from
const TENANT_COLLECTIONS = ["ZVN_SYS_OS_job_queue", "OLYMPUS_SWARM_SYS_OS_job_queue"];

export async function GET(req: NextRequest) {
  const agentFilter = req.nextUrl.searchParams.get("agent");
  const userId = req.headers.get("X-ZAP-User");
  const tenantId = req.headers.get("X-ZAP-Tenant") || "OLYMPUS_SWARM";

  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const matchStage: any = { 
    "historyContext.sessionId": { $exists: true },
    "historyContext.from": userId
  };
  if (agentFilter) {
    matchStage["historyContext.assignedAgentId"] = agentFilter;
  }

  try {
    const client = await getGlobalMongoClient();
    const db = client.db(DB_NAME);
    const col = db.collection(`${tenantId}_SYS_OS_job_queue`);

    const aggregatePipeline: any[] = [
      { $match: matchStage },
      { $group: { 
          _id: "$historyContext.sessionId", 
          agentId: { $first: "$historyContext.assignedAgentId" },
          from: { $first: "$historyContext.from" },
          to: { $first: "$historyContext.to" },
          status: { $first: "$status" }, 
          createdAt: { $first: "$createdAt" }, 
          count: { $sum: 1 } 
      } },
      { $match: { _id: { $ne: null } } },
      { $sort: { createdAt: -1 } },
      { $limit: 100 }
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

    const sortedSessions = Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);

    // Enrich with auto-generated titles; filter archived sessions
    const sessionIds = sortedSessions.map(s => s._id).filter(Boolean);
    const titles = sessionIds.length > 0
      ? await db.collection("SYS_OS_session_titles").find({ sessionId: { $in: sessionIds } }).toArray()
      : [];
    const archivedSet = new Set(titles.filter(t => t.archived).map(t => t.sessionId));
    const titleMap = new Map(titles.map(t => [t.sessionId, t.title]));

    const formattedSessions = sortedSessions
      .filter(s => !archivedSet.has(s._id))
      .map(s => ({ 
        id: s._id, 
        agentId: s.agentId,
        from: s.from,
        to: s.to,
        status: s.status, 
        turns: s.count, 
        createdAt: s.createdAt, 
        title: titleMap.get(s._id) || null 
      }));

    return NextResponse.json({ success: true, sessions: formattedSessions });
  } catch (error: any) {
    logger.error(`[api/swarm/sessions] Error:`, error);
    return NextResponse.json({ error: `Failed to fetch sessions: ${error.message}` }, { status: 500 });
  } finally {
  }
}

