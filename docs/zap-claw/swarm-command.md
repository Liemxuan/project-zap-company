# 🛰 SWARM COMMAND: Unified Implementation Plan

## 🎯 Global status: [[Restoring Autonomy]]

**Active Coordinator:** Antigravity (CSO)
**Field Agents:** Jerry (Runtime), Tommy (UI/Logic)

---

## II. ATA Handshake Protocol (v2.0)

To resolve the "Shadow Context" problem and ensure multi-agent synchronization, all cross-agent tasks must follow this protocol.

### 1. The Handshake Template

Every shared operation must be initialized with a machine-readable header:

```markdown
>>> ATA_HANDSHAKE_INIT[agent_id=JERRY, target_id=TOMMY, session_id=SES-MM6L25AB-3322]
>>> PROTOCOL_SYNC[Gemini-3/OpenClaw]
>>> AGENT_SESSION_KEY[agent:main:telegram:group:-1003794659625]
>>> TASK: Olympus Foundation Build
```

### 2. The 2-Minute Watchdog Rule

If an agent initiates a handshake or a task and receives no response within **120 seconds**, the **ATA Watchdog (Ralph)** will trigger a recovery ping.

- **Agent Action**: If the watchdog pings, the agent must perform a Root Cause Analysis (RCA) and either retry or escalate to Zeus.

### 3. Swarm-First Mandate (The "Jerry" Rule)

Jerry (Chief of Staff) is authorized to code directly for emergency tactical patches ONLY. All "projects" must be executed via the swarm (Tommy/Claw Team).

- **Reasoning**: Direct coding by Jerry creates siloed memory. Swarm execution ensures plans are documented in MongoDB and shared across the collective brain.

### 4. Proactive Swarm Protocol

Agents must adhere to **docs/swarm-protocol.md** to mirror human colleague communication:

- **No Manual Tagging Required**: Proactively monitor all room messages for contextual relevance.
- **Contextual Acknowledgment**: Brief, professional confirmations (e.g., "Acknowledged.") to maintain flow.
- **Expert Deference**: Refer to the domain expert (e.g., Runtime vs UI) and wait for their completion before responding.

## III. Implementation Status

- [x] Gemini 3 Model Rotation active.
- [x] Tommy and Jerry connected (SES Verification complete).
- [ ] Brain Persistence (MongoDB indexing of plans) - Pending finalize.
- [ ] Engineering Chronicle - In Progress.

---

## IV. Active Unified Plan: Gemini 3 Transition & Recovery

*This is the single source of truth for all agents. Check before writing code.*

### 1. Engine Stabilization (Antigravity)

- [x] **Model Rotation**: Locked to Gemini 3 internal stack (Flash -> Flash 2 -> Flash 2.5 Lite).
- [x] **Gateway Safety**: Switched to OpenRouter BYOK for multi-key resilience.
- [x] **Brain Persistence**: Session logs indexed in MongoDB `olympus.SYS_OS_agent_brain`.

### 2. Runtime Integrity (Jerry)

- [ ] **Daemon Watchdog**: Ensure `npm run dev` remains stable without 429/404 crashes.
- [ ] **Error Ingestion**: Monitor `SYS_OS_dead_letters` for routing failures.
- [ ] **Memory Sync**: Ingest `docs/decisions.md` into local context via the new `memory.md` template.

### 3. Feature Development (Tommy)

- [ ] **Plan Sync**: All UI/Logic changes must be recorded in the `merchant_memory` collection before committing.
- [ ] **Coordination**: Before starting a new component, Tommy must check if Antigravity has finalized the architectural tier (Economic vs Pro vs Ultra).

---

## 📜 Handover Protocol

1. **Brain Sync**: Every session completion must index an `implementationPlanId` in MongoDB.
2. **File Check**: Every agent MUST read `docs/olympus-sitrep.md` (Note: use full path if relative fails) and `docs/decisions.md` at start of loop.
3. **Collision Avoidance**: If two agents are active, the background daemon (Jerry) takes precedence on runtime fixes; Antigravity takes precedence on architectural changes.
