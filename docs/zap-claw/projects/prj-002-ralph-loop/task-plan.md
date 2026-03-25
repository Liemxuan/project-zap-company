# prj-002-ralph-loop: Blueprint & Execution Plan

## Objective
Establish a strict, workspace-wide Naming Convention for all structural documents, and formalize the "Ralph Loop" (stateless, infinite-iteration execution pattern) into a globally accessible Artificial Intelligence Skill.

---

## 🏗️ Phase 2: Link (Environment & Prerequisites)

*   **Target Files:**
    *   `docs/sops/sop-001-master-openclaw-blast.md` (To enforce Naming Conventions globally).
    *   `~/.skills/ralph-loop/skill.md` (To establish the new global skill).

---

## 📐 Phase 3: Architect (Implementation Steps)

### Step 1: Enforce Global Naming Conventions
*   **Action:** Modify `sop-001-master-openclaw-blast.md`.
*   **Logic:** Inject a new, mandatory section at the very top of the B.L.A.S.T. execution rules defining strict identifier prefixes.
*   **Schema Required:**
    *   `SOP-XXX-[NAME].md` (Standard Operating Procedures)
    *   `KB-XXX-[NAME].md` (Knowledge Base Entries)
    *   `PRJ-XXX-[NAME]` (Project Folders)
    *   `~/.skills/[skill-name]/skill.md` (Global lowercase, hyphenated skill folders)

### Step 2: Formalize the `ralph-loop` Global Skill
*   **Action:** Create the directory `~/.skills/ralph-loop` and generate `skill.md`.
*   **Logic:** Translate the raw findings from `kb-001-ralph-loop.md` into an actionable, executable SOP for AI agents.
*   **Skill Requirements:**
    *   Must define the concept of "Stateless Iteration" (destroying and recreating the agent context to avoid LLM hallucination over time).
    *   Must define the operational cycle (Read state -> Pick goal -> Execute -> Test -> Save state -> Exit).
    *   Must define a hard "Stop Condition" (e.g., exiting the infinite loop when `<promise>COMPLETE</promise>` is reached).

---

## 🎨 Phase 4: Stylize (Formatting)
*   Ensure the new `ralph-loop` skill.md adheres to the human-taught UX formatting rules (from `~/.skills/blast-ux-protocol`), minimizing text walls and using clear markup headings.

## 🚀 Phase 5: Trigger (Finalization)
*   Present the completed Ralph Loop Skill and the updated Master SOP to the Human for final sign-off before we resume prj-001-memory.
