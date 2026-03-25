# Zap Claw — Level 2: Memory (Redesigned)

**Milestone:** _Bot remembers things you told it last week, automatically, with no commands required._

---

## Why OpenClaw's Memory Is Broken

After reading the source, the problems are clear:

| Problem | What OpenClaw Does | What Goes Wrong |
|---|---|---|
| **Memory only saves on `/new` command** | `session-memory` hook fires when user types `/new` | If you never type `/new`, nothing is saved. Memory is opt-in per session. |
| **Memory is markdown files** | Writes `2026-02-21-slug.md` to a flat directory | No structured recall. The LLM has to scan files. No indexing. |
| **LLM generates the filename slug** | Calls the model just to name the file | Costs tokens, adds latency, can fail — just to create a filename |
| **Session history in JSONL flat files** | Rotates to `.reset.*` variants on `/new` | Requires brittle fallback logic to find "the right" session file. 80+ lines of path resolution. |
| **Embeddings are the primary recall mechanism** | 81 files: batch ops, vector dedup, FTS5 hybrid, cache tables | Massive complexity for personal use. Embeddings require an external API call every recall. |
| **No automatic conversation persistence** | Context lives only in the active session | Restart the process = lose all context. Memory only survives in `.md` dumps from `/new`. |

**Root cause:** OpenClaw was built for a workspace codebase indexer (indexing files on disk) and the "memory" system is a bolted-on adaptation of that. It's designed for _retrieving knowledge from a codebase_, not _remembering conversations_.

---

## Our Design Principles

1. **Automatic** — memory saves after every message, no commands needed
2. **Structured** — SQLite rows, not flat files. Every fact has an ID, timestamp, user
3. **Fast recall** — FTS5 full-text search, no embeddings API call required
4. **Stateless restarts** — process can die at any time; next message picks up from DB
5. **Transparent** — bot tells you what it remembers; you can ask it to forget

---

## What We're Building

### Layer 1 — Conversation Persistence
Every message pair (user → assistant) is written to SQLite. On the next message, the last N turns are loaded and prepended to the prompt. The bot has rolling context across restarts.

### Layer 2 — Long-Term Memory (Explicit)
The bot has 3 tools: `remember`, `recall`, `forget`. When you tell it something important, it decides to call `remember`. When you ask about the past, it calls `recall`. No commands. No `/new`. The agent decides when memory matters.

### Layer 3 — Memory Awareness in System Prompt
The system prompt tells Claude: _"You are a persistent memory agent. After each session you may call `remember` to save facts the user might want later. On each message, call `recall` if the user asks about something they've told you before."_

---

## Proposed Changes

### New Dependency
```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

---

### Database Layer — `src/db/`

#### [NEW] `src/db/client.ts`
- Opens `~/zap-claw/data/zap-claw.db` (creates `data/` dir if missing)
- Exports singleton `db` — synchronous `better-sqlite3` (no async needed, much simpler)
- Enables WAL mode: `PRAGMA journal_mode = WAL`

#### [NEW] `src/db/migrate.ts`
- `_migrations` table tracks applied migrations
- On startup: reads numbered `.sql` files, applies new ones in order
- Fails loudly if migration fails (not silent)

#### [NEW] `src/db/migrations/001_conversations.sql`
```sql
-- Rolling conversation history per user
CREATE TABLE conversations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  role       TEXT NOT NULL CHECK(role IN ('user','assistant','tool')),
  content    TEXT NOT NULL,
  tool_name  TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX idx_conv_user_time ON conversations(user_id, created_at DESC);
```

#### [NEW] `src/db/migrations/002_memories.sql`
```sql
-- Explicit long-term facts (called by remember tool)
CREATE TABLE memories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  content    TEXT NOT NULL,
  tags       TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- FTS5: fast full-text recall, no embeddings API needed
CREATE VIRTUAL TABLE memories_fts USING fts5(
  content,
  tags,
  content='memories',
  content_rowid='id'
);

-- Keep FTS in sync automatically
CREATE TRIGGER memories_ai AFTER INSERT ON memories BEGIN
  INSERT INTO memories_fts(rowid, content, tags) VALUES (new.id, new.content, new.tags);
