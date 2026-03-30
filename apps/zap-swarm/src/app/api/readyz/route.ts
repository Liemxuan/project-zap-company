import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const CLAW_URL = process.env.NEXT_PUBLIC_CLAW_URL || "http://localhost:3900";

/**
 * /api/readyz — Readiness probe for the ZAP Swarm Command Center.
 * Unlike /api/health (liveness), this checks actual dependency connectivity:
 * - MongoDB reachable
 * - ZAP Claw backend reachable
 * - Redis reachable (optional, non-blocking)
 * 
 * Returns 200 if all critical deps are up, 503 if not.
 */
export async function GET() {
    const checks: Record<string, { status: string; latencyMs?: number; error?: string }> = {};
    let allHealthy = true;

    // 1. MongoDB Check
    const mongoStart = Date.now();
    let mongoClient: MongoClient | null = null;
    try {
        mongoClient = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
        await mongoClient.connect();
        await mongoClient.db("olympus").command({ ping: 1 });
        checks.mongodb = { status: "ok", latencyMs: Date.now() - mongoStart };
    } catch (err: any) {
        checks.mongodb = { status: "fail", latencyMs: Date.now() - mongoStart, error: err.message };
        allHealthy = false;
    } finally {
        if (mongoClient) await mongoClient.close().catch(() => {});
    }

    // 2. ZAP Claw Check
    const clawStart = Date.now();
    try {
        const res = await fetch(`${CLAW_URL}/api/health`, {
            signal: AbortSignal.timeout(3000),
        });
        checks.zapClaw = {
            status: res.ok ? "ok" : "degraded",
            latencyMs: Date.now() - clawStart,
        };
        if (!res.ok) allHealthy = false;
    } catch (err: any) {
        checks.zapClaw = { status: "fail", latencyMs: Date.now() - clawStart, error: err.message };
        // Claw being down is degraded, not fatal — Swarm can still show dashboards
    }

    // 3. Redis Check (optional — non-blocking)
    const redisStart = Date.now();
    try {
        const Redis = (await import("ioredis")).default;
        const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
            connectTimeout: 2000,
            lazyConnect: true,
        });
        await redis.connect();
        await redis.ping();
        checks.redis = { status: "ok", latencyMs: Date.now() - redisStart };
        await redis.quit();
    } catch (err: any) {
        checks.redis = { status: "degraded", latencyMs: Date.now() - redisStart, error: err.message };
        // Redis down is degraded, not fatal
    }

    const statusCode = allHealthy ? 200 : 503;

    return NextResponse.json({
        status: allHealthy ? "ready" : "not_ready",
        service: "zap-swarm",
        timestamp: new Date().toISOString(),
        checks,
    }, { status: statusCode });
}
