/**
 * Olympus Memory v2 + Heartbeat — Shared Agent Middleware
 * 
 * Drop-in routes for any Express-based zap-claw agent.
 * Provides:
 *   GET  /api/heartbeat          — agent status + uptime + memory health
 *   POST /api/memory/retain      — store experience or world fact
 *   GET  /api/memory/recall      — query memories by type/domain/agent
 *   POST /api/memory/reflect     — auto-prune + promote patterns (Karpathy-inspired)
 *   GET  /api/memory/stats       — memory collection counts + agent breakdown
 * 
 * Usage: import { mountMemoryRoutes } from './lib/memory_routes.js';
 *        mountMemoryRoutes(app, { name: 'jerry', role: 'Watchdog', port: 3300 });
 */

import { Router } from 'express';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI || '';
const DB_NAME = 'olympus';
const BOOT_TIME = new Date();

interface AgentIdentity {
    name: string;
    role: string;
    port: number;
}

// Singleton connection for memory operations
let _client: MongoClient | null = null;
async function getDb() {
    if (!_client) {
        _client = await MongoClient.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    }
    return _client.db(DB_NAME);
}

export function mountMemoryRoutes(app: { use: (router: any) => void }, identity: AgentIdentity) {
    const router = Router();

    // ── Heartbeat ─────────────────────────────────────────────
    router.get('/api/heartbeat', async (_req, res) => {
        const now = new Date();
        const uptimeMs = now.getTime() - BOOT_TIME.getTime();
        const uptimeMin = Math.floor(uptimeMs / 60000);
        const uptimeHr = Math.floor(uptimeMin / 60);

        let memoryStatus = 'unknown';
        let memoryCounts = { world: 0, experiences: 0, models: 0 };

        try {
            const db = await getDb();
            const [w, e, m] = await Promise.all([
                db.collection('memory_world').countDocuments(),
                db.collection('memory_experiences').countDocuments(),
                db.collection('memory_models').countDocuments(),
            ]);
            memoryCounts = { world: w, experiences: e, models: m };
            memoryStatus = 'connected';
        } catch {
            memoryStatus = 'disconnected';
        }

        res.json({
            agent: identity.name,
            role: identity.role,
            status: 'online',
            port: identity.port,
            timestamp: now.toISOString(),
            boot_time: BOOT_TIME.toISOString(),
            uptime: {
                ms: uptimeMs,
                human: uptimeHr > 0 ? `${uptimeHr}h ${uptimeMin % 60}m` : `${uptimeMin}m`,
            },
            memory: {
                status: memoryStatus,
                ...memoryCounts,
            },
            capabilities: ['heartbeat', 'retain', 'recall', 'reflect', 'stats'],
        });
    });

    // ── Retain (structured experience or world fact) ──────────
    router.post('/api/memory/retain', async (req, res) => {
        const { type, data } = req.body;
        if (!type || !data) {
            res.status(400).json({ error: 'type and data are required' });
            return;
        }

        try {
            const db = await getDb();
            const now = new Date().toISOString();

            if (type === 'experience') {
                // Structured experience — matches Genesis schema
                const doc = {
                    agent: data.agent || identity.name,
                    session_id: data.session_id || 'unknown',
                    action: data.action || data.content || '',
                    outcome: data.outcome || 'unspecified',    // success | failure | partial | unspecified
                    context: data.context || '',
                    lesson: data.lesson || '',
                    files_touched: data.files_touched || [],
                    domain: data.domain || 'general',
                    tags: data.tags || [],
                    timestamp: now,
                    duration_minutes: data.duration_minutes || null,
                    // Karpathy-inspired: structured metrics
                    metrics: data.metrics || {},               // { tokens_used, response_ms, etc. }
                    generation: data.generation || 1,          // knowledge evolution tracking
                    supersedes: data.supersedes || null,       // ID of previous experience this replaces
                    status: data.status || 'keep',             // keep | discard | crash (experiment log)
                    retained_at: now,
                };
                const result = await db.collection('memory_experiences').insertOne(doc);
                res.json({ success: true, id: result.insertedId.toString(), type: 'experience' });

            } else if (type === 'world') {
                const doc = {
                    category: data.category || 'fact',         // fact | mandate | pattern | config
                    domain: data.domain || 'general',
                    content: data.content || '',
                    source: data.source || `agent:${identity.name}`,
                    tags: data.tags || [],
                    agent: data.agent || identity.name,
                    confidence: data.confidence ?? 0.8,
                    created_at: now,
                    updated_at: now,
                    supersedes: data.supersedes || null,
                    version: data.version || 1,                // knowledge versioning
                    meta: data.meta || {},
                };
                const result = await db.collection('memory_world').insertOne(doc);
                res.json({ success: true, id: result.insertedId.toString(), type: 'world' });

            } else {
                res.status(400).json({ error: 'type must be "experience" or "world"' });
            }
        } catch (err: any) {
            res.status(500).json({ error: err.message || 'Memory retain failed' });
        }
    });

    // ── Recall (query memories) ──────────────────────────────
    router.get('/api/memory/recall', async (req, res) => {
        const { type, domain, agent, outcome, tags, limit } = req.query;
        const maxResults = Math.min(parseInt(limit as string) || 10, 50);

        try {
            const db = await getDb();
            const filter: Record<string, any> = {};
            if (domain) filter.domain = domain;
            if (agent) filter.agent = agent;
            if (outcome) filter.outcome = outcome;
            if (tags) filter.tags = { $in: (tags as string).split(',') };

            const collection = type === 'experience' ? 'memory_experiences'
                : type === 'model' ? 'memory_models'
                    : 'memory_world';

            const docs = await db.collection(collection)
                .find(filter)
                .sort({ _id: -1 })
                .limit(maxResults)
                .toArray();

            res.json({ count: docs.length, results: docs });
        } catch (err: any) {
            res.status(500).json({ error: err.message || 'Memory recall failed' });
        }
    });

    // ── Reflect (auto-prune + pattern promotion) ─────────────
    // Karpathy-inspired: evaluate recent experiences, promote wins to world facts
    router.post('/api/memory/reflect', async (_req, res) => {
        try {
            const db = await getDb();
            const expCol = db.collection('memory_experiences');
            const worldCol = db.collection('memory_world');

            // 1. Find recent successes from this agent that have lessons
            const wins = await expCol.find({
                agent: identity.name,
                outcome: 'success',
                lesson: { $ne: '' },
            }).sort({ _id: -1 }).limit(20).toArray();

            // 2. Find recent failures 
            const failures = await expCol.find({
                agent: identity.name,
                outcome: 'failure',
            }).sort({ _id: -1 }).limit(10).toArray();

            // 3. Auto-promote repeated successful patterns to world facts
            const promoted: string[] = [];
            const lessonCounts: Record<string, number> = {};
            for (const w of wins) {
                const key = w.lesson?.substring(0, 100);
                if (key) {
                    lessonCounts[key] = (lessonCounts[key] || 0) + 1;
                    if (lessonCounts[key] >= 2 && !promoted.includes(key)) {
                        // Repeated success pattern → promote to world fact
                        await worldCol.insertOne({
                            category: 'pattern',
                            domain: w.domain || 'general',
                            content: `[Auto-promoted] ${w.lesson}`,
                            source: `reflect:${identity.name}`,
                            tags: ['auto-promoted', 'pattern', ...(w.tags || [])],
                            agent: identity.name,
                            confidence: 0.7,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            version: 1,
                            meta: { from_experience_count: lessonCounts[key] },
                        });
                        promoted.push(key);
                    }
                }
            }

            // 4. Mark old discarded experiments for cleanup (soft-delete)
            const discardCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
            const pruned = await expCol.updateMany(
                {
                    agent: identity.name,
                    status: 'discard',
                    retained_at: { $lt: discardCutoff.toISOString() },
                    _pruned: { $ne: true },
                },
                { $set: { _pruned: true, _pruned_at: new Date().toISOString() } }
            );

            res.json({
                agent: identity.name,
                reflected_at: new Date().toISOString(),
                wins_reviewed: wins.length,
                failures_reviewed: failures.length,
                patterns_promoted: promoted.length,
                experiences_pruned: pruned.modifiedCount,
                promoted_lessons: promoted,
            });
        } catch (err: any) {
            res.status(500).json({ error: err.message || 'Reflect failed' });
        }
    });

    // ── Stats (memory overview) ──────────────────────────────
    router.get('/api/memory/stats', async (_req, res) => {
        try {
            const db = await getDb();
            const [worldCount, expCount, modelCount] = await Promise.all([
                db.collection('memory_world').countDocuments(),
                db.collection('memory_experiences').countDocuments(),
                db.collection('memory_models').countDocuments(),
            ]);

            // Agent-specific counts
            const agentExp = await db.collection('memory_experiences')
                .aggregate([
                    { $group: { _id: '$agent', count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                ])
                .toArray();

            // Outcome breakdown
            const outcomes = await db.collection('memory_experiences')
                .aggregate([
                    { $group: { _id: '$outcome', count: { $sum: 1 } } },
                ])
                .toArray();

            res.json({
                agent: identity.name,
                totals: { world: worldCount, experiences: expCount, models: modelCount },
                by_agent: agentExp.reduce((acc: Record<string, number>, r) => {
                    acc[r._id || 'unknown'] = r.count;
                    return acc;
                }, {}),
                by_outcome: outcomes.reduce((acc: Record<string, number>, r) => {
                    acc[r._id || 'unspecified'] = r.count;
                    return acc;
                }, {}),
            });
        } catch (err: any) {
            res.status(500).json({ error: err.message || 'Stats failed' });
        }
    });

    app.use(router);
    console.log(`[${identity.name.toUpperCase()}] 🧠 Memory v2.1 mounted — heartbeat, retain, recall, reflect, stats`);
}
