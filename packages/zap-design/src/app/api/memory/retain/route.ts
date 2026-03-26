/**
 * POST /api/memory/retain
 * 
 * Retain a world fact or experience in the Olympus Memory System.
 * 
 * Body: { type: 'world' | 'experience', data: WorldFact | Experience }
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  retainWorldFact,
  retainExperience,
  type WorldFact,
  type Experience,
} from '../../../../lib/memory';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type, data' },
        { status: 400 }
      );
    }

    if (type === 'world') {
      // Validate required world fact fields
      if (!data.category || !data.domain || !data.content) {
        return NextResponse.json(
          { error: 'World facts require: category, domain, content' },
          { status: 400 }
        );
      }

      const fact: WorldFact = {
        category: data.category,
        domain: data.domain,
        content: data.content,
        source: data.source || 'session',
        tags: data.tags || [],
        agent: data.agent || 'system',
        confidence: data.confidence ?? 0.8,
        created_at: new Date(),
        updated_at: new Date(),
        supersedes: data.supersedes || null,
        meta: data.meta || {},
      };

      const id = await retainWorldFact(fact);
      return NextResponse.json({
        success: true,
        id,
        type: 'world',
        message: `World fact retained in domain '${fact.domain}'`,
      });
    }

    if (type === 'experience') {
      // Validate required experience fields
      if (!data.agent || !data.action || !data.outcome) {
        return NextResponse.json(
          { error: 'Experiences require: agent, action, outcome' },
          { status: 400 }
        );
      }

      const experience: Experience = {
        agent: data.agent,
        session_id: data.session_id || 'unknown',
        action: data.action,
        outcome: data.outcome,
        context: data.context || '',
        lesson: data.lesson || '',
        files_touched: data.files_touched || [],
        domain: data.domain || 'general',
        tags: data.tags || [],
        timestamp: new Date(),
        duration_minutes: data.duration_minutes,
      };

      const id = await retainExperience(experience);
      return NextResponse.json({
        success: true,
        id,
        type: 'experience',
        message: `Experience retained for agent '${experience.agent}'`,
      });
    }

    return NextResponse.json(
      { error: `Invalid type: '${type}'. Must be 'world' or 'experience'.` },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Memory Retain Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
