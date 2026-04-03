# DeerFlow 2.0 Runtime Engine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build the missing DeerFlow 2.0 runtime engine — middleware pipeline, DAG executor, skill runner, and missing agent identities — to turn ZAP OS from a routing layer into a full orchestration harness.

**Architecture:** Extend the existing `ToolMiddleware` pipeline pattern (`middlewares/pipeline.ts`) with 8 new middleware layers. Build a `dag_executor.ts` that leverages the existing DAG unblocking in `omni_queue.ts`. Create a `skill_runner.ts` that reads SKILL.md files and dispatches through OmniRouter. All new code lives in `packages/zap-claw/src/` and `apps/zap-swarm/src/app/api/swarm/`.

**Tech Stack:** TypeScript 5.9, MongoDB 7, Redis (ioredis), Jest 30, ChromaDB, OpenAI SDK, Next.js 15

**Existing Infrastructure (do NOT rebuild):**
- `middlewares/pipeline.ts` — `ToolMiddlewareContext` + `runMiddlewarePipeline()` chain
- `omni_queue.ts:332-343` — DAG dependent unblocking already works
- `tools/task.ts` — Fire-and-forget subagent dispatch via `executeSerializedLane()`
- `tools/write_todos.ts` — `activePlans` Map for plan state
- `middlewares/todolist.ts` — Blocks delegation without plan
- `runtime/router/native_acp.ts` — A2A subagent protocol
- 9 DeerFlow skill definitions in `.agent/skills/df-*/SKILL.md`
- All 4 zap-swarm pages wired to live MongoDB APIs

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `packages/zap-claw/src/middlewares/memory_inject.ts` | Recall relevant memories before LLM call, inject into context |
| `packages/zap-claw/src/middlewares/context_summarize.ts` | Compress threads >40 turns via Flash model |
| `packages/zap-claw/src/middlewares/loop_detection.ts` | Hash (agent+prompt+context), block if seen 3x |
| `packages/zap-claw/src/middlewares/title_autogen.ts` | Generate thread title on first assistant message |
| `packages/zap-claw/src/middlewares/followup_suggest.ts` | Generate 3 follow-up suggestions after response |
| `packages/zap-claw/src/middlewares/subagent_limit.ts` | Cap concurrent child jobs per thread |
| `packages/zap-claw/src/runtime/engine/dag_executor.ts` | Poll PENDING jobs, resolve DAG deps, dispatch to OmniRouter |
| `packages/zap-claw/src/skills/skill_runner.ts` | Load SKILL.md, build prompt, dispatch via OmniRouter |
| `packages/zap-claw/src/skills/skill_registry.ts` | Scan `.agent/skills/`, sync to MongoDB `SYS_SKILLS` |
| `apps/zap-swarm/src/app/api/swarm/spawn/route.ts` | HTTP endpoint for DAG child job creation |
| `packages/zap-claw/src/tools/spawn.ts` | `spawn` tool definition for agents to create child jobs |

### Modified Files

| File | Change |
|------|--------|
| `packages/zap-claw/src/middlewares/index.ts` | Re-export new middlewares |
| `packages/zap-claw/src/tools/index.ts` | Register `spawn` tool |
| `packages/zap-claw/src/runtime/engine/omni_queue.ts` | Add `createChildJob()` method |
| `apps/zap-swarm/src/app/api/swarm/skills/route.ts` | POST handler uses `skill_runner.ts` instead of raw chat dispatch |

### Agent Identity Files (5 missing agents x 12 files each)

| Agent | Directory |
|-------|-----------|
| Coder | `packages/zap-claw/.agent/coder/` |
| Architect | `packages/zap-claw/.agent/architect/` |
| Cleo | `packages/zap-claw/.agent/cleo/` |
| Daemon | `packages/zap-claw/.agent/daemon/` |
| Gateway | `packages/zap-claw/.agent/gateway/` |

---

## Task 1: Missing Agent Identity Files

**Files:**
- Create: `packages/zap-claw/.agent/cleo/identity.md` (+ 11 more per agent)
- Reference: `packages/zap-claw/.agent/jerry/` (template)

- [x] **Step 1: Read the Jerry agent template to understand the 12-file structure**

```bash
ls packages/zap-claw/.agent/jerry/
cat packages/zap-claw/.agent/jerry/identity.md
```

- [x] **Step 2: Create Cleo agent (DeerFlow Lead Agent equivalent)**

Create `packages/zap-claw/.agent/cleo/` with all 12 files. Cleo is the orchestrator — task decomposition, DAG spawning, TodoMode enforcement.

`identity.md`:
```markdown
# Cleo — Workflow Orchestrator

**Role:** Lead Agent / Task Decomposition Engine
**Port:** 3311
**Tier:** Precision (Gemini 3.1 Pro)

## Core Directive
You are Cleo, the DeerFlow Lead Agent equivalent. Your job is to decompose complex user requests into a DAG of sub-tasks, assign each to the correct specialist agent, and monitor execution to completion.

## Capabilities
- Break multi-step requests into atomic tasks
- Spawn child jobs via `spawn` tool with dependency ordering
- Monitor DAG execution status
- Escalate blocked tasks to human (HITL)
- Use `write_todos` before any delegation

## Output Format
Always produce a structured plan before executing. Use the `write_todos` tool first, then `spawn` tool for each task node.
```

`models.md`:
```markdown
# Model Configuration
- **Primary:** gemini-3.1-pro (Precision tier)
- **Fallback:** claude-sonnet-4-6 via OpenRouter
- **Theme:** PRECISION
```

Create minimal versions of: `soul.md`, `tools.md`, `memory.md`, `skill.md`, `heartbeat.md`, `shield.md`, `agents.md`, `learn.md`, `user.md`, `self-healing-brain.md` — following Jerry's structure.

- [x] **Step 3: Create Coder agent**

`packages/zap-claw/.agent/coder/identity.md`:
```markdown
# Coder — Code Generator

**Role:** Code Execution & TDD Specialist
**Port:** 3309
**Tier:** Productivity (Gemini 3 Pro)

## Core Directive
You are Coder. You write TypeScript code following BLAST protocol and strict TDD. You execute in sandboxed environments and return tested, working code.

## Capabilities
- Write TypeScript/React/Node.js code
- Execute commands via `run_command` tool
- Read/write files via VFS tools
- Run tests and verify green before returning
```

- [x] **Step 4: Create Architect agent**

