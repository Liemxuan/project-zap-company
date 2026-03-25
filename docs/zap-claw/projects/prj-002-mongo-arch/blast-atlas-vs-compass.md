# PRJ-002: MongoDB Atlas vs. Compass architecture

**SLA ID:** `SLA-BLAST-MONGO-20260223`

## Phase 1: B - Blueprint (Discovery)

### 1. The Core Objective
To formally document the architectural relationship, responsibilities, and data flow between MongoDB Atlas (the cloud database) and MongoDB Compass (the local GUI), ensuring all future developers (AI or human) understand how Zap-Claw interacts with long-term memory.

### 2. The Current Workflow
Currently, Zap-Claw uses an environment variable (`MONGODB_URI`) to authenticate directly against a shared MongoDB Atlas Sandbox cluster. Compass is used exclusively by the human administrator to visually inspect or manually alter the database state without writing code.

### 3. The Constraint Map
- **Atlas Constraint:** The Atlas Sandbox is hosted in the cloud. It requires internet access and is subject to MongoDB's free-tier rate limits and sleeping policies.
- **Compass Constraint:** Compass is a read/write viewer, *not* a database. If Atlas is offline, Compass cannot show any data.
- **Agent Constraint:** Zap-Claw (`src/agent.ts`) connects only to Atlas. It has no awareness of Compass or whether Compass is currently open on the user's machine.

### 4. The Human Element
- **UI/UX Strategy:** The sole UI for database management is MongoDB Compass. No custom web dashboard will be built to replace it at this time, adhering to the Anti-Paralysis Deployment rule (Phase 5).
- **Security:** The `MONGODB_URI` contains highly privileged credentials (`tomtranzap_db_user`) and must never be exposed outside of `.env`.

### 5. Architectural Diagram (Data Flow)

```text
[ Telegram User ]  <--chat-->  [ Zap-Claw Agent Loop ]
                                    |
                                    | (Reads/Writes via MONGODB_URI)
                                    v
                            [ MongoDB Atlas Cloud ]  <==== The Actual Database Vault
                                    ^
                                    | (Reads/Writes via MONGODB_URI)
                                    |
[ Human Admin Mac ] <--views-- [ MongoDB Compass GUI ] <== The Viewer/Flashlight
```

## Phase 2: L - Link (Connectivity)
*Pre-requisites established in PRJ-001:*
- [x] Node.js `mongodb` driver installed.
- [x] `MONGODB_URI` validated and injected into `src/agent.ts`.
- [x] Local MongoDB Compass application installed and successfully handshaking with Atlas.

## Phase 3: A - Architect (Structure & Logic)
*Logic finalized in PRJ-001:*
- [x] Long-term facts (`merchant_memory`) are fetched synchronously before the LLM prompt.
- [x] Memory injection is prioritized over local SQLite tool-calling.

## Phase 4: S - Stylize (Refinement & UI)
- [x] Ensure backend logging specifies when Memory Facts are injected from Atlas (e.g., `Successfully injected X MemoryFacts from MongoDB`).
- **PRD Required:** No. MongoDB Compass serves as the primary visual interface.

## Phase 5: T - Trigger (Deployment & Validation)
- [x] **Empirical SWARM Validation:** Completed under PRJ-001 (`test_agent.ts` verified prompt injection).
- [x] **Universal ID Finalization:** This document serves as `KB-MONGO-arch-001`.
