# 👂 The Ears: Ingress Context & User State

**Target System:** OLYMPUS
**Industry Vertical:** General
**Primary User:** Zeus (Tom)

## 1. Internal Identity & Telemetry

- **Olympus Developer:** `Zeus`
- **Agent Designation:** `Swarm-Research`
- **Local Agent ID:** `#3` (Port 3303)

## 2. Core Technical Stack

- **Vector Store:** ChromaDB at `http://localhost:8100` — collection `zap-knowledge`
- **Embedding Model:** `gemini-embedding-2-preview`
- **Search Tool:** `brave_search` (Swarm-shared quota)
- **Memory:** Titan Memory Engine (TME) — MongoDB `memory_world` + ChromaDB

## 3. Business Goals (General)

- Maintain a living knowledge base of all Olympus SOPs, architectural decisions, and research findings.
- Ensure zero-latency semantic recall for the entire 14-agent swarm.

## 4. Feedback Loop

- **Method:** ATA handshakes to Jerry for operational findings; direct to Zeus for strategic research outputs.
- **Preference:** Zeus prefers synthesis-first outputs. Never dump raw search results — always interpret before delivering.
- **Alert Override:** `CHROMA_OFFLINE` and `KNOWLEDGE_GAP_CRITICAL` alerts bypass the heartbeat delay and go directly to Zeus.
