# PRJ-003: Olympus Multi-Tenant Database architecture

**SLA ID:** `SLA-BLAST-OLYMPUS-20260223`

## Phase 1: B - Blueprint (Discovery)

### 1. The Core Objective
Design the overarching database deployment architecture for the **Olympus System**, integrating MongoDB Atlas and MongoDB Compass. Establish strict naming protocols to support ZAP's internal infrastructure (ZAP Vietnam) while enabling a highly scalable, multi-tenant POS (Point of Sale) distribution model to future external merchants.

### 2. Service Tiers (The Deployment Matrices)
When a customer purchases or adopts the Olympus System, they select their structural tier. The database logic dynamically assigns their Universal ID (`MRCH-[HASH]`) to the correct cluster:

| Tier | Name | architecture | Target Audience |
| :--- | :--- | :--- | :--- |
| **A** | **Cloud Service** | 100% remote. Full data resides securely on ZAP's managed Mongo Atlas cluster. Zero local infrastructure needed. | Small merchants prioritizing zero-maintenance and instant onboarding. |
| **B** | **Hybrid Service** | Critical/heavy interactions (like raw POS logs and employee activity) are kept on a local server. Abstracted high-level Long-Term Memory facts sync to Mongo Atlas for AI processing. | Medium/Large merchants needing local privacy but wanting AI capabilities. |
| **C** | **Local Service** | 100% air-gapped. A localized MongoDB instance runs on the merchant's hardware. Mongo Compass connects to `localhost`. No data touches Atlas. | Enterprise, high-compliance merchants with strict data privacy laws. |

### 3. Alpha Deployment: ZAP Vietnam (Hybrid Setup)
ZAP Vietnam will serve as the "Customer 0" proving ground. It will utilize the **Hybrid Structure (Tier B)**.
- **Why Hybrid for ZAP Vietnam?** We need access to the Atlas Sandbox to train the AI tools (Zap-Claw), while ensuring internal operations (payroll, local employee data) remain segmented and highly responsive locally.
- **The Employee Experience:** The system allows ZAP Vietnam employees to manage HR (payroll, schedules) and deploy AI assistance uniquely per employee profile across the organization.

### 4. ZAP-OS ISO Naming Protocol
To prevent data contamination in a multi-tenant environment, every table, collection, and service MUST adhere to the following ISO-standardized nomenclature format: `[TENANT_ID]_[SYS_CODE]_[COLLECTION]`.

#### Ecosystem System Codes (`[SYS_CODE]`):
- **`SYS_OS`** (ZAP-Os): The core operating engine and identity provider.
- **`SYS_CLAW`** (ZAP-Claw): The AI assistant neural network and memory core.
- **`SYS_POS`** (ZAP-Pos): Sales, transactional processing, and B2B deployment engine.
- **`SYS_DESIGN`** (ZAP-Design): UX/UI configurations, assets, and styling states.
- **`SYS_EMP`** (ZAP-Employee): HR modules, payroll handling, and internal staffing operations.

#### Example Atlas / Compass Topology:
For the first customer (ZAP Vietnam), assigned Tenant ID `ZVN`:
*   `ZVN_SYS_EMP_payroll` - (Stores local employee payroll facts)
*   `ZVN_SYS_CLAW_merchant_memory` - (Stores the Agent's specific context for ZAP Vietnam)
*   `ZVN_SYS_POS_transactions` - (Stores B2B and POS sales metrics)

When ZAP-Pos sells the system to an external customer (Tenant ID `CUST99`), the system seamlessly spawns:
*   `CUST99_SYS_CLAW_merchant_memory`
*   `CUST99_SYS_POS_transactions`

### 5. Architectural Diagram

```text
======================= OLYMPUS SYSTEM =======================

[ Tier A: Cloud Customer ] --------> ( ZAP-Managed Mongo Atlas )
                                            ^
[ Tier B: ZAP Vietnam ] ==== (Sync) ========|
   |                                        |
   |--> [ Local ZAP-OS DB ]                 | (AI Context only)
   |       |- ZVN_SYS_EMP_payroll           |
   |       |- ZVN_SYS_POS_sales             |

[ Tier C: Defense/Local ] --------> ( Local Air-Gapped DB )
```

## Phase 2: L - Link (Connectivity)
- [ ] Establish environment loading rules (`.env`) for dynamic MONGODB_URI assignment based on the Tier (A, B, or C) assigned to the current `merchantId`.
- [ ] Determine local MongoDB deployment strategy for Tier C / Tier B isolation.

## Phase 3: A - Architect (Structure & Logic)
- [ ] Refactor Prisma (SQLite) and `src/agent.ts` to enforce the `[TENANT_ID]_[SYS_CODE]` naming convention during read/write operations.

## Phase 4: S - Stylize (Refinement & UI)
- [ ] **PRD Required:** Build a dashboard UI outlining the deployment tiers and allowing ZAP-Pos to register new multi-tenant clusters visually.

## Phase 5: T - Trigger (Deployment & Validation)
- [ ] Run empirical test isolating ZAP Vietnam employee data from generic Cloud Customer data using the newly established ISO prefixes.
