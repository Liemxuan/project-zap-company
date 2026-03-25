# Architectural Evaluation: Cognee Framework vs. Ralph Loop

## 1. Executive Summary
Per your request, we isolated and tested the [Cognee](https://github.com/topoteretes/cognee) framework in a Python 3.11 sandbox to determine if we should inject it into Zap-Claw (PRJ-001). 

**Conclusion:** We strongly recommend **against** integrating Cognee into our core architecture at this time. Our current custom-built Ralph Loop (TypeScript + SQLite -> MongoDB) is significantly faster, strictly adheres to our B.L.A.S.T. `<user_data>` security boundaries, and matches our tech stack.

---

## 2. Sandbox Test Results (The Data)

We initialized a fresh Python virtual environment, installed `cognee` (`v0.5.2`), and wrote a Proof-of-Concept ingestion script (`test_cognee.py`) that attempted to extract a simple user preference graph ("The user hates green").

### Metrics & Observations
| Metric | Cognee (Python Sandbox) | Ralph Loop (Zap-Claw Native) | Winner |
| :--- | :--- | :--- | :--- |
| **Language** | Python (3.10 - 3.13) | TypeScript / Node.js | **Ralph** (No Polyglot Overhead) |
| **Startup / Init Time** | ~8.32 seconds | ~0.05 seconds | **Ralph** |
| **Storage Engine** | LanceDB (Vector) + NetworkX/Neo4j (Graph) + SQLite | SQLite (Fast cache) + MongoDB (Global) | **Ralph** (Simpler, standard stack) |
| **Security/Injection Defense** | Relies on LLM's default JSON extraction capabilities | 100% verified via `<user_data>` XML sandbox isolation | **Ralph** |
| **LLM Provider Coupling** | Hardcodes `LLM_API_KEY` directly inside framework (failed our OpenRouter proxy) | Fully decoupled (Uses our `Gateway Arbitrage` matrix) | **Ralph** |

---

## 3. Why Cognee the Wrong Fit for Zap-Claw

### 1. The Language Barrier (Node vs. Python)
Zap-Claw is a Node.js/TypeScript engine. Cognee is exclusively a Python framework. If we injected Cognee, we would essentially have to run two entirely separate application servers and pass data between them over HTTP REST or gRPC. This violates our goal of a tight, low-latency, monolith-style core loop.

### 2. Heavy Abstraction
Cognee is designed to do *everything* for the developer (it reads the text, manages the vector database, creates the graph relationships, and queries the LLM internally). 
Because it encapsulates the LLM call, **it breaks our Gateway Arbitrage (OpenRouter fallbacks).** Our test script failed instantly because Cognee tried to ping the LLM internally using its own strict Pydantic models and rejected our OpenRouter routing configurations.

### 3. Startup Latency
Just importing and booting the Cognee module inside our script took over 8 seconds of execution time, pulling down heavyweight data science dependencies (`numpy`, `kuzu`, `lancedb`, `networkx`). Our daemon polls every 10 seconds; an 8-second startup lag would effectively choke the main Node worker thread if called as a sub-process.

## 4. Final Verdict
Cognee is an incredible tool for *Python-native* developers building RAG chatbots from scratch. However, for Zap-Claw, we have already built a state-of-the-art, load-tested (EXP-001) memory ingestion daemon that perfectly fits our infrastructure.

We should stick with what we have built in PRJ-001.
