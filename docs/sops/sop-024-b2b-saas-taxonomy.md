# SOP-024-B2B-SAAS-TAXONOMY

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** ARCHITECTURE & DATABASE SCHEMA

---

## 1. Context & Purpose
This SOP governs the absolute terminology standard for the Olympus ecosystem. We are transitioning from a legacy, retail-centric naming convention (Merchants/Customers) to a universal, ISO 27000 Series compliant B2B SaaS taxonomy. This ensures our API, Database Schema, and structural documentation project enterprise-grade professionalism when selling to high-tier verticals (Legal, Medical, Finance).

All human developers and AI Swarm Agents MUST adhere to this taxonomy for all variable names, database models, API route design, and UI labeling.

## 2. The Absolute Naming Convention

| Legacy Term | Enterprise Standard | Database / API Target | Notes |
| :--- | :--- | :--- | :--- |
| **Olympus/ZAP Worker** | **System Admin** | `system_admins` | People who operate the Olympus platform infrastructure. |
| **Merchant** | **Tenant** | `tenants` | The supreme B2B entity that isolats data (e.g., A Law Firm, A Restaurant Group). |
| **Company / Location** | **Workspace** | `workspaces` | A structural subdivision of a Tenant (e.g., A specific franchise location or city office). |
| **Employee** | **User** | `users` | Authenticated humans operating the platform under a Workspace. |
| **Customer** | **Client** | `clients` | External buyers who engage with the Tenant (The End-Consumer). |

## 3. The 3-Tier Expertise Integration (GStack Standard)

When referring to AI Cognitive Labor / Expertise-as-a-Service, the following architectural mapping must be enforced:
1. **AI Personas (`ai_personas`):** Master definitions held by Olympus. Must use the Universal Command Nomenclature (UCN) structure (e.g., `/cso-plan-audit`).
2. **Tenant Subscriptions (`tenant_subscriptions`):** Authorization matrix indicating which Tenant pays for access to which Persona.
3. **User Interactions (`user_interactions`):** The exact transactional ledger when a `user` triggers a `persona`. 

## 4. The Universal SaaS Module Core Syntax

B2B SaaS platforms typically offer a uniform set of capabilities hidden beneath industry-specific labels. When generating database schemas, API routes, and structural application state, developers MUST use the **short, single-word core structural name** defined below. The appropriate industry translation will be dynamically injected at the presentation layer based on the querying Tenant's sector.

### Permanent Module Taxonomy Mapping

| Core Structural Name | Food & Beverage (F&B) | Hospitality (Lodging) | Retail / Commerce | Professional Services | Beauty & Wellness |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **STAFF** | Staffing & Scheduling | Staff & Housekeeping | Associate Management | Talent Management | Specialist Management |
| **PAY** | Payroll & Tips | Payroll | Payroll | Billing & Payroll | Payroll & Commissions |
| **HIRE** | BOH & FOH Recruiting | Seasonal Hiring | Volume Recruiting | Talent Acquisition | Talent Sourcing |
| **LEARN** | Menu & Safety Training | Service Standards | Product & Sales Training | Certifications & CLE | Technique Training |
| **POS** | POS & Menu Ordering | PMS & Folio | Omni-Channel POS | Client Proposals & Invoicing | Booking & POS |
| **BOOK** | Table Reservations | Room & Block Booking | Appointment & Stylings | Client Consultations | Salon / Spa Appointments |
| **CRM** | Diner Profiles | Guest Intelligence | Customer 360 | Client Relations | Client Preferences |
| **MARKET** | Loyalty & Promos | Loyalty & Rewards | Loyalty Programs | Brand & Outreach | Client Retention |
| **STOCK** | Ingredient & Prep | Amenities & Linens | Warehouse & Floor Stock | Resource & Asset Mgmt | Retail & Pro Products |
| **SOURCE** | Supplier Management | Vendor Management | Sourcing & Suppliers | Contractor Management | Supplier Management |
| **LEDGER** | Daily Financials & Tips | Night Audit | Daily Sales & Ledger | Financial Accounting | Daily Close & Cash |
| **DATA** | Menu Engineering | RevPAR Analytics | Sales & Margin BI | Utilization Analytics | Service Utilization |
| **OPS** | Kitchen Display (KDS) | Front Desk / Concierge | Fulfillment Center | Case / Project Mgmt | Floor Management |
| **FIELD** | Delivery & Dispatch | Valet & Transport | Last-Mile Delivery | Field Service Mgmt | Mobile / Event Services |
| **FACILITY** | Appliance Maintenance | Property Management | Store Maintenance | Office Management | Equipment Maintenance |
| **TALK** | Shift Notes & Logs | Shift Huddles | Store Communications | Practice Communications| Daily Briefings |
| **REVIEW** | Staff Evaluations | Staff Appraisals | Associate Reviews | Partner Evaluations | Stylist Evaluations |
| **SUPPORT** | Diner Feedback | Guest Services | Customer Support | Client Support | Client Support |
| **COMPLY** | Food Safety & Health | Health & Safety | Loss Prevention | Risk Management | Licensure & Sanitations |

## 5. Permanent Architectural Database Strategy

We have officially adopted this taxonomy as the permanent core database structure. The strategy is implemented as follows:

1. **`system_modules`**: The master dictionary containing the Core Structural Name (e.g., `STAFF`, `HIRE`, `CRM`).
2. **`module_localizations`**: A localization map that translates the `STAFF` key to the appropriate UI label (e.g., "Staffing & Scheduling" if the querying Tenant's sector is `FOOD_AND_BEVERAGE`).
3. **`tenant_modules`**: The entitlements table defining what the Tenant has unlocked.
4. **Persona Wiring**: We actively map specific "Expertise" Personas to these modules. For example, a "Food Safety Auditor" persona requires explicit access to the `COMPLY` module. This is our permanent standard for role-based gating.

## 6. Enforcement Rule
Never use the terms "Merchant", "Company", "Employee" or "Customer" in new database rows, file names, or interface data-grids. If you encounter them in legacy code during an Audit, immediately initiate a refactor ticket to port them to `Tenant`, `Workspace`, `User`, or `Client`. Ensure all core modules use the strict 1-word structural key.
