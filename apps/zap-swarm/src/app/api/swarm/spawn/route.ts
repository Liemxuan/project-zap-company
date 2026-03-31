// apps/zap-swarm/src/app/api/swarm/spawn/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parentThreadId,
      agentSlug,
      task,
      priority = 2,
      dependsOn = [],
      tenantId = "ZVN",
    } = body;

    if (!agentSlug || !task) {
      return NextResponse.json(
        { error: "agentSlug and task are required" },
        { status: 400 }
      );
    }

    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(MONGO_URI);
    const db = client.db("zap_swarm");
    const col = db.collection(`${tenantId}_SYS_OS_job_queue`);

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
    await client.close();

    return NextResponse.json({
      success: true,
      jobId: result.insertedId.toString(),
      status: job.status,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
