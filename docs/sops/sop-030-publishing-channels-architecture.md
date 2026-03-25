# SOP-030-PUBLISHING-CHANNELS-ARCHITECTURE

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** DATABASE ARCHITECTURE

---

## 1. Context & Purpose
This SOP governs the structure of **Publishing Channels** (Menu Visibility) within the ZAP-OS Postgres database. 

Publishing Channels dictate *where* menus, products, pricing formulas, and promotions are permitted to be displayed. This operates completely independently of how an order is captured or paid for. A "Menu Presentation" must explicitly be linked to Publishing Channels to be active on them.

## 2. Core Directive: The Array Inheritance Model
Unlike `internal_channels` or `payment_gateways` where an Order must map to a single integer, **Publishing Channels operate as static arrays**. 

If a merchant creates a "Happy Hour Menu", they do not create three separate versions for the POS, the App, and UberEats. They create *one* menu, and tag it with the allowed Publishing Channel IDs: `[1, 5, 8]`.

When ZAP-OS engineers add a new ecosystem integration (e.g., adding a digital drive-thru board), they append a new ID integer to this static matrix. The new ID is immediately inherited by all tenants, who simply check a box to publish to it.

## 3. The Static ID Matrix
This matrix represents the fixed integers used for menu visibility targeting. 

| `id` | `publishing_channel` | `target_audience` | `visibility_logic` |
| :---: | :--- | :--- | :--- |
| **1** | Employee POS | Cashiers / Bartenders | Maximum visibility. Shows base pricing + internal-only modifier options. |
| **2** | Employee Handheld | Waitstaff | Same as POS, optimized for portrait layout queries. |
| **3** | Self-Service Kiosks | Walk-in Customers | Limited visibility. Hides complex modifiers; emphasizes visual upsells. |
| **4** | Native Web Storefront | Online Customers | Standard web presentation. |
| **5** | Native Apps (iOS/Android) | Loyalty Customers | Shows app-exclusive pricing tiers and promotional products. |
| **6** | Table/Seat QR Ordering | Seated Customers | Restricted to the active table session. |
| **7** | Call Center | Phone Agents | Maximum visibility + overrides. Allows phone agents to bypass normal Kiosk/App limits. |
| **8** | Marketplaces (Aggregator) | Third-Party Traffic | Applies strict markup pricing blocks (e.g., +30% UberEats padding). Hides low-margin items. |
| **9** | Order Ahead / Drive-Thru | Mobile/Car Customers | Highly simplified menu. Fast prep items only. |
| **10** | Digital Menu Boards | Store Traffic (View Only) | Read-only GraphQL feed for driving external digital signage (no ordering capability). |

## 4. Architectural Rules for Engineers

1.  **Do Not Map to Orders:** The `orders` table does not care about Publishing Channels. The order table uses `internal_channels`, `marketplace_channels`, and `payment_gateways`.
2.  **Strict Boolean Toggling:** You do not hardcode "UberEats" into a product name. You tag the product with `publishing_channel_ids = [1, 2, 4, 8]` and the GraphQL engine figures out the rest when the UberEats webhook syncs the menu.
3.  **Cross-Contamination:** A menu item can exist in POS (1) but be completely invisible to Marketplaces (8) to protect margins. This is managed purely by omitting `8` from the array.

**End of SOP.**
