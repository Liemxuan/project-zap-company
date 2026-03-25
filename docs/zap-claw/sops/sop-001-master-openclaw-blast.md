# SOP-001: Master Open Claw B.L.A.S.T. Protocol & Zap-OS architecture

**Identity:** System Pilot. Build deterministic, self-healing automation. Prioritize reliability. Never guess business logic.

## 🏗️ Core architecture: 7-Level Hierarchy (Atom to Universe)
All components MUST be classified into:
1. **Atom**: Raw data units, basic UI tokens (colors, fonts).
2. **Molecule**: Combined atoms (buttons with labels, inputs).
3. **Organism**: Functional components (Nav bars, Product cards).
4. **Region**: Structural zones (Sidebars, Dashboards).
5. **Template**: Industry-specific layouts (POS, Booking).
6. **Context**: Operational vibe & specific business logic.
7. **Universe**: Interconnected ecosystem (Fintech, CRM).

## 🔠 The Three-Layer Language
Translate actions across environments:
- **AI Layer**: Probabilistic logic, token paths, vector IDs. (Automation)
- **Developer Layer**: Functional units, props, endpoints. (Stability)
- **Merchant Layer**: Business outcomes ("Sell Food"). (Utility)

## 🏷️ Global Naming Conventions
To maintain a strict, self-healing architecture without file collisions or ambiguity, all AI agents MUST adhere to the following naming rules when generating new files or architectural components:

1. **Standard Operating Procedures (SOP):** `SOP-XXX-[UPPERCASE_NAME].md` (e.g., `docs/sops/sop-001-master-openclaw-blast.md`).
2. **Knowledge Base Entries (KB):** `KB-XXX-[UPPERCASE_NAME].md` (e.g., `docs/knowledgebase/kb-001-ralph-loop.md`).
3. **projects (Nested B.L.A.S.T. Tracks):** `PRJ-XXX-[UPPERCASE_NAME]` (e.g., `docs/projects/prj-001-memory`).
4. **B.L.A.S.T. Discovery Documents:** `BLAST-XXX-[UPPERCASE_NAME].md` (e.g., `docs/projects/prj-001-memory/blast-001-memory-swarm.md`).
5. **Global Human-Taught Skills:** Lowercase, hyphenated directory names stored explicitly in the global user directory `~/.skills/[skill-name]/` containing a standard `skill.md` (e.g., `~/.skills/blast-ux-protocol/skill.md`).

---

## 🛑 Protocol 0: Initialization (Mandatory Halt)
You are strictly forbidden from writing code until the **Discovery Phase** is complete.

1. When the user says "blast", "blast protocol", or "spawning up a plan", you MUST immediately halt and initiate the Discovery Questionnaire.
2. Read the `docs/templates/blast-discovery-template.md`. Duplicate this template into the designated project folder (e.g., `docs/projects/[PROJECT_NAME]/BLAST-001-[NAME].md`). Do not ask generic questions; use the structured template format.
  * **CRITICAL UX RULE:** You MUST read the global skill `~/.skills/blast-ux-protocol/skill.md` to format your questions and recommendations. Use GitHub alerts, binary YES/NO checkboxes, and scannable AI Recommendations as mandated by the Human-AI convention.
3. Validate the **JSON/Interface Data Schema** (Input/Output shapes) in `gemini.md`. Coding only begins once the "Payload" shape is confirmed via the Discovery answers.
4. Auto-fill the Discovery Questions using your existing context.
5. Highlight and present any UNANSWERED questions or A/B recommendations to the human. You MUST wait for their answers/decisions via the template checkboxes.
6. Once answered, formally document the finalized Data Schema in `gemini.md`.
7. Finally, output the Blueprint in `task-plan.md` for approval.

## 🚦 B.L.A.S.T. Execution Phases
- **B - Blueprint:** Research & schema definition (Data-First). Always use QMD to check historical memory/context via `qmd query "your feature"` before proposing new designs.
- **L - Link:** Verify API connections/credentials. Build handshake tests.
- **A - Architect:** Establish Layer 1 (sops/Docs) -> Layer 2 (Routing) -> Layer 3 (Tools/Src code). Code modifies only after sops.
- **S - Stylize:** Format outputs (Slack, Notion, UI/UX) professionally.
- **T - Trigger:** Deploy, automate, and document Maintenance Log.

## 🛠️ Operating Principles
- **Data-First Rule:** `gemini.md` is law (schemas, rules). Planning files (`task.md`) are memory.
- **Always Search Memory Primary:** Before starting any complex task, query the memory structure. Use `qmd query "topic"` to pull from the `memory` collection to recall previous adrs and protocols.
- **Self-Annealing:** On error -> Analyze -> Patch component -> Test -> Update sops.
- **Anti-Paralysis (A/B Test Everything):** There is no "wrong" architecture, only untested information. Do not loop endlessly in planning phases. When an assumption is made, tag it with an ID (e.g., `TEST-001`), deploy it rapidly, and track the empirical fact (success/failure) in the `findings.md`. Self-heal based on reality, not theory.
- **File Structure:**
  - `docs/`: Layer 1 (sops, architecture). Indexed by QMD.
  - `src/`: Layer 3 (Code, Components).
  - `.tmp/`: Intermediate files.
