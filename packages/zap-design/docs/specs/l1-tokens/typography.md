# Typography — L1 Token Specification

**Tier:** L1 (Physics) | **Category:** Typography
**Source:** `globals.css`, `typography-topology.md`, `typography-registry.ts` | **Last Updated:** 2026-03-28

## 1. Token Registry

### Font Families
| Token Name | CSS Variable | Tailwind | Font Name | Theme-Aware |
|------------|-------------|----------|-----------|-------------|
| Display | `--font-display` | `.font-display` | Space Grotesk | Yes |
| Body | `--font-body` | `.font-body`, `.font-secondary` | Inter | Yes |
| Mono | `--font-mono` | `.font-dev`, `.font-tertiary` | JetBrains Mono | No |

### The "H" Series (Heading Standards)
Font Family: Primary (`font-display` / Space Grotesk)
Usage: Hierarchy, module separation, and large visual points.

| Token Name | Target CSS Unit | Desktop Size | Mobile Size | Purpose |
|------------|-----------------|--------------|-------------|---------|
| H1 | `text-4xl`/`5xl` | 48px | 32px | The main title of a page. Only one per page. |
| H2 | `text-3xl`/`4xl` | 38px | 28px | For the big chapters or sections of a page. |
| H3 | `text-2xl`/`3xl` | 31px | 24px | For cards, widgets, or blocks of content. |
| H4 | `text-xl`/`2xl` | 25px | 20px | For smaller groups within a module. |
| H5 | `text-lg`/`xl` | 20px | 18px | Use this for a title that needs to stand out but stay small. |
| H6 | `text-base` | 16px | 14px | For very small labels that still need to be "titles." |

### The "Body" Series (Reading Standards)
Font Family: Secondary (`font-body` / Inter)
Usage: Structural text, readable content, and component labels.

| Token Name | Target CSS Unit | Desktop Size | Mobile Size | Purpose |
|------------|-----------------|--------------|-------------|---------|
| Body Large | `text-lg` | 18px | 16px | The "Intro": Use for first paragraph of an article. |
| Body Main | `text-base` | 16px | 16px | The "Standard": Use for 90% of all text. |
| Body Small | `text-sm` | 14px | 12px | The "Detail": Use for captions, dates, or secondary info. |
| Body Tiny | `text-xs` | 12px | 10px | The "Fine Print": Use for legal text or tiny tooltips. |

### Semantic Role-based Mapping (M3 Typography)
| Token Name | CSS Variable | Maps To |
|------------|-------------|---------|
| M3 Display | `--font-m3-display` | `var(--font-display)` |
| M3 Headline | `--font-m3-headline` | `var(--font-display)` |
| M3 Title | `--font-m3-title` | `var(--font-body)` |
| M3 Body | `--font-m3-body` | `var(--font-body)` |
| M3 Label | `--font-m3-label` | `var(--font-body)` |

### The Dev-Overlay Tokens
Font Family: Mono (`font-mono` / JetBrains Mono)
Usage: Technical UI overlays, debugging outputs, system labels.

| Token Name | Style Target | Visual Treatment | Purpose |
|------------|--------------|----------------|---------|
| Dev-Wrapper | 13px Mono / 400 | Magenta/Cyan text | Shows Div classes, Z-Index. |
| Dev-Note | 13px Mono / 700 | Yellow Highlight BG | Internal team notes. |
| Dev-Metric | 11px Mono / 400 | Small Gray text | Page load speed, API latency. |

## 2. Semantic Mapping
Typography relies on CSS variables populated at the document root to establish family trees (Display vs Body vs Mono). Structural component rendering maps to CSS variables (`--font-display`), while Tailwind utility classes (`font-display`, `font-body`) map to the exact same variables for ad-hoc typography styling.

Global text-transforms map through `--heading-transform`, `--body-transform`, `--dev-transform` logic dynamically to implement Neo-Brutalist ALL-CAPS if requested.

## 3. Theme Variants

| Theme | Vibe | Header Wght | Body Wght | Letter Spac | FX / Text-Shadow |
|-------|------|-------------|-----------|-------------|------------------|
| **CORE** | Technical | Black (900) | Med (500) | -0.02em (Tight) | None |
| **NEO** | Brutalist | X-Black (1000) | Semi (700) | -0.05em (Ultra-Tight) | `4px 4px 0px brand-yellow` |
| **METRO** | Clean UI | Bold (700) | Reg (400) | 0 (Normal) | None |
| **WIX** | Dark Future| Black (900) | Light (300) | +0.1em (Wide) | Glow: `0 0 10px teal` |

## 4. Usage Rules
- **✅ DO Decouple Scaling**: Use CSS scaling inside primitives instead of arbitrary utility pixel classes.
- **✅ DO use Font Aliases classes**: (`font-secondary`, `font-tertiary`) when building generalized structures that may swap exact font faces across themes.
- **❌ DON'T Use Arbitrary Pixel Values**: Always target one of the Token Scale names (H1-H6, Body Large-Tiny).
- **❌ DON'T Hardcode Font Weights**: Rely on the theme wrapper injecting variables into the component tree.
- **❌ DON'T Mix Display/Body**: Use Display strictly for titles and short headers, Body strictly for readable prose or tight component labeling.

## 5. Inspector Integration
Typography scale mappings, line-height sliders, and active `font-family` CSS Custom Properties are globally intercepted by ZAP Inspector Typography panel, enabling live font-swaps in realtime preview without unmounting standard components.
