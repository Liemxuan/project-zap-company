# Accordion — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** General
**Source:** `genesis/atoms/layout/AccordionItem.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A vertically stacked set of interactive headings that each reveal an L2 or L3 sub-container of information. Often used inside the Inspector sidebar or Main Canvas.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard accordion row | Seamlessly blends into the background |
| `bordered`| Card-style accordion | Adds 1px `var(--card-border)` and `--card-radius` |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `type` | `'single'\|'multiple'` | `'single'` | Yes | Determines if multiple sections can be open at once |
| `value` | `string` | undefined | No | Controlled value for the opened item |
| `onValueChange`| `function` | undefined | No | Callback when selection changes |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Layer 1/2 | `--color-layer-base` | Defines the resting state background |
| Outline | `--color-outline-variant` | Defines the bottom divider line between sections |
| Body Font | `--font-m3-body` | Heading and content text typography |

## 5. Accessibility
- Full keyboard navigation (Up/Down arrows cycle headers).
- Evaluates native ARIA expanded/collapsed attributes automatically via Radix.

## 6. Usage Examples
```tsx
// Primary usage
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Nest small blocks of text or input toggles inside content | Don't put huge structural L2 cards inside an accordion row |
