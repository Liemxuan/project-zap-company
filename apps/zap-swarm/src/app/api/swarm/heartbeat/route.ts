// F3: Agent Health Heartbeat API
import { NextResponse } from "next/server";

const CLAW_PORTS = [
  { id: "primary", port: 3900, label: "ZAP Claw (Primary)" },
  { id: "secondary", port: 3901, label: "ZAP Claw (Secondary)" },
  { id: "tertiary", port: 3902, label: "ZAP Claw (Tertiary)" },
];

async function pingAgent(port: number, timeoutMs = 2000): Promise<{ healthy: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`http://localhost:${port}/api/agent/jwt-health`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    const latencyMs = Date.now() - start;
    return { healthy: res.ok, latencyMs };
  } catch {
    return { healthy: false, latencyMs: Date.now() - start };
  }
}

export async function GET() {
  const results = await Promise.all(
    CLAW_PORTS.map(async (agent) => {
      const { healthy, latencyMs } = await pingAgent(agent.port);
      return { ...agent, healthy, latencyMs };
    })
  );

  const allHealthy = results.every((r) => r.healthy);
  const anyHealthy = results.some((r) => r.healthy);

  return NextResponse.json({
    status: allHealthy ? "ALL_HEALTHY" : anyHealthy ? "DEGRADED" : "DOWN",
    agents: results,
    checkedAt: new Date().toISOString(),
  });
}
