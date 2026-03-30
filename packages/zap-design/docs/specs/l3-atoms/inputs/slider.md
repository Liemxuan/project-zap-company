# Slider — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Inputs
**Source:** `genesis/atoms/interactive/slider.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A form control that allows users to make selections from a range of values. The ZAP slider implements custom bounding properties mapping to `--color-primary`.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard Radix Slider | Thick background track with a sliding solid fill |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `defaultValue`| `number[]` | undefined | No | Uncontrolled starting bounds |
| `max` | `number` | `100` | No | Upper logic limit |
| `min` | `number` | `0` | No | Lower logic limit |
| `step`| `number` | `1` | No | Step increment magnitude |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `100%` | Enforced circular thumb tracker bounding |
| Track | `--color-primary`, `--color-secondary` | Progress indicator mapping vs fallback track |
| Outline | `--color-outline-variant` | Default border rendering fallback |

## 5. Accessibility
- Radix binds strictly to `role="slider"` and injects `aria-valuemax/aria-valuemin`.
- Completely accessible via Arrow Keys to increment/decrement smoothly.

## 6. Usage Examples
```tsx
<Slider
  defaultValue={[50]}
  max={100}
  step={1}
/>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Implement specific `min/max` bounds if values represent finite volumes | Don't use sliders for boolean toggles (Use a Switch) |
