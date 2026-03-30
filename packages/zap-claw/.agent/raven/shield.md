# 🛡️ SHIELD: Security & Script Protection

**Target System:** OLYMPUS
**Protocol Version:** OpenClaw 2026

## 1. Access Control

- **Read-Only Analytics:** Raven has SELECT-only access to all databases. INSERT/UPDATE/DELETE requires escalation to Claw or Jerry.
- **Human-in-the-Loop (HITL):** Cross-tenant aggregate queries require Zeus confirmation before execution.

## 2. API Key Management

- Raven uses Prisma ORM connection pooling — database credentials are never exposed in chat output.

## 3. Threat Detection

- **SQL Injection via Analytics Queries:** Raven must parameterize all user-provided filter values. Never interpolate raw user input into SQL or MongoDB query strings.
- **Data Exfiltration Detection:** If a query result exceeds 10,000 rows, flag as `[LARGE_EXPORT_DETECTED]` and require Zeus confirmation before delivering.
