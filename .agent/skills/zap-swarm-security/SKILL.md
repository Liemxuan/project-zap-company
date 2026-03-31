---
name: Zap Swarm Security (ZSS)
description: Explicit guidelines and SOPs for securing Olympus AI subagents and MCP integration endpoints. Provides defense-in-depth against prompt injection, infinite looping, command chaining, budget exhaustion, secret leakage, and agent impersonation.
---

# ZAP Swarm Security (ZSS)

This Standard Operating Procedure (SOP) defines the mandatory security bindings required for all LLM-driven components inside the Olympus monorepo (specifically targeting `zap-claw` and any MCP server fleet configs).

## 1. Context & Threats
Following the audit of external systems (Ruflo, Paperclip), we recognize six critical threat vectors for our autonomous agent network:
1. **Command Injection**: When agents take string outputs (like file paths or git branches) and place them directly into `child_process.exec({ shell: true })`.
2. **Prompt Injection (Cognitive Bypass)**: When untrusted user data is concatenated nakedly into a System Prompt, allowing users to override instructions (e.g., `Ignore all previous instructions...`).
3. **Token DoS**: When recursive loops or extremely large un-sanitized inputs exhaust our API window or budget.
4. **Secret Leakage**: When API keys, JWT tokens, or PII (home directories, usernames) flow unredacted through trace logs to dashboards.
5. **Agent Impersonation**: When any localhost process can hit internal APIs claiming to be any agent without cryptographic proof.
6. **Unchecked Reconfiguration**: When agent role/model changes fire without approval gates or audit trails.

## 2. Core Security Protocol

### A. The SafeExecutor Mandate
**No Olympus agent or runtime script may use `child_process.exec` or `spawn` with `shell: true` when consuming externally sourced text.** 
* When subagents execute terminal commands on the host machine, they **MUST** route through `packages/zap-claw/src/security/safe-executor.ts`.
* `SafeExecutor` forces `execFile()`, dropping shell pipes (`|`, `&&`, `>`, `<`) entirely, and enforces an explicit AllowList (e.g., `['git', 'npm', 'node']`).

### B. Zod MCP Input Validation
Every MCP tool handler accepting input (via FastMCP, Express, or direct SDK) **MUST** wrap the request object in a `Zod` validation schema:
* Enforce `.max()` string constraints. Never accept unbounded strings. (e.g., `z.string().max(2000)`).
* Enforce `.enum()` constraints where discrete types are known.
* Regex validate identifiers (e.g., CUIDs, emails) rather than passing raw inputs directly to `prisma.user.findUnique()`.

### C. Prompt Output Sandboxing (Execution Tethers)
Do not build agents that are entirely open-ended.
* Define strict `iteration constraints` (e.g., Hydra Swarm lanes should fail/timeout after N roundtrips).
* Use the Metronic / System Memory to persist states rather than passing full application states exclusively through Agent Context Windows.

### D. Log Redaction (BLAST-IRONCLAD Phase 1)
**All trace logs MUST pass through the redaction layer before reaching Redis pubsub or any external surface.**
* Module: `packages/zap-claw/src/security/log_redaction.ts`
* Scrubs: API keys, JWT tokens (3-part base64url), key=value secret patterns, home directory paths, OS usernames.
* Applied at: `omni_queue.ts` logTrace(), `server.ts` morgan output.

### E. Token Budget Enforcement (BLAST-IRONCLAD Phase 2)
**Every LLM dispatch MUST be gated by a per-agent token budget check.**
* Module: `packages/zap-claw/src/security/token_budgets.ts`
* Pre-check: `generateOmniContent()` calls `checkBudget()` before any model invocation.
* Post-accounting: `processNextJob()` calls `recordUsage()` after completion.
* Budget windows reset on the 1st of each month UTC.
* At 90% usage: `WARNED` status emitted. At 100%: `BUDGET_EXHAUSTED` error thrown, agent halted.
* Collection: `SYS_OS_token_budgets` in MongoDB.

### F. Agent JWT Authentication (BLAST-IRONCLAD Phase 3)
**Agents MUST present a signed JWT for sensitive API calls.**
* Module: `packages/zap-claw/src/security/agent_jwt.ts`
* Algorithm: HMAC-SHA256 with `timingSafeEqual` verification.
* Claims: `sub` (agentId), `tenant_id`, `role`, `run_id`, `iat`, `exp`.
* Token endpoint: `POST /api/agent/token` (requires issuance secret).
* Middleware: `requireAgentJwt` — currently opt-in via `AGENT_JWT_ENFORCE=true`.
* Health check: `GET /api/agent/jwt-health`.

### G. Approval Gates (BLAST-IRONCLAD Phase 4)
**High-blast-radius operations require explicit user confirmation.**
* Agent reconfigurations (role, model, tags) display a confirmation modal before firing.
* All sync operations are audited to `SYS_OS_approvals` in MongoDB with timestamp, changes, and approver.

### H. Container Hardening (BLAST-IRONCLAD Phase 5)
**All Docker containers MUST run with least-privilege security directives.**
* `cap_drop: ALL` — drop every Linux capability by default.
* `security_opt: no-new-privileges` — prevent privilege escalation.
* `tmpfs` bounds for writable scratch space.
* `mem_limit` and `pids_limit` per container to prevent resource exhaustion.
* Gateway containers may add `NET_BIND_SERVICE` for port binding.

### I. Skill Sandbox (BLAST-IRONCLAD Phase 6)
**Untrusted skills MUST execute inside a VM sandbox.**
* Module: `packages/zap-claw/src/security/skill_sandbox.ts`
* Uses `vm.createContext()` with restricted globals (no `require`, `process`, `__dirname`).
* Module allowlist: `url`, `querystring`, `path`, `crypto` only.
* Path traversal prevention via `isWithinRoot()`.
* Default timeout: 3 seconds (max: 10 seconds).
* Built-in trusted skills bypass the sandbox entirely for zero overhead.

## 3. Security Module Registry

| Module | Path | Phase |
|---|---|---|
| SafeExecutor | `src/security/safe-executor.ts` | Original ZSS |
| Log Redaction | `src/security/log_redaction.ts` | IRONCLAD Phase 1 |
| Token Budgets | `src/security/token_budgets.ts` | IRONCLAD Phase 2 |
| Agent JWT | `src/security/agent_jwt.ts` | IRONCLAD Phase 3 |
| Skill Sandbox | `src/security/skill_sandbox.ts` | IRONCLAD Phase 6 |
