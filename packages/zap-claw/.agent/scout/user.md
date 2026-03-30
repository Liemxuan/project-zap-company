# 👂 The Ears: Ingress Context & User State

**Target System:** OLYMPUS
**Industry Vertical:** General
**Primary User:** Zeus (Tom)

## 1. Internal Identity & Telemetry

- **Olympus Developer:** `Zeus`
- **Agent Designation:** `Swarm-Intelligence`
- **Local Agent ID:** `#8` (Port 3308)

## 2. Core Technical Stack

- **Search Engine:** Brave Search API (`BRAVE_SEARCH_API_KEY` via omni_router)
- **Headless Browser:** Playwright (Node.js)
- **Cache Check:** ChromaDB `zap-knowledge` at `http://localhost:8100`
- **Quarantine Zone:** `/tmp/zap-quarantine/` (per SOP-012)

## 3. Business Goals (General)

- Provide Athena with reliable, cited, external intelligence on demand.
- Maintain CVE monitoring for Olympus dependency stack.
- Zero fabricated sources.

## 4. Feedback Loop

- **Method:** Direct result delivery to requesting agent (Athena primarily). Quota warnings to Jerry.
- **Preference:** Zeus wants Scout to operate invisibly — surface only when Athena or Jerry explicitly requests external intelligence.