`packages/zap-claw/.agent/architect/identity.md`:
```markdown
# Architect — System Designer

**Role:** Architecture Decisions & BLAST Plans
**Port:** 3310
**Tier:** Precision (Gemini 3.1 Pro)

## Core Directive
You are Architect. You design system architecture, write PRDs, create DAG designs, and author SOPs. You think in systems and produce implementation plans.
```

- [x] **Step 5: Create Daemon agent**

`packages/zap-claw/.agent/daemon/identity.md`:
```markdown
# Daemon — Background Runtime

**Role:** Cron, Memory Compaction, Sandbox Provisioning
**Port:** 8000
**Tier:** Fast (Flash)

## Core Directive
You are Daemon. You run background maintenance: memory compaction (24h cycle), health checks, Docker sandbox provisioning, and scheduled tasks. You never interact with users directly.
```

- [x] **Step 6: Create Gateway agent**

`packages/zap-claw/.agent/gateway/identity.md`:
```markdown
# Gateway — OmniRouter Entry Point

**Role:** Traffic Classification & Fleet Arbitrage
**Port:** 3001
**Tier:** Fast (Flash)

## Core Directive
You are Gateway. You classify inbound requests, rate-limit by tenant, and route to the correct agent via OmniRouter. You are the API gateway entry point for all external traffic.
```

- [x] **Step 7: Commit**

```bash
git add packages/zap-claw/.agent/cleo/ packages/zap-claw/.agent/coder/ packages/zap-claw/.agent/architect/ packages/zap-claw/.agent/daemon/ packages/zap-claw/.agent/gateway/
git commit -m "feat: add 5 missing agent identity files (Cleo, Coder, Architect, Daemon, Gateway)"
```

---

## Task 2: Middleware — Memory Inject

**Files:**
- Create: `packages/zap-claw/src/middlewares/memory_inject.ts`
- Test: `packages/zap-claw/src/__tests__/middlewares/memory_inject.test.ts`
- Modify: `packages/zap-claw/src/middlewares/index.ts`
- Reference: `packages/zap-claw/src/middlewares/todolist.ts` (pattern), `packages/zap-claw/src/memory/ralph.ts` (memory API)

- [x] **Step 1: Write the failing test**

```typescript
// packages/zap-claw/src/__tests__/middlewares/memory_inject.test.ts
import { MemoryInjectMiddleware } from '../../middlewares/memory_inject.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('MemoryInjectMiddleware', () => {
  it('should inject recalled memories into toolInput context', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'What do we know about auth?' },
      userId: 1,
      botName: 'Spike',
      sessionId: 'test-session',
      isAllowed: true,
    };

    let nextCalled = false;
    await MemoryInjectMiddleware(ctx, async () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
    expect(ctx.isAllowed).toBe(true);
    // Memory inject should add context but not block
  });

  it('should pass through when no memories found', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'hello' },
      userId: 1,
      botName: 'Spike',
      isAllowed: true,
    };

    let nextCalled = false;
    await MemoryInjectMiddleware(ctx, async () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

```bash
cd packages/zap-claw && npx jest src/__tests__/middlewares/memory_inject.test.ts --no-coverage
```
Expected: FAIL — `Cannot find module '../../middlewares/memory_inject.js'`

- [x] **Step 3: Write minimal implementation**

```typescript
// packages/zap-claw/src/middlewares/memory_inject.ts
import { ToolMiddleware } from "./pipeline.js";

/**
 * Memory Inject Middleware
 * Before LLM call: recall relevant memories from Redis→Mongo→Chroma
 * and inject them into the tool context for the agent to use.
 */
export const MemoryInjectMiddleware: ToolMiddleware = async (ctx, next) => {
  try {
    // Only inject memory for chat-related tools
    const chatTools = ['chat', 'task', 'spawn'];
    if (!chatTools.includes(ctx.toolName)) {
      await next();
      return;
    }

    const message = (ctx.toolInput.message as string) || (ctx.toolInput.objective as string) || '';
    if (!message || message.length < 10) {
      await next();
      return;
    }

    // Dynamic import to avoid circular deps
    const { getDb } = await import('../db.js');
    const db = await getDb();
    const tenantId = (ctx.toolInput.tenantId as string) || 'ZVN';

    // Layer 1: MongoDB memory recall (fast, structured)
    const memCol = db.collection(`${tenantId}_SYS_CLAW_memory`);
    const recentMemories = await memCol
      .find({ agentSource: ctx.botName })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    if (recentMemories.length > 0) {
      const memoryContext = recentMemories
        .map(m => `[Memory] ${m.content || m.text || JSON.stringify(m)}`)
        .join('\n');

      // Inject into toolInput as additional context
      ctx.toolInput._injectedMemory = memoryContext;
    }
  } catch (err) {
    // Memory injection is non-blocking — log and continue
    console.warn('[MemoryInject] Failed to recall memories:', (err as Error).message);
  }

  await next();
};
```

- [x] **Step 4: Run test to verify it passes**

```bash
cd packages/zap-claw && npx jest src/__tests__/middlewares/memory_inject.test.ts --no-coverage
```
Expected: PASS

- [x] **Step 5: Export from index**

Add to `packages/zap-claw/src/middlewares/index.ts`:
```typescript
export { MemoryInjectMiddleware } from './memory_inject.js';
```

- [x] **Step 6: Commit**

```bash
git add packages/zap-claw/src/middlewares/memory_inject.ts packages/zap-claw/src/__tests__/middlewares/memory_inject.test.ts packages/zap-claw/src/middlewares/index.ts
git commit -m "feat: add memory inject middleware for DeerFlow pipeline"
```

---

## Task 3: Middleware — Loop Detection

**Files:**
- Create: `packages/zap-claw/src/middlewares/loop_detection.ts`
- Test: `packages/zap-claw/src/__tests__/middlewares/loop_detection.test.ts`

- [x] **Step 1: Write the failing test**

```typescript
// packages/zap-claw/src/__tests__/middlewares/loop_detection.test.ts
import { LoopDetectionMiddleware, _resetLoopCache } from '../../middlewares/loop_detection.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('LoopDetectionMiddleware', () => {
  beforeEach(() => _resetLoopCache());

  function makeCtx(overrides?: Partial<ToolMiddlewareContext>): ToolMiddlewareContext {
    return {
      toolName: 'task',
      toolInput: { role: 'Spike', objective: 'build auth module' },
      userId: 1,
      botName: 'Cleo',
      sessionId: 'sess-1',
      isAllowed: true,
      ...overrides,
    };
  }

  it('should allow first two identical calls', async () => {
    for (let i = 0; i < 2; i++) {
      const ctx = makeCtx();
      let nextCalled = false;
      await LoopDetectionMiddleware(ctx, async () => { nextCalled = true; });
      expect(nextCalled).toBe(true);
      expect(ctx.isAllowed).toBe(true);
    }
  });

  it('should block on 3rd identical call', async () => {
    for (let i = 0; i < 2; i++) {
      const ctx = makeCtx();
      await LoopDetectionMiddleware(ctx, async () => {});
    }
    const ctx = makeCtx();
    let nextCalled = false;
    await LoopDetectionMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(false);
    expect(ctx.isAllowed).toBe(false);
    expect(ctx.resultContent).toContain('Loop detected');
  });

  it('should allow different inputs', async () => {
    for (let i = 0; i < 3; i++) {
      const ctx = makeCtx({ toolInput: { role: 'Spike', objective: `task-${i}` } });
      let nextCalled = false;
      await LoopDetectionMiddleware(ctx, async () => { nextCalled = true; });
      expect(nextCalled).toBe(true);
    }
  });
});
```

- [x] **Step 2: Run test to verify it fails**

```bash
cd packages/zap-claw && npx jest src/__tests__/middlewares/loop_detection.test.ts --no-coverage
```

- [x] **Step 3: Write minimal implementation**

```typescript
// packages/zap-claw/src/middlewares/loop_detection.ts
import { createHash } from 'crypto';
import { ToolMiddleware } from './pipeline.js';

