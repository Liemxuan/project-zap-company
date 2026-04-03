// Olympus ID: OLY-SWARM
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Redis from "ioredis";
import dotenv from "dotenv";
import path from "path";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../../../lib/mongo";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), override: true });

const DB_NAME = "olympus";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const { interruptId, response, approved } = await req.json();

    if (!interruptId) {
      return NextResponse.json({ error: "Missing interruptId" }, { status: 400 });
    }

    const client = await getGlobalMongoClient();
    const db = client.db(DB_NAME);

    const result = await db.collection("SYS_OS_interrupts").findOneAndUpdate(
      { _id: new ObjectId(interruptId), sessionId, status: "pending" },
      {
        $set: {
          status: "resolved",
          response: response ?? null,
          approved: approved ?? null,
          resolvedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Interrupt not found or already resolved" }, { status: 404 });
    }

    // Notify the agent via Redis so it can resume
    try {
      const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
      await redis.publish(
        `zap:interrupt:${sessionId}`,
        JSON.stringify({ interruptId, response, approved })
      );
      redis.quit();
    } catch (redisErr: any) {
      logger.warn("[interrupt POST] Redis publish failed (non-fatal):", redisErr?.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error("[interrupt POST] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
