# Indicator — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Data Display
**Source:** `genesis/atoms/data-display/indicator.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A subtle overlay pip positioned absolutely at the corner of its parent element (such as an Avatar or a Bell Icon) to indicate unread status, new messages, or connectivity.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `active` | Default | Red/Primary dot on the top-right ring |
| `numbered`| Badge overlap | Dot containing a tiny integer |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `pulse` | `boolean` | `false` | No | Instantiates a tailwind `.animate-ping` effect |
| `count` | `number` | undefined | No | Replaces the solid dot with `1`, `9+` rules |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `100%` | Pure geometric circular pin |
| State | `--color-state-error` | Universally red (`Destructive`) indicating required attention |
| Space | `absolute -top-1 -right-1` | Tailwind pinning classes relative to its parent container |

## 5. Accessibility
- Must be complemented with an `aria-label` stating "1 unread notification" on the parent bounding container if interactive.

## 6. Usage Examples
```tsx
<div className="relative inline-flex">
  <Bell />
  <Indicator pulse={true} count={3} />
</div>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Apply exclusively to primary NavBar Action Icons | Don't create huge Indicators overlapping actual content lines |
