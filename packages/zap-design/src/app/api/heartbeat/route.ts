/**
 * GET /api/heartbeat
 * 
 * Agent heartbeat endpoint. Returns agent status, uptime,
 * and memory system health for cron job scheduling.
 * 
 * Every agent should expose this at their port for fleet health monitoring.
 */

import { NextResponse } from 'next/server';
import { memoryStats } from '../../../lib/memory';

const BOOT_TIME = new Date();

export async function GET() {
  const now = new Date();
  const uptimeMs = now.getTime() - BOOT_TIME.getTime();
  const uptimeMinutes = Math.floor(uptimeMs / 60000);
  const uptimeHours = Math.floor(uptimeMinutes / 60);

  let memoryStatus = 'unknown';
  let memoryDetails = {};

  try {
    const stats = await memoryStats();
    memoryStatus = 'connected';
    memoryDetails = stats;
  } catch {
    memoryStatus = 'disconnected';
  }

  return NextResponse.json({
    agent: 'antigravity',
    role: 'CSO / Primary AI Agent',
    status: 'online',
    port: 3002,
    timestamp: now.toISOString(),
    boot_time: BOOT_TIME.toISOString(),
    uptime: {
      ms: uptimeMs,
      human: uptimeHours > 0 
        ? `${uptimeHours}h ${uptimeMinutes % 60}m` 
        : `${uptimeMinutes}m`,
    },
    memory: {
      status: memoryStatus,
      ...memoryDetails,
    },
    capabilities: [
      'heartbeat',
      'retain',
      'recall',
      'reflect',
      'stats',
      'code-generation',
      'browser-automation',
      'mcp-orchestration',
    ],
  });
}