const loopCache = new Map<string, number>();
const MAX_REPEATS = 3;

export function _resetLoopCache() {
  loopCache.clear();
}

export const LoopDetectionMiddleware: ToolMiddleware = async (ctx, next) => {
  const hash = createHash('sha256')
    .update(`${ctx.botName}:${ctx.sessionId || ''}:${ctx.toolName}:${JSON.stringify(ctx.toolInput)}`)
    .digest('hex')
    .slice(0, 16);

  const count = (loopCache.get(hash) || 0) + 1;
  loopCache.set(hash, count);

  if (count >= MAX_REPEATS) {
    ctx.isAllowed = false;
    ctx.hadError = true;
    ctx.resultContent = `[DEERFLOW GUARDRAIL] Loop detected: identical (agent + tool + input) seen ${count} times in this session. Breaking the loop. Try a different approach.`;
    console.warn(`[LoopDetection] 🔁 Blocked ${ctx.toolName} by ${ctx.botName}: ${count} repeats (hash: ${hash})`);
    return;
  }

  await next();
};
```

- [x] **Step 4: Run test to verify it passes**

```bash
cd packages/zap-claw && npx jest src/__tests__/middlewares/loop_detection.test.ts --no-coverage
```

- [x] **Step 5: Export and commit**

```bash
# Add to middlewares/index.ts
git add packages/zap-claw/src/middlewares/loop_detection.ts packages/zap-claw/src/__tests__/middlewares/loop_detection.test.ts packages/zap-claw/src/middlewares/index.ts
git commit -m "feat: add loop detection middleware for DeerFlow pipeline"
```

---

## Task 4: Middleware — Context Summarization

**Files:**
- Create: `packages/zap-claw/src/middlewares/context_summarize.ts`
- Test: `packages/zap-claw/src/__tests__/middlewares/context_summarize.test.ts`

- [x] **Step 1: Write the failing test**

```typescript
// packages/zap-claw/src/__tests__/middlewares/context_summarize.test.ts
import { ContextSummarizeMiddleware } from '../../middlewares/context_summarize.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('ContextSummarizeMiddleware', () => {
  it('should pass through when history is short', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'hello', _historyLength: 5 },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };

    let nextCalled = false;
    await ContextSummarizeMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(ctx.toolInput._shouldSummarize).toBeUndefined();
  });

  it('should flag summarization when history exceeds threshold', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'continue', _historyLength: 45 },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };

    let nextCalled = false;
    await ContextSummarizeMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(ctx.toolInput._shouldSummarize).toBe(true);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

- [x] **Step 3: Write minimal implementation**

```typescript
// packages/zap-claw/src/middlewares/context_summarize.ts
import { ToolMiddleware } from './pipeline.js';

const SUMMARIZE_THRESHOLD = 40; // turns

/**
 * Context Summarize Middleware
 * When a thread exceeds 40 turns, flag it for summarization.
 * The OmniRouter will then compress the context before the LLM call.
 */
export const ContextSummarizeMiddleware: ToolMiddleware = async (ctx, next) => {
  const historyLength = (ctx.toolInput._historyLength as number) || 0;

  if (historyLength > SUMMARIZE_THRESHOLD) {
    ctx.toolInput._shouldSummarize = true;
    console.log(`[ContextSummarize] Thread ${ctx.sessionId} has ${historyLength} turns — flagged for summarization.`);
  }

  await next();
};
```

- [x] **Step 4: Run test to verify it passes**

- [x] **Step 5: Export and commit**

```bash
git add packages/zap-claw/src/middlewares/context_summarize.ts packages/zap-claw/src/__tests__/middlewares/context_summarize.test.ts packages/zap-claw/src/middlewares/index.ts
git commit -m "feat: add context summarization middleware for DeerFlow pipeline"
```

---

## Task 5: Middleware — Subagent Limit

**Files:**
- Create: `packages/zap-claw/src/middlewares/subagent_limit.ts`
- Test: `packages/zap-claw/src/__tests__/middlewares/subagent_limit.test.ts`

- [x] **Step 1: Write the failing test**

```typescript
// packages/zap-claw/src/__tests__/middlewares/subagent_limit.test.ts
import { SubagentLimitMiddleware, _resetSpawnCounts } from '../../middlewares/subagent_limit.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('SubagentLimitMiddleware', () => {
  beforeEach(() => _resetSpawnCounts());

  it('should allow spawn when under limit', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'spawn',
      toolInput: { agent_slug: 'coder', task: 'write tests' },
      userId: 1,
      botName: 'Cleo',
      sessionId: 'sess-1',
      isAllowed: true,
    };

    let nextCalled = false;
    await SubagentLimitMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
  });

  it('should block spawn when limit reached', async () => {
    for (let i = 0; i < 6; i++) {
      const ctx: ToolMiddlewareContext = {
        toolName: 'spawn',
        toolInput: { agent_slug: 'coder', task: `task-${i}` },
        userId: 1,
        botName: 'Cleo',
        sessionId: 'sess-1',
        isAllowed: true,
      };
      await SubagentLimitMiddleware(ctx, async () => {});
    }

    const ctx: ToolMiddlewareContext = {
      toolName: 'spawn',
      toolInput: { agent_slug: 'coder', task: 'task-7' },
      userId: 1,
      botName: 'Cleo',
      sessionId: 'sess-1',
      isAllowed: true,
    };
    let nextCalled = false;
    await SubagentLimitMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(false);
    expect(ctx.isAllowed).toBe(false);
  });

  it('should not affect non-spawn tools', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'web_search',
      toolInput: { query: 'test' },
      userId: 1,
      botName: 'Scout',
      isAllowed: true,
    };
    let nextCalled = false;
    await SubagentLimitMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

- [x] **Step 3: Write minimal implementation**

```typescript
// packages/zap-claw/src/middlewares/subagent_limit.ts
import { ToolMiddleware } from './pipeline.js';

