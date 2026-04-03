# 🏢 ZAP-OS B2B Master Port Topology

**Last Updated:** Phase 7 (Agent Containerization & Multi-Tenant Rollout)

This document serves as the absolute single source of truth for the Olympus Monorepo port allocations. It enforces strict separation between internal operations, merchant-facing products, and headless containerized agents.

---

## 1. TIER 1: The UI Foundations & Agents (Our Tech)
*Where we build the underlying tech and monitor the AI intelligence.*

| Port | Ownership | Service Name | Path in Monorepo | Detailed Business Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`3000`** | **`[ZAP]`** | **Design Engine** | `packages/zap-design` | **The UI Foundry.** Used by the Vietnam team to build, inspect, and test L1-L7 components, atoms, and M3 design tokens before they are shipped to products. |
| **`3500`** | **`[ZAP]`** | **Swarm Monitor** | `apps/zap-swarm` | **Agent Telemetry.** Our internal Swarm Command Center. Used by our engineers to track agent memory, ticket queues, and AI fleet health globally. |

---

## 2. TIER 2: The Merchant Revenue Suite (The Products We Sell)
*The frontend applications we license to merchants. These are strictly customer-facing.*

| Port | Ownership | Service Name | Path in Monorepo | Detailed Business Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`3100`** | **`[MERCHANT]`** | **POS Terminal** | `apps/pos` | **Physical Store Checkout.** Staff-facing point of sale software licensed to the merchant for cash wrap operations. |
| **`3200`** | **`[MERCHANT]`** | **Kiosk** | `apps/kiosk` | **Self-Service.** Customer-facing hardware terminal module for autonomous ordering or check-in. |
| **`3300`** | **`[MERCHANT]`** | **Web App** | `apps/web` | **E-commerce.** Primary B2C storefront. Customer-facing web platform deployed to the merchant's domain for internet sales. |
| **`3400`** | **`[MERCHANT]`** | **Customer Portal**| `apps/portal` | **Loyalty & Accounts.** Where the merchant's end-customers log in to track their orders, subscriptions, and reward points. |

---

## 3. TIER 3: The Dual Control Planes
*Complete isolation between how WE run Olympus and how the MERCHANT runs their store.*

| Port | Ownership | Service Name | Path in Monorepo | Detailed Business Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`4200`** | **`[ZAP]`** | **Global Ops** | `apps/operations` | **ZAP CRM.** Olympus Master Operations. This is how we bill the merchants, manage global tenant onboarding, and track super-admin sales. |
| **`4300`** | **`[ZAP]`** | **Infrastructure**| `packages/zap-design` | **DevOps Telemetry.** Tracks cloud uptime, database load, and deployment pipeline health for our DevOps team. |
| **`4600`** | **`[ZAP]`** | **Mission Control**| `packages/zap-design` | **Global Radar.** Ping-checks every port in this registry to ensure all monorepo modules are active on localhost. |
| **`4700`** | **`[MERCHANT]`** | **Admin Ops** | `apps/settings` | **Merchant Back-Office.** The merchant's dedicated portal. Where store managers log in to configure taxes, store hours, staff roles, and terminal settings. |

---

## 4. TIER 4: The Shared Data Vaults
*The centralized persistence layer.*

| Port | Ownership | Service Name | Location | Detailed Business Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`5432`** | *(Multi-Tenant)* | **PostgreSQL** | `34.44.230.32` | **Relational Source of Truth.** Holds identity, billing, and transactional data. Strictly segregated by tenant ID. |
| **`27017`**| *(Multi-Tenant)* | **MongoDB Atlas**| Cloud SRV | **Unstructured Data Payload.** Massive document storage. Holds raw JSON payloads, agent conversation logs, and dynamic web templates. |
| **`6379`** | **`[ZAP]`** | **Redis** | Native Mac | **The Message Broker.** The high-speed inbox that routes async tickets from the merchant gateways directly to the Docker Agent Fleet. |

---

## 5. TIER 5: The Agent Fleet (Docker Containerization)
*The headless worker force. Pushed to `8000+` to ensure infinite horizontal scaling without UI port overlap.*

| Port | Ownership | Service Name | Location | Detailed Business Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`8000`** | **`[ZAP]`** | **ChromaDB** | Docker | **The Hive Mind.** Vector database serving semantic memory for the AI fleet. Native Rust KAIROS daemon depends on this. |
| **`8100`** | **`[ZAP]`** | Jerry (Agent) | Docker | Internal watchdog agent. Monitors other agents and checks token sanity. Container is entirely air-gapped from external ingress. |
| **`8101`** | **`[ZAP]`** | Spike (Agent) | Docker | Primary structural builder agent. Heavy UI generation and React extraction. |
| **`8102`** | **`[ZAP]`** | Thomas (Agent) | Docker | Analytics and financial reporting logic operations. |
| **`8103`** | **`[ZAP]`** | Athena (Agent) | Docker | Architectural verification and review workflows. |
| **`8104`** | **`[ZAP]`** | Hermes (Agent) | Docker | System messaging and API routing logic. |
| **`8105`** | **`[ZAP]`** | Hawk (Agent) | Docker | Threat detection and security auditing. |
| **`8106`** | **`[ZAP]`** | Nova (Agent) | Docker | Content creation and copy generation tasks. |
| **`8107`** | **`[ZAP]`** | Raven (Agent) | Docker | Deep data parsing and document extraction. |
| **`8108`** | **`[ZAP]`** | Scout (Agent) | Docker | Open-source intelligence and web research. |
| **`8109`** | **`[ZAP]`** | Coder (Agent) | Docker | Core execution loop programming logic. |
| **`8110`** | **`[ZAP]`** | Architect (Agent)| Docker | System scaling strategies and infrastructure design. |
| **`8111`** | **`[ZAP]`** | Cleo (Agent) | Docker | User Experience and design token compliance alignment. |
