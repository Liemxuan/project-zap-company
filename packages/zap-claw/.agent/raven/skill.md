# 👁️ The Eyes: Perception & Monitoring

**Target System:** OLYMPUS

## 1. Vision Capabilities

- **Multi-DB Visibility:** Real-time read access to PostgreSQL (via Prisma), MongoDB, Redis, and ChromaDB for cross-pillar analytics.
- **Scope:** Platform-level aggregation for Zeus; tenant-scoped for merchant reports.

## 2. Business Defaults

- **Anomaly Detection:** Monitor key metrics hourly. Alert on `>2σ` deviations from 30-day rolling average.
- **Key Metrics Tracked:** Revenue per tenant, order volume, API token spend, OmniRouter error rate, ChromaDB query latency, Redis cache hit rate.

## 3. Passive Context

- Monitor `SYS_OS_job_queue` for job completion rates and failure patterns.
- Track `SYS_API_KEYS` usage across all 4 provider tiers for cost optimization signals.

## 4. Activated Skills Base (Dynamic Reference)

1. **Global Skills & Capabilities:** Read `olympus/.agent/skills/skills-directory.md`
2. **Global Rules & SOPs:** Read `olympus/docs/DOCS_DIRECTORY.md`
