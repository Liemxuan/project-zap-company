# BLAST-018: Micro-Swarm Specialization (Team Hydra)

**Status:** Active | **Initiated By:** Zeus | **Fleet Commander:** Jerry | **Date:** 2026-03-06

## 1. The Core Philosophy

The era of the "Do-Everything" generalist AI agent is over. Supplying a single agent with all context (design, infrastructure, deployment) results in massive context bloat, token inefficiency, and degraded output quality.

To improve our infrastructure of building software, **Jerry (Fleet Commander)** is mandated to split **Team Hydra (Claude Code / OpenClaw Sub-Agents)** into highly specialized, isolated micro-units.

By narrowing the scope, we achieve:

1. **Pristine Token Health:** No wasted context window.
2. **Hyper-Focus:** Outstanding domain-specific results.
3. **Targeted Skill Loading:** Agents only receive the `.agent/skills` strictly necessary for their exact job.

---

## 2. The Specialized Micro-Units

Jerry will provision, orchestrate, and hand-off tasks between these three specific Team Hydra variants:

### Unit A: UX/UI Designer (The Blueprint)

* **Role:** Visual planning, Figma/visual token analysis, user journey mapping.
* **Focus:** Determining *what* something should look like and *how* it should feel.
* **Loaded Skills (`--skills`):**
  * `ui-ux-pro-max-skill`
  * `web-design-guidelines`
  * `workflow-brand-guidelines`
  * `zap-inspector-icons`
* **Rules:** Do not write boilerplate API code or backend logic. Output design decisions, color palettes, and structural DOM wireframes to `task.md` or a specific blueprint file.

### Unit B: UX/UI Construction (The Builder / Spike)

* **Role:** React/Next.js UI implementation, Tailwind compilation, atomic component writing.
* **Focus:** Taking Unit A's blueprints and translating them into pixel-perfect, production-grade code.
* **Loaded Skills (`--skills`):**
  * `frontend-component-refactor`
  * `tailwind-patterns`
  * `motion` / `frontend-motion`
  * `zap-integration`
  * `frontend-webapp-testing`
* **Rules:** You are the executor. You ensure micro-interactions (hover states, Framer Motion) work seamlessly. If the backend API isn't ready, you build the mocked interface anyway. Do not touch backend routes.

### Unit C: Infrastructure (The Core / Tommy's Domain)

* **Role:** Backend APIs, MongoDB schemas, Node.js routing, Monorepo management, testing pipelines.
* **Focus:** Data integrity, latency, security, and systemic queue management.
* **Loaded Skills (`--skills`):**
  * `database-design`
  * `nodejs-best-practices`
  * `api-patterns`
* **Role:** Backend APIs, MongoDB schemas, Node.js routing, Monorepo management, testing pipelines.
* **Focus:** Data integrity, latency, security, and systemic queue management.
* **Loaded Skills (`--skills`):**
  * `database-design`
  * `nodejs-best-practices`
  * `api-patterns`
  * `server-management`
  * `systematic-debugging`
* **Rules:** Do not worry about flexbox, Tailwind, or UX constraints. Your job is pure logical execution, Redis pub/sub stability, and rigorous Red-Green TDD implementation.

---

## 3. The 24/7 Autonomous Core (Tommy & Jerry)

The system cannot scale if it relies on Zeus (Human) bouncing instructions back and forth with a single AI agent. To achieve a non-stop, 24/7 building crew, **Tommy (Lead Architect)** and **Jerry (Build Orchestrator)** must operate as a dual-manager autonomous engine.

### How The Managers Split the Load

1. **Tommy (The Queue Master):** Monitors the monorepo, analyzes the Olympus routing queue (`OmniQueue`), and breaks massive epics down into bite-sized architectural blueprints (`PRDs`). He ensures the scope is tight.
2. **Jerry (The Execution Foreman)::** Takes Tommy's PRDs, loads the correct specific skills, spins up the specialized micro-units (UX, UI, Infrastructure), and forces them to write the code.
3. **The Merge Loop:** Once Unit B and Unit C finish building, Jerry tests the code. If it passes, Tommy reviews the architecture. If it aligns, they push it to the queue.

By operating this way, Tommy and Jerry act as an infinite pipeline. Once this AI pipeline is perfected, we can inject specialized human developers seamlessly into these micro-unit roles to expedite specific components (e.g., adding a human Senior React Dev to take over Unit B tasks while Jerry manages the rest).

## 4. The Jerry Orchestration Loop

Jerry operates as the Fleet Commander. Jerry does **not** do the coding himself unless it forms the orchestrating glue. He acts as the project manager:

1. **The Brief:** Jerry pulls the next completed PRD from Tommy's queue.
2. **Context Routing:** Jerry passes ONLY the relevant system intent and design criteria to **Unit A (Designer)**.
3. **The Blueprint Sync:** Unit A outputs `design-spec.md`. Jerry verifies the output against ZAP brand guidelines.
4. **The Armory (Skill Dispensing):** Before spinning up the builders, Jerry acts as the Quartermaster. He reads the master `.agent/skills` vault, matches the requirements of the PRD/Design Spec to available skills (e.g., matching a Redux request to a potential `react-best-practices` skill), and mathematically limits the `--skills` array to only the 3-5 absolute essentials. Sub-agents do **not** select their own tools; Jerry loads their toolbelts before deploying them.
5. **The Build Hand-off:** Jerry invokes **Unit B (Construction)** and **Unit C (Infrastructure)** *in parallel* via Native ACP threads (`mode=persistent`), injecting the precisely calculated `--skills` arrays into their spawn commands.
    * Unit B receives `design-spec.md` and begins building the React layout.
    * Unit C receives the required API payload schema and begins building the MongoDB endpoints.
6. **The Convergence:** Jerry collects the completed pull requests/commits, runs the frontend testing/testsprite validation, and hands the feature back to Tommy to finalize the queue.

## 5. Execution Directives for Agents

When acting as a specialized unit:

## 6. The Olympus Override (Manual Approval Bypass)

To maintain a true non-stop 24/7 pipeline, we must eliminate human bottlenecks (approval fatigue). Zeus retains ultimate authority but can conditionally delegate approval rights.

At the beginning of any new BLAST sequence, Tommy or Jerry must present the architectural scope to Zeus. Zeus will then classify the execution mode for that specific BLAST:

1. **Manual Mode (Default):** Zeus must manually approve the final merge and infrastructure changes.
2. **The Olympus Override (`--full-auto`):** If the BLAST is low-risk, well-defined (e.g., standard UI components, routine React refactoring), or highly specialized, Zeus will reply with:
   > "Auto-approve until the change is complete."

Once this override is issued for a specific BLAST:

* Jerry becomes the sole approver.
* Jerry evaluates Unit B and Unit C's code against the test requirements.
* If Red-Green TDD passes, Jerry merges the code natively and pulls the next ticket from Tommy without stopping to ping Zeus.
* Zeus is only interrupted if a catastrophic structural conflict occurs or if the current BLAST concludes entirely.
