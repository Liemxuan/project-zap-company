# PRD-004: Hydra architecture (3-Way Autonomous Coding Loop)

## 1. Context & Business Objective

ZAP-OS requires a resilient, multi-agent orchestration layer capable of unsupervised code generation, verification, and self-correction. Currently, single-agent models (even powerful ones like Claude 3.7) hallucinate, fail structural tests, or lose context on large tasks.

This PRD defines the **Hydra architecture**: a 3-agent orchestration loop where a Planner (Antigravity/Gemini), a Coder (Claude Team), and a QA Watchdog (Jerry) operate in sequence. By integrating the Test-Time Recursive Thinking (TRT) capabilities and **TestSprite MCP**, Hydra enables autonomous coding loops that return to the human operator (Zeus) only when code is 100% verified against cloud-executed test suites, visual metrics, or API contracts.

## 2. Core Personas & Roles

### Agent 1: The Architect (Antigravity / Gemini 3.1 Pro)

* **Designation:** Planner & Systems Engineer
* **Role:** The Architect processes the raw request and formulates constraints. It does not write the code. Instead, it reads the existing ZAP-OS codebase and design templates, mapping out dependencies to generate a structured `[IMPLEMENTATION_PLAN.md]`.
* **Output:** Strict boundaries, target file paths, logic targets, and functional requirements for Agent 2.

### Agent 2: The Workforce (Claude 3.7 Sonnet / The Team)

* **Designation:** Raw Code Generation
* **Role:** Strictly executes the `[IMPLEMENTATION_PLAN.md]`. It does not plan, question, or invent outside the Architect's boundaries. It writes the React components, database transactions, or API endpoints exactly as specified.
* **Output:** Writes raw code to the local file system. Flags the sub-task as `READY_FOR_REVIEW`.

### Agent 3: The Watchdog (Jerry / Local OLLAMA or Gemini 2.5 Flash-Lite)

* **Designation:** Verification, MCP Management & TRT Enforcer
* **Role:** Jerry wakes up when Claude finishes coding. Jerry compiles the code (`tsc`) and delegates QA testing to external tools. Utilizing the **TestSprite MCP Server**, Jerry sends the compiled codebase and the PRD directly to TestSprite's secure cloud to execute the testing regime.
* **Output:**
  * **Pass:** Upon receiving a clean bill of health from TestSprite, Jerry appends a `VERIFIED` status to the session state and alerts Zeus via Telegram.
  * **Fail:** If TestSprite returns failing test results, Jerry generates a TRT `[Error Report]` (e.g., "The API route failed TestSprite's validation checks 2, 4, and 5..."). Jerry injects this crash report into Claude's `knowledge_text` block and kicks the task back to Agent 2 for an automated rewrite.

## 3. High-Level architecture (The Hydra Loop)

1. **Sys-Init:** Zeus Proposes Task: "Build a User Profile API and test it."
2. **Lane 1 (Architect):** Antigravity generates the exact schema blueprint and constraints.
3. **Lane 2 (Coder):** Claude reads the blueprint and writes the Node.js/Prisma code.
4. **Lane 3 (Watchdog):** Jerry invokes `npx @testsprite/testsprite-mcp@latest` to trigger cloud security and functional tests on the new API.
5. **TRT Feedback Loop:** If TestSprite flags the build, Jerry halts the deployment, takes the exact `stderr` testing failures, converts them into an `[Error Report]`, attributes it to `role: "mistake"`, and kicks the loop back to Lane 2.
6. **Termination Gate:** The sequence resolves exclusively when TestSprite signs off on 100% test passage, or halts permanently if it hits the maximum retry limit (`max_retries = 4`).

## 4. Technical Implementation Path

### Phase 1: The Orchestration Script (`src/runtime/hydra_lane.ts`)

* Build a specialized loop sequence wrapping the existing `omni_router.ts`.
* Define the global `HydraState` payload that passes cleanly between the Planner, the Coder, and the Verifier without dropping context.

### Phase 2: TestSprite MCP Setup & Integration

For Jerry (the Watchdog) to utilize TestSprite effectively, the MCP must be configured in the ZAP-OS daemon environment.

* **Dependency:** Run `npm install -g @testsprite/testsprite-mcp@latest`.
* **MCP Config File:** Create or inject the TestSprite Server definition into the Omni Router's environment variables map. Jerry needs the agent profile to include:

    ```javascript
    {
       command: "npx",
       args: ["@testsprite/testsprite-mcp@latest"],
       env: { TESTSPRITE_API_KEY: "your_sprite_key" }
    }
    ```

* **Actionable Tools:** Jerry uses the tool command: "Help me test this project with TestSprite" to trigger TestSprite's automated cloud environment.

### Phase 3: The Handoff Logic

* Incorporate `SOP-010` (TRT Protocol). When TestSprite uncovers a bug, Jerry's job is not to fix it, but to format the failure into the `## Wrong Answer List` array and pass the baton back to Claude to formulate a new hypothesis.

## 5. Security & Fallback Policies

* **Max Recursion:** The Hydra loop has an absolute lock out (`MAX_TRT_LOOPS = 4`). If Claude cannot satisfy the TestSprite validation metrics after 4 sequential rewrite attempts, Jerry throws a hard fault and dumps the state log to Zeus over Telegram.
* **Cost Management:** Jerry should run on a heavily optimized, secondary-tier model (e.g., Gemini 2.5 Flash Lite) to process the MCP payloads and error logic quickly without chewing up expensive Pro API limits while looping through TestSprite failures.
* **Working Tree Safety:** Hydra loops MUST execute within an isolated git branch (e.g., `hydra-session-XYZ`). Code is only merged to `main` upon successful TestSprite verification.

---
*Status: Approved architecture layout. No code implementation has occurred as per USER mandate.*
