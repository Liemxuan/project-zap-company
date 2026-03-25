---
name: "Inventory Tracking Strategy: Variant Dominance & BOM Architecture"
description: "Defines the architectural protocol for inventory tracking within ZAP-OS, explicitly dictating when to rely on a Parent conceptual item versus a strict Variant/BOM node for depletion."
---

# SOP-031: Inventory Tracking Strategy: Variant Dominance & BOM Architecture

## 1. Context and Objective
ZAP-OS manages an enterprise catalog connecting POS rendering (the visual layer) with physical COGS depletion (the math layer). The core objective of this SOP is to enforce the rule: **To track inventory accurately, the system must interact with the exact physical configuration sold.**

We align with the industry standards established by Square (Variant Dominance) and Toast/xtraCHEF (BOM Depletion). A parent concept (e.g., "Latte") cannot be counted. Only physical variants (e.g., "16oz Latte with Oat Milk") hold stock parameters.

## 2. Platform Parity Matrix

For context, this is how the industry leaders approach the "Tracking OFF" vs. "Tracking ON" dynamic, defining the ZAP-OS target state.

| Platform | Tracking Config | "Tracking OFF" (Conceptual Selling) | "Tracking ON" (Physical Depletion) |
| :--- | :--- | :--- | :--- |
| **Square** | Explicit boolean: `track_inventory` | **Parent-Led:** Sells the `CatalogItem`. No stock deducted. Infinite sales allowed. Ideal for services or "misc food". | **Variant-Led:** Tracking is explicitly locked to the `CatalogItemVariation`. The parent cannot hold stock. The variation holds the SKU and the count. |
| **Toast** | Implied via xtraCHEF (Prep Recipes) | **Item-Led:** Sells a "Menu Item". Exists purely for POS display/pricing. No backend depletion routing. | **BOM-Led:** Menus are explicitly linked to a Prep Recipe/Raw Ingredient. Sale triggers depletion of the mapped components (BOM). |
| **ZAP-OS** | Database Relational Presence | **Parent-Led (`products`):** Relies on `products` table for catalog display. Variants process transactions infinitely without querying ledgers. | **Variant/BOM-Led (`product_variants`):** The `product_variants` ID is the strict depletion node. Restricts checkout based on `inventory_counts` derived from `bom_recipes`. |

## 3. The ZAP-OS Architecture Rules

### 3.1 Tracking OFF (The Open Ring Bypass)
When a ZAP-OS item is configured not to track inventory (e.g., a "Custom Service Fee" or general "Tap Water"), the system utilizes a **Parent-Led structure**.

*   **The Database Behavior:** The POS queries the `product` for display and relies on the default `product_variants` simply to fetch the pricing payload.
*   **The Ledger Behavior:** The transaction closes immediately. The engine completely bypasses `bom_recipes` lookups and never logs an event to the `inventory_movements` ledger.

### 3.2 Tracking ON (The Ledger Enforcer)
When a ZAP-OS item requires strict stock and COGS tracking, the system shifts to a **Variant-Led structure**.

*   **The Database Behavior:** The `product` exists purely as a visual grouping shell. The checkout engine demands a specific `product_variants` ID.
*   **The Ledger Behavior:** 
    1. The engine intercepts the sale of the `product_variants` ID.
    2. It performs a forced lookup against the `bom_recipes` table targeting that specific Variant ID.
    3. It identifies the required depletion mathematics (e.g., this variant requires "12oz Milk" and "2oz Espresso").
    4. It writes a strict double-entry subtraction to the `inventory_movements` event ledger.
    5. It derives the new state ledger (`inventory_counts`) to update the Walk-in Fridge/Bar location counts.

## 4. Enforcement and Constraints

1.  **Never Track the Parent:** Inventory configuration (`track_inventory` flags or warnings) must never exist on the `products` table. It structurally belongs on the `product_variants` layer.
2.  **No BOM = No Depletion:** A product variant cannot trigger a stock depletion if it does not have a mapped relationship in the `bom_recipes` table linking it to a `raw_ingredients` node.
