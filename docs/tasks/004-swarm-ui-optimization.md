# Protocol 004: ZAP Swarm UI Performance Optimization

**Initiative:** Swarm Command Center Scale-Up
**Vibe/Context:** High-density, real-time command center telemetry. Cannot afford stale data, cannot afford blocking hydration.
**Status:** GAME PLAN - TRACKING INITIALIZED

---

## 🚦 B.L.A.S.T. Execution Plan

### B - Blueprint (The Game Plan)

Scale the Command Center by decoupling heavy static shells from real-time live data queries.

- **Rule 1:** Static layout shells (`layout.tsx`, navigation, headers) are edge-cached.
- **Rule 2:** Aggregate database queries (tokens, spending) use async Cron Jobs (Materialized Views) rather than per-user runtime aggregations.
- **Rule 3:** Live heartbeat data uses polling SWR (Stale-While-Revalidate) or SSE (Server-Sent Events) at the atomic component layer, leaving the page root completely static.

### L - Link (API Data Layer)

Connect client-side components directly to isolated Next.js `/api/*` endpoints with caching headers rather than relying on massive Server Component props injections.

### A - Architect (7-Level Breakdown)

- **Region** (Dashboards): Cache 100% of the Page boundaries.
- **Organism** (Data Tables): Cache standard lists.
- **Atom** (Status Badges/Claw Heartbeat): 100% Client-side fetched with `useSWR` for real-time reactivity.

### S - Stylize (UX Fallbacks)

Ensure that all live-polling atoms have strict M3 standard Skeleton loaders that match exact dimensions to prevent layout shifting when the heartbeat hook fires.

### T - Trigger (Tracking Database)

Below is the definitive optimization tracking table (our MD Database). We will measure baseline speeds against post-optimization hydration times.

---

## 🗄️ Optimization Tracking Database

| Page | Scope | Current Render | Target TTI | Cache Strategy | Status | Validation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Swarm Dashboard** (`/`) | Core Telemetry, Claw Heartbeat | 1.2s | < 500ms | 5s SWR Edge Shell + Atomic SSE Heartbeat | VERIFIED | [x] |
| **Agents / Fleet** (`/agents`) | Active Agents Registry, Role Tags | 1.4s | < 400ms | 1hr Edge Registry + 3s SWR Status Check | VERIFIED | [x] |
| **Active Sessions** (`/sessions`) | Session Conversational State | 1.5s | < 300ms | 1s Redis TTL state memory buffer | VERIFIED | [x] |
| **Channels** (`/channels`) | OmniRouter Channels | 2.5s | < 500ms | 24hr Edge Cache + Admin On-Demand Revalidation | VERIFIED | [x] |
| **Cost Intelligence** (`/cost`) | Prompt/Completion Analytics | 1.8s | < 800ms | 5m Backend Cron Materialized Views in Redis | VERIFIED | [x] |
| **Execution Traces** (`/history`) | JSON Log Output, Trace Search | 2.1s | < 600ms | Infinite Historical Cache + 5s polling for Page 1 | VERIFIED | [x] |
| **Security & Ops** (`/security`) | ZSS Intercepts, Payload Audits | 1.3s | < 500ms | No Cache. Direct Indexed DB Hit. | VERIFIED | [x] |
| **Skills & Deerflow** (`/skills`) | MCP Tools Matrix | 1.5s | < 300ms | Infinite Edge Cache + Webhook Revalidation | VERIFIED | [x] |
