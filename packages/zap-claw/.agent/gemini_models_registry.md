# ⚡ Gemini Models Registry (ZAP Olympus System)

> **Master Database for Omni-Router & Agent Inspector UI**
> This file acts as the single source of truth for all LLM checkpoints. The ZAP Swarm backend parses this markdown registry to populate model selection dropdowns, trigger keyword-based routing, and manage active/inactive deprecations.

---

## 🟢 ACTIVE MODELS

### Gemini 3.1 Pro
- **API Identifier:** `gemini-3.1-pro-preview`
- **Official Description:** Advanced intelligence, complex problem-solving skills, and powerful agentic and vibe coding capabilities.
- **Infrastructure Strategy:** Primary Core (C_PRECISION). The undisputed heavy lifter for Spike (Builder) and Jerry (Chief of Staff). Used internally for code generation, architectural decisions, and tasks requiring zero hallucination tolerance.
- **Tags / Keywords:** `coding`, `agentic`, `vibe-coding`, `complex-logic`, `spike`, `jerry`, `core-reasoning`
- **Status:** `ACTIVE`

### Gemini 3 Flash
- **API Identifier:** `gemini-3-flash-preview`
- **Official Description:** Frontier-class performance rivaling larger models at a fraction of the cost.
- **Infrastructure Strategy:** Workforce Tier (A_ECONOMIC). Executing the vast majority of our swarm monitoring, log parsing, and state validation. Maximum efficiency for repetitive intelligence.
- **Tags / Keywords:** `workforce`, `high-velocity`, `telemetry`, `log-parsing`, `cheap`, `fast`
- **Status:** `ACTIVE`

### Gemini 3.1 Flash-Lite
- **API Identifier:** `gemini-3.1-flash-lite-preview`
- **Official Description:** Frontier-class performance rivaling larger models at a fraction of the cost.
- **Infrastructure Strategy:** Scout Tier (Budget). Used for extreme high-volume micro-tasks, preliminary data triage, and superficial metadata tagging before triggering heavy models.
- **Tags / Keywords:** `micro-tasks`, `budget`, `triage`, `metadata`, `sorting`
- **Status:** `ACTIVE`

### Gemini Experimental Long Context (4M)
- **API Identifier:** `gemini-2.5-pro` *(or equivalent 4M context fallback)*
- **Official Description:** Advanced model featuring deep reasoning and expanded multi-million token context windows.
- **Infrastructure Strategy:** Heartbeat & Memory Engine. Used strictly for sweeping historical analysis, ingesting massive logs, and maintaining the continuous `Heartbeat` protocol for agents without losing thread continuity over weeks of uptime.
- **Tags / Keywords:** `4m-context`, `long-context`, `heartbeat`, `infinite-memory`, `log-ingestion`
- **Status:** `ACTIVE`

### Nano Banana 2
- **API Identifier:** `gemini-3.1-flash-image-preview`
- **Official Description:** Powerful, high-efficiency image generation and editing, optimized for speed and high-volume use cases.
- **Infrastructure Strategy:** Design Engine Assets. Used by our UI agents (or Spike) to rapidly spawn structural placeholders, icons, UI components, and fast visual context.
- **Tags / Keywords:** `image-generation`, `fast-visuals`, `ui-mockups`, `placeholders`, `banana`
- **Status:** `ACTIVE`

### Nano Banana Pro
- **API Identifier:** `gemini-3-pro-image-preview`
- **Official Description:** State-of-the-art image generation and editing models for highly contextual native image creation.
- **Infrastructure Strategy:** Presentation & High-Fidelity. Used when we need pixel-perfect 4K imagery, complex lighting, or final production assets for the shell.
- **Tags / Keywords:** `4k-visuals`, `production-art`, `high-fidelity`, `complex-lighting`, `banana-pro`
- **Status:** `ACTIVE`

### Veo 3.1
- **API Identifier:** `veo-3.1-generate-preview`
- **Official Description:** State-of-the-art cinematic video generation with advanced creative controls and natively synchronized audio.
- **Infrastructure Strategy:** Swarm Marketing & Demos. Embedded to allow the generation of seamless B-roll, product walk-throughs, and dynamic visual state representations directly from code or text prompts.
- **Tags / Keywords:** `video-generation`, `cinematic`, `b-roll`, `synchronized-audio`, `veo`
- **Status:** `ACTIVE`

### Gemini Embedding 2
- **API Identifier:** `gemini-embedding-2-preview`
- **Official Description:** Our first multimodal embedding model, mapping text, images, video, audio, and PDFs into a unified embedding space for advanced semantic search and RAG systems.
- **Infrastructure Strategy:** ZAP RAG & Memory Cortex. Used unconditionally for mapping all agent conversations, artifact storage, and codebase queries into our vector space to guarantee instant semantic search capabilities.
- **Tags / Keywords:** `embeddings`, `rag`, `semantic-search`, `vector-mapping`, `multimodal-rag`, `memory-cortex`
- **Status:** `ACTIVE`

### Gemini 3.1 Flash Live
- **API Identifier:** `gemini-3.1-flash-live-preview`
- **Official Description:** High-quality, low-latency Live API model for real-time dialogue and voice-first AI applications.
- **Infrastructure Strategy:** Swarm Command Voice Layer. The literal voice of the system for Phase 10 interactive WebSocket audio streaming when you interrogate the dashboard.
- **Tags / Keywords:** `live-api`, `voice`, `real-time-audio`, `websocket`, `speech`
- **Status:** `ACTIVE`

### Deep Research Agent
- **API Identifier:** `deep-research-pro-preview-12-2025`
- **Official Description:** An agentic model that autonomously plans and executes multi-step research across hundreds of sources to produce cited, interactive reports.
- **Infrastructure Strategy:** Athena's Core Engine. When Spike needs new external framework documentation, this model is deployed into the wild to return finalized JSON schemas and cited MDs.
- **Tags / Keywords:** `deep-research`, `autonomous`, `multi-step`, `cited-reports`, `athena`
- **Status:** `ACTIVE`

### Computer Use
- **API Identifier:** `gemini-2.5-computer-use-preview-10-2025`
- **Official Description:** A specialized model that can "see" a digital screen and perform UI actions like clicking, typing, and navigating.
- **Infrastructure Strategy:** Automated E2E Testing. Given to our dev-browser sub-agents to physically drive the localhost DOM to verify state integrity when unit tests fall short.
- **Tags / Keywords:** `computer-use`, `browser-automation`, `e2e-testing`, `click-typing`, `playwright-agent`
- **Status:** `ACTIVE`

---

## 🔴 INACTIVE / DEPRECATED MODELS

### Gemini 2.0 Flash (Deprecated)
- **API Identifier:** `gemini-2.0-flash`
- **Official Description:** Our second generation workhorse model.
- **Infrastructure Strategy:** Superceded by `gemini-3-flash-preview`. Deprecated to avoid unnecessary latency vs cost ratios.
- **Tags / Keywords:** `deprecated`, `legacy-workhorse`, `gemini-2`
- **Status:** `INACTIVE`

### Gemini 3 Pro Preview (Shut Down)
- **API Identifier:** `gemini-3-pro-preview`
- **Official Description:** Our state-of-the-art reasoning model.
- **Infrastructure Strategy:** Superceded by `gemini-3.1-pro-preview`. Endpoint terminated by Google.
- **Tags / Keywords:** `shut-down`, `deprecated`, `legacy-reasoning`
- **Status:** `INACTIVE`
