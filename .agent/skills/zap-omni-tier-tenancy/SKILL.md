---
name: Zap Omni-Tier Tenancy Protocol
description: The rigorous standard defining the 0-10 Level hierarchical RBAC mapping for ZAP infrastructure, bounding holding organizations, brands, locations, and customers. Mandatory reading before rewriting any user, authorization, or fetch logic.
---

# ZAP Omni-Tier Multi-Tenant Protocol

All multi-tenant architecture within the ZAP ecosystem (Olympus / ZAP Design Engine) must strictly follow the 0-10 Tier Access Spectrum. We do not use flat role structures. Every entity mapping and access perimeter is determined by an exact hierarchical integer level.

## The 0-10 Access Spectrum

Entities are distributed across an 11-point scalar index. This guarantees mathematical isolation while accommodating infinite horizontal scale (independent Brands) and vertical depth (from global Holdings down to individual point-of-sale terminals).

### Level 0: ZAP (The Builders)
*   **Definition:** The omnipotent platform layer governing the infrastructure.
*   **Database Imprint:** `assignedLevel: 0`, attached entity is `null` (or points to `ZAP_CORE_SYSTEM`).
*   **Personnel:** System engineers, CSO (Zeus Tom). They build the system and possess absolute global override clearance to audit and check into any node in the hierarchy.

### Level 1: Organization
*   **Definition:** The top-level corporate holding structure. Can be an incorporated enterprise (e.g., Vingroup) or an independent high-net-worth individual (e.g., Frank C's portfolio).
*   **Database Imprint:** `assignedLevel: 1`.
*   **Clearance:** Infinite depth visibility across all child Brands and physical Locations branching from this Org.

### Level 2: Brand
*   **Definition:** The consumer-facing business identity (e.g., Pho24, Pendolasco).
*   **Database Imprint:** `assignedLevel: 2`.
*   **Special Flag - `shareCustomers`:** Customer entities are strictly siloed per Brand. However, if a Brand turns on `shareCustomers`, customer loyalty ledgers and profiles are allowed to share memory cross-brand, provided the sister brands share the same Level 1 Organization parent.

### Levels 3 - 9: The Expansive Middle
*   **Definition:** Flexible depth reserved for structural scalability. We deliberately space out levels to accommodate any future management clusters without breaking the database relationships.
*   **Standard Mapping Example:**
    *   *Level 3:* Region (e.g., APAC, Northern Vietnam)
    *   *Level 4:* Area (e.g., Ho Chi Minh City Cluster)
    *   *Level 5:* District (e.g., District 1)
    *   *Level 6:* Location / Physical Store (e.g., Pho24 D1)
    *   *Level 7:* Zone (e.g., Kiosk, Kitchen, Drive-thru)
*   **Personnel Dynamics:** A District Manager lives at Level 5. They view all Level 6 stores beneath them but are completely locked out of Level 1, 2, 3, and 4 telemetry.

### Level 10: Customers
*   **Definition:** The End Consumer.
*   **Database Imprint:** Identifies purely as `Level 10`. Possesses no employee record.
*   **Clearance:** Absolute Zero backend visibility. Confined entirely to consumer-facing mobile and web applications interacting with Level 2 (Brand) or Level 6 (Location) endpoints.

## Defensive Modeling Strategy

When constructing queries (e.g., Prisma `findMany`), you **must** apply multi-tenant Row Level Security based on the caller's Level context:
```typescript
// Sample RLS Implementation Pattern
if (caller.level === 0) {
    // God Mode - Return everything
} else if (caller.level === 1) {
    // Return exclusively entities attached to caller.organizationId
} else if (caller.level === 6) {
    // Return exclusively data tethered to caller.locationId
}
```
If you encounter a flat list bypass or an un-scoped fetch operation, purge it immediately. All data flows must be constrained by their scalar Level.

## UI Data Parsing Protocol

When rendering multi-tenant tables (e.g., User Management), components must dynamically parse the polymorphic `employee` object based on `assignedLevel` instead of expecting a flat `merchant` object.

### Assignment Name Resolution Rules:
*   **L0:** Hardcode as `"ZAP Core"`.
*   **L1 (Organization):** Resolve via `employee.organization?.name`.
*   **L2 (Brand):** Resolve via `employee.brand?.name`.
*   **L6 (Location):** Resolve via `employee.location?.name`.
*   **Customer Fallback:** Render `"Customer"` if no employee node exists.

**Mandatory Implementation Pattern:**
```tsx
const renderAssignment = (user) => {
  if (!user.employee) return "Customer";
  
  const lvl = user.employee.assignedLevel;
  const name = lvl === 0 ? "ZAP Core" :
               user.employee.organization?.name || 
               user.employee.brand?.name || 
               user.employee.location?.name || 'N/A';
               
  return `${name} (L${lvl})`;
};
```
All list displays must output this hybrid string (`"Name (L#)"`) to guarantee context clarity for ZAP operators troubleshooting cross-tenant boundaries.
