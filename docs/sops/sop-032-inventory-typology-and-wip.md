# SOP-032: Inventory Typology and WIP (Work In Progress)

**Effective Date:** 2026-03-17
**Status:** Active
**Author:** Antigravity (ZAP-OS Security & Architecture)
**Scope:** Olympus (app-claw, app-design)

---

## 1. Directive

This SOP governs how ZAP-OS tracks physical inventory items across different stages of physical preparation. To maintain parity with enterprise Multi-Industry ERPs (SAP, NetSuite) and specialized POS systems (Square, Toast/xtraCHEF), ZAP-OS **will not** use separate database tables for Raw Materials, Semi-Products, and Finished Goods.

The **Single Item Master Table** (`inventory_items`) coupled with recursive **BOM Routing** (`bom_recipes`) is the only authorized method for determining inventory typology. 

## 2. The Golden Typology Rule

The system relies exclusively on the Bill of Materials (BOM) to infer what an item is.

*   **Rule 1: Finished Good / Semi-Product (Assembly):** If an `inventory_item` appears in the `bom_recipes` table as an **Output**, it is an Assembly.
*   **Rule 2: Raw Material:** If an `inventory_item` *only* ever appears in the `bom_recipes` table as an **Input**, it is a Raw Material.

## 3. Typology Metadata (The UI Filter)

To assist Managers in the physical world (so they do not accidentally attempt to sell "1 Gallon of Raw Broth" on the customer-facing iPad), `inventory_items` are assigned an explicit Enum:

```prisma
enum InventoryTrackingType {
  RAW_MATERIAL      // Input only (e.g., Raw Beef Bones, Flour)
  SEMI_PRODUCT      // Work In Progress / Batched. Is an output of a prep recipe, and an input to a POS Variant.
  FINISHED_GOOD     // A 1:1 mapped physical item sold directly (e.g., A can of Coke)
}
```

*   **Critial System Note:** This Enum is purely **Metadata for UI filtering**. It does not drive the depletion mathematics. The Math relies 100% on the BOM node traversal.

## 4. The Infinite Nesting (WIP) Pattern

The recursive nature of the BOM allows ZAP-OS to track "Work In Progress" (WIP) items indefinitely.

**Example: The Pho Workflow**
1.  **Receive RAW:** 50 lbs Beef Bones (`RAW_MATERIAL`)
2.  **Prep SEMI:** Chef boils bones to yield 10 Gallons of Master Broth (`SEMI_PRODUCT`).
    *   *Action:* Trigger a `Prep Event`. The system depletes Bones (-) and increments Broth (+).
3.  **Sell FINISHED:** Customer buys a Bowl of Pho (Variant on POS). 
    *   *Action:* Trigger a `Checkout Event`. The system traverses the Variant's BOM. It finds a requirement for 16oz of Master Broth. It depletes 16oz of Broth (-). 

The system never checks the Bones during checkout, because the BOM for the Pho Variant points to the Semi-Product (Broth), not the Raw Material (Bones).
