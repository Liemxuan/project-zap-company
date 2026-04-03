---
name: backend-db-hardening
description: Enforces scalable connection pooling and anti-dogpiling state logic for ZAP agents interfacing with databases like MongoDB or Prisma. Trigger when doing backend architecture, API route creation, or database read/write tasks.
---

# Backend DB Hardening Protocol

This skill dictates the absolute standards for interacting with databases in Olympus, specifically covering Serverless Next.js API Routes, webhooks, and high-frequency Agent Gateway patterns. It governs MongoDB, Prisma, and PostgreSQL (especially on GCP Cloud SQL).

If you are writing or reviewing backend code, you must ruthlessly enforce these standards.

## 1. Connection Bleed Prevention (The Singleton Rule)

All database driver instantiations MUST use a centralized connection pool singleton to prevent max-connection pool exhaustion.

* **Rule:** NEVER instantiate `new MongoClient()`, `new PrismaClient()`, or a raw PostgreSQL `new Client()` (from `pg`) directly inside an endpoint, route handler, or loop body. For GCP PostgreSQL, failing to pool will instantly exhaust Cloud SQL connection limits.
* **Implementation:** All database connections must be imported from a centralized cached utility (e.g., `src/db/mongo_client.ts`, `src/db/pg_pool.ts`, or `src/db/client.ts`). If running in a Serverless (Vercel) or active development (Hot-Reloading) environment, code must use global bindings (e.g., `globalThis.cachedClient`, `globalThis.pgPool`) to ensure the instances survive module re-execution. Otherwise, zombie connections will paralyze the DB cluster.

## 2. Anti-Dogpiling / Cache Stampede Management

For high-frequency read operations—such as retrieving matrix routings, auth resolution, global configuration models, or session states:

* **Rule:** Standard cache-aside logic is insufficient under load. If 500 requests happen instantly, they all check the empty cache, and all 500 independently trigger identical DB reads simultaneously (Cache Stampede).
* **Implementation:** You MUST implement **Promise Caching**. Your LRU cache or Map must store the `Promise` of the database hit, not the resolved value. This forces concurrent request spikes to `await` the single in-flight Promise rather than duplicating the query.

## 3. Cursor & Loop Paranoia

When iterating over collections, streams, or processing heavy batched webhooks:

* **Rule:** Do not open DB connections inside loops, and do not fire individual un-batched `findOne` queries inside standard loops.
* **Implementation:** Fetch required data sets before the loop, use massive `$in` queries where possible, and only update/insert asynchronously using `Promise.all()` chunking, strictly respecting connection limits.

## 5. Matrix-First Resilience & Arbiter Patterns

When building or refactoring high-reasoning agent gateways (like OmniRouter):

* **Rule:** Never rely on localized environment variables (`.env`) for individual agent API keys. This is a "Ghost Key" pattern that leads to 429 drift and silent hangs.
* **Implementation:** All agentic API consumption MUST route through the **Centralized Matrix Arbiter**. 
* **Redis Speed Layer:** Keys must be synced from MongoDB Atlas to a Redis hash (the "Speed Layer") on boot. Retrieval should be indexed by hash for sub-millisecond selection.
* **The 60-Second Dead List:** If a provider returns a `429 (Rate Limit)`, the system MUST instantly add that key's hash to a Redis "Dead List" with a **60-second TTL**. 
* **Seamless Failover:** The Arbiter must catch the 429, sideline the key, and instantly re-try the request with the next available key in the 105-unit matrix. Do not propagate the 429 to the Agent Loop unless the entire 105-key matrix is exhausted (Arbiter Panic).

## 6. Code Review & ZAP Audit

If you are auditing backend code (via `zap-audit` or otherwise), explicitly `grep` or search for inline driver definitions. If a developer left a `new MongoClient(uri)`, `new PrismaClient()`, or `new Client()` (Postgres) inside `export async function POST(req)`, flag it with a severity of `❌ CRITICAL FAILURE`.
