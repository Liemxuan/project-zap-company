# SOP-034-OLYMPUS-DATA-ARCHITECTURE

**Description:** The authoritative guide on where data lives within the Olympus ecosystem. This document defines the boundaries between relational data, document data, vector embeddings, and plain-text standard operating procedures.

---

## The 5 Pillars of Olympus Data

To prevent monolithic bottlenecks and ensure ZAP-OS scales, we strictly segment our data across four distinct storage paradigms. Every engineer and AI agent (Spike/Jerry) must adhere to these storage locations.

### System Architecture Diagram

```mermaid
flowchart TD
    %% Core Cloud DBs
    PG[(PostgreSQL)]:::postgres
    Mongo[(MongoDB)]:::mongo
    Chroma[(ChromaDB)]:::chroma

    %% Local Edge
    SQLiteLocal[(SQLite Edge)]:::sqlite

    %% Source of Truth Directives
    MD[Markdown SOPs & Skills]:::md

    %% Agents/System Handlers
    ZAP_OS[ZAP-OS & Olympus Core]:::system
    AI_SWARM[AI Swarm / Agents]:::ai

    %% Relationships
    SQLiteLocal --"Hybrid Sync (Orders, Inv. Movements)"--> PG
    ZAP_OS --"Read/Write Master Ledgers"--> PG
    ZAP_OS --"Save State & BLAST Profiles"--> Mongo

    AI_SWARM --"Read/Write AI State"--> Mongo
    AI_SWARM --"RAG Search & Recall"--> Chroma
    AI_SWARM --"Read Directives"--> MD

    MD --"Embedded into"--> Chroma

    %% Styling
    classDef postgres fill:#336791,color:#fff,stroke:#fff,stroke-width:2px;
    classDef mongo fill:#4DB33D,color:#fff,stroke:#fff,stroke-width:2px;
    classDef chroma fill:#FF8C00,color:#fff,stroke:#fff,stroke-width:2px;
    classDef sqlite fill:#003B57,color:#fff,stroke:#fff,stroke-width:2px;
    classDef md fill:#24292E,color:#fff,stroke:#fff,stroke-width:2px;
    classDef system fill:#4A90E2,color:#fff,stroke:#fff,stroke-width:2px,stroke-dasharray: 5 5;
    classDef ai fill:#9B59B6,color:#fff,stroke:#fff,stroke-width:2px,stroke-dasharray: 5 5;
```

---

### 1. PostgreSQL (The Relational Core)

_The source of truth for all transactional, hierarchical, and financial data._

**What lives here:**

- **The Hub (Olympus Core):** Tenants (e.g., Pho24), Billing, Subscriptions, and Platform Staff.
- **ZAP-POS (Sales):** Orders, Items Sold, Payment Transactions.
- **ZAP-HR (Identity):** Merchant Employees, Access Roles, Time Entries.
- **ZAP-OPERATION (Supply Chain):** Products, Variants, Locations, Inventory Ledgers, Purchase Orders.

**The Rule:** If it involves money, strict relationships, or an immutable double-entry ledger, it lives in Postgres.

#### Data Flow

```mermaid
flowchart LR
    %% Sources
    ZAP_POS[ZAP-POS Registers]:::source
    Mobile_App[Mobile App Sync]:::source
    Admin_Dash[Olympus Admin]:::source
    Stripe[Stripe Webhooks]:::source

    %% DB
    PG[(PostgreSQL Core)]:::postgres

    %% Entities
    Tenants[Tenants]:::entity
    Inv[Inventory Counts]:::entity
    Orders[Orders & Payments]:::entity

    %% Flow
    ZAP_OS{ZAP-OS & Prisma}:::system

    ZAP_POS --> ZAP_OS
    Mobile_App --> ZAP_OS
    Admin_Dash --> ZAP_OS
    Stripe --> ZAP_OS

    ZAP_OS --"Write/Update"--> PG

    PG --- Tenants
    PG --- Inv
    PG --- Orders

    classDef postgres fill:#336791,color:#fff,stroke:#fff,stroke-width:2px;
    classDef source fill:#4A90E2,color:#fff,stroke:#fff,stroke-width:1px;
    classDef entity fill:#E67E22,color:#fff,stroke:#fff,stroke-width:1px;
    classDef system fill:#7F8C8D,color:#fff,stroke:#fff,stroke-width:2px,stroke-dasharray: 5 5;
```

