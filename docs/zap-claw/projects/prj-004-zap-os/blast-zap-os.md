# PRJ-004: ZAP-OS Foundation & Identity Provider

**SLA ID:** `SLA-BLAST-ZAPOS-20260223`

## Phase 1: B - Blueprint (Discovery)

### 1. The Core Objective
To formally blueprint **ZAP-OS**, the foundational backend repository of the Olympus System. It will act as the central Identity Provider (IdP), tenant manager, and traffic router. It is strictly decoupled from the AI agent logic (`Zap-Claw`) to ensure maximum security, stability, and maintainability.

### 2. Primary Responsibilities of ZAP-OS
As the core engine, ZAP-OS has the following strict, non-negotiable responsibilities:

1.  **Multi-Tenant Identity Management (The Vault):**
    *   Authenticating users and generating their session tokens.
    *   Assigning and enforcing the `[TENANT_ID]` (e.g., `ZVN` for ZAP Vietnam, `CUST99`).
    *   Securing the `SYS_OS` database collections (e.g., `ZVN_SYS_OS_users`, `ZVN_SYS_OS_roles`).

2.  **API Routing & Delegation:**
    *   Acting as the front door for all incoming client requests (from web dashboards, mobile apps, or Telegram).
    *   If a request needs AI processing, ZAP-OS authenticates the user, retrieves their `TENANT_ID`, and securely proxies the request to the decoupled `Zap-Claw` service.
    *   If a request is a payroll action, it proxies to `Zap-Employee`.

3.  **Global Licensing & Billing:**
    *   Tracking which modules (Claw, Pos, Design) a specific Tenant has purchased.
    *   If a local deployment (Tier C) is offline, handling fallback licensing logic.

### 3. The Decoupled architecture (Microservices)

```text
       [ External Clients ]
       (Web, Mobile, Telegram)
                 |
                 v
   ==============================
   |       ZAP-OS (Gateway)     |  <-- Handles Auth, Tenant ID, Routing
   | (Reads ZVN_SYS_OS tables)  |
   ==============================
          |               |
   (If AI Request)  (If Sales Request)
          |               |
          v               v
 [ Zap-Claw API ]   [ Zap-Pos API ]
 (Reads SYS_CLAW)   (Reads SYS_POS)
```

### 4. Technical Stack Recommendation
To ensure hyper-scalability and rapid development, ZAP-OS should be built on:
- **Language:** TypeScript 
- **Framework:** Express.js or Fastify (for high-speed API routing).
- **Database Connection:** Native MongoDB Driver mapping to the shared Olympus Atlas Cluster.
- **Authentication:** JWT (JSON Web Tokens) encoding the `TENANT_ID`.

### 5. Alpha Deployment (ZAP Vietnam)
For ZAP Vietnam (Tenant `ZVN`), ZAP-OS will be deployed in the **Hybrid** configuration.
It will run securely on a local server, maintaining absolute control over local employee logins (`ZVN_SYS_OS_users`), while proxying AI tasks out to the cloud-hosted `Zap-Claw` instance.

## Phase 2: L - Link (Connectivity)
- [ ] Initialize a brand new, empty Git repository named `zap-os` adjacent to the `zap-claw` folder.
- [ ] Establish standard `.env` configuration (Database URI, JWT Secrets).

## Phase 3: A - Architect (Structure & Logic)
- [ ] Build the `/auth/login` and `/auth/register` API endpoints.
- [ ] Build the Tenant Middleware that intercepts every request and strictly enforces `[TENANT_ID]` database isolation.

## Phase 4: S - Stylize (Refinement & UI)
- [ ] **PRD Required:** Build a foundational Admin Dashboard (React/Next.js) allowing ZAP administrators to create new Tenants (e.g., registering "Customer 99").

## Phase 5: T - Trigger (Deployment & Validation)
- [ ] Run an empirical test attempting to read Tenant B's data using Tenant A's JWT token to validate infrastructure security.
