# Pill — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Data Display
**Source:** `genesis/atoms/data-display/pill.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A highly specialized display unit for representing categorized metrics (like "Success" / "Pending" / "Failed"). Often bundles an icon + label + background-color with explicitly rounded geometry.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `success` | Positive state | Light green background, dark green text |
| `warning` | Pending state | Yellow/Orange background and text mapping |
| `error` | Failed state | Red background and text mapping |
| `info` | Default/Gray| Neutral `--color-layer-panel` with gray text |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `status` | `enum` | `'info'` | Yes | Maps to logical business metrics |
| `icon` | `ReactNode` | undefined | No | SVG dot or glyph appended to the left |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Colors | `--color-state-*` | Injects semantic logic from globals.css mapped cleanly via `/20` opacity layers |
| Radius | `full` (`100%`) | Explicitly ignores system radius similar to Badges |

## 5. Accessibility
- Maps strictly to visual aesthetics. The host Table row or container must supply the textual equivalent.

## 6. Usage Examples
```tsx
<Pill status="success" icon={<CheckCircle />}>
  Completed
</Pill>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Populate Data Grid columns with standardized Pills | Don't rely solely on Pill colors; ensure the label is explicit |
