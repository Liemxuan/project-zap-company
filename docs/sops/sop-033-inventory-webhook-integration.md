# SOP-033-INVENTORY-WEBHOOK-INTEGRATION

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** B.L.A.S.T. / INVENTORY

---

## 1. Context & Purpose
This document codifies the architecture and standard operating procedure for the ZAP Claw Inventory Webhook Integration and its associated UI handlers. It serves as the blueprint for resuming the deep integration between external sales systems (Stripe, POS) and the internal dual-ledger inventory engine.

## 2. Webhook Proxy Architecture
External systems do not directly mutate the inventory database. All inventory deductions must flow through the dedicated Webhook Proxy located at `POST /webhook/payment` on the ZAP Claw API.

### 2.1 Payload Ingestion
The proxy is currently designed to accept generalized metadata payloads from external fulfillment systems. When live sales systems (Stripe, Telegram Bots, or ZAP POS) are connected, their webhooks must be formatted or adapted to pass through this endpoint.

### 2.2 Depletion Execution
Once validated, the webhook extracts the `itemsSold` array, the `orderId`, and the `locationId`, immediately piping them into `InventoryService.depleteOrder()`. This triggers the recursive BOM mapping to deduct physical ingredient quantities from the Master Ledger.

## 3. Administrative Interface (Admin UI)
The Inventory Command Center (`/admin/inventory`) in the ZAP Design Engine houses the tools for manual ledger adjustments outside of automated sales.

### 3.1 NextJS Proxying
To ensure client-side isolation, the Next.js `next.config.ts` must maintain active rewrites proxying all `/api/inventory/*` and `/webhook/*` requests to the internal ZAP Claw port (default `3300`).

### 3.2 Positive Intake (Purchase Orders)
Located in Tab 4 "Receive Goods", this UI connects to `POST /api/inventory/receive`. 
- **Rule:** All incoming vendor deliveries must be logged here.
- **Action:** Increments the `quantity_on_hand` in the `inventory_counts` state ledger and generates a positive event record in `inventory_movements`.

### 3.3 Negative Movement (Waste Logging)
Located in Tab 5 "Log Waste", this UI connects to `POST /api/inventory/waste`.
- **Rule:** All dropped, spoiled, or expired items must be explicitly logged here by BOH staff to maintain audit parity.
- **Action:** Decrements the `quantity_on_hand` in the `inventory_counts` state ledger and generates a negative event record in `inventory_movements`.

## 4. Re-Engagement Protocol
When external sales systems are ready to be hooked into the ledger:
1. Revive the session state using the checkpoint ID: `BLAST-SPLIT-69b9b8851099c24d89bd34b8-Inventory-Webhook-UI`
2. Map the incoming external vendor IDs/Line Items to internal `raw_ingredient_id` schemas.
3. Replace the generic payload extraction logic in `webhookRouter` with hardened Stripe webhook signature verification.
