# Checkbox — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Inputs
**Source:** `genesis/atoms/interactive/checkbox.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
The `Checkbox` is a boolean input primitive used to select one or multiple items from a flat list, toggle specific individual settings, or grant user consent.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard Radix Checkbox | Solid colored bounded square containing an SVG check |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `checked` | `boolean\|'indeterminate'` | `false` | No | Managed state of the control |
| `onCheckedChange` | `function` | undefined | No | Callback toggling boolean true/false/indeterminate |
| `required` | `boolean` | `false` | No | HTML accessibility flag |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `--radius-shape-small`| Checkbox corner radius |
| Fill | `--color-primary` | Active background color indicating selection |
| Border | `--color-primary` | High-contrast mapping on active, `--color-card-border` on empty |

## 5. Accessibility
- Builds upon Radix UI, providing strict `role="checkbox"` bindings and hidden internal `<input>`.
- Properly manages 'indeterminate' states via the `aria-checked="mixed"` signature.

## 6. Usage Examples
```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Enforce space-x padding connecting it cleanly to its label | Don't use a Checkbox for instant layout changes (Use a Switch) |
