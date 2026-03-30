import { NextResponse } from "next/server";

/**
 * /api/health — Liveness probe for the ZAP Swarm Command Center.
 * Returns 200 if the Next.js process is alive and responding.
 * 
 * Used by:
 * - Mission Control health monitoring
 * - Docker/K8s liveness probes
 * - Uptime checks
 */
export async function GET() {
    return NextResponse.json({
        status: "ok",
        service: "zap-swarm",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        node: process.version,
    });
}
