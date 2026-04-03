# ZAP Swarm: Consolidated Tech Stack (Master Harness)

This document defines the finalized, multi-language architectural footprint for the ZAP Swarm ecosystem. It combines the high-performance Rust core with the high-velocity TypeScript interface, backed by a resilient tiered-database strategy.

---

## 1. Core Architecture (The "Hydra" Model)

| Layer | Technology | Responsibility |
| :--- | :--- | :--- |
| **Engine (Harness)** | **Rust** | Task orchestration, `KAIROS` background daemon, Permission/Security hooks, and Session hydration. |
| **Gateway (Proxy)** | **Rust (Axum)** | High-concurrency SSE streaming, API token balancing, and request sanitization. |
| **Interface (UI)** | **TypeScript (Next.js 15)** | The Swarm Command Center, High-Density HUD, and real-time visualization. |
| **CLI / REPL** | **TypeScript (Bun)** | Rapid developer interaction, markdown terminal rendering, and local workspace hooks. |
| **Tooling** | **MCP (Model Context Protocol)** | Unified standard for connecting external tools (Figma, GitHub, MongoDB) to the agents. |

---

## 2. Persistence Layer (Storage & Memory)

We use a tri-database strategy to balance performance, structure, and long-horizon memory.

*   **MongoDB (Atlas)**: Agent long-horizon memory (unstructured), execution logs, and conversation history.
*   **Redis**: Real-time job queueing, concurrency locks, and the KAIROS tick registry.
*   **Chromadb (Vector Store)**: Semantic search, AST indexing for codebases, and RAG-based context retrieval.

### 4. Orchestration & Frameworks
*   **ZAP-OS Runtime (Rust)**: Native, high-performance orchestration inspired by Langchain/Pydantic-AI but built for concurrent swarm execution.
*   **Markdown-First Context**: The system uses `.md` as the canonical format for all persistent state, plans, and memory files.
*   **Arbiter Strategy (GCP/Anthropic)**: Multi-provider LLM routing (Gemini 1.5/2.0 on GCP, Claude 3.5/3.7) controlled by the Rust gateway.
  - **Long-Horizon Memory**: Storing extracted facts and context from `autoMode` sessions.
  - **Dynamic Settings**: Merchant-specific admin overrides and M3 design tokens.
  - **Trace Logs**: Unstructured execution logs from background agent runs.

### C. Redis (The "OmniRouter")
- **Technology**: Redis.
- **Role**: Real-time concurrency and messaging.
  - Job Queueing for the background fleet.
  - Caching LLM responses to reduce token costs.
  - Real-time Pub/Sub for UI updates in the Command Center.

---

## 3. The Fleet (Scaling & Deployment)

| Component | Technology | Logic |
| :--- | :--- | :--- |
| **Containerization** | **Docker** | Isolated environments for each agent execution to prevent host leakage. |
| **Orchestration** | **Kubernetes (K8s)** | Managing the 100,000+ agent fleet scaling (Phase 7). |
| **Execution** | **Firecracker/Wasm** | (Planned) For near-instant agent spin-up and sandbox isolation. |

---

## 4. Agent Intelligence (ZAP Arbiter)

- **Foundation Models**: Multi-provider strategy via `Arbiter` (Anthropic Opus/Sonnet, Google Gemini Pro/Flash, OpenAI GPT-4o).
- **Embedded Reasoning**: Test-Time Recursive Thinking (TRT) implemented at the Rust runtime layer for self-correcting loops.

---

## 5. Security & Governance

- **Sandbox Integrity**: EPERM-safe local file-vfs for restricted workspace access.
- **Permission Hooks**: Rust-native `PreToolUse` / `PostToolUse` interception pipeline.
- **Audit Trails**: Every command execution is hashed and logged to the Ticket Registry (Postgres).

---

> [!IMPORTANT]
> **Next Step**: We are now prioritizing the **Rust Core** implementation of the **KAIROS Daemon** (Phase 2A), which will serve as the heartbeat for this entire stack.
