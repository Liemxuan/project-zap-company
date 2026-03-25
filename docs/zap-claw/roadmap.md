# Zap Claw — Roadmap

## Vision

A lean, secure, fully-understood personal AI agent — and eventually a multi-tenant product that lets you provide the same service to others. Built from scratch in TypeScript so every line is auditable.

Not a fork of OpenClaw. No community skill files. No exposed web server.

---

## Product Levels

### Level 1 — Foundation ✅
**Status: Complete**

- Telegram bot (long polling, no web server)
- Security whitelist (Telegram user ID)
- OpenRouter LLM integration
- Agentic tool loop (max 10 iterations)
- First tool: `get_current_time`

**Milestone:** @ZAP_Claw_bot responds only to owner, calls tools, returns answers.

---

### Level 2 — Memory 🔜
**Goal:** Conversations survive restarts. Bot remembers context across sessions.

- `better-sqlite3` + FTS5 full-text search
- Per-user conversation history stored in DB
- Memory tools: `remember`, `recall`, `forget`
- Account config store in SQLite (foundation for multi-tenant)

**Milestone:** Bot remembers things you told it last week.

---

### Level 3 — Voice 🔜
**Goal:** Speak to the bot, hear it speak back.

- Whisper API: voice message → transcribed text
- ElevenLabs API: text response → voice file → Telegram voice note

**Milestone:** Full voice conversation loop.

---

### Level 4 — Tools + MCP 🔜
**Goal:** Bot can actually do things in the world.

- Shell tool (with explicit confirmation for destructive commands)
- File read/write tools
- MCP bridge: standardized, auditable connection to external services (no untrusted code)

**Milestone:** Bot can run scripts, read files, call external APIs — all via MCP.

---

### Level 5 — Heartbeat 🔜
**Goal:** Bot is proactive, not just reactive.

- Scheduled morning briefing
- Proactive check-ins
- Event-driven notifications

**Milestone:** Bot sends you a morning summary without you asking.

---

## Multi-Tenant Product (Parallel Track)

**Goal:** Provide Zap Claw as a service to other people.

### Key Design Decisions
- Each account is isolated: own Telegram user ID, own API keys, own conversation history
- Key mode per account: `single` or `round-robin`
- Round-robin: up to 5 keys per account, with 60-second cooldown on rate-limited keys
- Provider strategy: OpenRouter as primary (aggregates all models, one SDK)
- Account config stored in SQLite (same DB as Level 2 memory)

### Onboarding Flow (Telegram commands)
```
/register       → create account
/addkey         → add API key (provider + model)
/setmode        → single or round-robin
/status         → show current config
```

### Admin Commands
```
/admin list     → see all accounts
/admin suspend  → suspend an account
```

---

## Non-Goals (forever)
- No web server / no exposed ports
- No untrusted community skill files
- No hardcoded secrets
- No public deployments (always local-first)
