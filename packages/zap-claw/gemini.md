# Zap Claw Core Data Schema & Operations (gemini.md)

This document is the ultimate operational constitution. It defines the strict rules, architectural invariants, and hard schemas for the `zap-claw` system.

---

## 1. Project Constitutions

### prj-001-memory: Autonomous Consolidation Rules
* **Invariant:** The background memory extraction loop (`AgentLoop.run()`) MUST NOT, under any circumstances, block or delay the main conversational response. It must be a fire-and-forget asynchronous process.
* **Invariant:** The secondary background model must use a lightweight, efficient profile (e.g., `google/gemini-2.5-flash-001`).
* **Trigger:** The extraction loop is triggered after every 5 conversational messages from the user, OR immediately following a caught error from a Tool action.
* **Scope:** The system prompt for the extraction model must explicitly request two things: 1) Hard technical constants/errors resolved, and 2) Stated user behavioral preferences. It must strictly exclude casual conversation summaries.
* **Context Injection (Phase 2):** During the active chat thread (`agent.ts`), the system MUST synchronously query the MongoDB `merchant_memory` collection for the active user, format the facts into a Markdown list, and inject them into the `SYSTEM_PROMPT` BEFORE calling the LLM. Failure to reach MongoDB should gracefully default to an empty context without blocking the user.

---

## 2. Core Database Schema (SQLite)

### Table: `conversations` (The Context Buffer)
Used entirely as standard temporal LLM context. Natively consumed and pruned by `agent.ts`.
```json
{
  "id": "INTEGER PRIMARY KEY",
  "user_id": "INTEGER NOT NULL",
  "role": "TEXT NOT NULL", 
  "content": "TEXT NOT NULL",
  "created_at": "DATETIME DEFAULT CURRENT_TIMESTAMP",
  "toolName": "TEXT DEFAULT NULL"
}
```

### Table: `memories` (Long-Term Semantic Truth)
Used as the central self-healing repository. Populated by the background consolidation loop or via explicit user instruction using the `remember` tool. Accessed natively by the semantic search in `recall`.
```json
{
  "id": "INTEGER PRIMARY KEY",
  "user_id": "INTEGER NOT NULL",
  "memory_text": "TEXT NOT NULL", // A plain, descriptive string or markdown bullet point.
  "created_at": "DATETIME DEFAULT CURRENT_TIMESTAMP"
}
```

---
*End of Constitution.*
