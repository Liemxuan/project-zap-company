# ZAP Olympus Project: Sovereign Registry

> [!IMPORTANT]
> This is the canonical source of truth for the ZAP Federation infrastructure. All port assignments and service mappings must align with this document.

## 🛡️ Sovereign Port Registry

### 1. Design & Genesis (L1-L7)
*   **Port 3000**: `zap design` — L1-L7 Genesis Component Library & Sandbox.

### 2. Point of Sale (POS) & Terminal
*   **Port 3100**: `pos terminal` — Primary transaction layer.
*   **Port 3200**: `kiosk` — Self-service terminal.
*   **Port 3300**: `web app` — Core ZAP web application.
*   **Port 3400**: `portal` — Management/Consumer portal.

### 3. Agent Intelligence & Workspace
*   **Port 3500**: **`zap ai`** — AI Workspace Hub.
*   **Port 3501**: **`merchant hub`** — AI-powered Merchant operations.

### 4. Swarm Orchestration (The Hub)
*   **Port 3600**: **Mission Control** — Global Swarm Dashboard & Job Dispatcher.
*   **Port 3800**: **Agent Swarm** — Real-time 14-agent Fleet Monitoring & Ticks.
*   **Port 3999**: **Master Harness (Rust)** — High-performance SSE Telemetry Gateway.

### 5. Admin & Infrastructure
*   **Port 4100**: `settings` — Global Configuration.
*   **Port 4200**: `reports` — Analytics & Data Visualization.
*   **Port 4500**: `infrastructure` — System Health & Fleet Metrics.
*   **Port 4600**: `zap-db` — Database Visualizer.

### 6. Human & Identity
*   **Port 4700**: **`zap auth`** — Sovereign Identity & SSO.

### 7. References
*   **Port 5000**: `zap legacy` — Legacy codebase reference.
*   **Port 6000**: `metronic` — Metronic structural reference.

---

## 🏛️ Database Infrastructure (Tri-Vault)
*   **PostgreSQL (5432)**: Sovereign Persistence (Sessions, Jobs, Tickets).
*   **Redis (6379)**: Hybrid Cache & Job Queue (Ticks, State-Leaps).
*   **ChromaDB (8000)**: Vector Memory & AST Semantic Index.
*   **MongoDB**: ZAP Admin Settings & Omni-Tier Tenancy.

---

## 🛰️ 14-Agent Fleet Status
*   **Agent 1 (Jerry)**: Watchdog / Security.
*   **Agent 2 (Spike)**: Structural Builder.
*   **Agent 3 (Ralph)**: Deployment / Sync.
*   **Status**: ACTIVE (Polling via `kairosd` on Port 3999).
