/**
 * POST /api/memory/reflect
 * 
 * Karpathy-inspired: evaluate recent experiences, promote repeated 
 * successful patterns to world facts, prune old discarded experiments.
 */

import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI || '';

export async function POST() {
  const agentName = 'antigravity';

  try {
    const client = await MongoClient.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    const db = client.db('olympus');
    const expCol = db.collection('memory_experiences');
    const worldCol = db.collection('memory_world');

    // 1. Find recent successes with lessons
    const wins = await expCol.find({
      outcome: 'success',
      lesson: { $ne: '' },
    }).sort({ _id: -1 }).limit(30).toArray();

    // 2. Find recent failures
    const failures = await expCol.find({
      outcome: 'failure',
    }).sort({ _id: -1 }).limit(10).toArray();

    // 3. Auto-promote repeated successful patterns to world facts
    const promoted: string[] = [];
    const lessonCounts: Record<string, number> = {};
    for (const w of wins) {
      const key = (w.lesson as string)?.substring(0, 100);
      if (key) {
        lessonCounts[key] = (lessonCounts[key] || 0) + 1;
        if (lessonCounts[key] >= 2 && !promoted.includes(key)) {
          await worldCol.insertOne({
            category: 'pattern',
            domain: w.domain || 'general',
            content: `[Auto-promoted] ${w.lesson}`,
            source: `reflect:${agentName}`,
            tags: ['auto-promoted', 'pattern'],
            agent: agentName,
            confidence: 0.7,
            created_at: new Date(),
            updated_at: new Date(),
            version: 1,
            meta: { from_experience_count: lessonCounts[key] },
          });
          promoted.push(key);
        }
      }
    }

    // 4. Soft-prune old discarded experiments (7+ days)
    const discardCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const pruned = await expCol.updateMany(
      {
        status: 'discard',
        timestamp: { $lt: discardCutoff },
        _pruned: { $ne: true },
      },
      { $set: { _pruned: true, _pruned_at: new Date() } }
    );

    await client.close();

    return NextResponse.json({
      agent: agentName,
      reflected_at: new Date().toISOString(),
      wins_reviewed: wins.length,
      failures_reviewed: failures.length,
      patterns_promoted: promoted.length,
      experiences_pruned: pruned.modifiedCount,
      promoted_lessons: promoted,
    });
  } catch (error) {
    console.error('[Memory Reflect Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Reflect failed' },
      { status: 500 }
    );
  }
}
