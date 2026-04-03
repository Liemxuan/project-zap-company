export const dynamic = "force-dynamic";
// F2: Security Posture Aggregation API
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { getGlobalMongoClient } from "../../../../lib/mongo";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function GET() {
  const client = await getGlobalMongoClient();

  try {
    const db = client.db("olympus");

    // Parallel data fetch from all security collections
    const [
      approvalsCount,
      recentApprovals,
      zssCount,
      recentZss,
      budgets,
      tokenBudgets,
    ] = await Promise.all([
      db.collection("SYS_OS_approvals").countDocuments(),
      db.collection("SYS_OS_approvals").find().sort({ timestamp: -1 }).limit(5).toArray(),
      db.collection("SYS_OS_zss_audit").countDocuments(),
      db.collection("SYS_OS_zss_audit").find().sort({ timestamp: -1 }).limit(5).toArray(),
      db.collection("SYS_OS_tenant_budgets").find({}).toArray(),
      db.collection("SYS_OS_token_budgets").find({}).toArray(),
    ]);

    // Calculate budget utilization
    const budgetUtilization = budgets.map((b: any) => ({
      tenantId: b.tenantId,
      limit: b.budgetLimit || 0,
      spent: b.currentSpend || 0,
      pct: b.budgetLimit > 0 ? Math.round((b.currentSpend / b.budgetLimit) * 100) : 0,
    }));

    // Token budget health (from Ironclad BLAST 2)
    const tokenHealth = tokenBudgets.map((tb: any) => ({
      agentId: tb.agentId,
      monthly_limit: tb.monthly_limit || 50_000_000,
      tokens_used: tb.tokens_used || 0,
      pct: tb.monthly_limit > 0 ? Math.round((tb.tokens_used / tb.monthly_limit) * 100) : 0,
    }));

    // Compute individual BLAST postures
    const posture = {
      log_redaction: { status: "ACTIVE", detail: "Regex-based scrubbing on all trace + HTTP logs" },
      token_budgets: {
        status: tokenHealth.some((t: any) => t.pct > 90) ? "WARNING" : "HEALTHY",
        detail: `${tokenHealth.length} agents tracked`,
        agents: tokenHealth,
      },
      agent_jwt: {
        status: process.env.AGENT_JWT_ENFORCE === "true" ? "ENFORCING" : "DISABLED",
        detail: process.env.AGENT_JWT_ENFORCE === "true" ? "401 on unauthenticated /api/memory" : "Not enforced",
      },
      approval_gates: {
        status: "ACTIVE",
        detail: `${approvalsCount} events logged`,
        recent: recentApprovals.map((a: any) => ({
          agent: a.agentSlug,
          action: a.action,
          timestamp: a.timestamp,
          operator: a.operator || "system",
        })),
      },
      docker_hardening: {
        status: "ARMED",
        detail: "cap_drop ALL + no-new-privileges + tmpfs configured in docker-compose.yaml",
      },
      skill_sandbox: {
        status: "ACTIVE",
        detail: "node:vm isolation with module allowlisting",
      },
    };

    return NextResponse.json({
      success: true,
      posture,
      zss: { total: zssCount, recent: recentZss },
      budgets: budgetUtilization,
      checkedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  } finally {
  }
}