END;
CREATE TRIGGER memories_ad AFTER DELETE ON memories BEGIN
  INSERT INTO memories_fts(memories_fts, rowid, content, tags)
    VALUES ('delete', old.id, old.content, old.tags);
END;
```

---

### Conversation History — `src/history.ts`

#### [NEW] `src/history.ts`
```ts
// Thin wrapper around the conversations table
getHistory(userId, limit = 20): Message[]   // last N messages
appendMessage(userId, role, content, toolName?)  // one insert
pruneHistory(userId, keepLast = 200)             // cleanup old rows
```

No async. Synchronous DB calls. Simple.

---

### Modified Agent — `src/agent.ts`

#### [MODIFY] `src/agent.ts`
Current: maintains `messages[]` in memory (lost on restart)
After: 
- **Before each turn**: `history.getHistory(userId)` → prepend to Claude messages array
- **After each turn**: `history.appendMessage(...)` for user message + assistant response + any tool results
- Max history window: last 20 turns (configurable) to keep context window manageable

---

### Memory Tools — `src/tools/`

#### [NEW] `src/tools/remember.ts`
```
Input:  { content: string, tags?: string }
Action: INSERT into memories + FTS5 trigger fires automatically
Output: "Got it — I've saved that."
```

#### [NEW] `src/tools/recall.ts`
```
Input:  { query: string }
Action: FTS5 search: SELECT ... FROM memories_fts WHERE memories_fts MATCH ?
Output: top 5 matching memories with IDs and timestamps
```

#### [NEW] `src/tools/forget.ts`
```
Input:  { memory_id: number }
Action: DELETE from memories (FTS5 delete trigger fires automatically)
Output: "Done — I've forgotten that."
```

#### [MODIFY] `src/tools/index.ts`
Register all 4 tools.

#### [MODIFY] `src/system_prompt.ts`
Add memory instructions:
- "Call `recall` when the user asks about something they may have told you before"
- "Call `remember` when the user tells you something they'd want you to remember long-term (names, preferences, important facts)"
- "Never ask the user to use commands. Memory is automatic."

---

### Startup — `src/index.ts`

#### [MODIFY] `src/index.ts`
```ts
// Boot order
migrate()     // apply any pending SQL migrations
initDb()      // open DB connection
bot.start()   // long polling begins
```

Fail fast if DB can't be opened — print clear error, exit 1.

---

## File Tree After Level 2

```
zap-claw/
├── data/                          ← gitignored
│   └── zap-claw.db
├── src/
│   ├── db/
│   │   ├── client.ts              ← NEW
│   │   ├── migrate.ts             ← NEW
│   │   └── migrations/
│   │       ├── 001_conversations.sql  ← NEW
│   │       └── 002_memories.sql       ← NEW
│   ├── history.ts                 ← NEW
│   ├── agent.ts                   ← MODIFIED (DB-backed history)
│   ├── bot.ts
│   ├── index.ts                   ← MODIFIED (migrate on boot)
│   ├── system_prompt.ts           ← MODIFIED (memory awareness)
│   └── tools/
│       ├── index.ts               ← MODIFIED
│       ├── get_current_time.ts
│       ├── remember.ts            ← NEW
│       ├── recall.ts              ← NEW
│       └── forget.ts              ← NEW
└── docs/
```

---

## Verification

```bash
# 1. Type-check
cd ~/zap-claw && npm run build
# Must: 0 errors

# 2. DB created & migrated
sqlite3 ~/zap-claw/data/zap-claw.db ".tables"
# Must show: conversations  memories  memories_fts  _migrations

# 3. Memory persists across restarts
# → Tell bot: "My dog is named Biscuit"
# → Kill process, restart
# → Ask: "What's my dog's name?" → should answer "Biscuit"

# 4. Conversation history loads across restarts
# → Say: "My favorite color is blue"  
# → Kill, restart
# → Ask: "What did I say earlier?" → should recall "blue" from DB history

# 5. Forget works
# → "Forget my dog's name" → bot calls forget, confirms
# → "What's my dog's name?" → bot says it doesn't know
```

---

> **Not building:** Embeddings, vector search, batch ops, LLM-generated slugs, JSONL files, `/new` commands.  
> These are OpenClaw complexity that doesn't serve a personal bot. FTS5 is fast enough for thousands of memories.