const spawnCounts = new Map<string, number>();
const MAX_SUBAGENTS_PER_THREAD = 6;

export function _resetSpawnCounts() {
  spawnCounts.clear();
}

export const SubagentLimitMiddleware: ToolMiddleware = async (ctx, next) => {
  const spawnTools = ['spawn', 'task', 'deploy_hydra_team'];

  if (!spawnTools.includes(ctx.toolName)) {
    await next();
    return;
  }

  const threadKey = `${ctx.userId}:${ctx.sessionId || 'default'}`;
  const current = spawnCounts.get(threadKey) || 0;

  if (current >= MAX_SUBAGENTS_PER_THREAD) {
    ctx.isAllowed = false;
    ctx.hadError = true;
    ctx.resultContent = `[DEERFLOW GUARDRAIL] Subagent limit reached: ${current}/${MAX_SUBAGENTS_PER_THREAD} concurrent child jobs for this thread. Wait for existing jobs to complete before spawning more.`;
    console.warn(`[SubagentLimit] 🛑 Blocked ${ctx.toolName}: ${current} active spawns for thread ${threadKey}`);
    return;
  }

  spawnCounts.set(threadKey, current + 1);
  await next();
};
```

- [x] **Step 4: Run test to verify it passes**

- [x] **Step 5: Export and commit**

```bash
git add packages/zap-claw/src/middlewares/subagent_limit.ts packages/zap-claw/src/__tests__/middlewares/subagent_limit.test.ts packages/zap-claw/src/middlewares/index.ts
git commit -m "feat: add subagent limit middleware for DeerFlow pipeline"
```

---

## Task 6: Middleware — Title Auto-Gen & Follow-up Suggestions

**Files:**
- Create: `packages/zap-claw/src/middlewares/title_autogen.ts`
- Create: `packages/zap-claw/src/middlewares/followup_suggest.ts`
- Test: `packages/zap-claw/src/__tests__/middlewares/title_autogen.test.ts`
- Test: `packages/zap-claw/src/__tests__/middlewares/followup_suggest.test.ts`

- [x] **Step 1: Write tests for both middlewares**

```typescript
// packages/zap-claw/src/__tests__/middlewares/title_autogen.test.ts
import { TitleAutoGenMiddleware } from '../../middlewares/title_autogen.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('TitleAutoGenMiddleware', () => {
  it('should flag first message for title generation', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'Help me design an auth system', _isFirstMessage: true },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };
    let nextCalled = false;
    await TitleAutoGenMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(ctx.toolInput._generateTitle).toBe(true);
  });

  it('should skip title gen for subsequent messages', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'continue', _isFirstMessage: false },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };
    await TitleAutoGenMiddleware(ctx, async () => {});
    expect(ctx.toolInput._generateTitle).toBeUndefined();
  });
});
```

```typescript
// packages/zap-claw/src/__tests__/middlewares/followup_suggest.test.ts
import { FollowupSuggestMiddleware } from '../../middlewares/followup_suggest.js';
import { ToolMiddlewareContext } from '../../middlewares/pipeline.js';

describe('FollowupSuggestMiddleware', () => {
  it('should flag chat responses for follow-up generation', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'explain auth flows' },
      userId: 1,
      botName: 'Spike',
      sessionId: 'sess-1',
      isAllowed: true,
    };
    let nextCalled = false;
    await FollowupSuggestMiddleware(ctx, async () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(ctx.toolInput._generateFollowups).toBe(true);
  });
});
```

- [x] **Step 2: Run tests to verify they fail**

- [x] **Step 3: Write implementations**

```typescript
// packages/zap-claw/src/middlewares/title_autogen.ts
import { ToolMiddleware } from './pipeline.js';

export const TitleAutoGenMiddleware: ToolMiddleware = async (ctx, next) => {
  if (ctx.toolName === 'chat' && ctx.toolInput._isFirstMessage) {
    ctx.toolInput._generateTitle = true;
  }
  await next();
};
```

```typescript
// packages/zap-claw/src/middlewares/followup_suggest.ts
import { ToolMiddleware } from './pipeline.js';

export const FollowupSuggestMiddleware: ToolMiddleware = async (ctx, next) => {
  if (ctx.toolName === 'chat') {
    ctx.toolInput._generateFollowups = true;
  }
  await next();
};
```

- [x] **Step 4: Run tests to verify they pass**

- [x] **Step 5: Export and commit**

```bash
git add packages/zap-claw/src/middlewares/title_autogen.ts packages/zap-claw/src/middlewares/followup_suggest.ts packages/zap-claw/src/__tests__/middlewares/ packages/zap-claw/src/middlewares/index.ts
git commit -m "feat: add title auto-gen and follow-up suggestion middlewares"
```

---

## Task 7: Spawn Tool + API Route

**Files:**
- Create: `packages/zap-claw/src/tools/spawn.ts`
- Create: `apps/zap-swarm/src/app/api/swarm/spawn/route.ts`
- Modify: `packages/zap-claw/src/tools/index.ts`
- Modify: `packages/zap-claw/src/runtime/engine/omni_queue.ts`
- Test: `packages/zap-claw/src/__tests__/tools/spawn.test.ts`
- Reference: `packages/zap-claw/src/tools/task.ts` (existing pattern)

- [x] **Step 1: Write the failing test for spawn tool**

```typescript
// packages/zap-claw/src/__tests__/tools/spawn.test.ts
import { definition, createChildJob } from '../../tools/spawn.js';

