# Breadcrumb Pill — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** General
**Source:** `genesis/atoms/indicators/BreadcrumbPill.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A small, non-interactive navigation or status path indicator often used to show context hierarchy within complex apps (e.g. `Home > Settings > Network`).

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard pill indicator | Minimal gray background, soft text |
| `active` | The current page | Solid muted brand color background, dark text |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `path` | `string[]` | `[]` | Yes | Array of route names to render |
| `separator` | `ReactNode` | `<ChevronRight />` | No | Divider between nodes |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `--radius-shape-small` | Defines the pill roundness |
| Typography | `--font-m3-label` | Strictly restricted to small legible labels |

## 5. Accessibility
- Requires `aria-label="breadcrumb"` on the nav container.
- Represents `aria-current="page"` on the final node.

## 6. Usage Examples
```tsx
// Primary usage
<BreadcrumbPill path={['Dashboard', 'Users', 'Admin']} />
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Use to orient users in deeply nested structures | Don't use as primary navigation links |
