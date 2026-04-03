export const revalidate = 5;
// F1: Approval Audit Log API
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { getGlobalMongoClient } from "../../../../lib/mongo";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
  const agent = req.nextUrl.searchParams.get("agent") || null;
  const action = req.nextUrl.searchParams.get("action") || null;
  const since = req.nextUrl.searchParams.get("since") || null;

  const client = await getGlobalMongoClient();

  try {
    const db = client.db("olympus");
    const col = db.collection("SYS_OS_approvals");

    // Build dynamic filter
    const filter: Record<string, any> = {};
    if (agent) filter["agentSlug"] = { $regex: agent, $options: "i" };
    if (action) filter["action"] = action;
    if (since) filter["timestamp"] = { $gte: new Date(since) };

    const [approvals, total] = await Promise.all([
      col
        .find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      col.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      approvals,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  } finally {
  }
}
