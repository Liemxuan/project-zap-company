# Label — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** General
**Source:** `genesis/atoms/interactive/label.tsx`, `genesis/atoms/typography/label.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
Provides an accessible, standard text label for form inputs and toggles. This is the canonical text wrapping element for any input.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard form label | Bold or Medium weight depending on theme |
| `muted` | Secondary descriptor | Smaller, uses `--color-iso-gray-600` |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `htmlFor` | `string` | undefined | Yes | Links label directly to an input's ID |
| `required` | `boolean` | `false` | No | Appends a visual `*` to semantic markup |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Typography | `--font-m3-label` | Defines the text sizing scale |
| Color | `--color-on-surface` | Primary text legibility |

## 5. Accessibility
- Must ALWAYS provide an `htmlFor` prop that precisely matches the adjacent input's `id`.
- Automatically responds to associated disabled inputs by matching their opacity.

## 6. Usage Examples
```tsx
// Primary usage
<Label htmlFor="email" required>Email Address</Label>
<Input id="email" type="email" />
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Place firmly above or strictly inline with a checkbox | Don't wrap raw text around inputs without using `<Label>` |
