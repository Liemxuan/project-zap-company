// apps/zap-swarm/src/app/api/swarm/spawn/route.ts
// BLAST-IRONCLAD: Hardened with approval audit trail + rate limiting
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getGlobalMongoClient } from "../../../../lib/mongo";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

// In-memory rate limiter (per-process)
const spawnLog: number[] = [];
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 3;

function checkRateLimit(): boolean {
  const now = Date.now();
  // Purge expired entries
  while (spawnLog.length > 0 && spawnLog[0] < now - RATE_LIMIT_WINDOW_MS) {
    spawnLog.shift();
  }
  return spawnLog.length < RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  // Rate limit check
  if (!checkRateLimit()) {
    return NextResponse.json(
      { error: `Rate limit exceeded: max ${RATE_LIMIT_MAX} spawns per 10 minutes` },
      { status: 429 }
    );
  }

  let client: MongoClient | null = null;
  try {
    const body = await req.json();
    const {
      parentThreadId,
      agentSlug,
      task,
      priority = 2,
      dependsOn = [],
      tenantId = "ZVN",
      operator = "system",
    } = body;

    if (!agentSlug || !task) {
      return NextResponse.json(
        { error: "agentSlug and task are required" },
        { status: 400 }
      );
    }

    client = await getGlobalMongoClient();

    // Write job to queue
    const swarmDb = client.db("zap_swarm");
    const col = swarmDb.collection(`${tenantId}_SYS_OS_job_queue`);

    const job = {
      parentThreadId: parentThreadId || `SPAWN_${Date.now()}`,
      assignedAgentId: `AGNT-OLY-${agentSlug.toUpperCase()}`,
      agentSlug,
      payload: task,
      status: dependsOn.length > 0 ? "BLOCKED" : "PENDING",
      priority,
      dependsOn: dependsOn.map((id: string) => new ObjectId(id)),
      tenantId,
      createdAt: new Date(),
    };

    const result = await col.insertOne(job);

    // BLAST-IRONCLAD: Log spawn to approval audit trail
    const olympusDb = client.db("olympus");
    await olympusDb.collection("SYS_OS_approvals").insertOne({
      action: "SPAWN",
      agentSlug,
      operator,
      timestamp: new Date(),
      metadata: {
        jobId: result.insertedId.toString(),
        parentThreadId: job.parentThreadId,
        tenantId,
        priority,
        taskPreview: typeof task === "string" ? task.substring(0, 200) : JSON.stringify(task).substring(0, 200),
      },
    });

    // Record spawn in rate limiter
    spawnLog.push(Date.now());

    return NextResponse.json({
      success: true,
      jobId: result.insertedId.toString(),
      status: job.status,
      rateLimitRemaining: RATE_LIMIT_MAX - spawnLog.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  } finally {
  }
}

