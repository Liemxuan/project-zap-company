# SOP-036-GEMINI-MODEL-FLEET-MAPPING

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** OMNIROUTER-FLEET

---

## 1. Context & Purpose

This document strictly governs the model routing logic for the Olympus OmniRouter fleet. We operate on a 100% Google Gemini foundation. OpenRouter endpoints and third-party APIs are explicitly unauthorized for primary agent execution and MUST ONLY be triggered under strict Fallback/429 protocols. The objective is to maximize raw agentic intelligence where required while brutally suppressing token bloat and executing cost-efficient extraction via our flash-tier matrices.

## 2. The Agent Routing Matrix

### 2.1 Zeus / The Arbiter (The Orchestrator)

- **Target Model:** `gemini-3.1-pro-preview`
- **Mandate:** The Arbiter computes raw intent, makes architectural system decisions, and delegates logic to sub-agents. It requires maximum agentic delegation logic and reasoning. Stable `2.5-pro` is authorized if preview volatility disrupts core pipelines.

### 2.2 Spike (The Structural Builder / Coder)

- **Target Model (Heavy Build / Refactors):** `gemini-3.1-pro-preview`
- **Target Model (Rapid Component Slicing):** `gemini-3-flash-preview`
- **Mandate:** Spike manages ZAP Design Engine implementation, React atomic slicing, and M3 design token mapping. You must utilize 3.1 Pro's "vibe coding capabilities" for macro-architectural changes, dropping to 3 Flash strictly when writing rote structural React boilerplate.

### 2.3 Jerry (The Watchdog / Validator)

- **Target Model:** `gemini-2.5-flash` or `gemini-3.1-flash-lite-preview`
- **Mandate:** The DLQ (Dead Letter Queue) Watchdog enforces the 12-factor rules and compliance checks at a high velocity loop. Never waste Pro tokens on validation checks. Jerry requires raw speed and low latency.

### 2.4 Playwright & Browser Automation

- **Target Model:** `gemini-2.5-computer-use-preview-10-2025`
- **Mandate:** End-to-end user flows MUST use Google's native computer reasoning model. Do not deploy brittle DOM selectors through standard flash models.

### 2.5 High Order ZAP Audits

- **Target Model:** `deep-research-pro-preview-12-2025`
- **Mandate:** Generating structural diffs across multiple specification documents requires complex multi-step research. All documentation audits must be bypassed into the Deep Research agent.

### 2.6 Multimedia Generation (Website Build Assets)

- **Image Generation Target:** `gemini-3.1-flash-image-preview` (Nano Banana 2) or `gemini-3-pro-image-preview` (Nano Banana Pro)
- **Video Generation Target:** `veo-3.1-generate-preview` (Veo 3.1)
- **Mandate:** Premium UI generation is non-negotiable. When Spike operates to construct websites, it must spawn instances of the Nano Banana variants to dynamically generate context-aware placeholder images, icons, or high-fidelity SVGs. If the prompt dictates cinematic or motion backgrounds, the swarm MUST hand off the rendering logic to Veo 3.1 for natively synchronized MP4 outputs. Do not rely on external CDN placeholders if an atomic generation is explicitly requested.

## 3. Semantic Vector Operations (Titan Memory)

### 3.1 Embedding Extraction

- **Target Model:** `gemini-embedding-2-preview` (Native GoogleGenAI SDK)
- **Mandate:** The OpenAI wrapper is dead. Vectors are processed strictly natively via LangChain's `@langchain/google-genai` integration. Embedding 2 provides multimodal dimension mapping, meaning all `/tmp/zap-assets` (Telegram media) MUST be embedded directly into ChromaDB for semantic search. No manual Base64 stringification.

## 4. Operational Requirements

1. **No Assumption Overrides:** Do not test models in production outside this specification.
2. **Absolute Hardcoding Avoidance:** All model invocations MUST pull from `process.env` tiered strings distributed by `omni_router.ts` load balancing. Do not inline `gemini-3.1-pro` into stray scripts.
3. **Continuous Rotation:** If preview iterations enter sunset limits, automatically downgrade to nearest `-latest` stable release (e.g., `gemini-2.5-flash`).
