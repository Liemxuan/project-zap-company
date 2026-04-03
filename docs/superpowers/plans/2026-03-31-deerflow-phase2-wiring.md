# DeerFlow Phase 2: Context Engineering Wiring + Frontend Integration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the backend context engineering outputs (follow-up suggestions, session titles, cost tracking) into the frontend and close the remaining DeerFlow gaps — Slack channel, MCP client protocol, and the failing `inbound.test.ts`.

**Architecture:** Backend already generates titles and follow-ups into MongoDB (`SYS_OS_session_titles`, `SYS_OS_followup_suggestions`). Frontend needs API routes to surface them + UI components to render them. Cost tracking lives in `arbiter_engine.ts` with `MODEL_PRICE_MAP` — needs a summary API + dashboard page. Slack uses Socket Mode via `@slack/bolt`.

**Tech Stack:** TypeScript 5.9, Next.js 15, React 19, MongoDB 7, Tailwind CSS v4, zap-design, Jest 30, @slack/bolt

---

## File Structure

### New Files

| File | Responsibility |
|------|---------------|
| `apps/zap-swarm/src/app/api/swarm/suggestions/route.ts` | GET — fetch follow-up suggestions by sessionId from MongoDB |
| `apps/zap-swarm/src/app/api/swarm/titles/route.ts` | GET — fetch session title by sessionId from MongoDB |
| `apps/zap-swarm/src/app/api/swarm/cost/route.ts` | GET — fetch cost summary (total spend, per-model breakdown, per-agent breakdown) |
| `apps/zap-swarm/src/app/cost/page.tsx` | Cost Intelligence Dashboard — spend graphs, model breakdown, budget alerts |
| `packages/zap-claw/src/platforms/slack.ts` | Slack Socket Mode adapter — receive messages, dispatch to AgentLoop, reply in thread |
| `packages/zap-claw/src/mcp/mcp_client.ts` | MCP client — connect to external MCP servers, discover tools, proxy tool calls |
| `packages/zap-claw/src/__tests__/platforms/slack.test.ts` | Unit test for Slack adapter |
| `packages/zap-claw/src/__tests__/mcp/mcp_client.test.ts` | Unit test for MCP client |

### Modified Files

| File | Change |
|------|--------|
| `apps/zap-swarm/src/app/chats/[id]/page.tsx` | Add follow-up suggestion chips below last agent message + session title in header |
| `apps/zap-swarm/src/app/sessions/page.tsx` | Show session title instead of raw UUID |
| `apps/zap-swarm/src/app/api/swarm/sessions/route.ts` | Join `SYS_OS_session_titles` to enrich session list |
| `packages/zap-claw/src/runtime/router/__tests__/inbound.test.ts` | Fix mock setup for `getOrCreateSession` |
| `packages/zap-claw/src/middlewares/index.ts` | Add re-export for any new middleware |

---

## Tasks

### Task 1: Follow-up Suggestions API Route

**Files:**
- Create: `apps/zap-swarm/src/app/api/swarm/suggestions/route.ts`

- [ ] **Step 1: Write the API route**

```ts
// apps/zap-swarm/src/app/api/swarm/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ success: false, error: "sessionId required" }, { status: 400 });
  }

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("olympus");
    const doc = await db.collection("SYS_OS_followup_suggestions").findOne({ sessionId });
    return NextResponse.json({
      success: true,
      suggestions: doc?.suggestions || [],
      updatedAt: doc?.updatedAt || null,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
```

- [ ] **Step 2: Verify route loads**

