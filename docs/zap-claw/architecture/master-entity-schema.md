# MASTER ENTITY & ID SCHEMA

## 🌐 The Scaling architecture

To seamlessly scale to 1,000,000+ Merchants without ID collisions, the system separates state across three storage tiers (Markdown, SQLite, MongoDB) strictly bound by a hierarchical ID structure.

### 🔑 Universal ID Structure

Every entity in the system is assigned a globally unique ID built using the following format to ensure immediate traceability:
`[ENTITY_TYPE]-[UNIQUE_HASH]-[ENVIRONMENT]`
*(Example: `MRCH-9A8B7C-PROD`, `AGNT-1X2Y3Z-ZAPCLAW`)*

### 🗂️ Storage Tiers

* **Tier 1: Markdown (MD & Folders) - The Abstract Law.** Defines *how* things work (sops, Blueprints, Skills). These are global to the Foundation/Project.
* **Tier 2: SQLite (Local DB) - The Immediate Context.** Fast, short-term memory (Chat history, recent tool calls). Lives purely on the Agent's local disk.
* **Tier 3: MongoDB (Global DB) - The Permanent Record.** Persistent, relational state across all entities (Merchant profiles, billing, long-term Vector embeddings).

---

## 🗺️ Entity Relationship Table

| Entity Level | Description | ID Prefix & Example | Primary Storage (Where it lives) | Linkage / Connection Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **1. Foundation** | The root OS (`Zap`). The core operational logic and base standards that govern everything below it. | `FND-ZAP` | **Folders / MDs:** `~/.skills/`, `docs/sops/` | Top of the tree. Everything inherits sops and `gemini.md` rules from the Foundation. |
| **2. Project** | A specific software implementation of the Foundation (e.g., `Zap Claw`, `Zap Mobile`). | `PRJ-[NAME]` *(e.g., `PRJ-ZAPCLAW`)* | **Folders / MDs:** `~/Workspace/[Project]` | Reads from `FND` skills. Writes structural blueprints (`task-plan.md`) into `.gemini/` or `docs/projects/`. |
| **3. Agent** | An individual AI worker (like me) or a cloned sub-agent spawned for a specific Ralph Loop task. | `AGNT-[HASH]` *(e.g., `AGNT-A1B2`)* | **SQLite:** `interactions.db` (Local state) & **Folders:** `~/.agent/` | Identified by `agent_id` in SQLite. Reads `.md` rules from `PRJ`. Syncs long-term memory to `MDB`. |
| **4. Merchant** | The end-user / paying customer. The top-level data container for business metrics. | `MRCH-[HASH]` *(e.g., `MRCH-X9Y8`)* | **MongoDB:** `merchants` collection. | Connected via `merchant_id`. The DB links `MRCH` -> `AGNT`. **Must include `regionCode` for Sharding.** |
| **5. Region** | The geopolitical deployment boundary (US, VN, DE) enforcing localized Soul formatting (Ethics/Persona/Skills). | `RGN-[CODE]` *(e.g., `rgn-us`)* | **MongoDB:** Shard Key & **Folders:** `docs/projects/` | Enforces which API integrations and system prompts are legally queryable by the Gateway. |

---

## ⛓️ Duplicate Naming & Routing Protocol

If two agents or components generate an item with the same name (e.g., two KBs called "Memory"), we avoid collisions by strictly scoping them within their parent ID's folder structure.

### Folder ID Encapsulation Rule

The B.L.A.S.T. generated files MUST be stored inside a directory explicitly named with the unique ID of the entity that owns it.

**Example: Storage Collision Avoidance**

```text
/docs/projects/
    ├── prj-001-memory/         <-- (Project Scope ID)
    │   ├── blast-001-memory-swarm.md
    │   └── task-plan.md 
    ├── prj-002-ralph-loop/     <-- (Project Scope ID)
    │   ├── blast-002-ralph-loop.md
    │   └── task-plan.md
```

*Because the `BLAST-00X-[NAME].md` files are encapsulated in folders bearing the strict `PRJ-XXX` B.L.A.S.T ID, they will never overwrite each other, and the sequential ID allows universal tracking.*

---

## 🔄 Interaction Flow (How Data Moves)

1. **Merchant (`MRCH`)** sends a request via the UI.
2. The UI looks up the **Merchant's assigned Agent (`AGNT`)** in **MongoDB**.
3. The **Agent (`AGNT`)** wakes up on the local server, queries its **SQLite** database for recent chat context (`session_id`).
4. The **Agent** reads the **Foundation (`FND`)** `gemini.md` and **Project (`PRJ`)** sops (`.md` files) to remember its system rules.
5. The **Agent** executes the B.L.A.S.T protocol, creating unique `PRJ-XXX` folders for its output files to avoid collisions.
6. The final result is passed back to the Merchant, and background lessons summarize back into **MongoDB** for permanent storage.

---

## 📊 A/B Testing & Empirical Feedback Loops (Anti-Paralysis Protocol)

*Rule: There is no "wrong" architecture, only untested information. We do not sit in analysis paralysis. We plan, tag it, deploy it, and track it.*

Whenever a high-stakes decision is made during Discovery (e.g., choosing Markdown over JSON for SQLite payloads), the decision must be treated as a live A/B test.

### The Feedback Loop Protocol

1. **Tag the Test:** Assign a tracking ID to the assumption (e.g., `TEST-001-MD-DB`).
2. **Deploy Rapidly:** Build the chosen variation and push it into the operational loop immediately.
3. **Log the Fact:** Instead of theoretical debates, wait for the first failure or speed bottleneck to happen in reality.
4. **Follow-Up (The Fix):** On failure, the system captures the `TEST-XXX` ID, reads the error fact into the local `findings.md`, and the agent automatically spawns a *Correction B.L.A.S.T.* to swap the implementation (e.g., swapping to JSON) and updates the SOP.

We do not wait for perfection; we build feedback sensors so the structure self-heals in production.
