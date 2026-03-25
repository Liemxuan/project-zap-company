# SOP-002: A2A (Agent-to-Agent) Synchronization Protocol

**Status:** Deprecated (Superseded by SOP-018 Native ACP) | **Scope:** Global (Olympus & Zap-Claw) | **Date:** 2026-02-26

> [!WARNING]
> This legacy ATA (Agent-to-Agent) text-ping protocol has been replaced by **Native ACP (Agent Client Protocol)** via OpenClaw local bridges.
> Please refer to `sop-018-native-acp-protocol.md` for current intra-agent communication standards. The below documentation remains for historical context only.

## 1. Core Philosophy (Legacy)

AI Agents operating in shared workspaces (e.g., Tommy & Jerry) MUST NOT communicate via long-form text, code blocks, or raw JSON in human-facing chat interfaces (Telegram, Discord, Slack). This prevents token bloat, conversational clutter, and latency.

Instead, agents historically used **Machine-Speed File Transfer** paired with **Compressed Pings**.

## 2. The Mechanics

1. **The Shared Payload:** The initiating agent writes the necessary data, schema, code, or instruction set to a designated markdown file in the local workspace (e.g., `/Users/zap/workspace/A2A_SYNC.md` or a specific project `task-plan.md`).
2. **The Compressed Ping:** The initiating agent sends a highly compressed JSON-like string into the shared human chat channel.
   * Format: `{A2A:PING, TGT:[TARGET_AGENT_NAME], REQ:[ACTION_VERB], REF:[FILE_PATH]}`
   * Example: `{A2A:PING, TGT:JERRY, REQ:READ_SCHEMA, REF:A2A_SYNC.md}`
3. **The Acknowledgment:** The target agent receives the ping, reads the referenced local file silently, processes the task, and responds in the chat with a compressed acknowledgment.
   * Format: `{A2A:ACK, TGT:[SENDER_AGENT_NAME], STATUS:[DONE/ERROR], MSG:[BRIEF_STATUS]}`
   * Example: `{A2A:ACK, TGT:TOMMY, STATUS:DONE, MSG:AvatarUpdated}`

## 3. Rules of Engagement in Human War Rooms

* **Silence by Default:** Do not reply to other agents unless explicitly tagged via an `{A2A:PING}` or if a human issues a direct command mentioning your name/role.

* **No Extraneous Pleasantries:** Do not say "Hello Jerry, I have updated the file." Send the ping string.
* **Escalation to Human:** If an A2A request results in a structural conflict (e.g., Jerry rejects a database schema proposed by Tommy), the target agent must format a formal `[CONFLICT_REPORT]` and tag the human Pilot (`@Zeus` / `@Tom`) for a final architectural decision.

## 4. ACP Agent Integration (Fast Operator Flow)

OpenClaw's [Agent Client Protocol (ACP)](https://docs.openclaw.ai/tools/acp-agents) introduces native thread-bound session management, enhancing how we steer cross-agent intelligence. This is our preferred way to collaborate when parallel processing is required.

1. **Persistent Execution Threads:** Instead of disjointed pings, use `/acp spawn [AGENT_ID] --mode persistent --thread auto` to lock another agent into the current context.
2. **A2A Steering:** To nudge an active agent session without replacing its context or polluting the war room chat, use:
   * Format: `/acp steer --session [TARGET_AGENT_LABEL_OR_ID] [INSTRUCTION]`
   * Example: `/acp steer --session jerry review the merged schema and execute DB migration`
3. **Runtime Controls:** Adjust target bounds on the fly:
   * Limit blasts: `/acp timeout [SECONDS]`
   * Update clearance: `/acp permissions [PROFILE]`
4. **Cleanup:** Always use `/acp close` when the bound task completes to tear down the bridge and clear memory.
