# Olympus Omni-Channel CRM — architecture

**Date:** 2026-02-26
**Status:** Draft

---

## Overview

Olympus is an omni-channel CRM platform targeting F&B, Spa & Nails, Hotels & Airbnb, and Retail verticals. It unifies customer interactions across physical and digital touchpoints through four client components backed by shared services.

---

## Target Industries

| Industry | Key Workflows |
|---|---|
| F&B | Table management, ordering, loyalty, delivery integration |
| Spa & Nails | Appointment booking, staff scheduling, treatment history |
| Hotels & Airbnb | Check-in/out, room service, guest profiles, housekeeping |
| Retail (Offline/Online) | Inventory, POS transactions, e-commerce sync, returns |

---

## Target Markets

- **Phase 1:** Vietnam, United States
- **Phase 2:** Germany, South Korea

---

## Client Components

### POS (Point of Sale)
- **Tech:** C# / Blazor (desktop/web hybrid)
- **Responsibilities:** Transaction processing, cash/card payments, receipt printing, offline mode with sync, shift management
- **Deployment:** On-premise or cloud-connected; supports offline-first operation

### Kiosk
- **Tech:** C# / Blazor (browser kiosk mode) or JavaScript SPA
- **Responsibilities:** Self-service ordering, check-in, loyalty lookup, payment
- **Deployment:** Touch-screen hardware at venue; communicates with backend via REST/WebSocket

### App (Mobile)
- **Tech:** Flutter (iOS & Android)
- **Responsibilities:** Customer-facing mobile experience — loyalty rewards, booking, order history, push notifications, digital receipts
- **Deployment:** App Store & Google Play

### Web (Customer & Admin Portal)
- **Tech:** Blazor (Server/WASM) + JavaScript
- **Responsibilities:** Admin dashboard, reporting, CRM management, online ordering, booking portal
- **Deployment:** Cloud-hosted SaaS; multi-tenant

---

## Backend Services

All components communicate with backend microservices via REST APIs and WebSocket channels.

| Service | Responsibility |
|---|---|
| Identity & Auth | JWT-based auth, roles, multi-tenant isolation |
| Customer Service | Profiles, loyalty points, visit history |
| Order Service | Order lifecycle, kitchen display, fulfillment |
| Inventory Service | Stock levels, reorder alerts, supplier sync |
| Booking Service | Appointments, room reservations, availability |
| Payment Service | Payment gateway integration, refunds, reconciliation |
| Notification Service | Push, SMS, email notifications |
| Reporting Service | Analytics, dashboards, exports |

---

## Data Layer

- **Primary Database:** MongoDB
  - Document model suits varied industry schemas (menu items, treatment records, room configs)
  - Multi-tenant: tenant-per-database or tenant-per-collection (TBD at detailed design)
  - Replica sets for high availability
- **Cache:** Redis (session state, real-time seat/availability locks)
- **Search:** To be evaluated (MongoDB Atlas Search or dedicated Elasticsearch)
- **File Storage:** Object storage (S3-compatible) for receipts, images, reports

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Mobile App | Flutter (Dart) |
| Web / Admin Portal | Blazor Server + WASM, JavaScript |
| POS Client | C# / Blazor |
| Kiosk Client | C# / Blazor or JS SPA |
| Backend APIs | C# (.NET — ASP.NET Core) |
| Database | MongoDB |
| Cache | Redis |
| Messaging | To be determined (RabbitMQ / Azure Service Bus) |
| Hosting | Cloud-agnostic (Azure preferred for Phase 1) |

---

## Open Decisions

| # | Question | Options | Owner |
|---|---|---|---|
| 1 | Multi-tenancy strategy in MongoDB | DB-per-tenant vs collection-per-tenant | architecture |
| 2 | Message broker selection | RabbitMQ, Azure Service Bus, in-process events | architecture |
| 3 | Kiosk tech choice | C#/Blazor vs JS SPA | Frontend team |
| 4 | Search solution | MongoDB Atlas Search vs Elasticsearch | Data team |
| 5 | Hosting cloud provider | Azure vs AWS | Infrastructure |
