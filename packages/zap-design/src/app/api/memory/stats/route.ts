/**
 * GET /api/memory/stats
 * 
 * Memory system health and statistics.
 */

import { NextResponse } from 'next/server';
import { memoryStats } from '../../../../lib/memory';

export async function GET() {
  try {
    const stats = await memoryStats();

    return NextResponse.json({
      success: true,
      status: 'operational',
      stats,
      collections: {
        memory_world: { count: stats.world_facts, purpose: 'World Facts (rules, patterns, mandates)' },
        memory_experiences: { count: stats.experiences, purpose: 'Agent Experiences (actions, outcomes)' },
        memory_models: { count: stats.models, purpose: 'Mental Models (reflect insights)' },
      },
    });
  } catch (error) {
    console.error('[Memory Stats Error]', error);
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Connection failed',
      },
      { status: 500 }
    );
  }
}
