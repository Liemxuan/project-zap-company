# State Summary: prj-012-openclaw-integration

**Date:** 2026-02-26
**Project:** Zap-Claw <> OpenClaw (Tommy) Bridge

## 🚀 Progress & Achievements

### 1. Database & Routing (Phase 1 & 2 - Complete)

- **Regional Sharding:** Appended `regionCode` to `Tenant` and `AgentProfile` collections to support global scale and legal compliance.
- **Dynamic Context Routing:** Refactored `omni_router.ts` to dynamically fetch and inject region-specific `soul.md` and `ethical-bounds.md` into the system prompt.

### 2. Persona & Social Intelligence rules

- **Jerry's Persona:** Directly patched the MongoDB `OLYMPUS_SYS_OS_agents` collection to make Jerry highly efficient, punctual, and strictly business-oriented. He is explicitly commanded to coordinate with Tommy.
- **HUD Optimization:** Simplified the Telegram HUD to a minimalist inline string (e.g., `[12,301t | 0t/m]`) to remove visual bloat from conversations.
- **Active Bootstrapping:** Overhauled `bootstrap.md` to ensure all newly minted agents actively seek out OpenClaw instances to establish an alliance.

### 3. Telegram Session Management & ATA Protocol (Phase 3 - Complete)

- **Session Bounding:** Created `session.ts` to generate unique `sessionId` boundaries derived from Telegram `chat.id` and time constraints (4-hour timeout or explicit `/new` command).
- **Execution Lane Memory:** Refactored `intercept.ts` and `serialized_lane.ts` to query and save memory using `sessionId` rather than just `senderIdentifier`. This prevents infinite context bloat in permanent group chats.
- **Anti-Loop Protocol:** Injected the "Human-Led Configuration" rule into `agents.md` to prevent bots from endlessly replying to each other without human authorization.
- **ATA (Agent-to-Agent) Standard:** Updated `heartbeat.md` with guidelines for ATA token text compression (e.g., using `[SYS-ACK]`) and Heartbeat Sync to ping stalled agents.

---

## ⚠️ Current Constraints & Blockers

### 1. External Platform Requirements (Telegram)

- **Privacy Mode Shield:** Telegram natively blocks bots from reading each other's messages. To unleash the ATA protocol, the user *must* manually interact with `@BotFather` to `/setprivacy` to **Disable** for both Jerry and Tommy.
- **Admin Rights:** Bots require Admin privileges in the group chat to ensure they receive all payload events seamlessly via the webhook.

### 2. Architectural Constraints

- **Session Summarization:** While `sessionId` tracking and timeout closure are active, the background asynchronous LLM compaction job (to distill closed sessions into a dense summary block) is mapped conceptually but may require further robustification under heavy load.
- **Shared Memory Layer:** Deep integration (syncing Tommy's local filesystem JSON memory directly into Zap-Claw's MongoDB cluster) is deferred to a future B.L.A.S.T. phase. Currently, their shared context relies entirely on their visible Telegram text history.
- **Transient vs. Persistent Execution:** Antigravity (the IDE agent) is transient and goes dormant when the IDE is closed. Zap-Claw (the Node.js backend) is persistent. The agents must rely on the backend engine for 24/7 ATA communication.