Run: `cd apps/zap-swarm && npx next lint src/app/api/swarm/suggestions/route.ts`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add apps/zap-swarm/src/app/api/swarm/suggestions/route.ts
git commit -m "feat: add follow-up suggestions API route"
```

---

### Task 2: Session Titles API Route

**Files:**
- Create: `apps/zap-swarm/src/app/api/swarm/titles/route.ts`

- [ ] **Step 1: Write the API route**

```ts
// apps/zap-swarm/src/app/api/swarm/titles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ success: false, error: "sessionId required" }, { status: 400 });
  }

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("olympus");
    const doc = await db.collection("SYS_OS_session_titles").findOne({ sessionId });
    return NextResponse.json({
      success: true,
      title: doc?.title || null,
      updatedAt: doc?.updatedAt || null,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/zap-swarm/src/app/api/swarm/titles/route.ts
git commit -m "feat: add session titles API route"
```

---

### Task 3: Follow-up Suggestion Chips in Chat UI

**Files:**
- Modify: `apps/zap-swarm/src/app/chats/[id]/page.tsx`

- [ ] **Step 1: Add suggestions state and fetch hook**

After the existing state declarations, add:
```ts
const [suggestions, setSuggestions] = useState<string[]>([]);
```

Inside the existing polling `useEffect`, add a fetch to `/api/swarm/suggestions?sessionId={id}` that runs every 8s alongside the other polls. On success, call `setSuggestions(data.suggestions)`.

- [ ] **Step 2: Render suggestion chips below the last agent message**

After the messages `.map()` block and before the input area, add:
```tsx
{suggestions.length > 0 && (
  <div className="flex flex-wrap gap-2 px-4 pb-2">
    {suggestions.map((s, i) => (
      <button
        key={i}
        onClick={() => {
          // Set input to suggestion text and clear chips
          setInput(s);
          setSuggestions([]);
        }}
        className="px-3 py-1.5 rounded-full text-labelSmall font-body bg-layer-panel border border-outline-dim text-on-surface-variant hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
      >
        {s}
      </button>
    ))}
  </div>
)}
```

- [ ] **Step 3: Verify the chat page renders without errors**

Run: `cd apps/zap-swarm && npx next build --no-lint 2>&1 | head -30`
Expected: Build succeeds (or only pre-existing warnings)

- [ ] **Step 4: Commit**

```bash
git add apps/zap-swarm/src/app/chats/[id]/page.tsx
git commit -m "feat: render follow-up suggestion chips in chat UI"
```

---

### Task 4: Session Title in Chat Header + Sessions Page

**Files:**
- Modify: `apps/zap-swarm/src/app/chats/[id]/page.tsx`
- Modify: `apps/zap-swarm/src/app/sessions/page.tsx`
- Modify: `apps/zap-swarm/src/app/api/swarm/sessions/route.ts`

- [ ] **Step 1: Add title state to chat page**

```ts
const [sessionTitle, setSessionTitle] = useState<string | null>(null);
```

Fetch from `/api/swarm/titles?sessionId={id}` once on mount. Display `sessionTitle` in the header area where the session ID is currently shown (fallback to the raw ID if null).

- [ ] **Step 2: Enrich sessions API with titles**

In the sessions API route, after fetching sessions from the job queue, do a bulk lookup against `SYS_OS_session_titles` and merge the `title` field into each session object.

- [ ] **Step 3: Update sessions page to show titles**

In `sessions/page.tsx`, display `session.title || session.sessionId` on each card.

- [ ] **Step 4: Commit**

```bash
git add apps/zap-swarm/src/app/chats/[id]/page.tsx apps/zap-swarm/src/app/sessions/page.tsx apps/zap-swarm/src/app/api/swarm/sessions/route.ts
git commit -m "feat: display session titles in chat header and sessions list"
```

---

### Task 5: Cost Intelligence API Route

**Files:**
- Create: `apps/zap-swarm/src/app/api/swarm/cost/route.ts`

- [ ] **Step 1: Write the cost summary API**

```ts
// apps/zap-swarm/src/app/api/swarm/cost/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function GET(req: NextRequest) {
  const days = parseInt(req.nextUrl.searchParams.get("days") || "7");
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("olympus");
    const since = new Date(Date.now() - days * 86400000);

    // Aggregate from arbiter_metrics
    const metrics = db.collection("SYS_OS_arbiter_metrics");

    const [byModel, byAgent, totals] = await Promise.all([
      metrics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id: "$modelId",
          totalTokens: { $sum: "$tokens.total" },
          totalCost: { $sum: "$gatewayCharge" },
          calls: { $sum: 1 },
        }},
        { $sort: { totalCost: -1 } },
      ]).toArray(),

      metrics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id: "$botName",
          totalTokens: { $sum: "$tokens.total" },
          totalCost: { $sum: "$gatewayCharge" },
          calls: { $sum: 1 },
        }},
        { $sort: { totalCost: -1 } },
      ]).toArray(),

      metrics.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: {
          _id: null,
          totalTokens: { $sum: "$tokens.total" },
          totalCost: { $sum: "$gatewayCharge" },
          totalCalls: { $sum: 1 },
        }},
      ]).toArray(),
    ]);

    // Budget info
    const budgets = await db.collection("SYS_OS_tenant_budgets").find({}).toArray();

    return NextResponse.json({
      success: true,
      period: { days, since: since.toISOString() },
      totals: totals[0] || { totalTokens: 0, totalCost: 0, totalCalls: 0 },
      byModel,
      byAgent,
      budgets: budgets.map(b => ({ tenantId: b.tenantId, budgetLimit: b.budgetLimit, currentSpend: b.currentSpend })),
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/zap-swarm/src/app/api/swarm/cost/route.ts
git commit -m "feat: add cost intelligence API with model/agent breakdown"
```

---

### Task 6: Cost Intelligence Dashboard Page

**Files:**
- Create: `apps/zap-swarm/src/app/cost/page.tsx`

- [ ] **Step 1: Build the cost dashboard page**

Design system components from `zap-design`: `Card`, `Heading`, `Text`, `Badge`, `AppShell`.

Layout:
- **Top row**: 3 stat cards (Total Spend, Total Tokens, Total Calls) from `totals`
- **Middle row**: Model breakdown table (model name, calls, tokens, cost) from `byModel`
- **Bottom row**: Agent breakdown table (agent name, calls, tokens, cost) from `byAgent`
- **Sidebar/footer**: Budget status cards from `budgets` with progress bars (currentSpend / budgetLimit)
- Period selector dropdown: 1d, 7d, 30d

Fetch from `/api/swarm/cost?days={period}` with TanStack Query (10s refetch).

- [ ] **Step 2: Add navigation link**

Add "Cost Intelligence" link to the SideNav (matches existing L1 typography pattern) with `DollarSign` icon from lucide-react.

- [ ] **Step 3: Verify build**

Run: `cd apps/zap-swarm && npx next build --no-lint 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add apps/zap-swarm/src/app/cost/page.tsx
git commit -m "feat: add cost intelligence dashboard with model and agent breakdowns"
```

---

### Task 7: Fix `inbound.test.ts` Mock Failure

**Files:**
- Modify: `packages/zap-claw/src/runtime/router/__tests__/inbound.test.ts`

- [ ] **Step 1: Read the test file and the session module it mocks**

Understand the mock setup. The current error is:
```
TypeError: _session.getOrCreateSession.mockResolvedValue is not a function
```
This means the `jest.mock()` for the session module isn't returning a jest.fn(). Fix the mock factory to return `jest.fn()` for `getOrCreateSession`.

- [ ] **Step 2: Fix the mock**

Ensure the mock uses `jest.fn()`:
```ts
jest.mock('../../../session', () => ({
  getOrCreateSession: jest.fn(),
}));
```

- [ ] **Step 3: Run the test**

Run: `cd packages/zap-claw && npx jest src/runtime/router/__tests__/inbound.test.ts --no-coverage`
Expected: PASS

- [ ] **Step 4: Run full suite**

Run: `cd packages/zap-claw && npx jest --no-coverage`
Expected: All suites pass

- [ ] **Step 5: Commit**

```bash
git add packages/zap-claw/src/runtime/router/__tests__/inbound.test.ts
git commit -m "fix: correct session mock in inbound router test"
```

---

### Task 8: Slack Socket Mode Adapter

**Files:**
- Create: `packages/zap-claw/src/platforms/slack.ts`
- Create: `packages/zap-claw/src/__tests__/platforms/slack.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/zap-claw/src/__tests__/platforms/slack.test.ts
import { buildSlackReply, extractSlackContext } from '../../platforms/slack.js';

describe('Slack Adapter', () => {
  it('should extract user/channel/thread from a Slack event', () => {
    const event = {
      type: 'message',
      user: 'U12345',
      channel: 'C67890',
      text: 'hello agent',
      ts: '1234567890.123456',
      thread_ts: '1234567890.000001',
    };
    const ctx = extractSlackContext(event);
    expect(ctx.userId).toBe('U12345');
    expect(ctx.channelId).toBe('C67890');
    expect(ctx.threadTs).toBe('1234567890.000001');
    expect(ctx.text).toBe('hello agent');
  });

  it('should build a reply payload', () => {
    const reply = buildSlackReply('C67890', '1234567890.000001', 'Hello back!');
    expect(reply.channel).toBe('C67890');
    expect(reply.thread_ts).toBe('1234567890.000001');
    expect(reply.text).toBe('Hello back!');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/zap-claw && npx jest src/__tests__/platforms/slack.test.ts --no-coverage`
Expected: FAIL (module not found)

- [ ] **Step 3: Write the Slack adapter**

```ts
// packages/zap-claw/src/platforms/slack.ts

export interface SlackContext {
  userId: string;
  channelId: string;
  threadTs: string | undefined;
  text: string;
}

export function extractSlackContext(event: any): SlackContext {
  return {
    userId: event.user,
    channelId: event.channel,
    threadTs: event.thread_ts || event.ts,
    text: event.text || '',
  };
}

export function buildSlackReply(channel: string, threadTs: string, text: string) {
  return { channel, thread_ts: threadTs, text };
}

/**
 * Start the Slack Socket Mode listener.
 * Requires SLACK_BOT_TOKEN and SLACK_APP_TOKEN env vars.
 * Import @slack/bolt at runtime to keep it optional.
 */
export async function startSlackAdapter(botName: string = 'Spike') {
  const { App } = await import('@slack/bolt');

  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
  });

  app.message(async ({ message, say }) => {
    if (message.subtype) return; // Ignore edits, joins, etc.
    const ctx = extractSlackContext(message);

    // Dispatch to AgentLoop
    const { AgentLoop } = await import('../agent.js');
    const agent = new AgentLoop('tier_p2_balanced', botName);
    const sessionId = `SLACK:${ctx.channelId}:${ctx.threadTs}`;

    try {
      const response = await agent.run(
        parseInt(ctx.userId.replace(/\D/g, ''), 10) || 0,
        ctx.text,
        `SLACK:${botName}`,
        sessionId
      );
      const reply = buildSlackReply(ctx.channelId, ctx.threadTs!, response);
      await say(reply);
    } catch (e: any) {
      await say(buildSlackReply(ctx.channelId, ctx.threadTs!, `Error: ${e.message}`));
    }
  });

  await app.start();
  console.log(`[slack] ${botName} Slack adapter running (Socket Mode)`);
  return app;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/zap-claw && npx jest src/__tests__/platforms/slack.test.ts --no-coverage`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add packages/zap-claw/src/platforms/slack.ts packages/zap-claw/src/__tests__/platforms/slack.test.ts
git commit -m "feat: add Slack Socket Mode adapter with thread binding"
```

---

### Task 9: MCP Client Protocol

**Files:**
- Create: `packages/zap-claw/src/mcp/mcp_client.ts`
- Create: `packages/zap-claw/src/__tests__/mcp/mcp_client.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/zap-claw/src/__tests__/mcp/mcp_client.test.ts
import { buildMcpToolDefinitions } from '../../mcp/mcp_client.js';

describe('MCP Client', () => {
  it('should convert MCP tool schemas to OpenAI-compatible tool definitions', () => {
    const mcpTools = [
      {
        name: 'search_docs',
        description: 'Search documentation',
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string', description: 'Search query' } },
          required: ['query'],
        },
      },
    ];

    const result = buildMcpToolDefinitions(mcpTools, 'docs-server');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('function');
    expect(result[0].function.name).toBe('mcp__docs_server__search_docs');
    expect(result[0].function.parameters.properties.query.type).toBe('string');
  });

  it('should sanitize server names in tool prefixes', () => {
    const mcpTools = [{ name: 'test', description: 'test', inputSchema: { type: 'object', properties: {} } }];
    const result = buildMcpToolDefinitions(mcpTools, 'my-cool-server');
    expect(result[0].function.name).toBe('mcp__my_cool_server__test');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/zap-claw && npx jest src/__tests__/mcp/mcp_client.test.ts --no-coverage`
Expected: FAIL

- [ ] **Step 3: Write the MCP client**

```ts
// packages/zap-claw/src/mcp/mcp_client.ts

export interface McpToolSchema {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

/**
 * Convert MCP tool schemas to OpenAI-compatible function definitions.
 * Prefixes tool names with `mcp__{serverSlug}__{toolName}` to avoid collisions.
 */
export function buildMcpToolDefinitions(mcpTools: McpToolSchema[], serverName: string) {
  const slug = serverName.replace(/[^a-zA-Z0-9]/g, '_');
  return mcpTools.map(tool => ({
    type: 'function' as const,
    function: {
      name: `mcp__${slug}__${tool.name}`,
      description: `[MCP:${serverName}] ${tool.description}`,
      parameters: tool.inputSchema,
    },
  }));
}

/**
 * Parse an MCP-prefixed tool name back into server + tool.
 */
export function parseMcpToolName(prefixedName: string): { serverSlug: string; toolName: string } | null {
  const match = prefixedName.match(/^mcp__([^_]+(?:_[^_]+)*)__(.+)$/);
  if (!match) return null;
  return { serverSlug: match[1], toolName: match[2] };
}

/**
 * Connect to an MCP server via stdio transport.
 * Returns discovered tools and a callable dispatch function.
 */
export async function connectMcpServer(command: string, args: string[] = []) {
  const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
  const { StdioClientTransport } = await import('@modelcontextprotocol/sdk/client/stdio.js');

  const transport = new StdioClientTransport({ command, args });
  const client = new Client({ name: 'zap-claw', version: '1.0.0' });
  await client.connect(transport);

  const { tools } = await client.listTools();

  return {
    tools,
    toolDefinitions: buildMcpToolDefinitions(tools, command.split('/').pop()?.replace(/\.[^.]+$/, '') || command),
    async callTool(name: string, input: Record<string, unknown>) {
      const result = await client.callTool({ name, arguments: input });
      return result;
    },
    async close() {
      await client.close();
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/zap-claw && npx jest src/__tests__/mcp/mcp_client.test.ts --no-coverage`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add packages/zap-claw/src/mcp/mcp_client.ts packages/zap-claw/src/__tests__/mcp/mcp_client.test.ts
git commit -m "feat: add MCP client with tool schema conversion and stdio transport"
```

---

### Task 10: Enrich Sessions API with Titles

**Files:**
- Modify: `apps/zap-swarm/src/app/api/swarm/sessions/route.ts`

- [ ] **Step 1: Read the current sessions route**

Understand the existing aggregation pipeline.

- [ ] **Step 2: Add title join**

After fetching sessions, bulk-lookup titles:
```ts
const sessionIds = sessions.map(s => s.sessionId).filter(Boolean);
const titles = await db.collection("SYS_OS_session_titles")
  .find({ sessionId: { $in: sessionIds } })
  .toArray();
const titleMap = new Map(titles.map(t => [t.sessionId, t.title]));

// Merge
for (const s of sessions) {
  s.title = titleMap.get(s.sessionId) || null;
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/zap-swarm/src/app/api/swarm/sessions/route.ts
git commit -m "feat: enrich sessions API response with auto-generated titles"
```

---

### Task 11: Run Full Test Suite — Fix Until GREEN

**Files:**
- All test files in `packages/zap-claw`

- [ ] **Step 1: Run full suite**

Run: `cd packages/zap-claw && npx jest --no-coverage`
Expected: All suites PASS

- [ ] **Step 2: Fix any failures**

Address each failure individually. Common issues:
- Missing module mocks (use `jest.mock()`)
- Import path mismatches (`.js` extensions)
- Missing test utility resets in `beforeEach`

- [ ] **Step 3: Final verification**

Run: `cd packages/zap-claw && npx jest --no-coverage`
Expected: ALL GREEN

- [ ] **Step 4: Commit all fixes**

```bash
git add -A packages/zap-claw/src/__tests__/
git commit -m "fix: resolve all test failures across zap-claw test suite"
```

---

### Task 12: Install Missing Dependencies

**Files:**
- Modify: `packages/zap-claw/package.json`

- [ ] **Step 1: Install Slack SDK (optional peer)**

Run: `cd /Users/zap/Workspace/olympus && pnpm add -D @slack/bolt --filter zap-claw`

- [ ] **Step 2: Install MCP client SDK (if not already present)**

Run: `cd /Users/zap/Workspace/olympus && pnpm add @modelcontextprotocol/sdk --filter zap-claw`

- [ ] **Step 3: Verify no lockfile conflicts**

Run: `cd /Users/zap/Workspace/olympus && pnpm install --frozen-lockfile` (should succeed, or run without --frozen-lockfile if it fails)

- [ ] **Step 4: Commit**

```bash
git add pnpm-lock.yaml packages/zap-claw/package.json
git commit -m "chore: add @slack/bolt and @modelcontextprotocol/sdk dependencies"
```

---

## Execution Order & Parallelism

**Phase A (Backend APIs — parallel):**
- Task 1 (Suggestions API)
- Task 2 (Titles API)
- Task 5 (Cost API)
- Task 12 (Dependencies)

**Phase B (Frontend UI — sequential, depends on Phase A):**
- Task 3 (Suggestion Chips)
- Task 4 (Session Titles)
- Task 6 (Cost Dashboard)

**Phase C (Platform Integrations — parallel):**
- Task 8 (Slack Adapter)
- Task 9 (MCP Client)

**Phase D (Fixes & Verification — sequential):**
- Task 7 (Fix inbound.test.ts)
- Task 10 (Enrich Sessions API)
- Task 11 (Full Test Suite GREEN)

---

## Verification Checklist

1. `curl localhost:3500/api/swarm/suggestions?sessionId=test` → `{"success":true,"suggestions":[]}`
2. `curl localhost:3500/api/swarm/titles?sessionId=test` → `{"success":true,"title":null}`
3. `curl localhost:3500/api/swarm/cost?days=7` → `{"success":true,"totals":{...},"byModel":[...],"byAgent":[...]}`
4. Chat page shows suggestion chips after agent responds
5. Sessions page shows titles instead of UUIDs
6. `/cost` page renders with model/agent breakdown tables
7. `cd packages/zap-claw && npx jest --no-coverage` → ALL GREEN
8. Slack adapter compiles (runtime requires env vars to start)
9. MCP client tests pass with tool schema conversion
