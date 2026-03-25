# B.L.A.S.T. Discovery Questionnaire (prj-001-memory)

## 📋 Project Meta
- **Project ID:** prj-001-memory
- **Initiation Date:** 2026-02-22
- **Target Feature:** Autonomous Self-Healing & Background Memory Consolidation

---

## 🔍 Discovery Phase (Mandatory Halt)

### 1. Delivery Payload & Structure
*What does the final processed data look like (JSON, Markdown, specific API shape)?*
> [!NOTE]
> 🧠 **AI Recommendation:** Use Option A (Markdown string). SQLite's FTS5 engine is built for full-text semantic search. Over-engineering JSON here breaks the seamless nature of standard LLM RAG prompts. We can A/B test JSON later if precision drops.

- [ ] **YES** (Accept Recommendation)
- [ ] **NO** (Manual Override): _____________________

### 2. Integrations & Source of Truth
*What external systems must we connect to, and where does the raw data live?*
> [!NOTE]
> 🧠 **AI Recommendation:** Connect explicitly to the `sqlite` database `interactions` and `memories` tables. Route all background extraction calls strictly through the `google/gemini-2.5-flash-001` OpenRouter profile in `gateway.ts`.

- [ ] **YES** (Accept Recommendation)
- [ ] **NO** (Manual Override): _____________________

### 3. Rules & Operational Triggers
*When does this run, and when must it fail?*
> [!NOTE]
> 🧠 **AI Recommendation:** Abandon the basic "every 5 turns" trigger. Instead, use the **Ralph Loop** (from `~/.skills/ralph-loop/skill.md`). The Memory Consolidation worker must be a completely isolated, stateless agent. When triggered (either periodically or on tool failure), it wakes up, reads the raw chat logs, extracts one set of technical facts or user preferences into the `memories` table, checks the task off, and *terminates*. This guarantees no context bleed into the main conversation.

- [ ] **YES** (Accept Recommendation)
- [ ] **NO** (Manual Override): _____________________

---

## 🚦 Final Decision Checkpoint

- [ ] **AUTO-PROCEED:** I approve all "YES" toggles above. Generate the Blueprint and execute.
- [ ] **MANUAL FIX:** I have filled in manual overrides. Update the Schema and return for review.
- [x] **NESTED B.L.A.S.T:** I have identified a massive missing dependency / "rabbit hole" on Question 3. We must formalize the **Ralph Loop** execution strategy as an SOP/Skill before we can finalize these memory triggers. Halt PRJ-001 and spawn prj-002-ralph-loop to resolve the dependency.

---

## 🏗️ Next Steps (B.L.A.S.T.)
Once the decision above is made:
1. Document the formal Data Schema in `gemini.md`.
2. Generate the **Blueprint** for the architecture (`task-plan.md`).
3. Proceed to the **Link** and **Architect** execution phases.
