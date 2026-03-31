// packages/zap-claw/src/security/token_budgets.ts
// BLAST-IRONCLAD Phase 2: Per-Agent Token Budget Enforcement
// Provides pre-dispatch budget checks and post-completion accounting.
// Budget policies are stored in MongoDB SYS_OS_token_budgets collection.
// Backwards compatible: agents without a budget policy are unrestricted.

import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
const COLLECTION = "SYS_OS_token_budgets";

// Default monthly cap for newly created agents (50M tokens ≈ ~$12 on Flash)
const DEFAULT_MONTHLY_CAP = 50_000_000;
const WARN_THRESHOLD = 0.9; // Warn at 90% usage

export interface BudgetPolicy {
  agentId: string;
  monthlyTokenCap: number;
  currentMonthUsage: number;
  windowStart: Date;
  status: "ACTIVE" | "WARNED" | "EXHAUSTED";
  updatedAt: Date;
}

export interface BudgetCheckResult {
  allowed: boolean;
  remaining: number;
  used: number;
  cap: number;
  status: "ACTIVE" | "WARNED" | "EXHAUSTED" | "UNLIMITED";
}

/**
 * Returns the UTC start of the current calendar month.
 * Budget windows reset on the 1st of each month at 00:00 UTC.
 */
function currentWindowStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/**
 * Pre-dispatch budget check. Called before generateOmniContent().
 * Returns { allowed: false } if the agent has exceeded their monthly cap.
 * Agents without a budget policy are treated as UNLIMITED (backwards compatible).
 */
export async function checkBudget(agentId: string): Promise<BudgetCheckResult> {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const col = client.db(DB_NAME).collection<BudgetPolicy>(COLLECTION);
    const windowStart = currentWindowStart();

    const policy = await col.findOne({ agentId, windowStart });

    // No policy = no restrictions (backwards compatible for existing agents)
    if (!policy) {
      return { allowed: true, remaining: Infinity, used: 0, cap: 0, status: "UNLIMITED" };
    }

    const used = policy.currentMonthUsage;
    const cap = policy.monthlyTokenCap;
    const remaining = Math.max(0, cap - used);

    // Hard stop: budget exhausted
    if (remaining <= 0) {
      if (policy.status !== "EXHAUSTED") {
        await col.updateOne(
          { _id: policy._id },
          { $set: { status: "EXHAUSTED", updatedAt: new Date() } }
        );
      }
      return { allowed: false, remaining: 0, used, cap, status: "EXHAUSTED" };
    }

    // Soft warning: approaching limit
    if (used >= cap * WARN_THRESHOLD) {
      if (policy.status !== "WARNED") {
        await col.updateOne(
          { _id: policy._id },
          { $set: { status: "WARNED", updatedAt: new Date() } }
        );
      }
      return { allowed: true, remaining, used, cap, status: "WARNED" };
    }

    return { allowed: true, remaining, used, cap, status: "ACTIVE" };
  } finally {
    await client.close();
  }
}

/**
 * Post-completion token accounting. Called after job completes successfully.
 * Atomically increments the agent's usage counter for the current month.
 * If no budget document exists, creates one with the default cap (upsert).
 */
export async function recordUsage(
  agentId: string,
  tokensUsed: number
): Promise<void> {
  if (!tokensUsed || tokensUsed <= 0) return;

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const col = client.db(DB_NAME).collection<BudgetPolicy>(COLLECTION);
    const windowStart = currentWindowStart();

    await col.updateOne(
      { agentId, windowStart },
      {
        $inc: { currentMonthUsage: tokensUsed },
        $set: { updatedAt: new Date() },
        $setOnInsert: {
          monthlyTokenCap: DEFAULT_MONTHLY_CAP,
          status: "ACTIVE",
          windowStart,
        },
      },
      { upsert: true }
    );
  } finally {
    await client.close();
  }
}

/**
 * Set or update a budget policy for an agent.
 * Called from admin dashboard or approval flows.
 */
export async function setBudgetPolicy(
  agentId: string,
  monthlyTokenCap: number
): Promise<void> {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const col = client.db(DB_NAME).collection<BudgetPolicy>(COLLECTION);
    const windowStart = currentWindowStart();

    await col.updateOne(
      { agentId, windowStart },
      {
        $set: { monthlyTokenCap, updatedAt: new Date() },
        $setOnInsert: {
          currentMonthUsage: 0,
          status: "ACTIVE",
          windowStart,
        },
      },
      { upsert: true }
    );
  } finally {
    await client.close();
  }
}

/**
 * Get budget status for all agents (dashboard view).
 */
export async function getAllBudgets(): Promise<BudgetPolicy[]> {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const col = client.db(DB_NAME).collection<BudgetPolicy>(COLLECTION);
    const windowStart = currentWindowStart();
    return await col.find({ windowStart }).toArray();
  } finally {
    await client.close();
  }
}
