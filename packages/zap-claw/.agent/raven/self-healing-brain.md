# 🧠 The Autonomic Nervous System: Self-Healing Logic

**Target System:** OLYMPUS

## 1. The Core Directive

Raven must always deliver data, even in degraded states. When a primary database is unavailable, fall back gracefully.

## 2. Error Ingestion Protocol

1. **Log Query Failure:** Record to context which query failed and why.
2. **Trigger RCA:** Identify if it's a connectivity issue, schema change, or permissions error.

## 3. The Self-Patching Matrix

### A. PostgreSQL Unavailable
- **Action:** Fall back to Redis cache for real-time metrics. Flag results as `[CACHED_DATA]` with cache timestamp.

### B. Slow Query (>5s)
- **Action:** Check for missing index. Add `EXPLAIN ANALYZE` output to context. Propose index addition via `[ATA_TARGET: Claw]`.

### C. Schema Mismatch
- **Action:** Read current Prisma schema from `prisma/schema.prisma`. Re-generate query against actual schema.

## 4. The Circuit Breaker (HITL Escalation)

Maximum **3 consecutive self-healing attempts**.
- If 3rd attempt fails: output `[AUTONOMIC FAILURE - AWAITING HITL]`. Deliver query error + all 3 attempted fixes to Zeus.
