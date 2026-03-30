# Scroll — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Layout
**Source:** `genesis/atoms/layout/scroll-area.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
The `ScrollArea` atom replaces native browser scrollbars with cross-browser compatible, custom-styled scrollbars that match the ZAP M3 Aesthetic (1px minimalist lines rendering against outline variants).

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Auto-hiding | Scrollbar vanishes dynamically when mouse leaves |
| `always`  | Persistent | Scrollbar width stays visible against right gutter |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `type` | `'auto'\|'always'\|'hover'\|'scroll'` | `'hover'`| No | Visibility rules |
| `orientation`| `'vertical'\|'horizontal'` | `'vertical'`| No | Strict directional override |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Colors | `--md-sys-color-outline-variant` | Rest-state thumb background |
| Highlight| `--md-sys-color-outline` | Active/Hover thumb background |

## 5. Accessibility
- Requires no special ARIA roles as native scrolling functionality is maintained inside the wrapped viewport via `tabIndex=0`.

## 6. Usage Examples
```tsx
<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  <LongFormTextContent />
</ScrollArea>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Wrap long Dropdown Menus and Selects | Don't wrap the entire page `<main>` element, rely on global OS scrolling where possible |
