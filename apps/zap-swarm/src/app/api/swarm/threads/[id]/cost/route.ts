// Olympus ID: OLY-SWARM
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import path from "path";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../../../lib/mongo";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), override: true });

const DB_NAME = "olympus";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const client = await getGlobalMongoClient();
    const db = client.db(DB_NAME);

    const result = await db.collection("SYS_OS_arbiter_metrics").aggregate([
      { $match: { sessionId } },
      {
        $group: {
          _id: null,
          totalTokens: { $sum: "$tokens.total" },
          promptTokens: { $sum: "$tokens.prompt" },
          completionTokens: { $sum: "$tokens.completion" },
          totalCost: { $sum: "$gatewayCharge" },
          totalDurationMs: { $sum: "$durationMs" },
          calls: { $sum: 1 },
        },
      },
    ]).toArray();

    if (result.length === 0) {
      return NextResponse.json({
        success: true,
        cost: { totalTokens: 0, promptTokens: 0, completionTokens: 0, totalCost: 0, totalDurationMs: 0, calls: 0 },
      });
    }

    const { _id, ...cost } = result[0];
    return NextResponse.json({ success: true, cost });
  } catch (error: any) {
    logger.error("[cost GET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