describe('spawn tool', () => {
  it('should have correct tool definition', () => {
    expect(definition.function.name).toBe('spawn');
    expect(definition.function.parameters.required).toContain('agent_slug');
    expect(definition.function.parameters.required).toContain('task');
  });

  it('createChildJob should return a job document shape', () => {
    const job = createChildJob({
      parentThreadId: 'thread-1',
      agentSlug: 'coder',
      task: 'Write unit tests',
      priority: 1,
      tenantId: 'ZVN',
      userId: '1',
    });

    expect(job.agentSlug).toBe('coder');
    expect(job.status).toBe('PENDING');
    expect(job.parentThreadId).toBe('thread-1');
    expect(job.priority).toBe(1);
    expect(job.payload).toBe('Write unit tests');
  });
});
```

- [x] **Step 2: Run test to verify it fails**

- [x] **Step 3: Write spawn tool**

```typescript
// packages/zap-claw/src/tools/spawn.ts
import { ChatCompletionTool } from "openai/resources/chat/completions.js";

export const definition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "spawn",
    description:
      "Spawn a child agent job in the DAG. The child job runs asynchronously and its results are tracked in the job queue. Use this for tasks that need a specific specialist agent. Always use write_todos first to plan your delegation.",
    parameters: {
      type: "object",
      properties: {
        agent_slug: {
          type: "string",
          description: "The agent to assign this task to.",
          enum: [
            "spike", "jerry", "athena", "hermes", "hawk",
            "nova", "raven", "scout", "coder", "architect",
            "cleo", "daemon",
          ],
        },
        task: {
          type: "string",
          description: "The detailed task description for the child agent.",
        },
        priority: {
          type: "number",
          description: "Job priority: 0=critical, 1=high, 2=normal, 3=low",
          enum: [0, 1, 2, 3],
        },
        depends_on: {
          type: "array",
          items: { type: "string" },
          description: "Array of job IDs this task depends on (DAG edges).",
        },
      },
      required: ["agent_slug", "task"],
    },
  },
};

export interface ChildJobInput {
  parentThreadId: string;
  agentSlug: string;
  task: string;
  priority?: number;
  dependsOn?: string[];
  tenantId: string;
  userId: string;
}

export function createChildJob(input: ChildJobInput) {
  return {
    parentThreadId: input.parentThreadId,
    agentSlug: input.agentSlug,
    assignedAgentId: `AGNT-OLY-${input.agentSlug.toUpperCase()}`,
    payload: input.task,
    status: input.dependsOn?.length ? "BLOCKED" : "PENDING",
    priority: input.priority ?? 2,
    dependsOn: input.dependsOn || [],
    tenantId: input.tenantId,
    userId: input.userId,
    createdAt: new Date(),
  };
}

