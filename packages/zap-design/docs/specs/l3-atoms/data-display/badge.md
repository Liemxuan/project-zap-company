# Badge — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Data Display
**Source:** `genesis/atoms/data-display/badge.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
Displays a small, visual tag indicating standard statuses, tags, or unread numbers natively mapping the ZAP Design Engine Layer tokens (`primary`, `secondary`, `destructive`).

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Base M3 map | `--color-primary` background, crisp padding |
| `secondary` | Muted background| `--color-secondary` fill for arrays of tags |
| `destructive`| Critical alerts | `--color-state-error` rendering |
| `outline` | Thin pill | Hollow tag using `--color-outline` bound |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `string` | `'default'`| No | Selects the active thematic array |
| `className`| `string` | undefined | No | Overrides padding dimensions globally |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `full` (`100%`) | Standard full-radius tag rounding |
| Text | `--color-on-primary`| Perfect accessibility contrast over `.bg-primary` mapped layers |
| Outline | `--color-outline-variant` | Hollow layout bounding |

## 5. Accessibility
- Use descriptive `aria-hidden="true"` conditionally if Badges repeat text near their host (e.g., "3 items [Badge: 3]").

## 6. Usage Examples
```tsx
<Badge variant="outline">Label</Badge>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Display multi-tag arrays logically beside tables | Don't bind interactivity (Use `Toggle` instead of `Badge` for filters) |
