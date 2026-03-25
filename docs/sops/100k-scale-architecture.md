# ZAP OS Server-Side Scalability SOP & Milestone Tracker

**Author:** ZAP Inc. Architecture Team  
**Objective:** Scale the Olympus infrastructure to support 100,000 customers and 10,000 concurrent users.

*Updated based on Local-First App architecture constraints.*

Since the SQLite database is strictly a fast, local cache on the client app before syncing to the cloud, the architecture becomes significantly more resilient. We are building a true **Local-First** distributed system. This means the cloud backend's primary job shifts from "processing every click" to "bulk syncing state" and "managing heavy AI compute."

Here is the exact battle plan to reach 100,000 customers.

---

## 🚀 Execution Phases

### Phase 0: The Controlled Prototype (12 Users) **[CURRENT MILESTONE]**

Before we build hyper-scale infrastructure, we must validate the UI and basic sync loops.

- **Action:** Deploy the current Monorepo (`web`, `zap-claw`) via Vercel or a small Google run instance. Keep the SQLite local-first constraint.
- **Why:** This isolates the testing pool to our 12 internal team members. We verify data integrity across the 5 channels (Mobile, Web, Admin, Kiosk, POS) without over-engineering the backend.

### Phase 1: The Build & Pipeline Foundation (The Monorepo Upgrade)

Before we scale the servers, we must scale the engineering pipeline.

- **Action:** Rip out `npm workspaces` and replace it with `pnpm` and **Turborepo**.
- **Why:** Turborepo caches builds. It will drop deployment and testing times from minutes to seconds, which is mandatory when managing the complex `zap-claw`, `zap-design`, and edge-client sync modules.

### Phase 2: The Concurrency Layer (Multi-Channel Sync & API)

With up to 10,000 concurrent connections syncing their local SQLite data upwards, a single Node.js instance will bottleneck. Furthermore, this traffic is not uniform. It originates across **five distinct channels**, each requiring specific routing priority and security boundaries:

1. **Mobile Clients:** High-volume, intermittent connection syncs.
2. **Web Clients:** Real-time WebSocket/SSE state updates.
3. **Web Admin:** Heavy dashboard aggregations and sensitive overrides.
4. **Kiosks:** High-availability, low-latency, strictly locked environments.
5. **POS (Point of Sale):** Mission-critical transactional syncs (must never drop).

- **Action:** Implement **Redis** (via Upstash or Google Memory Store) as the ingestion queue and rate limiter.
- **Why:** When 10,000 local SQLite caches try to sync to the cloud at once, Redis acts as a shock absorber. It processes the connection in microseconds, caches the auth tokens, and queues the sync payloads for the backend workers to process safely.
- **Action:** Containerize the cloud sync layer (`zap-claw`) with **Docker** and deploy via Google Cloud Run for automatic horizontal scaling.

### Phase 3: The Cloud Data Vault (Remote Source of Truth)

While the app uses SQLite locally, the cloud truth requires a globally distributed database.

- **Action:** Transition the cloud persistence layer to **MongoDB Atlas** (for unstructured document sync) or a Serverless Edge PostgreSQL (like Neon or Supabase) to receive and resolve the queued sync payloads from the 10,000 clients.

---

## ✅ Verification & Testing Dumps

- Drop folders for the internal 12-person testing team have been provisioned at `/docs/testing-dumps/`.
- Team members monitoring Phase 0 should drop their JSON payloads, error logs, and SQLite cache snapshots into their respective channel folders (Mobile, Web, Admin, Kiosk, POS).
