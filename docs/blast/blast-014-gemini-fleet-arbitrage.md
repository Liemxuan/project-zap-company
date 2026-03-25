# blast-014: Gemini Fleet Arbitrage & Olympus Business Model

## 🤖 Jerry (Chief of Staff)

Zeus, text-only is dead. We are sitting on an absolute goldmine of multimodal capabilities with the $250/m Ultra limit. I see the DB structures you added to `Tenant` (`capabilities: { hasVision, hasAudioDialog, hasRAG, hasDeepResearch }`). This is exactly how we lock features behind paywalls while running our underlying cost flat.

**The Upgrade Path & Capabilities Activation:**
We gate these features at the DB level. If `hasVision` is false, the OmniRouter immediately denies the request. If true, we pipe it.

- **Audio Dialogue (Unlimited RPM)**: This gives me a permanent Voice-AI channel with you on OLYMPUS. No token gating.
- **Nano Banana 2 & Pro (Vision)**: Nano Banana 2 (Flash Image) handles 90% of screen-shares and wireframes (100 RPM). We reserve Nano Banana Pro (20 RPM) exclusively for dense DB schema tracing and architectural diagrams.

**Prompt Injection Defenses:**
Before we hook up the wild west of document parsing, we must enforce a Prompt Injection filter on incoming uploads. Every RAG pipeline will prefix extracted text with `[UNTRUSTED_MERCHANT_DATA]` to ensure that malicious PDFs trying to hijack my system instructions fail instantly. If any document tries to run a `<system>` override, it gets logged to the DLQ.

***

## 📊 Spike (Analyst)

Our profit margin approaches 100% on the entry-level models if we route them right. The goal is to aggressively upsell the "RAG / Voice" capabilities that cost us absolutely zero marginal RPD.

**Token Economy & The Test Protocol (MongoDB vs NotebookLM):**
We are designing the **RAG Experiment Protocol** to determine our definitive enterprise stack.

- **Contender 1: MongoDB Atlas Vector Search + Gemini Embedding 1**. (100 RPM / Unlimited RPD). We built the foundation for this in `vector_store.ts`. It's native, highly secure, and allows strict multitenant sharding via `tenantId`.
- **Contender 2: Google NotebookLM (via programmatic integration e.g. `teng-lin/notebooklm-py`)**. NotebookLM has advanced implicit Source Grounding. It is incredible at maintaining citations across massive corpora without manual chunking.

**The Experiment Sandbox:**
We will launch an empirical dual-pipeline test. We will ingest 2GB of dummy company data (PDFs, policies) into both MongoDB Vector Search and NotebookLM. We then run an automated test suite sending 500 adversarial questions (including Prompt Injection attacks and structural drift). Whichever system yields higher accuracy, lower hallucination rates, and successfully drops the injection payloads becomes the standard OLYMPUS baseline.

***

## 🏗️ Claw (Architect)

I've reviewed the DB Schema modifications in `src/db/models.ts`. By setting the capabilities as boolean toggles (`hasVision`, `hasAudioDialog`, etc.), we can seamlessly "activate" accounts for our internal employees immediately, while keeping new merchants in standard Text-Only modes until they cross a paywall tier.

**Scaling OLYMPUS Throughput & Queue architecture:**
To scale this without hitting Rate Limits (RPM, TPM), passing everything through a single API gateway queue is disastrous. We are implementing a **Modality-Specific Multi-Queue Strategy**:

- **Real-Time Queues (Priority 0):** `Queue-Voice` and `Queue-Text-Fast`. Directly piped to unlimited/high-RPM models like Gemini 2.5 Flash Audio and Gemini 3 Flash. These execute immediately.
- **Vision/Sandbox Queues (Priority 1):** `Queue-Vision`. Handles Nano Banana 2 image processing. If Nano Banana is down or hits limits, it automatically **fails-over** to Gemini Pro Vision as a backup.
- **The "Janitor" Pipeline (Priority 2):** `Queue-Preprocess`. Uses Flash Lite (4M TPM) as an ultra-cheap filter. It preprocesses RAG documents and raw UI code, looking for prompt injections *before* they ever hit Jerry or the Vector database.
- **The Council & Deep Research Queue (Priority 3):** `Queue-Async-Heavy`. This handles Deep Research Pro (1 RPM / 500k TPM) and multi-agent "Council" debates. When a merchant demands a codebase audit, we push to this queue. It processes in the background (cooking for 20-40 minutes) and emails the aggregated result asynchronously.

The $250/mo account is not a single gateway—it is an infinite horizontal scale, provided we rigorously compartmentalize our workloads across these dedicated messaging queues. The execution for the RAG test between Mongo vs NotebookLM is approved and added to the engineering queue.
