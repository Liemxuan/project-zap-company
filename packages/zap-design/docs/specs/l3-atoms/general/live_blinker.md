# Live Blinker — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** General
**Source:** `genesis/atoms/indicators/LiveBlinker.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A small pulsing dot used to indicate active processes, real-time data streams, open WebSocket connections, or immediate notifications (e.g. system is "online").

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `online`| Success state | Pulses using `--color-state-success` |
| `alert` | Error state | Pulses using `--color-state-error` |
| `pending`| Warning state | Pulses using `--color-state-warning` |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `state`| `string` | `'online'`| No | Matches the variant list |
| `size` | `number` | `8px` | No | Overrides standard dimension |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| State | `--color-state-*` | Injected into the SVG fill and tailwind ping animation |
| Radius| `--radius-shape-small` | Typically perfect circle `border-radius: 50%` |

## 5. Accessibility
- Includes `aria-label="System status online"` for screen readers to describe color states.
- Hides decorative CSS pulsing spans via `aria-hidden="true"`.

## 6. Usage Examples
```tsx
<LiveBlinker state="online" />
<span>Server Connected</span>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Place beside status text labels or in Nav bars | Don't use to attract attention to marketing buttons |
