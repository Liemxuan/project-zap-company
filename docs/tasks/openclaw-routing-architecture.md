# OpenClaw Architecture Deep Dive: Gateway, Groups, and Routing

This report synthesizes the architectural paradigms used by the OpenClaw framework for handling gateways (channels), group policies, and multi-agent routing. This intelligence serves as the foundational baseline for designing the Olympus Native Routing Engine (PRJ-016) and Tommys native thread routing architectures.

## 1. Multi-Agent Gateway Routing 

The core of OpenClaw's router relies on a deterministic fallback chain to route incoming webhooks/messages to a specific `agentId`. An "Agent" in OpenClaw is heavily isolated—it possesses its own workspace, session store, local memory, and auth profiles.

### The Routing Decision Matrix
When a message hits the gateway, the router executes a priority-based match (most-specific wins) against configured `bindings`:
1. **Peer Match**: Exact match for a DM, Group, or Channel ID (`peer.id`).
2. **Thread Inheritance**: Inherits the agent assigned to the parent thread (`parentPeer`).
3. **Role/Guild Match**: Platform-specific scoping (e.g., Discord `guildId` + `role`).
4. **Platform Boundary**: Match by Slack `teamId` or Discord `guildId`.
5. **Account Fallback**: Catch-all for a specific account (`accountId` match, e.g., WhatsApp "business" line).
6. **Provider Fallback**: Catch-all for the entire provider (e.g., all of `whatsapp` regardless of account).
7. **Default Agent**: If completely unmatched, routes to `agents.list[].default` or the first main agent.

## 2. Group Policy & Security

Groups in OpenClaw are explicitly treated as hostile environments. The system implements a paranoid, allow-by-default denial structure.

### Gating & Trigger Mechanics
- **Group Policy Enforcement:** Configured globally per channel (e.g., `groupPolicy: "allowlist"`). If a group is not explicitly allowlisted in `.groups`, all payloads are dropped at the gateway line.
- **Mention Gating (`requireMention`):** By default, bots ignore group messages unless explicitly `@mentioned` or a regex match occurs (`mentionPatterns`). Unmentioned messages are stored as pending context but never wake the execution loop.
- **Owner Activation:** Specialized `/activation` modes exist to limit bot triggering strictly to the gateway owner, preventing group abuse.

### Context Segregation
- **Group Context Generation:** OpenClaw injects environmental metadata to prevent AI hallucination regarding its audience (`ChatType=group`, `GroupSubject`, `GroupMembers`, `WasMentioned`).
- **Session Keys:** Group sessions are rigidly isolated from direct messages. A group chat writes to `agent:<agentId>:<channel>:group:<id>`. A thread within a group writes to `...:topic:<threadId>`.

## 3. Sandboxing & Tool Enforcement in Public Arenas

OpenClaw enforces severe capability limitations when an agent operates in a "non-main" context like a public group chat.

- **Non-Main Isolation:** DMs to the bot owner are routed to the host environment, but public Groups are forced into a sandbox (`mode: "non-main"`).
- **Session-Scoped Docker:** Each group triggers a dedicated, session-scoped Docker container (`scope: "session"`) with `workspaceAccess: "none"`.
- **Tool Castration:** By default, groups restrict the tool set. 
  - `allow: ["group:messaging", "group:sessions"]`
  - `deny: ["group:runtime", "group:fs", "group:ui", "nodes", "cron", "gateway"]`
- **Granular Overrides:** Tool execution can be dynamically overridden per-sender (`toolsBySender`) within a group, allowing the owner to execute `exec` in a group where regular members cannot.

## Architectural Takeaways for PRJ-016 (Olympus Native Routing)

To successfully deprecate OpenClaw and move to a Native Olympus Routing Engine, Tommy must replicate and improve:

1. **Paranoid Multi-Tenancy:** We require the same rigid separation between "DM / Authorized Execution" and "Public Group / Sandboxed Memory."
2. **Deterministic Dispatcher:** A native SQLite/Mongo lookup table replicating the 7-step Routing Decision Matrix will handle 99% of ZAP-Swarm's multi-agent traffic flawlessly.
3. **Mention-Only Triggering:** The Olympus Gateway must filter out non-mention WebSocket noise at the Edge before it ever reaches the Agent's expensive cognitive loop.
4. **Thread-Level Keys:** Our Native ACP (Agent Context Protocol) must adopt the `provider:group:thread` composite key model to natively resolve the issue OpenClaw had with overlapping context windows.
