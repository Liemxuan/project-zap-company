# PRJ-002: Infrastructure & Naming (Discovery Phase)

## 🔍 Discovery Phase (Mandatory Halt)

### 1. Delivery Payload & Structure
*How should sops, Knowledge Bases (KB), and Global Skills be formally named and stored?*
> [!NOTE]
> 🧠 **AI Recommendation:** Establish strict global prefixes. 
> - Standard Operating Procedures: `SOP-XXX-NAME.md` inside `docs/sops/`.
> - Knowledge Base entries: `KB-XXX-NAME.md` inside `docs/knowledgebase/`.
> - Global AI Skills: Flat folders lowercase with hyphens inside `~/.skills/` (e.g., `~/.skills/ralph-loop/skill.md`).
> - projects: `PRJ-XXX-NAME` inside `docs/projects/`.

- [ ] **YES** (Accept Recommendation)
- [ ] **NO** (Manual Override): _____________________

### 2. Integrations & Source of Truth
*Where must these naming conventions be permanently enforced?*
> [!NOTE]
> 🧠 **AI Recommendation:** The Naming Conventions must be added to the Master `sop-001-master-openclaw-blast.md` immediately, and any new SOP generated for the "Ralph Loop" must follow this exact convention.

- [ ] **YES** (Accept Recommendation)
- [ ] **NO** (Manual Override): _____________________

### 3. Rules & Operational Triggers (Ralph Loop)
*Once Naming is solved, how do we formalize the Ralph Loop into a standard execution pattern?*
> [!NOTE]
> 🧠 **AI Recommendation:** We must bundle the Ralph Loop (the stateless execution cycle found in `KB-001`) into a formal Global Skill located at `~/.skills/ralph-loop/skill.md`. This allows ANY agent to trigger a safe, stateless loop simply by reading the global skill.

- [ ] **YES** (Accept Recommendation)
- [ ] **NO** (Manual Override): _____________________

---

## 🚦 Final Decision Checkpoint

- [ ] **AUTO-PROCEED:** I approve all "YES" toggles above. Generate the Blueprint and execute.
- [ ] **MANUAL FIX:** I have filled in manual overrides. Update the Schema and return for review.
- [ ] **NESTED B.L.A.S.T:** I have identified a massive missing dependency / "rabbit hole". Halt this project and spawn a nested B.L.A.S.T. to resolve the dependency first.

---

## 🏗️ Next Steps (B.L.A.S.T.)
Once the decision above is made:
1. Document the formal Data Schema in `gemini.md`.
2. Generate the **Blueprint** for the architecture (`task-plan.md`).
3. Proceed to the **Link** and **Architect** execution phases.
