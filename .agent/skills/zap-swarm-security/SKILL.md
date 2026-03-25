---
name: Zap Swarm Security (ZSS)
description: Explicit guidelines and SOPs for securing Olympus AI subagents and MCP integration endpoints. Provides defense-in-depth against prompt injection, infinite looping, and command chaining.
---

# ZAP Swarm Security (ZSS)

This Standard Operating Procedure (SOP) defines the mandatory security bindings required for all LLM-driven components inside the Olympus monorepo (specifically targeting `zap-claw` and any MCP server fleet configs).

## 1. Context & Threats
Following the audit of external systems (like Ruflo), we recognize three critical threat vectors for our autonomous agent network:
1. **Command Injection**: When agents take string outputs (like file paths or git branches) and place them directly into `child_process.exec({ shell: true })`.
2. **Prompt Injection (Cognitive Bypass)**: When untrusted user data is concatenated nakedly into a System Prompt, allowing users to override instructions (e.g., `Ignore all previous instructions...`).
3. **Token DoS**: When recursive loops or extremely large un-sanitized inputs exhaust our API window or budget.

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
