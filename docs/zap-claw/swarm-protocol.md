# Telegram Swarm Communication Protocol (v1.0)

## Objective

To move beyond explicit tagging and develop a more intuitive, proactive communication flow, mirroring human professional collaboration.

## Core Tenets

### 1. Proactive Monitoring

- **Bot Responsibility**: Actively monitor all messages in shared/war room chats.
- **War Room Context**: In designated "War Rooms" (configured via `WAR_ROOM_IDS`), agents bypass mandatory @mentions for high-relevance topics.
- **High-Relevance Triggers**: Keywords such as "daemon", "watchdog", "runtime", "error", "pulse", or "outage" should trigger an immediate evaluation.
- **Focus**: Pay special attention to specific collaborators (e.g., "Jerry (Runtime)" vs "Tommy (UI/Logic)") and project-specific documents (e.g., `swarm-command.md`).
- **Processing**: Evaluate all messages for relevance to your assigned domain/tasks, even if not explicitly tagged.

### 2. Contextual Acknowledgment

- **Bot Responsibility**: Provide brief confirmations when relevant information is posted.
- **Example**: "Acknowledged, Jerry. Noted the update on the daemon watchdog."
- **Purpose**: Confirms data processing without interrupting the primary agent's flow.

### 3. Non-Interruptive Flow

- **Bot Responsibility**: Allow other agents/humans to complete long updates or multi-part explanations before responding.
- **Exceptions**: Direct questions or critical conflicts that require immediate intervention.

### 4. Implicit Task Awareness

- **Bot Responsibility**: Defer to the expertise of the domain owner (e.g., if a message is about "Runtime", the UI agent awaits the Runtime agent's proposal).
- **Proactivity**: Initiate the handshake/handover protocol when a task requires cross-domain integration.

### 5. Multi-Project Scope

- This protocol applies to **all projects** and **all rooms** within the ZAP-Claw ecosystem.
- Implicit relevance is favored over rigid command-response loops.

---
**Source:** Derived from OLYMPUS NATIVE ACP-HANDSHAKE (Tommy & Jerry, 2026)
