# PRJ-005: Olympus Data Auditing & Testing Matrix

**SLA ID:** `SLA-BLAST-AUDIT-20260223`

## Phase 1: B - Blueprint (Discovery)

### 1. The Core Objective
To establish a rigorous, end-to-end auditing framework for the Olympus System. Before onboarding live external customers, we must algorithmically prove that the entire "Circle of Data" remains secure, coherent, and strictly isolated across the multi-tenant architecture. 

### 2. The "Circle of Data" Vectors
The testing matrix will repeatedly hammer three core vectors using automated QA scripts:

| Vector | Description | Success Criteria |
| :--- | :--- | :--- |
| **Identity Flow (ID)** | The assignment and enforcement of tokens (`AGNT-`, `MRCH-`, `EMP-`). Validating that Tenant A (`ZVN`) can *never* read Tenant B (`CUST99`). | No cross-tenant spillage. JWTs correctly scope all API requests. |
| **Data Flow (Context)** | The flow of information between `Zap-OS` (user state), `Zap-Pos` (product catalog), and `Zap-Claw` (AI memory facts). | Changes in employee status or permissions immediately alter Zap-Claw's context. |
| **Money Flow (Fintech)** | The transactional ledger. Tracking logic from a raw POS sale (`SYS_POS_sales`) through to an employee's commissioned paycheck (`SYS_EMP_payroll`). | Ledger totals zero out correctly. No lost or orphaned transactional arrays. |

### 3. The Synthetic Testing Strategy (The "War Games")
We will build a sub-system specifically for generating chaos and validating constraints.
- **The Actors:** We will generate synthetic "Customers" buying from synthetic "Merchant Employees." 
- **The Interrogation:** We will aggressively prompt `Zap-Claw` with confusing questions designed to trick it into leaking data across tenants or hallucinating financial totals. 
- **The Audit Tools:** We will build scripts that iterate entirely through the MongoDB Compass collections to mathematically verify the Money Flow and Data Flow matches the intended logic. 

### 4. Legacy Integration (Phase 2 Post-Audit)
*Only after* the Olympus Circle of Data achieves a 100% pass rate on synthetic data will we ingest the **Legacy ZAP 1.0 System**.
- **Migration Strategy:** ZAP 1.0 SQL/legacy data will be mapped and normalized into the new `[TENANT_ID]_[SYS_CODE]_[COLLECTION]` schema on a staging Atlas cluster.
- **Verification:** The same synthetic interrogation tests will be run against the newly migrated ZAP 1.0 data to ensure no architectural breakage occurs under historical load.

## Phase 2: L - Link (Connectivity)
- [ ] Establish a `tests/audit` directory specifically reserved for the QA scripts.
- [ ] Configure a dedicated MongoDB Atlas testing cluster (e.g., `zapcluster_QA`) to prevent synthetic chaos from touching ZAP Vietnam's real data.

## Phase 3: A - Architect (Structure & Logic)
- [ ] Build `audit_identity.ts`: A script that rapid-fires JWT spoofing attempts against `Zap-OS`.
- [ ] Build `audit_ledger.ts`: A script that verifies that every sale logged in `SYS_POS` reflects correctly in `SYS_EMP` payroll logic.

## Phase 4: S - Stylize (Refinement & UI)
- [ ] **PRD Required:** An internal Data Audit Dashboard that visualizes the "Circle of Data" for ZAP Admins, lighting up green or red based on the real-time integrity of the MongoDB collections.

## Phase 5: T - Trigger (Deployment & Validation)
- [ ] Run the complete `tests/audit` suite across 10,000 synthetic multi-tenant transactions and log the success rate.
