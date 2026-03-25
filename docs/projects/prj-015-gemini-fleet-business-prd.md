# PRD: Gemini Fleet Arbitrage & Olympus Business Model

## 1. Executive Summary

This document outlines the strategic integration of the $250/mo Gemini Ultra account into the **OLYMPUS Gateway**. By intelligently routing payloads via the OmniRouter based on modality (Text, Vision, Audio, RAG) and applying a Modality-Specific Multi-Queue architecture, we can effectively resell this capacity to internal employees and external merchants at near 100% margin.

## 2. Business Objectives

- **Zero Marginal Cost Services:** Leverage models with unlimited or astronomically high rate limits (Audio Dialog, Gemini Flash lines) to provide 24/7 Voice AI and Chat AI to users with zero variable cost increase.
- **Premium Upselling:** Lock scarce, high-tier models (Gemini 3 Pro, Deep Research) behind premium merchant tiers using DB-level constraint flags.
- **Unified Gateway Control:** Ensure all traffic passes through a unified API that handles queue prioritization, prompt injection defenses, and rate-limit compartmentalization.

## 3. Product Features & Capabilities

### 3.1 Tiered DB Capability Flags

The `Tenant` model in MongoDB is now upgraded to include specific boolean locks:

- `hasVision`: Gates access to Nano Banana Image models.
- `hasAudioDialog`: Gates access to real-time WebRTC Voice pipelines.
- `hasRAG`: Gates access to the Vector Database / NotebookLM pipelines.
- `hasDeepResearch`: Gates access to the async, high-latency competitive analysis models.

### 3.2 Modality-Specific Multi-Queue architecture

Single-queue gateways fail under high volume. OLYMPUS will deploy a prioritized queue matrix:

- **Priority 0 (Real-Time Voice/Fast Text):** Directly piped to unlimited/high-RPM models (Gemini 2.5 Flash Audio, Gemini 3 Flash).
- **Priority 1 (Vision/Sandbox):** Handles Nano Banana 2 image processing. Fails over to Gemini Pro Vision if limits are hit.
- **Priority 2 (The Janitor Pipeline):** Uses Flash Lite (4M TPM) as a pre-processor to scrub raw UI code and RAG uploads for prompt injections.
- **Priority 3 (Async Council / Deep Research):** Processes heavy architectural audits via Deep Research Pro (1 RPM / 500k TPM) in the background (cooking for 20-40 minutes) and emails merchants the result.

### 3.3 Deep Reasoner Client UX (Async Loop)

Heavy async tasks (Priority 3) must never block the client interface. The explicit UX loop is as follows:

1. **Immediate Acknowledgment:** When a query targets the Deep Reasoner, the Gateway immediately returns a **Case ID** (e.g., `Job ID`).
2. **Client Freedom:** The UI notifies the user: *"Your case [Case ID] is being processed by the Council. This takes time. Feel free to leave this screen."*
3. **Background Loop:** The OmniQueue processes the task safely in the background, retrying if necessary.
4. **Client Interruption:** Once completed, the system explicitly interrupts the user via websocket, push notification, or an in-app toast, delivering the result and allowing them to take the next action.

## 4. RAG Experiment Protocol: MongoDB vs NotebookLM

### 4.1 The Challenge

We must determine the optimal stack for Enterprise RAG (Retrieval-Augmented Generation).

- **Option A (MongoDB Vector Search):** Employs `Gemini Embedding 1` mapping directly to Atlas Vector indices. Native, highly secure, and allows strict multitenant sharding via `tenantId`.
- **Option B (NotebookLM Integration):** Employs programmatic bridging (e.g., `teng-lin/notebooklm-py`) to leverage Google's implicit Source Grounding. Superior at maintaining citations across massive corpora without manual chunking.

### 4.2 Testing Methodology

1. **Data Ingestion:** Load 2GB of dummy corporate policies into both pipelines.
2. **Adversarial Testing:** Run an automated suite of 500 questions, including structural drift and prompt injection attempts.
3. **Evaluation Metrics:** Accuracy, hallucination rates, latency, and injection drop rate.
4. **Conclusion:** Whichever mechanism wins will become the standard baseline for the `hasRAG` flag feature.

## 5. Live Empirical Latency Report

We ran a live API test against the Gemini Fleet to validate our tiering strategy. The results confirm the "Flash Lite Preprocessor" model is viable due to its extreme speed:

