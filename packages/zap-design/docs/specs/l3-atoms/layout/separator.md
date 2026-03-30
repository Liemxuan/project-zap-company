# Separator — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Layout
**Source:** `genesis/atoms/layout/separator.tsx`, `genesis/atoms/interactive/separator.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
Visually or semantically separates content within a card, menu, or list. The separator relies heavily on the `outline-variant` token.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `horizontal`| Row divider | Width 100%, Height 1px |
| `vertical`  | Column divider| Height 100%, Width 1px |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `orientation`| `'horizontal'\|'vertical'`| `'horizontal'`| No | Axis to split |
| `decorative` | `boolean` | `true` | No | Strips ARIA semantic meaning if just for looks |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Color | `--color-outline-variant`, or `--color-card-border` | The actual 1px fill color depending on context |

## 5. Accessibility
- If `decorative=true`, `role="none"` is applied to ignore screen readers.
- If `decorative=false`, `role="separator"` is automatically implemented.

## 6. Usage Examples
```tsx
<div>
  <div>Top Menu Item</div>
  <Separator className="my-4" />
  <div>Bottom Menu Item</div>
</div>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Use to break up major conceptual sections | Don't use to hack spacing between elements (use Flex gap instead) |
