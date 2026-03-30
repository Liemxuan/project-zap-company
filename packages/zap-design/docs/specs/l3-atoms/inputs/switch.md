# Switch — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Inputs
**Source:** `genesis/atoms/interactive/switch.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
An interactive boolean pill replacing checkboxes for "Instant Action" selections. Selecting a switch should immediately affect the UI/System, compared to Checkboxes which usually require a "Save/Submit" step after checking.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Clean pill | Smooth internal circle tracking to the right |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `checked` | `boolean` | `false` | No | Strict control state |
| `onCheckedChange` | `function` | undefined | No | Callback passing the new boolean |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `full` (`100%`) | Explicitly ignores system radius to mandate a pill shape |
| Active | `--color-primary` | Background fill engaging true state |
| Idle | `--color-outline-variant`| Background fill for disabled/false |

## 5. Accessibility
- Implements `role="switch"` natively.
- Evaluates `aria-checked` accurately.
- Connects immediately to standard `<Label htmlFor="">` attributes.

## 6. Usage Examples
```tsx
<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Use exactly like a Checkbox within JSX codebases | Don't use inside long multi-select forms waiting for a final Submit button |
