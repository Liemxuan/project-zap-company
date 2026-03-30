# Textarea — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Inputs
**Source:** `genesis/atoms/interactive/textarea.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
The `Textarea` atom extends standard Input capabilities to multiline text fields (Bio, descriptions, JSON editors). It aligns fully to ZAP Input geometries but overrides the height restrictions natively.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard box | Maintains `min-h-[80px]` bound |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `placeholder`| `string` | undefined | No | Default faded text preview |
| `disabled` | `boolean` | `false` | No | Blocks interactive manipulation |
| `onResize` | `function` | undefined | No | Hooks to track dimension updates |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `--input-radius` | Defines corner curvature identically to single-line Inputs |
| Border | `--input-border` | Uses the primary `--color-state-focus` on click |
| Typography | `--font-m3-body` | Reverts `textarea` to generic fonts from browser defaults |

## 5. Accessibility
- Ensures visible focus via `ring-2 ring-primary`.
- Enforces `aria-invalid` if connected to validation schemas mapping errors.

## 6. Usage Examples
```tsx
<div className="grid w-full gap-1.5">
  <Label htmlFor="message">Your message</Label>
  <Textarea placeholder="Type your message here." id="message" />
</div>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Allow users to vertically resize unless in an explicit form wizard | Don't lock horizontal resizing (allow width to adapt to parent layout grids) |