| Model | Success | Latency (ms) | Output | Strategic Use Case |
| :--- | :---: | :---: | :--- | :--- |
| **Gemini 2.5 Flash Lite** | ✅ | 338ms | `READY` | Ultra-fast queue pre-processing; prompt-injection scanning. |
| **Gemini 2.5 Flash** | ✅ | 854ms | `READY` | Standard real-time chat; code formatting. |
| **Gemini 2.5 Pro** | ✅ | 2415ms | `READY` | Asynchronous heavy lifting; council tasks. |
| **Gemini 3.1 Pro Preview** | ✅ | 3204ms | `READY` | Extreme reasoning; long-context architectural rewrites. |

## 6. Enterprise Database Decision Matrix

To support the varying workloads of the OmniRouter and Mobile Clients, we divide data persistence conceptually based on business needs rather than using a single monolithic store.

| Technology | Scope | Core Business Uses | Why It Fits OLYMPUS |
| :--- | :--- | :--- | :--- |
| **MongoDB (Atlas)** | **Global & Vectors** | Tenant Configs, Semantic RAG, Multi-Tenant User Data | Its native `$vectorSearch` handles our raw `gemini-embedding-001` payload effortlessly. **⚠️ CRITICAL:** The new `gemini-embedding-001` model requires an index size of **3072 dimensions** (up from 768). Legacy 768-D MongoDB indices will silently fail and must be rebuilt before querying. |
| **PostgreSQL** | **Financials / Relational** | Billing, Subscription Tiers, Hard-locks | When locking capabilities like `hasVision` or processing the $250/m arbitrage billing, we need strict ACID compliance. The relational engine ensures 100% financial consistency across complex multi-tenant joins. |
| **SQLite (Mobile)** | **Edge Processing** | Offline-First Cache, Local App Preferences | On Zeus's mobile devices, SQLite caches temporary agent interaction history. It guarantees the mobile UI loads instantly (0-latency) even if the OmniRouter is fetching heavy data in the background. |
| **NotebookLM (Abstractions)** | **Specialized RAG** | Dynamic Citations, Infinite Corpus Querying | Instead of manually managing chunking strategies in MongoDB, NotebookLM handles source-grounding automatically via `notebooklm-py`. It acts as a specialized read-only endpoint exclusively for massive document Q&A pipelines. |

## 7. Pros and Cons

### Pros

- **Infinite Margins:** The fixed $250 API cost allows infinite reselling of the unlimited tiers (Audio, Flash).
- **Graceful Degradation:** The multi-queue failover ensures that if "Nano Banana" fails, the system auto-routes to a fallback vision model without throwing 500 errors to the client.
- **Robust Security:** Pre-processing via Flash Lite ensures all user-uploaded content is scrubbed for prompt injections before reaching the more gullible/powerful Pro models.

### Cons

- **Queue Complexity:** Standing up Priority 0-3 Queues requires heavy Redis/Kafka implementation work on the Node.js backend.
- **NotebookLM Fragility:** If we elect to use the NotebookLM programmatic abstraction, we risk API drift, as it is an undocumented API wrapper compared to native MongoDB vectors.
- **Latency on Heavy Requests:** Deep Research Pro operates asynchronously. Managing user expectations UX-wise (e.g., "Your report is generating...") will be crucial to avoid ticket spam.

## 8. Crew Execution & Arbitrage Demonstration

To validate the theoretical limits of the $250/m Ultra tier, Jerry, Spike, and Claw engineered `crew_fleet_demonstration.ts`. This script simulated a live production environment where three distinct business payloads hit the OmniRouter simultaneously:

1. **The Preprocessor (Priority 2):** Claw passed an untrusted, prompt-injected PDF payload into the queue. The engine successfully isolated it, routed it explicitly to **Gemini 2.5 Flash Lite**, and neutralized the threat by returning exactly `DANGER` in under 400ms without touching the costly models.
2. **The Customer Endpoint (Priority 0):** Jerry simulated a live mobile chat resolving a password reset. The engine routed it to **Gemini 2.5 Flash**, returning a conversational response globally in ~800ms.
3. **The Council / Async (Priority 3):** Spike simulated a massive architectural audit of the authentication system. The engine routed it to **Gemini 2.5 Pro**, chewing on it asynchronously in the background.

**Conclusion:** The Multi-Queue architecture properly scales the $250 flat-rate. By trapping 95% of queries (Janitorial operations, Chat) inside the "Unlimited" models and locking the 5% (Deep Reasoning) behind Pro, the Arbitrage model is solid.
