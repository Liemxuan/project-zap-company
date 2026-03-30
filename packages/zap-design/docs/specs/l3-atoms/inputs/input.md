# Input — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Inputs
**Source:** `genesis/atoms/interactive/input.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
The `Input` primitive encompasses standard single-line semantic HTML data entry fields (`text`, `email`, `password`, `number`). It serves as the baseline stylistic foundation for all more complex entry formats like Currency or Phone.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Base input element | 1px border bounded area with `--input-height` baseline |
| `icon` | Embedded internal action | Appends leading or trailing SVG elements neatly inside the visual bounds |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `type` | `string` | `'text'` | No | Standard HTML input attribute defining data semantics |
| `placeholder` | `string` | undefined | No | Muted guidance text inside the box |
| `disabled` | `boolean` | `false` | No | Grays out the input and strips interactivity |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Border | `--input-border` | The raw bounding line color. Focus forces `--color-state-focus`. |
| Radius | `--input-radius` | Defines corner curvature for all input fields globally |
| Height | `--input-height` | The strict 34px-based universal height bounding |
| Type | `--font-m3-body` | Typographical input cascade |

## 5. Accessibility
- Focus outlines are forcefully governed globally using `ring-offset-2 ring-primary` to guarantee explicit visibility.
- Error states can be indicated by wrapping the label with `--color-state-error` text mappings.

## 6. Usage Examples
```tsx
<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Always map standard `.gap-1.5` metrics between inputs and labels | Don't create multi-line text fields with `Input` (Use `Textarea` instead) |
