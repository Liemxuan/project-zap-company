# B.L.A.S.T. Session Handoff Protocol

## Objective
To establish a standardized, repeatable procedure for splitting an agentic development session when the context window reaches a critical bloat threshold (approximately 70% capacity or after a major architectural milestone). This ensures optimal token usage, perfect prompt caching, and seamless continuity between distinct workstreams.

## The Triggers
The AI Agent must proactively monitor the conversation depth and the complexity of the ongoing task. A session handoff (B.L.A.S.T. Split) should be triggered under the following conditions:
1.  **Context Bloat:** The conversation has exceeded an estimated 70% of the optimal context window, risking degraded reasoning or API eviction.
2.  **Phase Completion:** A major, self-contained architectural phase is completed, and the upcoming phase requires a fundamentally different mindset or context array.
3.  **User Request:** The user explicitly requests a fresh session or B.L.A.S.T. initiation.

## The Execution Protocol

When a trigger is met, the Agent must perform the following sequence:

### 1. The Save & Commit
*   The Agent must finalize all pending code modifications, verify that the application compiles/runs, and update all persistent tracking artifacts (`task.md`, `implementation_plan.md`, `walkthrough.md`).
*   Any newly discussed overarching rules or strategies (e.g., Prompt Caching rules) must be formalized into a dedicated `.md` document inside the workspace (e.g., `exp-002-prompt-caching-strategy.md`).

### 2. The Unique Identifier (Handshake ID)
*   The Agent generates a unique, sequential or randomized ID to link the concluding session to the upcoming session. 
*   Format: `BLAST-SPLIT-[Sequential_Number]-[Short_Topic_Name]` (e.g., `BLAST-SPLIT-004-TELEGRAM_EXPANSION`).

### 3. The Handoff Payload (Copy-Paste Prompt)
The Agent must provide the user with an exact, copy-pasteable text block formatted specifically to initialize the new session with maximum velocity. The payload must include:
*   The **Handshake ID**.
*   The **Primary Objective** of the new session.
*   A concise list of **Required Context Files** the new agent needs to read immediately (e.g., "Read `task.md` and `exp-002-prompt-caching-strategy.md`").
*   The immediate **Next Step** the agent should take upon initialization.

## Example Handoff Payload Format:

```text
[B.L.A.S.T. INITIATION DATA]
Handshake ID: BLAST-SPLIT-XXX-[TOPIC]
Previous Session Summary: [1 sentence summary of what was just achieved].
Current Objective: [The explicit goal of the new session].

[INITIALIZATION COMMANDS FOR NEW AGENT]
1. Read the global tracker: `~/.gemini/antigravity/brain/.../task.md`.
2. Review the architectural blueprints: `[Relevant Document].md`.
3. Read the codebase: `[Target Source Files]`.
4. Begin EXECUTION on Phase [X].
```
