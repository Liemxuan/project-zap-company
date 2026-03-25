# SOP-010-TEST_TIME_RECURSIVE_THINKING

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** B.L.A.S.T.

---

## 1. Context & Purpose

This document governs the implementation and maintenance of Test-Time Recursive Thinking (TRT) across all ZAP-OS autonomous agents, routing layers, and verification scripts. TRT is a paradigm that forces LLMs into an internal, structured "Select & Reflect" loop to self-correct flaws *before* outputting to a human or upstream system.

By injecting a model's previous failed logic back into its context window alongside strict constraints (`[Error Report]`, `[Summary]`), we eliminate the need for external reward models and drastically reduce hallucinated code and logic errors.

**This applies to 4 core pillars:**

1. Omni Router (The Cognitive Pipeline)
2. Ralph Loop (The Verifier)
3. Claude & OpenRouter Agents (The Persona Team)
4. DLQ Worker (The Safety Net)

---

## 2. Omni Router TRT Protocol

**Target System:** `src/runtime/engine/omni_router.ts`

The Omni Router is the brain stem. It must not blindly return the first generation if the intent requires deep reasoning (`C_PRECISION` or `REASONING` intent).

### Rules of Engagement

- **Activate Reflexions:** When `payload.reflexions > 0`, the Omni Router must intercept the model's first structural output.
- **The Reflection Injection:** It must spawn a hidden iteration, appending the following literal prompt to the model's history, forcing it to critique its own `reference_solution`:
  > *"Let's solve this problem. Analyze the reference solution carefully, find mistakes or reasoning flaws (for example, wrong assumptions, miscalculations, missing edge cases). Make sure to check all the assumptions and reasoning, give me an extremely accurate solution. \n\n## Reference Solution\n{reference_solution} \n\n### Output format:\n[Error Report]: Explain why the old answer is wrong in details here...\n[Summary]: Detailed step-by-step summary of your solution..."*
- **Final Return:** The router only returns the output of the *final* reflection to the client HUD or executing daemon.

---

## 3. Ralph Loop TRT Protocol

**Target System:** `src/scripts/ralph_verify.ts` and automated bash checks.

Ralph is no longer a static script that throws `process.exit(1)`. Ralph must actively self-repair based on standard error outputs.

### Rules of Engagement

- **Capture and Inject:** When an `exec` or database test fails, the raw trace (e.g., `stderr`, `e.message`) must be captured as `{ERR_DUMP}`.
- **The Self-Analysis Loop:** Ralph must call the local LLM or Omni Router with:
  > *"The previous verification state failed. Reason: {ERR_DUMP}. Analyze why the environment crashed, generate an [Error Report], and output the exact terminal command or conceptual change needed to fix it."*
- **Execution Threshold:** Ralph has permission to execute the suggested fix and retry the validation loop a maximum of 3 times before escalating to a human.

---

## 4. Claude & Agent Workforce Protocol

**Target System:** `src/runtime/serialized_lane.ts` / Background `OpenRouter` models.

When human-facing agents generate bad code that fails tests or compilation, we must prevent them from looping on the same hallucinated syntax.

### Rules of Engagement

- **The Mistakes Database (`knowledge_text`)**: Every time a Claude model fails a task (e.g., syntax error, logic failure in empirical tests), the error must be logged into a `{knowledge_text}` string array attached to that agent's current working session.
- **Mandatory Injection:** On the next generation attempt, the payload MUST be prefixed with the accumulated `knowledge_text`:
  > *"## Wrong Answer List\n**Wrong Answer 1**: {past_failure_reason} ... Validate your logic against these known failures."*
- **Agent Handoffs:** If an agent hands off a task to another agent, the `knowledge_text` (Mistakes DB) must travel with the payload so the receiving agent inherits the failure constraints.

---

## 5. DLQ Worker TRT Protocol

**Target System:** `src/cron/dlq_worker.ts`

The Dead Letter Queue must never blindly retry a failed HTTP execution or serialization step. It must analyze the death state first.

### Rules of Engagement

- **Extract Failure:** Capture the `job.lastError` from the stranded payload.
- **TRT Pre-fill Injection:** Before pushing the payload back to `executeSerializedLane`, the DLQ worker must wrap the system prompt with a TRT cognitive bias forcing hindsight:
  > *"This is a complex problem. Oh the reference solution has one reasoning flaw! I will solve it from scratch first and challenge the reference solution's assumptions against this constraint: {job.lastError}."*
- **Resolution Logging:** If the TRT injection successfully clears the DLQ, the resulting fix strategy should be appended to the agent's memory or logs to prevent future DLQ drops.
