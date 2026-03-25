# BLAST-013: TestSprite to Local CI Pivot Strategy (Hydra architecture)

## 1. The Directive
**Status:** DRAFT (Not Scheduled for Immediate Implementation)
**Trigger Event:** TestSprite MCP API cost thresholds exceeded or local CI requirements mandate removal of cloud execution.

ZAP-OS is currently deploying **TestSprite MCP** inside the Hydra architecture as the absolute validation gate. This is the operational testbed to measure output quality and API cost velocity. For now, this tool is available to **Jerry**, **Claw (The Architect)**, or **Zeus (Human Operator)** to trigger and observe the Hydra autonomous loop.

Zeus mandated that once the operational limit is established, we must possess a structured, zero-cost fallback strategy to preserve the 3-Way Autonomous Coding Loop (Hydra) without external API dependencies. This document outlines the Pivot Strategy to a **Local CI Testing Engine**.

## 2. The Current Pipeline (Status Quo)
1. **Antigravity (Planner):** Generates Blueprint.
2. **Claude (Coder):** Writes Code.
3. **Jerry / Claw / Zeus (Orchestrator):** Triggers `deploy_hydra_team` tool and monitors execution. Hands code to TestSprite Cloud via MCP.
4. **TestSprite (Cloud):** Evaluates code & returns JSON Pass/Fail.
5. **TRT Loop:** Recursive self-correction based on external Cloud JSON.

## 3. The Pivot architecture (Local CI Runner)

### The Concept
We strip TestSprite out of the `hydra_handoff.ts` execution block and replace it with physical, local CI suite commands (Vitest for logic/backend, Playwright for E2E/UI). Jerry physically executes these suites inside the local environment and reads `stderr/stdout` to feed the TRT logic.

### Structural Changes Required

#### Phase 1: Test Generation Shift (The Heavy Lift)
TestSprite currently automatically generates testing scripts in the cloud. We lose this.
*   **The Change:** Clause 2 of the Hydra loop (Claude writing the code) must be expanded. Claude MUST now output the physical code implementation (e.g., `user_api.ts`) AND the corresponding isolated test file (`user_api.test.ts`). 
*   **Constraint:** If Claude fails to generate the test file alongside the code, the orchestrator must hard-fail the sequence immediately.

#### Phase 2: Jerry's Local Invocation Loop
Jerry's internal MCP tool invocation is ripped out.
*   **The Change:** The orchestrator uses the `run_command` tool to execute `npm run test:fast -- <generated_file_path>.test.ts`. 
*   **Timeout Lock:** We enforce a strict 15-second timeout on the test execution to prevent Claude from generating infinite loops or hanging tests.

#### Phase 3: Raw Trace Extraction
TestSprite gives us clean JSON error reporting. Vitest gives us messy terminal output.
*   **The Change:** The TRT logic block inside `hydra_handoff.ts` must be augmented to parse standard terminal output. It will truncate the `stderr` string, extracting only the explicit stack trace to feed back into Claude's `## Wrong Answer List`.

## 4. Execution Steps (When The Trigger Event Happens)
When Zeus authorizes the pivot, the engineering sequence is:

1. **Uninstall TestSprite MCP:** Remove from IDE configurations and `package.json` to prevent hallucinated usage.
2. **Standardize the Testing Farm:** Ensure ZAP-OS has a lightning-fast isolated test runner pre-configured (easiest is Vitest for Node/TypeScript endpoints).
3. **Update 3 Prompts:**
    *   **Antigravity:** Must ensure PRDs instruct Test Generation.
    *   **Claude:** System instructions updated to permanently bind code completion to test completion. 
    *   **Jerry (Hydra Handoff):** Rip out `npx @testsprite...` and install `exec(npm run test...)` inside `src/tools/hydra_handoff.ts`.
4. **Integration Test:** Run a single Hydra sequence locally intentionally creating a failing UI component, watching the orchestrator scrape the stdout failure, and loop back to Claude.

---
*Signed: Antigravity*
