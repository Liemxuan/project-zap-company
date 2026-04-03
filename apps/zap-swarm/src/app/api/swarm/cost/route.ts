export const revalidate = 300;
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getGlobalMongoClient } from "../../../../lib/mongo";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function GET(req: NextRequest) {
  const days = parseInt(req.nextUrl.searchParams.get("days") || "7");
  const client = await getGlobalMongoClient();
  try {
    const db = client.db("olympus");
    const since = new Date(Date.now() - days * 86400000);
    const metrics = db.collection("SYS_OS_arbiter_metrics");

    const [byModel, byAgent, totals, dailyBurn, topConversations, byFleet, byProject] = await Promise.all([
      // By Model breakdown
      metrics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id: "$modelId",
          totalTokens: { $sum: "$tokens.total" },
          totalCost: { $sum: "$gatewayCharge" },
          calls: { $sum: 1 },
        }},
        { $sort: { totalCost: -1 } },
      ]).toArray(),

      // By Agent breakdown
      metrics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id: "$botName",
          totalTokens: { $sum: "$tokens.total" },
          totalCost: { $sum: "$gatewayCharge" },
          calls: { $sum: 1 },
        }},
        { $sort: { totalCost: -1 } },
      ]).toArray(),

      // Totals
      metrics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id: null,
          totalTokens: { $sum: "$tokens.total" },
          totalCost: { $sum: "$gatewayCharge" },
          totalCalls: { $sum: 1 },
        }},
      ]).toArray(),

      // Daily burn rate per agent (last 7 days rolling average)
      metrics.aggregate([
        { $match: { timestamp: { $gte: new Date(Date.now() - 7 * 86400000) } } },
        { $group: {
          _id: {
            agent: "$botName",
            day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          },
          dailyTokens: { $sum: "$tokens.total" },
          dailyCost: { $sum: "$gatewayCharge" },
        }},
        { $group: {
          _id: "$_id.agent",
          avgDailyTokens: { $avg: "$dailyTokens" },
          avgDailyCost: { $avg: "$dailyCost" },
          daysActive: { $sum: 1 },
        }},
        { $sort: { avgDailyCost: -1 } },
      ]).toArray(),

      // Top 5 most expensive conversations
      metrics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id: "$sessionId",
          agent: { $first: "$botName" },
          model: { $first: "$modelId" },
          totalTokens: { $sum: "$tokens.total" },
          totalCost: { $sum: "$gatewayCharge" },
          calls: { $sum: 1 },
          lastActivity: { $max: "$timestamp" },
        }},
        { $sort: { totalCost: -1 } },
        { $limit: 5 },
      ]).toArray(),

      // By Fleet Tier (ULTRA / PRO / OPENROUTER / OLLAMA)
      // Use accountLevel if available, fallback to provider/pillar for older records
      metrics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $addFields: {
          // Resolve the provider from whatever field exists
          resolvedProvider: { $ifNull: ["$provider", { $ifNull: ["$pillar", "GOOGLE"] }] },
          fleetTier: {
            $switch: {
              branches: [
                // If accountLevel is explicitly set and meaningful, use it
                { case: { $eq: ["$accountLevel", "ULTRA"] }, then: "ULTRA" },
                { case: { $eq: ["$accountLevel", "PRO"] }, then: "PRO" },
                { case: { $eq: ["$accountLevel", "OPENROUTER"] }, then: "OPENROUTER" },
                { case: { $eq: ["$accountLevel", "OLLAMA"] }, then: "LOCAL" },
                // Fallback: derive from provider/pillar
                { case: { $eq: [{ $ifNull: ["$provider", "$pillar"] }, "OPENROUTER"] }, then: "OPENROUTER" },
                { case: { $eq: [{ $ifNull: ["$provider", "$pillar"] }, "OLLAMA"] }, then: "LOCAL" },
                // Google is the most common — determine Ultra vs Pro from model
                { case: { $regexMatch: { input: { $ifNull: ["$modelId", ""] }, regex: /3\.1-pro|ultra/i } }, then: "ULTRA" },
              ],
              default: "PRO"
            }
          }
        }},
        { $group: {
          _id: "$fleetTier",
          totalTokens: { $sum: { $ifNull: ["$tokens.total", { $ifNull: ["$tokensUsed.total", 0] }] } },
          totalCost: { $sum: "$gatewayCharge" },
          calls: { $sum: 1 },
          models: { $addToSet: "$modelId" },
        }},
        { $sort: { totalCost: -1 } },
      ]).toArray(),

      // By Project ID — enriched with models, agents, fleet, token breakdown
      metrics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id: { $ifNull: ["$projectId", "default"] },
          totalTokens: { $sum: { $ifNull: ["$tokens.total", { $ifNull: ["$tokensUsed.total", 0] }] } },
          promptTokens: { $sum: { $ifNull: ["$tokens.prompt", { $ifNull: ["$tokensUsed.prompt", 0] }] } },
          completionTokens: { $sum: { $ifNull: ["$tokens.completion", { $ifNull: ["$tokensUsed.completion", 0] }] } },
          totalCost: { $sum: "$gatewayCharge" },
          calls: { $sum: 1 },
          providers: { $addToSet: { $ifNull: ["$provider", "$pillar"] } },
          models: { $addToSet: "$modelId" },
          agents: { $addToSet: { $ifNull: ["$agentId", { $ifNull: ["$botName", "unknown"] }] } },
          fleetTiers: { $addToSet: { $ifNull: ["$accountLevel", "STANDARD"] } },
          firstActivity: { $min: "$timestamp" },
          lastActivity: { $max: "$timestamp" },
        }},
        { $addFields: {
          avgCostPerCall: { $cond: { if: { $gt: ["$calls", 0] }, then: { $divide: ["$totalCost", "$calls"] }, else: 0 } },
          avgTokensPerCall: { $cond: { if: { $gt: ["$calls", 0] }, then: { $divide: ["$totalTokens", "$calls"] }, else: 0 } },
        }},
        { $sort: { totalCost: -1 } },
      ]).toArray(),
    ]);

    const budgets = await db.collection("SYS_OS_tenant_budgets").find({}).toArray();
    const tokenBudgets = await db.collection("SYS_OS_token_budgets").find({}).toArray();

    // Calculate projected exhaustion per agent
    const burnProjections = dailyBurn.map((agent: any) => {
      const tb = tokenBudgets.find((t: any) => t.agentId === agent._id);
      const monthlyLimit = tb?.monthly_limit || 50_000_000;
      const tokensUsed = tb?.tokens_used || 0;
      const remaining = monthlyLimit - tokensUsed;
      const dailyRate = agent.avgDailyTokens || 0;
      const daysUntilExhaustion = dailyRate > 0 ? Math.ceil(remaining / dailyRate) : Infinity;
      const exhaustionDate = daysUntilExhaustion < 365
        ? new Date(Date.now() + daysUntilExhaustion * 86400000).toISOString()
        : null;

      return {
        agentId: agent._id,
        avgDailyTokens: Math.round(agent.avgDailyTokens),
        avgDailyCost: agent.avgDailyCost,
        daysActive: agent.daysActive,
        monthlyLimit,
        tokensUsed,
        pctUsed: Math.round((tokensUsed / monthlyLimit) * 100),
        daysUntilExhaustion: daysUntilExhaustion === Infinity ? null : daysUntilExhaustion,
        exhaustionDate,
      };
    });

    return NextResponse.json({
      success: true,
      period: { days, since: since.toISOString() },
      totals: totals[0] || { totalTokens: 0, totalCost: 0, totalCalls: 0 },
      byModel,
      byAgent,
      byFleet,
      byProject,
      burnProjections,
      topConversations,
      budgets: budgets.map(b => ({ tenantId: b.tenantId, budgetLimit: b.budgetLimit, currentSpend: b.currentSpend })),
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
  }
}
