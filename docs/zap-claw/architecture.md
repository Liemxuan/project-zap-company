# Zap Claw — architecture

## Overview

```
Telegram (long polling)
    ↓
grammy Bot
    ↓
Security Middleware (userId whitelist)
    ↓
AgentLoop
    ↓
OpenRouter API (via OpenAI SDK)
    ↓ (tool_calls)
Tool Registry
    ↓
Tool Handler (e.g. get_current_time)
    ↓ (tool_result back to LLM)
AgentLoop (iterate until stop or max iterations)
    ↓
Reply → Telegram
```

---

## Core Modules

### `src/index.ts`
Entry point. Validates env vars (fails fast with clear error). Starts bot with graceful SIGINT/SIGTERM shutdown.

### `src/bot.ts`
- Sets up grammy `Bot`
- **Security middleware** runs on every update — non-whitelisted user IDs are silently dropped (no reply, no log)
- Handlers: `/start`, `/clear`, `message:text`

### `src/agent.ts`
- `AgentLoop` class
- Per-user conversation history (`Map<userId, ChatCompletionMessageParam[]>`)
- Hard cap: `MAX_ITERATIONS = 10`
- Flow: LLM call → if `tool_calls` → execute tools → append results → loop → if `stop` → return text

### `src/tools/index.ts`
- Tool registry: `name → { definition, handler }`
- `toolDefinitions[]` — passed to LLM every call
- `executeTool(name, input)` — safe dispatch with error handling

### `src/system_prompt.ts`
Claude's persona and instructions. Defines tone, tool-use expectations, security posture.

---

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Transport | Long polling (no webhook) | No web server, no exposed ports |
| LLM provider | OpenRouter | Aggregates all models, one SDK, one API format |
| SDK | OpenAI SDK → OpenRouter | OpenRouter is OpenAI-compatible |
| Language | TypeScript strict | Type safety, catches errors at compile time |
| Runtime | tsx (dev), tsc+node (prod) | Fast iteration in dev |
| Memory (Level 1) | In-memory Map | Simple, no deps; replaced in Level 2 |
| Memory (Level 2+) | SQLite + FTS5 | Local-first, fast, no external service |
| Tool integrations | MCP (Level 4) | Standardized, auditable, separate process |

---

## Concurrency Model

Node.js is single-threaded with a non-blocking event loop.

- `grammy` handles incoming updates asynchronously
- Multiple users can have active conversations simultaneously — while waiting for one user's LLM response, the event loop processes other messages
- Per-user history in `Map<userId>` ensures conversations never bleed across users
- **No additional threading needed** for multi-user support

---

## Rate Limiting Strategy (Multi-Tenant)

When serving multiple users with their own API keys:

```
try key[0]
  → 429? wait 60s, mark key as cooling down
  → try key[1]
  → 429? try key[2]
  → all keys cooling? → reply: "Rate limited, try in X seconds"
  → success → use response, reset fail counter for that key
```

Key selection is round-robin by default. After a 429, the failed key is skipped for 60 seconds.

---

## File Structure

```
zap-claw/
├── src/
│   ├── index.ts
│   ├── bot.ts
│   ├── agent.ts
│   ├── system_prompt.ts
│   └── tools/
│       ├── index.ts
│       └── get_current_time.ts
├── docs/
│   ├── roadmap.md
│   ├── architecture.md   ← this file
│   ├── security.md
│   ├── database.md
│   ├── multi-tenant.md
│   └── decisions.md
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── changelog.md
└── readme.md
```
