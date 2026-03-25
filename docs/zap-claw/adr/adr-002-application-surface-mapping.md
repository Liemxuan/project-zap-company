# adr-002: Application Surface Database Mapping

**Date:** March 1, 2026
**Topic:** Database Routing, Core Functions, and File architecture for the 7 OLYMPUS Surfaces
**Status:** PROPOSED

## 1. The Directive

The OLYMPUS ecosystem spans 7 distinct application surfaces. Each surface requires extreme clarity on *where* it reads/writes data, *what* its core function is, and *which files* define its architecture. This prevents developers (Luong, Nguyen, Liem) from querying the wrong system at the 100,000 user scale.

We utilize four data stores:

1. **PostgreSQL (.NET 9 / EF Core):** The Indestructible Vault (Cloud).
2. **MongoDB:** The Cognitive Core (Cloud).
3. **Redis (`HybridCache`):** The High-Speed Mesh (Cloud).
4. **SQLite:** The Offline Redundancy Layer (Local Device).

---

## 2. Surface Mapping & Core Functions

### 1. Point of Sale (POS) - Flutter/Windows

* **Core Function:** High-speed, uninterrupted offline/online retail checkout execution.
* **architecture Docs:** `docs/arch/arch-001-POS_CHECKOUT.md`
* **Remote DB (Cloud):** PostgreSQL (via .NET API)
* **Local DB (Offline-First):** SQLite
* **Caching:** Redis (Product lookups from API)
* **The "Why":** POS must never go down if the internet cuts out. Luong uses **SQLite** to store local syncing arrays. It runs transactions locally, pulling cached product data via the API (Redis), and batches completed financial orders back to the cloud (PostgreSQL) when the connection is green. It never touches Mongo.

### 2. Kiosk (Self-Service) - Flutter/Android

* **Core Function:** Unattended customer ordering, visual upselling, and queue management.
* **architecture Docs:** `docs/arch/arch-002-KIOSK_FLOW.md`
* **Remote DB (Cloud):** PostgreSQL
* **Local DB:** SQLite
* **Caching:** Redis (Heavy Image/Menu cache)
* **The "Why":** Kiosks take thousands of rapid menu queries. They use **SQLite** to store local hardware session states and offline queue drops. The catalog images and prices are pulled instantly from Redis. When the customer taps "Pay", the transaction commits to Postgres via the API.

### 3. Native Mobile App (Consumer) - Flutter/iOS/Android

* **Core Function:** Customer loyalty, pre-ordering, and real-time order tracking.
* **architecture Docs:** `docs/arch/arch-003-MOBILE_APP.md`
* **Remote DB (Cloud):** PostgreSQL
* **Local DB:** SQLite
* **Caching:** Redis
* **The "Why":** Consumers need a fast, local experience. **SQLite** stores the user's localized session preferences, JWTs, and offline carts. Network requests fetch order history (Postgres), loyalty points (Postgres), and the live store menu (Redis).

### 4. Admin Web Portal (Merchant Dash) - Next.js

* **Core Function:** Enterprise control center for financials, component design, and industry-specific toggles.
* **architecture Docs:** `docs/arch/arch-004-ADMIN_PORTAL.md`
* **Primary DB:** PostgreSQL (80%) / MongoDB (10%) / Redis (10%)
* **The "Why":** The Admin portal is split into two massive operational halves:
  1. **Standard Administration (Postgres):** Sales graphs, inventory management, staff scheduling.
  2. **The Design Engine (Postgres/Redis):** This is where the merchant builds and controls the other surfaces (Website, App, Kiosk, Marketing Materials). It enforces **Brand Guidelines** (fonts, colors, logos) centrally. It allows merchants to turn specific UI features on and off based on their **Industry** (e.g., Restaurant turns on "Tipping", Retailer turns on "Shipping").
  3. **AI Insights (MongoDB):** The portal reads from MongoDB when the merchant asks the Swarm for business insights.

### 5. Website (Storefront) - Next.js

* **Core Function:** Public-facing e-commerce, SEO discovery, and brand showcasing.
* **architecture Docs:** `docs/arch/arch-005-WEBsite.md`
* **Primary DB:** Redis (Read-Only) / PostgreSQL (Write)
* **The "Why":** A storefront at 100k scale will get DDoS'd by legitimate users if it hits the SQL database for every page load. The Next.js frontend is entirely hydrated from Redis caches. It only touches Postgres when a payment executes.

### 6. AI Platform (The Swarm & Models) - ZAP-Claw / OpenClaw

* **Core Function:** Asynchronous business analysis, automated infrastructure coding, and anomaly detection.
* **architecture Docs:** `docs/arch/arch-006-SWARM_PLATFORM.md`
* **Primary DB:** MongoDB (90%) / PostgreSQL (10% Read-Only)
* **The "Why":** Jerry, Spike, Tommy, and the models live in MongoDB. They output unstructured, massive JSON blobs. A SQL schema would shatter under this payload. The AI *reads* Postgres occasionally to analyze financials, but it *thinks and remembers* in Mongo.

### 7. AI Agents (Customer Chat/Support bots)

* **Core Function:** Real-time customer support, triage, and semantic search queries on the Storefront.
* **architecture Docs:** `docs/arch/arch-007-CHAT_agents.md`
* **Primary DB:** MongoDB
* **The "Why":** When a customer interacts with an AI bot on the storefront, the context, memory, and dialog history persist in MongoDB for instant retrieval by the Swarm.

---

## 3. The Golden Rules for Developers (Vuong/Luong/Liem)

1. **If it deals with money, inventory, or user accounts:** It MUST go into PostgreSQL.
2. **If it deals with AI logs, agent memory, or raw chat history:** It MUST go into MongoDB.
3. **If it reads the same menu/catalog 10,000 times a minute:** It MUST be served from Redis.
4. **If the device runs without internet (POS/Mobile/Kiosk):** It MUST cache locally in SQLite and sync back to Postgres aggressively.
