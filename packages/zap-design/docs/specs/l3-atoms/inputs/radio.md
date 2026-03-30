# Radio — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Inputs
**Source:** `genesis/atoms/interactive/radio-group.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
The `RadioGroup` represents a set of mutually exclusive, single-choice options where all available choices should be transparently visible to the user at once (vs a Select dropdown).

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard Radix Radio | Circular hollow ring showing filled inner circle on selection |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `defaultValue`| `string` | undefined | No | The uncontrolled starting value |
| `value` | `string` | undefined | No | The controlled active value |
| `onValueChange`| `function` | undefined | No | Callback firing on new selection |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `full` (`100%`) | Explicitly ignores system radius to mandate a perfect circular UX |
| Color | `--color-primary` | Fills the interior SVG dot upon activation |
| Border | `--color-primary` | Renders the primary border upon activation, falling back to `--color-outline` |

## 5. Accessibility
- Requires a wrapper `RadioGroup` component ensuring `role="radiogroup"`.
- Focus manages natively spanning across children using standard arrow-keys instead of pure Tab indexing.

## 6. Usage Examples
```tsx
<RadioGroup defaultValue="comfortable">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="default" id="r1" />
    <Label htmlFor="r1">Default</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="comfortable" id="r2" />
    <Label htmlFor="r2">Comfortable</Label>
  </div>
</RadioGroup>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Apply spacing gaps explicitly between radio options | Don't use Radio lists for booleans (Use a Checkbox instead) |
