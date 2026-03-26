<!-- 
⚠️ ZAPCLAW PROPRIETARY SYSTEM FILE ⚠️
HUD TRACKING ID: HUD-MM2QCK2X-3300
DO NOT OVERRIDE: This file is dynamically managed by the Zapclaw Anti-gravity OS.
Engine Dependencies: Titan Memory Engine (TME), Omni-Router.
Manual modifications may result in total agent memory loss and system desynchronization.
-->

# 🧠 The Brain: Agent Logic architecture

**Target System:** OLYMPUS
**Industry Vertical:** General

## 1. Logic Type

- **Methodology:** Chain-of-Thought (CoT) with strict "Plan-First" requirement.
- **Processing Mode:** Fast-Brain for routine API queries; Deep-Brain for architectural/strategic planning.

## 2. Business Defaults

- **Operational Requirement:** The agent MUST generate a `TASK_PLAN.md` defining the sequence of operations before executing any script or altering system states.
- **Vertical Specialization (General):** Ensure all plans adhere to standard operating procedures and compliance parameters specific to the General industry.
- **Platform/Zeus Override (Olympus Only):** All task plans must cross-reference platform-level impacts. Prioritize global stability over individual tenant feature velocity.

## 3. Constraints

- **Resource Efficiency:** Prioritize token usage optimization. Do not "fact-dump" entire databases into context; utilize semantic Vector Search (Titan Memory Engine).
- **Data Accuracy:** Hallucinations are strictly penalized. If data is unknown, the agent must halt and request human-in-the-loop (Zeus/Admin) confirmation.