### 2. MongoDB (The Document Object Store)

_The flexible, schema-less store for AI session memory and checkpointing._

**What lives here:**

- **BLAST Summaries:** Serialized session checkpoints generated during active development.
- **AI State:** Complex, deeply nested JSON representations of what the Swarm (Agents) were working on before a crash or handoff.
- **Unstructured Analytics:** High-volume, schemaless web analytics or telemetry dumps that do not require strict joins.

**The Rule:** If it is a deeply nested object, a massive payload of unstructured data, or a save-state for the AI Swarm, it lives in MongoDB.

#### Data Flow

```mermaid
flowchart LR
    %% Sources
    Agents[AI Agents / Swarm]:::source
    Session[User UI Session]:::source
    Telemetry[System Telemetry]:::source

    %% DB
    Mongo[(MongoDB)]:::mongo

    %% Flow
    Checkpoint_Gen{BLAST Checkpoint Generator}:::system
    Log_Aggregator{Pino Log Aggregator}:::system

    Agents --"Save Task State"--> Checkpoint_Gen
    Session --"Crash/Suspend"--> Checkpoint_Gen
    Telemetry --"Raw Event Dumps"--> Log_Aggregator

    Checkpoint_Gen --"Write BSON"--> Mongo
    Log_Aggregator --"Write JSON Logs"--> Mongo

    classDef mongo fill:#4DB33D,color:#fff,stroke:#fff,stroke-width:2px;
    classDef source fill:#9B59B6,color:#fff,stroke:#fff,stroke-width:1px;
    classDef system fill:#7F8C8D,color:#fff,stroke:#fff,stroke-width:2px,stroke-dasharray: 5 5;
```

### 3. ChromaDB (The Vector & Memory Vault)

_The mathematical memory layer powering RAG (Retrieval-Augmented Generation) for Spike, Jerry, and the ZAP Swarm._

**What lives here:**

- **Codebase Embeddings:** Mathematical representations of our UI components, API routes, and design system.
- **SOP Vectors:** Embeddings of our operational rules so that the AI can instantly retrieve and apply them during code generation.
- **Contextual Memory:** Semantic search indices allowing the Swarm to recall "How did we implement the Profile Switcher last week?"

**The Rule:** If it requires semantic search or powers the "Brain" of the autonomous agents, it is indexed in ChromaDB.

#### Data Flow

```mermaid
flowchart TD
    %% Sources
    MD_Files[Markdown SOPs & Skills]:::md
    Codebase[React/TS Codebase]:::code
    Past_Memory[Past Agent Sessions]:::mongo

    %% DB
    Chroma[(ChromaDB Vector Store)]:::chroma

    %% Process
    Embedder{Embedding Model}:::system
    AI_Agent[AI Agent Querying]:::ai

    MD_Files --> Embedder
    Codebase --> Embedder
    Past_Memory --> Embedder

    Embedder --"Compute Vectors"--> Chroma

    AI_Agent --"1. Semantic Search Query"--> Chroma
    Chroma --"2. Return Nearest K Results (RAG)"--> AI_Agent

    classDef chroma fill:#FF8C00,color:#fff,stroke:#fff,stroke-width:2px;
    classDef md fill:#24292E,color:#fff,stroke:#fff,stroke-width:1px;
    classDef code fill:#2980B9,color:#fff,stroke:#fff,stroke-width:1px;
    classDef mongo fill:#4DB33D,color:#fff,stroke:#fff,stroke-width:1px;
    classDef system fill:#7F8C8D,color:#fff,stroke:#fff,stroke-width:2px,stroke-dasharray: 5 5;
    classDef ai fill:#9B59B6,color:#fff,stroke:#fff,stroke-width:2px;
```

