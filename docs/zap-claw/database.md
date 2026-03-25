# Zap Claw — Database Design

## Technology Choice

**`better-sqlite3` with FTS5 extension**

- Local-first: data never leaves your machine
- Synchronous API: simpler code, no async complexity for DB calls
- FTS5: built-in full-text search — essential for memory recall
- Single file: easy to backup, inspect, migrate

---

## Schema (Level 2)

### `conversations`
Stores all message history per user.

```sql
CREATE TABLE conversations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  role        TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'tool')),
  content     TEXT NOT NULL,
  tool_name   TEXT,               -- populated when role = 'tool'
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
```

### `memories`
Long-term facts the bot explicitly stores (via `remember` tool).

```sql
CREATE TABLE memories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  content     TEXT NOT NULL,
  tags        TEXT,               -- comma-separated
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

-- FTS5 virtual table for full-text search
CREATE VIRTUAL TABLE memories_fts USING fts5(
  content,
  tags,
  content='memories',
  content_rowid='id'
);
```

### `accounts` (Multi-Tenant — Level 2+)
Per-user configuration store.

```sql
CREATE TABLE accounts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id   INTEGER NOT NULL UNIQUE,
  display_name  TEXT,
  key_mode      TEXT NOT NULL DEFAULT 'single' CHECK(key_mode IN ('single', 'round-robin')),
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at    INTEGER NOT NULL DEFAULT (unixepoch())
);
```

### `api_keys`
Per-account API keys (encrypted at rest).

```sql
CREATE TABLE api_keys (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id    INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  provider      TEXT NOT NULL DEFAULT 'openrouter',
  model         TEXT NOT NULL,
  api_key_enc   TEXT NOT NULL,    -- AES-256 encrypted, never stored plaintext
  priority      INTEGER NOT NULL DEFAULT 0,  -- 0 = highest priority
  is_active     INTEGER NOT NULL DEFAULT 1,
  cooldown_until INTEGER,         -- unix timestamp, null = available
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_api_keys_account_id ON api_keys(account_id);
```

---

## Key Selection Logic (Round-Robin)

```
SELECT * FROM api_keys
WHERE account_id = ?
  AND is_active = 1
  AND (cooldown_until IS NULL OR cooldown_until < unixepoch())
ORDER BY priority ASC, id ASC
LIMIT 1
```

On 429 error: `UPDATE api_keys SET cooldown_until = unixepoch() + 60 WHERE id = ?`

---

## File Location

```
~/zap-claw/data/zap-claw.db
```

The `data/` folder is gitignored. Never commit the database.

---

## Migration Strategy

Migrations are plain numbered SQL files:

```
src/db/migrations/
├── 001_conversations.sql
├── 002_memories.sql
└── 003_accounts.sql
```

Run on startup — check current version, apply any missing migrations in order.

---

## Backup

Simple: copy the `.db` file.

```bash
cp ~/zap-claw/data/zap-claw.db ~/zap-claw/data/backups/$(date +%Y%m%d).db
```
