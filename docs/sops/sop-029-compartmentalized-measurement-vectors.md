# SOP-029-COMPARTMENTALIZED-MEASUREMENT-VECTORS

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** DATABASE ARCHITECTURE

---

## 1. Context & Purpose
This SOP governs the absolute structural separation of Order Origin and Financial Tender within the ZAP-OS Postgres database. 

To maintain strict accounting fidelity and accurately measure Cost of Customer Acquisition (CAC) against Cost of Operations, ZAP-OS explicitly splits these concepts into three hard-isolated database tables. These are not enum fields on a single table. They are physical, separate ledgers governed by Static Toggle IDs.

## 2. Critical ID Enforcement (The Toggle Inheritance Model)

We enforce a strict, continuous numbering system (IDs 1 through 7+). These are **Static IDs** mapped globally across the ZAP-OS ecosystem.

1.  **Immutability:** When engineers build a new feature (e.g., adding Stripe as Payment Gateway ID 4), that ID is permanently appended. We never change, delete, or overwrite existing IDs.
2.  **Universal Inheritance:** Every single tenant/user inherits that ID immediately. They do not get a custom, tenant-specific ID mapping.
3.  **The Toggle Mechanism:** The client simply toggles that specific ID `ON` or `OFF` in their Admin Dashboard. 

This structural rigidity guarantees our APIs, webhooks, and routing engines never break because the integer ID is the absolute, unchanging Source of Truth.

## 3. The Three Distinct Sectors

Because they are distinct Postgres tables, `ID = 1` means something entirely different depending on the ledger being queried.

### 3.1. `internal_channels` (Cost of Operations)
These are devices/software owned by the tenant. Measurements track hardware ROI, software licensing, and labor efficiency.

| `id` | `channel_name` | `hardware_form_factor` |
| :---: | :--- | :--- |
| **1** | POS Terminal | Landscape Tablet |
| **2** | Associate Handheld | Portrait Mobile |
| **3** | Self-Service Kiosk | Large Display Touch |
| **4** | Web Storefront | Responsive Web |
| **5** | Native Brand App | iOS/Android |
| **6** | QR Code Table Menu | Bring Your Own Device |
| **7** | Call Center / Phone | Agent Dashboard |

### 3.2. `marketplace_channels` (Cost of Acquisition / Marketing)
These are the platforms the tenant pays to acquire customers. Measurements track commission fees against Customer Lifetime Value (LTV).

| `id` | `marketplace_name` | `integration_type` |
| :---: | :--- | :--- |
| **0** | **Not Applicable (Internal Order)** | **System Default** |
| **1** | UberEats | Webhook |
| **2** | DoorDash | Webhook |
| **3** | ShopeeFood | Polling API |
| **4** | GrabFood | Webhook |
| **5** | Deliveroo | Webhook |
| **6** | Postmates | Webhook |
| **7** | Foodpanda | Polling API |
| **8** | ZaloPay Mini App | Webhook |

### 3.3. `payment_gateways` (Financial Reconciliation)
These are the financial pathways used to collect legal tender.

| `id` | `gateway_name` | `tender_origin` |
| :---: | :--- | :--- |
| **1** | Cash | Physical USD/VND |
| **2** | Square Terminal | Physical Card Present |
| **3** | Stripe Checkout | Card Not Present (Web) |
| **4** | MoMo QR | Digital Wallet |
| **5** | ZaloPay QR | Digital Wallet |
| **6** | VNPay | Digital Wallet |
| **7** | Apple Pay / Google Pay | Direct Digital Wallet |

## 4. Operational Logging (The "No Null" Rule)

When an order is created in the `orders` ledger, it MUST map to these tables. **Null values are strictly prohibited for these three vectors.** 

*   If an order does not originate from a marketplace, its `marketplace_channel_id` must explicitly equate to `0` (Not Applicable).
*   By forcing explicit integer mapping (`internal_channel_id` + `marketplace_channel_id` + `payment_gateway_id`), the CFO can instantly write analytical queries to measure hardware efficiency and payment processing fees independently without joining complex, unstructured JSON blobs.

**End of SOP.**
