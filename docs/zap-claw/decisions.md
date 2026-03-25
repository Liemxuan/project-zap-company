# Zap Claw — architecture Decision Records

A log of significant technical decisions, why they were made, and what was considered.

---

## adr-001: Telegram-only, no web server

**Date:** 2026-02-20
**Status:** Accepted

**Decision:** Use Telegram long polling exclusively. No HTTP server, no webhooks, no exposed ports.

**Reasoning:**

- OpenClaw's biggest security flaw was 42K+ instances exposed publicly
- Long polling gives identical functionality with zero attack surface
- grammy handles long polling natively — no extra complexity

**Alternatives considered:**

- Webhooks: require an HTTPS endpoint → need a server or tunnel → reintroduces exposure
- Direct socket: overkill, no benefit

---

## adr-002: OpenRouter instead of direct Anthropic API

**Date:** 2026-02-20
**Status:** Accepted

**Decision:** Use OpenRouter as the LLM gateway, accessed via the OpenAI-compatible SDK.

## 🧠 PROJECT DECISIONS & archITECTURE LOG

## 🛠 RECOVERY: Gemini 3 Autonomic Restoration (2026-02-28)

**Issue:** System-wide 404s due to deprecated models (`gemini-1.5`, `gemini-2.0`). Daemon went unresponsive.
**Action:** Migrated entire engine to **Gemini 3** stack.
**Result:** Restore Jerry's pulse. confirmed connectivity via `test_hydra_chain.ts`.

---

## 🏗 Model Rotation Strategy (The Hydra Chain)

Based on live testing and OEM deprecations, the model rotation is now locked as follows:

### **Ultra Account (C_PRECISION)**

*Role: Strategic architecture, Security Audits, High-Reasoning Soul work.*

1. **Google Native**: `gemini-3.1-pro-preview` (Pillar 1: `PRECISION_GATEWAY`)
2. **OpenRouter Fallback**: `google/gemini-3.1-pro-preview`
3. **Frontier Bridge**: `google/gemini-3-pro-preview` (Strategic fallback via OpenRouter)
4. **Local Watchdog**: `OLLAMA`

### **Pro Account (B_PRODUCTIVITY)**

*Role: Standard Coding, Component Generation, Routine Diagnostics.*

1. **Google Native**: `gemini-3-pro-preview` (Pillar 2: `CODE_WORKFORCE`)
2. **OpenRouter Fallback**: `google/gemini-3-pro-preview`
3. **Local Watchdog**: `OLLAMA`

### **Economic Account (A_ECONOMIC)**

*Role: Budget/Bulk work, Web Scraping (Ralph Loop), Stateless extraction.*

1. **Google Native (Pillar 1)**: `gemini-3-flash-preview`
2. **Google Native (Pillar 2)**: `gemini-2-0-flash-001` (Resilience layer)
3. **Google Native (Pillar 3)**: `gemini-2.5-flash-lite` (Extreme efficiency)
4. **OpenRouter Fallback**: `google/gemini-3-flash-preview` (BYOK Aggregator)
5. **Local Watchdog**: `OLLAMA`

---

**Reasoning:**

- User already has an OpenRouter key and account
- One SDK covers all models (Claude, Gemini, GPT, etc.)
- Model swapping requires only one env var change (`MODEL=`)
- OpenAI SDK is battle-tested and well-typed

**Alternatives considered:**

- Direct Anthropic SDK: Anthropic-specific types and message format, harder to swap models
- Multiple SDKs: complexity grows with each provider added

---

## adr-003: SQLite for all persistence

**Date:** 2026-02-20
**Status:** Planned (Level 2)

**Decision:** Use `better-sqlite3` with synchronous API and FTS5 for all data storage (conversations, memories, accounts, API keys).

**Reasoning:**

- Local-first: data never leaves the machine
- Single file is easy to backup and inspect
- FTS5 enables semantic-ish memory search without a vector database
- Synchronous API simplifies code (no async DB calls in an already async system)

**Alternatives considered:**

- PostgreSQL: overkill, requires a running server process, not local-first
- Vector DB (e.g. Pinecone/Chroma): good for semantic search but heavy dep, FTS5 is good enough for Phase 1. Pinecone is scheduled for Phase 2 (alongside the scaling of the C# Orchestrator).
- JSON files: no ACID guarantees, no efficient search

---

## adr-004: Max 5 API keys per account (round-robin)

**Date:** 2026-02-20
**Status:** Planned (Multi-Tenant)

**Decision:** Cap round-robin key pool at 5 per account.

**Reasoning:**

- 1–3 keys handles 99% of individual use cases
- Beyond 5, the correct fix is upgrading to a higher API tier, not stockpiling keys
- Keeps the round-robin logic simple and the UX clear

---

## adr-005: API keys encrypted at rest in SQLite

**Date:** 2026-02-20
**Status:** Planned (Multi-Tenant)

**Decision:** Store API keys AES-256 encrypted in the DB. Encryption key derived from a master secret in `.env`.

**Reasoning:**

- If the DB file is ever exposed, raw keys won't be readable
- The master secret in `.env` is the single protected value
- Standard AES-256 is sufficient for this threat model

**Alternatives considered:**

- Plaintext in DB: unacceptable — DB files are often in less-protected locations
- OS keychain: complex cross-platform, overkill for a local app

---

## adr-006: MCP for tool integrations (Level 4)

**Date:** 2026-02-20
**Status:** Planned (Level 4)

**Decision:** All external service integrations (beyond simple tools like `get_current_time`) go through MCP servers, not community skill files.

**Reasoning:**

- OpenClaw's skill files had 341 confirmed malicious entries
- MCP runs as a separate process — sandboxed, auditable, standardized
- Growing ecosystem of first-party MCP servers

**Alternatives considered:**

- Community skill files: rejected — untrusted arbitrary code
- Direct API integrations: fine for simple cases but MCP is more scalable
