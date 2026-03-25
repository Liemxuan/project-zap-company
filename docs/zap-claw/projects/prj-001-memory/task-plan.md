# prj-001-memory: Task Plan (Blueprint)

This document maps out the specific execution phases (Blueprint -> Link -> Architect -> Stylize -> Trigger) for the memory consolidation feature. It will be populated once the Discovery answers are approved.

## 1. Phase 1: The Memory Swarm (Extraction)
- [x] **Blueprint**: Setup background daemon architecture (`src/daemon.ts`).
- [x] **Link**: Connect to `better-sqlite3` and `mongodb`.
- [x] **Architect**: Build `src/memory/ralph.ts` engine and `src/memory/sync.ts` script.
- [x] **Stylize**: Enforce strict `<user_data>` JSON schemas.
- [x] **Trigger**: Execute `EXP-001` (N=100) load test to verify 100% injection immunity.

## 2. Phase 2: Context Injection (Retrieval)
- [x] **Blueprint**: Design synchronous MongoDB retrieval.
- [x] **Link**: Import `MongoClient` directly into `src/agent.ts` and `src/api.ts`.
- [x] **Architect**: Prepend raw Markdown formatting to the `SYSTEM_PROMPT`.
- [x] **Stylize**: Handle fallback gracefully if DB times out.
- [x] **Trigger**: Run local test script (`test_injection.ts`) to verify `[LONG-TERM MEMORY CONTEXT]` successfully appends to the LLM arrays.
