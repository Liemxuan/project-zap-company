# SOP-014-FLEET_ARBITRAGE_PROTOCOL

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** B.L.A.S.T. 014

---

## 1. Context & Purpose

This standard operating procedure mandates the technical rules and client-facing processes for the Gemini Fleet Arbitrage system. Its primary purpose is to ensure Olympus extracts infinite margin from the $250/m Gemini Ultra flat-rate by routing 95% of workloads to zero-cost, high-speed models (Flash) and strictly protecting asynchronous compute (Pro) without throwing errors to clients.

This document serves as the operational source of truth for ZAP Internal Staff integrating the OmniRouter, and dictates the Public/Merchant SLAs (Service Level Agreements) for interaction with the Gateway.

## 2. Core Business Strategy

The Olympus API gateway masks the complexity of the Gemini model constellation. The arbitrage relies entirely on correct classification of the payload so we do not burn expensive API limits on simple tasks.

- **Zero-Margin Burn:** Under no circumstances should simple chat queries or raw UI parsing hit Gemini 2.5 Pro or higher. They must be routed to Flash or Flash Lite.
- **Failover Tolerance:** If a premium model fails or rate-limits, the system must gracefully degrade (e.g., fallback to Gemini 3 Flash Preview). 500 server errors are unacceptable.

## 3. The Modality-Specific Multi-Queue architecture (Internal)

To manage this, all requests to the OmniRouter are forced into the **OmniQueue** backed by MongoDB. Staff must route payloads into these specific queue assignments based on their characteristics:

### 3.1 Priority 0: Real-Time / Fast Chat

- **Models Used:** Gemini 2.5 Flash, Gemini 3 Flash Preview, Gemini Flash Audio.
- **SLA:** Sub-second latency.
- **Use Cases:** Direct mobile voice communication, quick customer support, immediate UI generation snippets.

### 3.2 Priority 1: Vision / Pre-Processing

- **Models Used:** Nano Banana 2 (via Ollama) -> Fallback: Gemini Pro Vision.
- **SLA:** 1-3 seconds.
- **Use Cases:** Image recognition, snapshot ingestion, document OCR.

### 3.3 Priority 2: Security & Janitorial

- **Models Used:** Gemini 2.5 Flash Lite.
- **SLA:** Sub-400ms.
- **Use Cases:** The "Janitor Pipeline". All untrusted text, RAG payloads, and potential prompt injection vectors *must* pass through this queue first. The payload must be neutralized before being allowed back onto the main logic bus.

### 3.4 Priority 3: Async Heavy / Deep Council

- **Models Used:** Gemini 2.5 Pro, Deep Research Pro.
- **SLA:** 10 minutes to 1 hour+.
- **Use Cases:** Massive codebase refactoring, enterprise architectural audits, intensive competitive research.

## 4. Deep Reasoner Client UX (Public/Merchant-Facing)

Because Priority 3 (Async Heavy tasks) take significant API spin-up time and algorithmic processing, we **must never block the client's screen or freeze the UI**.

All frontends, agents, and client portals interfacing with the Deep Reasoner MUST implement the Async Loop Pattern:

1. **Immediate Acknowledgment:** The Gateway receives the payload and instantly responds with a **Case ID** (Job ID string).
2. **Client Freedom Notification:** The client interface must display language similar to: *"Your case [Case ID] is being processed by the system. This will take time. You may leave this screen."*
3. **Unbound App:** The user must be free to navigate the rest of the application or close it entirely.
4. **Active Interruption:** Once the OmniQueue worker completes the task, the server explicitly interrupts the client via a WebSocket event, push notification, or email trigger stating the Case ID is resolved and results are ready.

## 5. Security & Prompt Injection Protocol

No raw data interacts with a high-tier reasoning model directly. All RAG documents uploaded by merchants or scraped from external domains must be sandboxed.

- If a prompt injection is detected by the Priority 2 Flash Lite Janitor (which flags with the word `DANGER`), the OmniRouter must aggressively kill the job and lock out the payload from the OLYMPUS execution context.
