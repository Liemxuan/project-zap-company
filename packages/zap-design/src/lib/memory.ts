/**
 * Olympus Memory System v2
 * 
 * Biomimetic agent memory layer built on MongoDB Atlas.
 * Operations: retain (store), recall (retrieve), reflect (analyze)
 * 
 * SOP-035-OLYMPUS_MEMORY_SYSTEM
 */

import { MongoClient, type Db, type Document, type WithId } from 'mongodb';

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------

const ATLAS_URI = process.env.OLYMPUS_MEMORY_URI
  || 'mongodb+srv://tomtranzap_db_user:8wGYUhjtcR8z3TOv@zapcluster0.jog3w9m.mongodb.net/';
const DB_NAME = 'olympus';

let cachedClient: MongoClient | null = null;

async function getDb(): Promise<Db> {
  if (!cachedClient) {
    cachedClient = new MongoClient(ATLAS_URI);
    await cachedClient.connect();
  }
  return cachedClient.db(DB_NAME);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MemoryCategory =
  | 'mandate'
  | 'rule'
  | 'pattern'
  | 'anti-pattern'
  | 'architecture'
  | 'procedure'
  | 'agent-registration';

export type MemorySource = 'learn.md' | 'session' | 'manual' | 'reflect' | 'genesis';
export type Outcome = 'success' | 'failure' | 'partial';

export interface WorldFact {
  category: MemoryCategory;
  domain: string;
  content: string;
  source: MemorySource;
  tags: string[];
  agent: string;
  confidence: number;
  created_at: Date;
  updated_at: Date;
  supersedes?: string | null;
  meta?: Record<string, unknown>;
}

export interface Experience {
  agent: string;
  session_id: string;
  action: string;
  outcome: Outcome;
  context: string;
  lesson: string;
  files_touched: string[];
  domain: string;
  tags: string[];
  timestamp: Date;
  duration_minutes?: number;
}

export interface MentalModel {
  domain: string;
  insight: string;
  derived_from: string[];
  confidence: number;
  created_at: Date;
  agent: string;
  actionable: boolean;
  recommendation: string;
}

export interface RecallOptions {
  domain?: string;
  agent?: string;
  tags?: string[];
  category?: MemoryCategory;
  outcome?: Outcome;
  text?: string;
  limit?: number;
  since?: Date;
}

export interface RecallResult {
  world_facts: WithId<Document>[];
  experiences: WithId<Document>[];
  models: WithId<Document>[];
}

// ---------------------------------------------------------------------------
// RETAIN — Store memories
// ---------------------------------------------------------------------------

export async function retainWorldFact(fact: WorldFact): Promise<string> {
  const db = await getDb();
  const collection = db.collection('memory_world');

  const doc = {
    ...fact,
    created_at: fact.created_at || new Date(),
    updated_at: fact.updated_at || new Date(),
  };

  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

export async function retainExperience(experience: Experience): Promise<string> {
  const db = await getDb();
  const collection = db.collection('memory_experiences');

  const doc = {
    ...experience,
    timestamp: experience.timestamp || new Date(),
  };

  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

export async function retainModel(model: MentalModel): Promise<string> {
  const db = await getDb();
  const collection = db.collection('memory_models');

  const doc = {
    ...model,
    created_at: model.created_at || new Date(),
  };

  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

// ---------------------------------------------------------------------------
// RECALL — Retrieve memories
// ---------------------------------------------------------------------------

export async function recall(options: RecallOptions): Promise<RecallResult> {
  const db = await getDb();
  const limit = options.limit || 10;

  // Build base filter
  const buildFilter = (extraFields?: Record<string, unknown>) => {
    const filter: Record<string, unknown> = {};
    if (options.domain) filter.domain = options.domain;
    if (options.agent) filter.agent = options.agent;
    if (options.tags?.length) filter.tags = { $in: options.tags };
    if (options.since) filter.timestamp = { $gte: options.since };
    if (extraFields) Object.assign(filter, extraFields);
    return filter;
  };

  // Text search if provided
  const textFilter = options.text
    ? { $text: { $search: options.text } }
    : {};

  // Query world facts
  const worldFilter = buildFilter(
    options.category ? { category: options.category } : undefined
  );
  Object.assign(worldFilter, textFilter);

  const worldFacts = await db.collection('memory_world')
    .find(worldFilter)
    .sort(options.text
      ? { score: { $meta: 'textScore' }, confidence: -1 }
      : { confidence: -1, updated_at: -1 }
    )
    .limit(limit)
    .toArray();

  // Query experiences
  const expFilter = buildFilter(
    options.outcome ? { outcome: options.outcome } : undefined
  );
  // Only add text search if not already filtering heavily
  if (options.text && !options.domain) {
    Object.assign(expFilter, textFilter);
  }

  const experiences = await db.collection('memory_experiences')
    .find(expFilter)
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();

  // Query mental models
  const modelFilter: Record<string, unknown> = {};
  if (options.domain) modelFilter.domain = options.domain;
  if (options.text) Object.assign(modelFilter, textFilter);

  const models = await db.collection('memory_models')
    .find(modelFilter)
    .sort({ confidence: -1, created_at: -1 })
    .limit(Math.min(limit, 5))
    .toArray();

  return { world_facts: worldFacts, experiences, models };
}

// Convenience: Recall just world facts for a domain
export async function recallFacts(domain: string, limit = 10): Promise<WithId<Document>[]> {
  const db = await getDb();
  return db.collection('memory_world')
    .find({ domain })
    .sort({ confidence: -1, updated_at: -1 })
    .limit(limit)
    .toArray();
}

// Convenience: Recall agent's recent experiences
export async function recallExperiences(
  agent: string,
  domain?: string,
  limit = 10
): Promise<WithId<Document>[]> {
  const db = await getDb();
  const filter: Record<string, unknown> = { agent };
  if (domain) filter.domain = domain;
  return db.collection('memory_experiences')
    .find(filter)
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
}

// Convenience: Recall all mandates (always needed on session start)
export async function recallMandates(): Promise<WithId<Document>[]> {
  const db = await getDb();
  return db.collection('memory_world')
    .find({ category: 'mandate' })
    .sort({ confidence: -1 })
    .toArray();
}

// ---------------------------------------------------------------------------
// REFLECT — Analyze (returns aggregated data for LLM processing)
// ---------------------------------------------------------------------------

export async function gatherReflectData(
  domain?: string,
  daysSince = 7
): Promise<{ experiences: WithId<Document>[]; facts: WithId<Document>[] }> {
  const db = await getDb();
  const since = new Date();
  since.setDate(since.getDate() - daysSince);

  const expFilter: Record<string, unknown> = { timestamp: { $gte: since } };
  if (domain) expFilter.domain = domain;

  const experiences = await db.collection('memory_experiences')
    .find(expFilter)
    .sort({ timestamp: -1 })
    .limit(50)
    .toArray();

  const factFilter: Record<string, unknown> = {};
  if (domain) factFilter.domain = domain;

  const facts = await db.collection('memory_world')
    .find(factFilter)
    .sort({ confidence: -1 })
    .limit(20)
    .toArray();

  return { experiences, facts };
}

// ---------------------------------------------------------------------------
// STATS — Memory system health
// ---------------------------------------------------------------------------

export async function memoryStats(): Promise<{
  world_facts: number;
  experiences: number;
  models: number;
  domains: string[];
  agents: string[];
}> {
  const db = await getDb();

  const [worldCount, expCount, modelCount, domains, agents] = await Promise.all([
    db.collection('memory_world').countDocuments(),
    db.collection('memory_experiences').countDocuments(),
    db.collection('memory_models').countDocuments(),
    db.collection('memory_world').distinct('domain'),
    db.collection('memory_experiences').distinct('agent'),
  ]);

  return {
    world_facts: worldCount,
    experiences: expCount,
    models: modelCount,
    domains,
    agents,
  };
}

// ---------------------------------------------------------------------------
// CLEANUP — Close connection (for scripts)
// ---------------------------------------------------------------------------

export async function closeMemory(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
  }
}
