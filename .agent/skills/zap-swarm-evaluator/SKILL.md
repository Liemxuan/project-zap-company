---
name: zap-swarm-evaluator
description: ZAP-OS specific framework for benchmarking, evaluating, and authorizing Swamp agent skills. Mandates that all skill deployments, evaluations, and optimizations run through the Omni Router and Redis Queue. Use to ensure Jerry, Spike, and the Swarm adhere strictly to compliance (e.g. ZAP Dev Wrapper Protocol, SAP) before a new skill or update is pushed to production.
---

# ZAP Swarm Evaluator & Router Compliance Protocol

The **ZAP Swarm Evaluator** is a highly specialized evolution of the Anthropic `agent-skill-evaluator`. It strictly audits the effectiveness of our active Swarm (Jerry, Spike, Tommy) and any new skills introduced into the ZAP-OS ecosystem.

**CRITICAL MANDATE:** No agent, skill, or evaluation loop shall operate autonomously outside of the central nervous system. Everything must pass through the **Omni Router** and the **Redis Synchronization Queue**.

## The Central Queue Doctrine (Router First)

We do not run loose, unsupervised sub-agents. Our infrastructure is powered by the `zap-claw` live HTTP gateway and Redis queues.

1. **Queue Injection & Triage:** When evaluating a skill, the test tasks must be structured as payloads and passed into `enqueueOmniJob()`. The router executes `triageJob()`.
2. **Short vs Complex Routing:**
   - If Short, they skip the queue and evaluate instantly.
   - If Long or Complex (Evaluations/Deep Research), they are enqueued into `ZVN_SYS_OS_job_queue`. The user gets an immediate message ("Task Queued").
3. **Dual Confirmation Locking:** For complex eval jobs, the system enters a hard lock.
   - **Antigravity CLI:** A console alert is printed to unlock it via `scripts/approve_job.ts`.
   - **Telegram:** The webhook simultaneously pings the Admin ID (`1809088654`). The human can simply reply `/approve <jobId>` from their phone.
4. **Dead Letter Queue (DLQ) Fallback:** If a Swarm agent hallucinates, fails a quantitative assertion, or hits a sandbox `EPERM` error *after* approval, the Omni Router forces the task into the DLQ. The TRT watchdog then analyzes the failure.

## The Evaluation Loop

When the Human (or Chief of Staff Agent) needs to evaluate how well the Swarm understands a skill (like `code-simplifier` or `zap-integration`):

### 1. Construct the Payload & Generate the Ticket (MongoDB Tracking)

Instead of manually typing prompts, construct a structured JSON evaluation block.
Before dispatching, you MUST generate a **BLAST-SPLIT ID (MongoDB Ticket)**. By pushing everything into the queue, it creates an auditable ticket. If you, the Swarm, or I (the Human) forget what was going on, the ticket remains in the system.
This guarantees the process is solidified, regardless of how long the deep research or eval takes.

### 2. Dispatch via Router (Async Hand-off)

Send the JSON payload (including exactly what to test and the assertions) to the Omni Router via the Redis Queue.
The Router explicitly commands Jerry or Spike:

- *"Execute Task [Ticket ID] from the Queue utilizing Skill Y."*

**CRITICAL:** Since this is deep research or rigorous A/B testing, you do not sit and spin waiting for the result. You give the Human the `BLAST-SPLIT-[Ticket-ID]` and await the callback when the queue is finished.

### 3. A/B Swarm Benchmarking (The Gladiator Pit)

When evaluating a new skill or a complex protocol (like the Dev Wrapper "All-The-Way-Down" matrix), the Omni Router must deploy two independent teams in parallel:

- **Team Alpha (Baseline):** Executes the task relying *only* on global context and their native understanding.
- **Team Beta (Enhanced):** Executes the same task, but is explicitly equipped with the new `SKILL.md` (e.g., `code-simplifier` or `zap-integration`).

Instead of assuming success, the TRT Watchdog acts as a rigorous A/B comparator. It extracts both outputs and scores them against identical JSON assertions.

### 4. Quantitative Grading (The Assertions)

The TRT Watchdog automatically grades Team Alpha and Team Beta's output against the assertions.

- **Structural Integrity:** Did the agent wrap all L2 and L3 boundaries according to the Segmented Audit Protocol (SAP)?
- **Logic Flattening:** Did the agent avoid nested ternary operators (as dictated by `code-simplifier`)?
- **Token Attrition:** Did the task take 40,000 tokens when it should have taken 5,000?

### 5. Benchmark Aggregation & Merge

Once graded, the Omni Router generates a structured Benchmark Matrix. You (the Human) or the Chief of Staff reviews the delta.
If Team Beta (Enhanced) scores higher (e.g., 100% boundary wrap vs 60%, or completed via flat logic vs complex ternaries):

1. **Merge:** The Omni Router officially merges Team Beta's PR pipeline.
2. **B.L.A.S.T. Synchronization (Memory Hook):** The successful test vectors and the new skill instructions are serialized via the B.L.A.S.T. protocol and saved to the `olympus.knowledge_items` MongoDB cluster via the CLI (`mongosh`). If the Swarm ever "forgets" the skill, we can instantly rehydrate its context from the brain.

## Creating or Updating a Skill (The SOP)

If you are updating or drafting a new skill for the Swarm:

1. **Drafting:** Write the `.md` file inside `.agent/skills/<skill-name>/SKILL.md`. Be explicit. Explain *why* the rules exist so the Swarm understands the theory of mind behind the architecture.
2. **Testing (Queued):** Do not run a manual sub-agent. Tell the user you are pushing the test cases through the Omni Router.
3. **Iterating:** Read the DLQ or the output logs. If the Swarm failed, adjust the `SKILL.md` to be more explicit (e.g., changing a broad "make it clean" to a strict "ban all nested ternaries").
4. **Approval:** Once the TRT Watchdog clears the outputs with a 100% pass rate on structural assertions, the skill is officially authorized for production use in ZAP-OS.

---
**Summary:** We do not rely on "Vibe Coding." We rely on the Omni Router, Redis Queues, quantitative assertions, and strict adherence to the ZAP architectural mandates.
