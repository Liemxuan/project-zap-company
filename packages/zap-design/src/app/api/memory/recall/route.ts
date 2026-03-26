/**
 * POST /api/memory/recall
 * 
 * Recall memories from the Olympus Memory System.
 * 
 * Body: RecallOptions — { domain?, agent?, tags?, text?, limit?, category?, outcome?, since? }
 * 
 * GET /api/memory/recall?domain=layer-system&agent=spike&limit=5
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  recall,
  recallFacts,
  recallMandates,
  recallExperiences,
  type RecallOptions,
} from '../../../../lib/memory';

export async function POST(request: NextRequest) {
  try {
    const body: RecallOptions = await request.json();
    const result = await recall(body);

    return NextResponse.json({
      success: true,
      total: result.world_facts.length + result.experiences.length + result.models.length,
      world_facts: result.world_facts,
      experiences: result.experiences,
      models: result.models,
    });
  } catch (error) {
    console.error('[Memory Recall Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const agent = searchParams.get('agent');
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Shortcut: recall mandates
    if (type === 'mandates') {
      const mandates = await recallMandates();
      return NextResponse.json({ success: true, mandates });
    }

    // Shortcut: recall facts for a domain
    if (type === 'facts' && domain) {
      const facts = await recallFacts(domain, limit);
      return NextResponse.json({ success: true, facts });
    }

    // Shortcut: recall agent experiences
    if (type === 'experiences' && agent) {
      const experiences = await recallExperiences(agent, domain || undefined, limit);
      return NextResponse.json({ success: true, experiences });
    }

    // Full recall
    const result = await recall({
      domain: domain || undefined,
      agent: agent || undefined,
      limit,
    });

    return NextResponse.json({
      success: true,
      total: result.world_facts.length + result.experiences.length + result.models.length,
      world_facts: result.world_facts,
      experiences: result.experiences,
      models: result.models,
    });
  } catch (error) {
    console.error('[Memory Recall Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
