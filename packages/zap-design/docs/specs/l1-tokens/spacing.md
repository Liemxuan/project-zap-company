# Spacing — L1 Token Specification

**Tier:** L1 (Physics) | **Category:** Spacing
**Source:** `globals.css` | **Last Updated:** 2026-03-28

## 1. Token Registry

### Form & Layout Gaps
| Token Name | CSS Variable | Default Value | Purpose |
|------------|-------------|---------------|---------|
| Form Gap | `--spacing-form-gap` | `24px` | Distance between major form block groupings |
| Element Gap | `--spacing-element-gap` | `16px` | Vertical/Horizontal spacing between adjacent items |
| Card Padding | `--spacing-card-pad` | `24px` | Standard internal inset padding for Cards/Panels |

### Navigation Spacing
| Token Name | CSS Variable | Default Value | Purpose |
|------------|-------------|---------------|---------|
| Category Gap | `--nav-gap-category` | `8px` | Space between navigation group titles |
| Item Gap | `--nav-gap-item` | `4px` | Space between clickable nav objects |
| Expansion Pad | `--nav-expansion-pad` | `8px` | Expansion indicator padding |

### Dimensions & Constraints
| Token Name | CSS Variable | Default Value | Purpose |
|------------|-------------|---------------|---------|
| Input Height | `--input-height` | `34px` | Default height for precise inputs |
| Button Height | `--button-height` | `34px` | Standard button alignment |
| Btn Height Large | `--button-height-large` | `34px` | Primary CTA/Hero bounds |
| Card Max Width | `--card-max-width` | `400px` | Maximum structural card limit |

## 2. Semantic Mapping
Spacing constraints represent the densification engine of ZAP. A high-density environment like METRO tightens padding requirements against input elements seamlessly through CSS overrides, while CORE relies on high-end whitespace rules. Form Gaps are universally declared to prevent component drifting.

## 3. Theme Variants

| Theme | Vibe | Padding Application | Density Type |
|-------|------|---------------------|--------------|
| **CORE** (Baseline) | Neutral, airy | Comfortable (`24px` pads) | Relaxed/Standard |
| **NEO** (Brutalist) | Raw, high-contrast | Aggressive, chunky | Oversized padding |
| **METRO** (Dense) | Compact, flat | Highly constrained (`12px`) | High-Density |
| **WIX** (Dark) | Future-tech | Large negative space | Standard Dark |

## 4. Usage Rules
- **✅ DO Use Layout Spacing Vars**: Within custom components, hook vertical stacks directly to `--spacing-element-gap` for universal density awareness.
- **✅ DO Maintain Height Synchronization**: Elements side-by-side using `--input-height` and `--button-height` guarantee alignment, overriding standard Tailwind height discrepancies inside tight grid interfaces.
- **❌ DON'T Use Hardcoded Rem Metrics for Flex Gaps**: Hardcoding values breaks the ability for the inspector to push dense-mode toggles instantly.

## 5. Inspector Integration
Spacing toggles like "Dense Mode" or standard sliders dynamically alter `.layer-base` element gap requirements, triggering realtime reflow operations on complex table headers and modal paddings directly through these variables.
