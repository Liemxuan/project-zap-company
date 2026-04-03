// F6: Execution History API
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
  const model = req.nextUrl.searchParams.get("model") || null;
  const status = req.nextUrl.searchParams.get("status") || null;
  const days = parseInt(req.nextUrl.searchParams.get("days") || "7");

  const client = await getGlobalMongoClient();

  try {
    const db = client.db("olympus");
    const metrics = db.collection("SYS_OS_arbiter_metrics");
    const since = new Date(Date.now() - days * 86400000);

    // Build filter
    const filter: Record<string, any> = { timestamp: { $gte: since } };
    if (agent) filter["botName"] = { $regex: agent, $options: "i" };
    if (model) filter["modelId"] = { $regex: model, $options: "i" };
    if (status) filter["status"] = status;

    // Fetch executions + stats in parallel
    const [executions, total, stats] = await Promise.all([
      metrics
        .find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .project({
          _id: 1,
          botName: 1,
          modelId: 1,
          "tokens.total": 1,
          "tokens.prompt": 1,
          "tokens.completion": 1,
          gatewayCharge: 1,
          durationMs: 1,
          status: 1,
          timestamp: 1,
          sessionId: 1,
          tier: 1,
        })
        .toArray(),

      metrics.countDocuments(filter),

      metrics.aggregate([
        { $match: { timestamp: { $gte: new Date(Date.now() - 86400000) } } }, // today only
        { $group: {
          _id: null,
          totalToday: { $sum: 1 },
          avgDuration: { $avg: "$durationMs" },
          totalTokensToday: { $sum: "$tokens.total" },
          totalCostToday: { $sum: "$gatewayCharge" },
          successCount: { $sum: { $cond: [{ $ne: ["$status", "ERROR"] }, 1, 0] } },
          errorCount: { $sum: { $cond: [{ $eq: ["$status", "ERROR"] }, 1, 0] } },
        }},
      ]).toArray(),
    ]);

    const todayStats = stats[0] || {
      totalToday: 0,
      avgDuration: 0,
      totalTokensToday: 0,
      totalCostToday: 0,
      successCount: 0,
      errorCount: 0,
    };

    return NextResponse.json({
      success: true,
      executions,
      total,
      page,
      pages: Math.ceil(total / limit),
      today: {
        ...todayStats,
        successRate: todayStats.totalToday > 0
          ? Math.round((todayStats.successCount / todayStats.totalToday) * 100)
          : 100,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  } finally {
  }
}