### 4. Markdown Files (.md) (The Source of Truth Directives)

_The human and machine-readable laws of Olympus._

**What lives here:**

- **SOPs (Standard Operating Procedures):** Rules of engagement (e.g., SOP-031 Inventory Tracking, SOP-033 Webhook Integration).
- **Artifacts:** Implementation plans, test scenarios (e.g., `tenant_pho24_test_scenario.md`), and database fracturing schemas.
- **Agent Skills:** The `SKILL.md` files defining exact workflows for the AI.

**The Rule:** If it dictates human processes, architectural law, or AI system prompts, it is written in Markdown and stored in Version Control (Git).

#### Data Flow

```mermaid
flowchart LR
    %% Creators
    Human[Engineering Leads]:::human
    Swarm[AI Verification Swarm]:::ai

    %% Store
    Git[(Local /Git / GitHub)]:::git
    MD_Artifacts[MD SOPs & Artifacts]:::md

    %% Consumers
    Chroma[(ChromaDB Embedder)]:::chroma
    Spike[Spike / Jerry Agents]:::ai

    Human --"Author Rules"--> MD_Artifacts
    Swarm --"Generate Docs/Test Scenarios"--> MD_Artifacts

    MD_Artifacts --"Commit"--> Git
    MD_Artifacts --"Index"--> Chroma
    MD_Artifacts --"Read via view_file"--> Spike

    classDef git fill:#F05032,color:#fff,stroke:#fff,stroke-width:2px;
    classDef md fill:#24292E,color:#fff,stroke:#fff,stroke-width:2px;
    classDef chroma fill:#FF8C00,color:#fff,stroke:#fff,stroke-width:1px;
    classDef ai fill:#9B59B6,color:#fff,stroke:#fff,stroke-width:1px;
    classDef human fill:#1ABC9C,color:#fff,stroke:#fff,stroke-width:1px;
```

### 5. SQLite (The Local Edge)

_The highly-available, localized offline-first database sitting on physical hardware._

**Purpose:** We operate a **Hybrid Model** (Local + Online Sync). By processing writes and reads locally on SQLite, we achieve maximum speed, completely decoupling the real-time store operations from cloud latency.

**What lives here:**

- **ZAP-POS Registers:** Local `orders`, `checkout_sessions`, and cached `products` for zero-latency ringing.
- **Customer Kiosks:** On-device cached menu navigation ensuring ordering never drops on spotty Wi-Fi.
- **Mobile Apps:** Local state and sync queues waiting to beam upward to the Cloud PostgreSQL instance.

**The Rule:** If it lives on a physical iPad, Android terminal, or Customer Kiosk, and requires sub-10ms latency regardless of internet connectivity, you write it to local SQLite first. A background worker will eventually sync it to Olympus Core.

#### Data Flow

```mermaid
flowchart TD
    %% Local Devices
    POS_Cashier[Cashier iOS/Android]:::device
    Kiosk[Customer Kiosk]:::device

    %% DB
    SQLite[(Local SQLite)]:::sqlite

    %% Cloud
    ZAP_Sync{ZAP-OS Sync Worker}:::system
    PG[(Cloud PostgreSQL)]:::postgres

    POS_Cashier --"Write Order (0ms latency)"--> SQLite
    Kiosk --"Read Menu Cache (0ms latency)"--> SQLite

    SQLite --"1. Background Sync Queue"--> ZAP_Sync
    ZAP_Sync --"2. Push to master ledger"--> PG
    PG --"3. Pull latest menu/prices down"--> ZAP_Sync
    ZAP_Sync --"4. Update local cache"--> SQLite

    classDef sqlite fill:#003B57,color:#fff,stroke:#fff,stroke-width:2px;
    classDef postgres fill:#336791,color:#fff,stroke:#fff,stroke-width:2px;
    classDef device fill:#E74C3C,color:#fff,stroke:#fff,stroke-width:1px;
    classDef system fill:#4A90E2,color:#fff,stroke:#fff,stroke-width:2px,stroke-dasharray: 5 5;
```
