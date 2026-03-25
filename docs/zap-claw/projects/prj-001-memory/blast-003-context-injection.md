# B.L.A.S.T. Discovery Questionnaire (PRJ-001 Phase 2: Context Injection)

## 📋 Project Meta
- **Project ID:** prj-001-memory (Phase 2)
- **Initiation Date:** 2026-02-22
- **Target Feature:** Dynamic Memory Context Retrieval & Injection into Active Chat

---

## 🔍 Discovery Phase (Mandatory Halt)

### 1. Delivery Payload & Structure
*What does the final processed data look like (JSON, Markdown, specific API shape)?*
> [!NOTE]
> 🧠 **AI Recommendation:** Extract the `MemoryFacts` from MongoDB and format them as a **Markdown bulleted list**. Inject this Markdown string into the `fallbackMessageSystem` (which acts as the system prompt) BEFORE the `executeWithArbitrage` call. This ensures the LLM seamlessly reads the context without complex parsing.

- [x] **YES** (Accept Recommendation)
- [ ] **NO** (Manual Override): _____________________

### 2. Integrations & Source of Truth
*What external systems must we connect to, and where does the raw data live?*
> [!NOTE]
> 🧠 **AI Recommendation:** Connect directly to the global **MongoDB Database** (specifically the `MemoryFacts` collection) using the existing `MongoClient` pattern (like in `src/memory/sync.ts`). Query by the current user's identification (Merchant ID) to retrieve their specific synced facts.

- [x] **YES** (Accept Recommendation)
- [ ] **NO** (Manual Override): _____________________

### 3. Rules & Operational Triggers
*When does this run, and when must it fail?*
> [!NOTE]
> 🧠 **AI Recommendation:** Run this query **synchronously** during the active conversation thread (prior to the LLM call). **Failure condition:** If MongoDB is unreachable or times out, log a warning but gracefully proceed with an *empty* context to ensure the chat remains resilient and never blocks the user.

- [x] **YES** (Accept Recommendation)
- [ ] **NO** (Manual Override): _____________________

---

## 🚦 Final Decision Checkpoint

- [x] **AUTO-PROCEED:** I approve all "YES" toggles above. Generate the Blueprint and execute.
- [ ] **MANUAL FIX:** I have filled in manual overrides. Update the Schema and return for review.
- [ ] **NESTED B.L.A.S.T:** I have identified a massive missing dependency / "rabbit hole". Halt this project and spawn a nested sub-project to resolve the dependency first.