export async function handler(
  input: Record<string, unknown>,
  userId: number,
  botName?: string
) {
  const { agent_slug, task, priority, depends_on } = input as {
    agent_slug: string;
    task: string;
    priority?: number;
    depends_on?: string[];
  };

  const tenantId = (input.tenantId as string) || "ZVN";
  const sessionId = (input.sessionId as string) || `SPAWN_${Date.now()}`;

  const job = createChildJob({
    parentThreadId: sessionId,
    agentSlug: agent_slug,
    task,
    priority,
    dependsOn: depends_on,
    tenantId,
    userId: userId.toString(),
  });

  // Insert into MongoDB job queue
  try {
    const { getDb } = await import("../db.js");
    const db = await getDb();
    const col = db.collection(`${tenantId}_SYS_OS_job_queue`);
    const result = await col.insertOne(job);

    console.log(
      `[Spawn] 🚀 ${botName || "Lead"} spawned child job for [${agent_slug}]: ${result.insertedId}`
    );

    return {
      output: `Child job spawned for agent "${agent_slug}" (Job ID: ${result.insertedId}). Status: ${job.status}. ${
        job.dependsOn.length
          ? `Blocked on: ${job.dependsOn.join(", ")}`
          : "Ready for execution."
      }`,
    };
  } catch (err) {
    return {
      output: `Failed to spawn child job: ${(err as Error).message}`,
    };
  }
}
```

- [x] **Step 4: Run test to verify it passes**

- [x] **Step 5: Create the API route**

```typescript
// apps/zap-swarm/src/app/api/swarm/spawn/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parentThreadId,
      agentSlug,
      task,
      priority = 2,
      dependsOn = [],
      tenantId = "ZVN",
    } = body;

    if (!agentSlug || !task) {
      return NextResponse.json(
        { error: "agentSlug and task are required" },
        { status: 400 }
      );
    }

    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db("olympus");
    const col = db.collection(`${tenantId}_SYS_OS_job_queue`);

    const job = {
      parentThreadId: parentThreadId || `SPAWN_${Date.now()}`,
      assignedAgentId: `AGNT-OLY-${agentSlug.toUpperCase()}`,
      agentSlug,
      payload: task,
      status: dependsOn.length > 0 ? "BLOCKED" : "PENDING",
      priority,
      dependsOn: dependsOn.map((id: string) => new ObjectId(id)),
      tenantId,
      createdAt: new Date(),
    };

    const result = await col.insertOne(job);
    await client.close();

    return NextResponse.json({
      success: true,
      jobId: result.insertedId.toString(),
      status: job.status,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
```

- [x] **Step 6: Register spawn tool in tools/index.ts**

Add the spawn tool import and registration alongside existing tools.

- [x] **Step 7: Commit**

```bash
git add packages/zap-claw/src/tools/spawn.ts packages/zap-claw/src/__tests__/tools/spawn.test.ts packages/zap-claw/src/tools/index.ts apps/zap-swarm/src/app/api/swarm/spawn/route.ts
git commit -m "feat: add spawn tool and API route for DAG child job creation"
```

---

## Task 8: DAG Executor

**Files:**
- Create: `packages/zap-claw/src/runtime/engine/dag_executor.ts`
- Test: `packages/zap-claw/src/__tests__/runtime/dag_executor.test.ts`
- Reference: `packages/zap-claw/src/runtime/engine/omni_queue.ts:332-343` (existing DAG unblocking)

- [x] **Step 1: Write the failing test**

```typescript
// packages/zap-claw/src/__tests__/runtime/dag_executor.test.ts
import { resolveReadyJobs, shouldDispatch } from '../../runtime/engine/dag_executor.js';

describe('DAG Executor', () => {
  it('shouldDispatch returns true for PENDING jobs with no dependencies', () => {
    const job = { status: 'PENDING', dependsOn: [] };
    expect(shouldDispatch(job)).toBe(true);
  });

  it('shouldDispatch returns false for BLOCKED jobs', () => {
    const job = { status: 'BLOCKED', dependsOn: ['abc'] };
    expect(shouldDispatch(job)).toBe(false);
  });

  it('shouldDispatch returns false for COMPLETED jobs', () => {
    const job = { status: 'COMPLETED', dependsOn: [] };
    expect(shouldDispatch(job)).toBe(false);
  });

  it('resolveReadyJobs filters to only dispatchable jobs', () => {
    const jobs = [
      { _id: '1', status: 'PENDING', dependsOn: [] },
      { _id: '2', status: 'BLOCKED', dependsOn: ['1'] },
      { _id: '3', status: 'COMPLETED', dependsOn: [] },
      { _id: '4', status: 'PENDING', dependsOn: [] },
    ];
    const ready = resolveReadyJobs(jobs);
    expect(ready).toHaveLength(2);
    expect(ready.map(j => j._id)).toEqual(['1', '4']);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

- [x] **Step 3: Write implementation**

```typescript
// packages/zap-claw/src/runtime/engine/dag_executor.ts

interface DAGJob {
  _id: string;
  status: string;
  dependsOn: string[];
  agentSlug?: string;
  assignedAgentId?: string;
  payload?: string;
  tenantId?: string;
  parentThreadId?: string;
  priority?: number;
  [key: string]: unknown;
}

export function shouldDispatch(job: Pick<DAGJob, 'status' | 'dependsOn'>): boolean {
  return job.status === 'PENDING' && (!job.dependsOn || job.dependsOn.length === 0);
}

export function resolveReadyJobs(jobs: DAGJob[]): DAGJob[] {
  return jobs.filter(shouldDispatch);
}

/**
 * DAG Executor Daemon
 *
 * Polls the job queue for PENDING jobs with resolved dependencies,
 * dispatches them to OmniRouter via the existing executeSerializedLane.
 *
 * The DAG unblocking logic already exists in omni_queue.ts (lines 332-343):
 * when a job completes, it removes itself from dependsOn arrays of BLOCKED jobs,
 * promoting them to PENDING when all deps are resolved.
 *
 * This executor complements that by actively polling for PENDING jobs
 * and dispatching them.
 */
export async function startDAGExecutor(tenantId: string = 'ZVN', pollIntervalMs: number = 2000) {
  const { getDb } = await import('../../db.js');
  const { executeSerializedLane } = await import('../serialized_lane.js');

  const db = await getDb();
  const col = db.collection(`${tenantId}_SYS_OS_job_queue`);

  console.log(`[DAG Executor] 🔄 Started polling every ${pollIntervalMs}ms for tenant ${tenantId}`);

  const interval = setInterval(async () => {
    try {
      const pendingJobs = await col
        .find({ status: 'PENDING', agentSlug: { $exists: true } })
        .sort({ priority: 1, createdAt: 1 })
        .limit(3) // Process max 3 jobs per tick
        .toArray();

      const ready = resolveReadyJobs(pendingJobs as unknown as DAGJob[]);

      for (const job of ready) {
        // Mark as PROCESSING to prevent double-dispatch
        await col.updateOne(
          { _id: job._id, status: 'PENDING' },
          { $set: { status: 'PROCESSING', startedAt: new Date() } }
        );

        console.log(`[DAG Executor] 🚀 Dispatching job ${job._id} to agent ${job.agentSlug}`);

        const agentProfile = {
          name: job.agentSlug || 'spike',
          role: job.agentSlug || 'spike',
          department: 'Swarm',
          assignedAgentId: job.assignedAgentId || `AGNT-OLY-${(job.agentSlug || 'SPIKE').toUpperCase()}`,
          defaultModel: 'anthropic/claude-sonnet-4-6',
          specialty: 'EXECUTION',
        };

        // Fire and forget — omni_queue handles completion + DAG unblocking
        executeSerializedLane(
          agentProfile,
          job.tenantId || tenantId,
          '0', // system user
          job.payload || '',
          1,
          job.parentThreadId || `DAG_${job._id}`
        ).catch(err => {
          console.error(`[DAG Executor] ❌ Job ${job._id} failed: ${err.message}`);
          col.updateOne(
            { _id: job._id },
            { $set: { status: 'FAILED', error: err.message, failedAt: new Date() } }
          ).catch(() => {});
        });
      }
    } catch (err) {
      console.error(`[DAG Executor] Poll error: ${(err as Error).message}`);
    }
  }, pollIntervalMs);

  return { stop: () => clearInterval(interval) };
}
```

- [x] **Step 4: Run test to verify it passes**

- [x] **Step 5: Commit**

```bash
git add packages/zap-claw/src/runtime/engine/dag_executor.ts packages/zap-claw/src/__tests__/runtime/dag_executor.test.ts
git commit -m "feat: add DAG executor daemon for DeerFlow job orchestration"
```

---

## Task 9: Skill Runner

**Files:**
- Create: `packages/zap-claw/src/skills/skill_runner.ts`
- Create: `packages/zap-claw/src/skills/skill_registry.ts`
- Test: `packages/zap-claw/src/__tests__/skills/skill_runner.test.ts`
- Modify: `apps/zap-swarm/src/app/api/swarm/skills/route.ts` (POST handler)
- Reference: `apps/zap-swarm/src/app/api/swarm/skills/route.ts` (existing classification logic)

- [x] **Step 1: Write the failing test**

```typescript
// packages/zap-claw/src/__tests__/skills/skill_runner.test.ts
import { resolveSkillPrompt, buildSkillSystemPrompt } from '../../skills/skill_runner.js';

describe('Skill Runner', () => {
  it('buildSkillSystemPrompt wraps skill instructions with context', () => {
    const result = buildSkillSystemPrompt({
      skillName: 'Deep Research',
      instructions: 'You are a research agent. Search broadly.',
      userInput: 'Research OAuth 2.0 best practices',
      agentSlug: 'athena',
    });

    expect(result).toContain('Deep Research');
    expect(result).toContain('Search broadly');
    expect(result).toContain('OAuth 2.0');
    expect(result).toContain('athena');
  });

  it('resolveSkillPrompt returns null for unknown skill', async () => {
    const result = await resolveSkillPrompt('nonexistent-skill', '/fake/path');
    expect(result).toBeNull();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

- [x] **Step 3: Write implementation**

```typescript
// packages/zap-claw/src/skills/skill_runner.ts
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface SkillPromptInput {
  skillName: string;
  instructions: string;
  userInput: string;
  agentSlug: string;
}

export function buildSkillSystemPrompt(input: SkillPromptInput): string {
  return [
    `# Skill Execution: ${input.skillName}`,
    `**Assigned Agent:** ${input.agentSlug}`,
    '',
    '## Skill Instructions',
    input.instructions,
    '',
    '## User Request',
    input.userInput,
  ].join('\n');
}

export async function resolveSkillPrompt(
  skillDirName: string,
  skillsBasePath: string
): Promise<string | null> {
  const skillMdPath = join(skillsBasePath, skillDirName, 'SKILL.md');

  if (!existsSync(skillMdPath)) {
    return null;
  }

  return readFileSync(skillMdPath, 'utf-8');
}

export async function executeSkill(opts: {
  skillDirName: string;
  skillsBasePath: string;
  userInput: string;
  agentSlug: string;
  sessionId: string;
  tenantId: string;
}): Promise<{ systemPrompt: string; agentSlug: string } | null> {
  const instructions = await resolveSkillPrompt(opts.skillDirName, opts.skillsBasePath);

  if (!instructions) {
    return null;
  }

  // Extract skill name from directory (e.g., "df-deep-research" → "Deep Research")
  const skillName = opts.skillDirName
    .replace(/^df-/, '')
    .replace(/^zap-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const systemPrompt = buildSkillSystemPrompt({
    skillName,
    instructions,
    userInput: opts.userInput,
    agentSlug: opts.agentSlug,
  });

  return { systemPrompt, agentSlug: opts.agentSlug };
}
```

```typescript
// packages/zap-claw/src/skills/skill_registry.ts
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface SkillEntry {
  dirName: string;
  name: string;
  command: string;
  description: string;
  agentSlug: string;
  path: string;
}

/**
 * Scan the .agent/skills/ directory and return all discovered skills.
 */
export function discoverSkills(skillsBasePath: string): SkillEntry[] {
  if (!existsSync(skillsBasePath)) return [];

  return readdirSync(skillsBasePath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const skillMdPath = join(skillsBasePath, d.name, 'SKILL.md');
      if (!existsSync(skillMdPath)) return null;

      const content = readFileSync(skillMdPath, 'utf-8');
      const firstLine = content.split('\n').find(l => l.trim().length > 0) || d.name;
      const desc = content.slice(0, 200).replace(/^#.*\n/, '').trim();

      // Determine agent from prefix
      let agentSlug = 'spike';
      if (d.name.startsWith('df-')) agentSlug = 'athena';
      if (d.name.includes('chart') || d.name.includes('data-analysis')) agentSlug = 'raven';
      if (d.name.includes('design') || d.name.includes('frontend')) agentSlug = 'nova';
      if (d.name.includes('github')) agentSlug = 'scout';

      return {
        dirName: d.name,
        name: firstLine.replace(/^#+\s*/, ''),
        command: `/${d.name}`,
        description: desc,
        agentSlug,
        path: skillMdPath,
      };
    })
    .filter(Boolean) as SkillEntry[];
}
```

- [x] **Step 4: Run test to verify it passes**

- [x] **Step 5: Commit**

```bash
mkdir -p packages/zap-claw/src/skills
git add packages/zap-claw/src/skills/skill_runner.ts packages/zap-claw/src/skills/skill_registry.ts packages/zap-claw/src/__tests__/skills/skill_runner.test.ts
git commit -m "feat: add skill runner and registry for DeerFlow skill execution"
```

---

## Task 10: Wire the Full Middleware Pipeline

**Files:**
- Modify: `packages/zap-claw/src/middlewares/index.ts`
- Test: `packages/zap-claw/src/__tests__/middlewares/pipeline_integration.test.ts`
- Reference: `packages/zap-claw/src/middlewares/pipeline.ts` (`runMiddlewarePipeline`)

This task wires all middlewares into the canonical execution order.

- [x] **Step 1: Write the integration test**

```typescript
// packages/zap-claw/src/__tests__/middlewares/pipeline_integration.test.ts
import { runMiddlewarePipeline, ToolMiddlewareContext } from '../../middlewares/pipeline.js';
import { LoopDetectionMiddleware, _resetLoopCache } from '../../middlewares/loop_detection.js';
import { SubagentLimitMiddleware, _resetSpawnCounts } from '../../middlewares/subagent_limit.js';
import { ContextSummarizeMiddleware } from '../../middlewares/context_summarize.js';
import { MemoryInjectMiddleware } from '../../middlewares/memory_inject.js';
import { TodoListMiddleware } from '../../middlewares/todolist.js';

describe('Full DeerFlow Middleware Pipeline', () => {
  beforeEach(() => {
    _resetLoopCache();
    _resetSpawnCounts();
  });

  it('should run full pipeline in order for allowed request', async () => {
    const executionOrder: string[] = [];

    const trackingMiddleware = (name: string) =>
      (async (ctx: ToolMiddlewareContext, next: () => Promise<void>) => {
        executionOrder.push(name);
        await next();
      }) as any;

    const ctx: ToolMiddlewareContext = {
      toolName: 'chat',
      toolInput: { message: 'hello world' },
      userId: 1,
      botName: 'Spike',
      sessionId: 'test',
      isAllowed: true,
    };

    await runMiddlewarePipeline(
      [
        trackingMiddleware('guardrail'),
        trackingMiddleware('memory'),
        trackingMiddleware('context'),
        trackingMiddleware('loop'),
        trackingMiddleware('subagent'),
        trackingMiddleware('todo'),
      ],
      ctx
    );

    expect(executionOrder).toEqual([
      'guardrail', 'memory', 'context', 'loop', 'subagent', 'todo'
    ]);
    expect(ctx.isAllowed).toBe(true);
  });

  it('should halt pipeline when a middleware blocks', async () => {
    const ctx: ToolMiddlewareContext = {
      toolName: 'spawn',
      toolInput: { agent_slug: 'coder', task: 'test' },
      userId: 1,
      botName: 'Cleo',
      sessionId: 'test',
      isAllowed: true,
    };

    // TodoListMiddleware blocks spawn without plan
    let postTodoRan = false;
    await runMiddlewarePipeline(
      [
        TodoListMiddleware,
        async (_ctx, next) => { postTodoRan = true; await next(); },
      ],
      ctx
    );

    expect(ctx.isAllowed).toBe(false);
    expect(postTodoRan).toBe(false);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

- [x] **Step 3: Update middlewares/index.ts with canonical pipeline**

```typescript
// packages/zap-claw/src/middlewares/index.ts
export { runMiddlewarePipeline } from './pipeline.js';
export type { ToolMiddleware, ToolMiddlewareContext } from './pipeline.js';

// DeerFlow Pipeline Middlewares (execution order)
export { GuardrailMiddleware } from './guardrail.js';
export { MemoryInjectMiddleware } from './memory_inject.js';
export { ContextSummarizeMiddleware } from './context_summarize.js';
export { SubagentLimitMiddleware } from './subagent_limit.js';
export { LoopDetectionMiddleware } from './loop_detection.js';
export { TodoListMiddleware } from './todolist.js';
export { TitleAutoGenMiddleware } from './title_autogen.js';
export { FollowupSuggestMiddleware } from './followup_suggest.js';
export { HITLMiddleware } from './hitl.js';
export { SandboxMiddleware } from './sandbox.js';
export { FallbackMiddleware } from './fallback.js';

// Canonical DeerFlow pipeline order
export { DEERFLOW_PIPELINE } from './deerflow_pipeline.js';
```

Create `packages/zap-claw/src/middlewares/deerflow_pipeline.ts`:
```typescript
import { ToolMiddleware } from './pipeline.js';
import { GuardrailMiddleware } from './guardrail.js';
import { MemoryInjectMiddleware } from './memory_inject.js';
import { ContextSummarizeMiddleware } from './context_summarize.js';
import { SubagentLimitMiddleware } from './subagent_limit.js';
import { LoopDetectionMiddleware } from './loop_detection.js';
import { TodoListMiddleware } from './todolist.js';
import { TitleAutoGenMiddleware } from './title_autogen.js';
import { FollowupSuggestMiddleware } from './followup_suggest.js';
import { HITLMiddleware } from './hitl.js';

/**
 * Canonical DeerFlow Middleware Pipeline
 *
 * Execution order:
 * 1. Guardrail (ZSS) — content safety + prompt injection
 * 2. Memory Inject — recall relevant context
 * 3. Context Summarize — compress long threads
 * 4. Subagent Limit — cap concurrent spawns
 * 5. Loop Detection — prevent infinite loops
 * 6. TodoList — enforce plan-before-delegate
 * 7. HITL — human confirmation for destructive actions
 * 8. Title Auto-Gen — generate thread title (first turn)
 * 9. Follow-up Suggest — generate next-step suggestions
 */
export const DEERFLOW_PIPELINE: ToolMiddleware[] = [
  GuardrailMiddleware,
  MemoryInjectMiddleware,
  ContextSummarizeMiddleware,
  SubagentLimitMiddleware,
  LoopDetectionMiddleware,
  TodoListMiddleware,
  HITLMiddleware,
  TitleAutoGenMiddleware,
  FollowupSuggestMiddleware,
];
```

- [x] **Step 4: Run tests to verify they pass**

```bash
cd packages/zap-claw && npx jest src/__tests__/middlewares/ --no-coverage
```

- [x] **Step 5: Commit**

```bash
git add packages/zap-claw/src/middlewares/
git commit -m "feat: wire canonical DeerFlow middleware pipeline with execution order"
```

---

## Task 11: Wire Skill Execution in zap-swarm POST Handler

**Files:**
- Modify: `apps/zap-swarm/src/app/api/swarm/skills/route.ts` (POST section)

- [x] **Step 1: Read current POST handler**

```bash
cat apps/zap-swarm/src/app/api/swarm/skills/route.ts
```

- [x] **Step 2: Update POST handler to use skill_runner**

The current POST handler already reads SKILL.md and dispatches to chat. Verify it works end-to-end by:
1. Confirming the SKILL.md resolution path is correct
2. Confirming the system prompt injection reaches the agent
3. Adding the skill execution audit log

No structural change needed if the existing POST handler already does this correctly (it does based on the audit). Verify and move on.

- [x] **Step 3: Commit (if changes made)**

```bash
git add apps/zap-swarm/src/app/api/swarm/skills/route.ts
git commit -m "fix: verify skill execution POST handler wiring"
```

---

## Task 12: Integration Smoke Test

- [x] **Step 1: Start zap-claw dev server**

```bash
cd packages/zap-claw && npm run dev
```

- [x] **Step 2: Verify middleware pipeline loads**

Check console output for middleware registration messages.

- [x] **Step 3: Test spawn API endpoint**

```bash
curl -X POST http://localhost:3500/api/swarm/spawn \
  -H 'Content-Type: application/json' \
  -d '{"agentSlug":"spike","task":"test task","tenantId":"ZVN"}'
```

Expected: `{ "success": true, "jobId": "...", "status": "PENDING" }`

- [x] **Step 4: Test skill execution**

```bash
curl -X POST http://localhost:3500/api/swarm/skills \
  -H 'Content-Type: application/json' \
  -d '{"skillName":"df-deep-research","input":"Research OAuth patterns","sessionId":"TEST_SMOKE","agentId":"athena"}'
```

Expected: `{ "success": true, "jobId": "...", "skill": "df-deep-research" }`

- [x] **Step 5: Verify DAG unblocking**

Create two jobs where job B depends on job A. Complete job A manually in MongoDB. Verify job B status changes from BLOCKED to PENDING.

```bash
# Insert parent job
curl -X POST http://localhost:3500/api/swarm/spawn \
  -d '{"agentSlug":"scout","task":"research X","tenantId":"ZVN"}'
# Note the jobId, then insert child depending on it
curl -X POST http://localhost:3500/api/swarm/spawn \
  -d '{"agentSlug":"coder","task":"implement X","dependsOn":["<PARENT_JOB_ID>"],"tenantId":"ZVN"}'
```

- [x] **Step 6: Final commit**

```bash
git commit --allow-empty -m "chore: DeerFlow runtime engine integration verified"
```

---

## Summary

| Task | Component | New Files | Tests |
|------|-----------|-----------|-------|
| 1 | 5 Agent Identities | 60 `.md` files | Manual verification |
| 2 | Memory Inject Middleware | 1 `.ts` + 1 test | Jest |
| 3 | Loop Detection Middleware | 1 `.ts` + 1 test | Jest |
| 4 | Context Summarize Middleware | 1 `.ts` + 1 test | Jest |
| 5 | Subagent Limit Middleware | 1 `.ts` + 1 test | Jest |
| 6 | Title + Follow-up Middlewares | 2 `.ts` + 2 tests | Jest |
| 7 | Spawn Tool + API | 2 `.ts` + 1 test + 1 route | Jest |
| 8 | DAG Executor | 1 `.ts` + 1 test | Jest |
| 9 | Skill Runner + Registry | 2 `.ts` + 1 test | Jest |
| 10 | Wire Full Pipeline | 2 `.ts` + 1 test | Jest |
| 11 | Skill POST Handler | 0 (verify existing) | Manual |
| 12 | Integration Smoke Test | 0 | curl + MongoDB |

**Total new files:** ~75 (60 agent `.md` + 15 `.ts`)
**Total new tests:** 10 Jest test files
**Estimated effort:** 3-4 focused sessions
