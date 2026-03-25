# EXP-003: Recursive Language Model (RLM) Strategy

## Overview
The Recursive Language Model (RLM) is not a new foundation model, but rather a wrapper architecture designed to eliminate "context rot" when dealing with massive datasets (e.g., 10,000+ unstructured documents, massive codebase analysis, heavy log parsing).

### The Problem it Solves
Standard approaches stuff the entire dataset into the LLM's context window. Even with models supporting 1M+ tokens, attention degradation occurs. The model loses details, hallucination spikes, and context cost skyrockets.

### The RLM Mechanism
Instead of providing the data as raw text in the prompt, the RLM architecture operates as a **Developer loop**:
1.  **The Environment:** The LLM is given access to a secure Python REPL (e.g., a sandbox container).
2.  **The Payload:** The massive dataset is loaded into the REPL memory as a variable (e.g., `context_data`).
3.  **The Prompt:** The LLM is instructed: *"You have a Python notebook. A massive dataset is in memory. Explore it, write code to chunk it, and call copies of yourself on the smaller chunks."*
4.  **Execution:** 
    * The LLM writes Python to sample the data (`print(context_data[:1000])`).
    * It writes regex or filtering logic to isolate relevant sections.
    * It splits the data into byte-sized, easily digestible chunks.
    * **The Recursive Step:** Through the REPL, the LLM fires off localized API calls to new, identically-prompted instances of itself, passing *only* the small chunk.

### Why It Excels
*   **Zero Context Rot:** The parent model never sees the million tokens. The child models only see targeted 5k-10k token slices where their attention mechanism is mathematically flawless.
*   **Cost Efficiency:** Using a much smaller, cheaper model (like Gemini 2.5 Flash or GPT-4o Mini) recursively outperforms monolithic models (like Claude Opus) on massive context, at a fraction of the cost.

---

## Strategic Implementation in ZAP Claw

Currently, ZAP Claw operates three lanes: Serialized (Chat), Arbitrage (Fallback), and Autonomous (Cron). 

The RLM strategy perfectly maps to an evolution of the **Autonomous Lane**.

### The Future "RLM Lane" architecture
If we were to implement this in a future B.L.A.S.T. session, the architecture would look like this:

1.  **The Sandbox Service:** We would spin up a secure, isolated Python execution environment (potentially using Docker or a lightweight WASM runtime like Pyodide depending on data sensitivity).
2.  **The Data Ingestor:** When a super-massive task enters the `SYS_OS_tasks` queue (e.g., "Analyze the last 5 years of PHO24 sales data and find the correlation between rain and Pho sales"), the Data Ingestor loads the JSON/CSV into the Sandbox.
3.  **The RLM Supervisor (`Ralph`):** We deploy `Ralph` (our fully autonomous `gemini-2.5-flash` agent). Ralph's system prompt is altered entirely:
    *   *You are the RLM Supervisor. You have access to a Python Sandbox tool. The target data is loaded in `target_data`. Write code to chunk this data. For each chunk, use the `spawn_sub_agent` tool to classify/analyze it. Aggregate the results and write the final report.*
4.  **The Sub-Agents:** The `spawn_sub_agent` tool simply executes the standard `serialized_lane.ts` (with Prompt Caching enabled!), creating a beautiful synthesis of Phase 12 (Caching) and Phase 13 (RLM).

### Conclusion for Current Scope
**DO NOT IMPLEMENT NOW.** 
This is an advanced scale-out strategy. We must first perfect our Prompt Caching (Phase 12) so that when the RLM *does* recursively call sub-agents 1,000 times, those 1,000 calls are >90% cached and cost $0.0001 instead of $1.00.
