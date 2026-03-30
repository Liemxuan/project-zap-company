# Elevation — L1 Token Specification

**Tier:** L1 (Physics) | **Category:** Elevation
**Source:** `globals.css` | **Last Updated:** 2026-03-28

## 1. Token Registry

### Shadows and Depth
| Token Name | CSS Variable | Default Value | Theme-Aware |
|------------|-------------|---------------|-------------|
| Card Shadow | `--card-shadow` | `0px 4px 6px rgba(0, 0, 0, 0.05)` | Yes |
| Button Shadow | `--btn-shadow` | *(Theme Generated)* | Yes |
| Text Shadow | `text-shadow` | `0 0.5px 1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)` | Yes |

### Component Shadow Aliases
| Token Name | CSS Variable | Maps To | Theme-Aware |
|------------|-------------|---------|-------------|
| Global Card Shadow | `--shadow-card` | `var(--card-shadow)` | Yes |

*Note: Z-Index scales are managed via standard Tailwind classes globally inside functional layout shells, not mapped to arbitrary variables, save for complex overlays (z-50) which reside in standard Radix configurations.*

## 2. Semantic Mapping
Elevation serves functional depth cues across varying visual themes.
In Neo-Brutalism (NEO theme), shadows morph into solid offset-colors (`4px 4px 0px black`), shedding blur radiuses. In flat design (METRO), shadows are eliminated completely (`box-shadow: none`), relying entirely on border boundaries and layer fill mapping. CORE maintains clean, soft, high-end Apple-style ambient dropshadows.

## 3. Theme Variants

| Theme | Vibe | Elevation Treatment | Shadow Physics |
|-------|------|---------------------|----------------|
| **CORE** (Baseline) | Neutral, high-legibility | Soft ambient shadow | `0px 4px 6px rgba(0, 0, 0, 0.05)` |
| **NEO** (Brutalist) | Raw, high-contrast | Solid offset black blocks | `4px 4px 0px #000` |
| **METRO** (Dense) | Compact, flat | Flat, strict borders | `none` |
| **WIX** (Dark) | Future-tech, dark mode | Soft glowing undertones | Colored translucent glows |

## 4. Usage Rules
- **✅ DO Use Semantic Shadows**: Apply `--card-shadow` or `--shadow-card` strictly on interactive surfaces that need depth separation from their Layer background (L1, L2).
- **✅ DO Honor Theme Overrides**: The CSS variable handles the transformation, so apply the custom CSS property via utility classes rather than hardcoded tailwind `shadow-lg` if you want theme adherence.
- **❌ DON'T Hardcode Box-Shadow**: Hardcoding string values in files breaks Neo Brutalist offsets and Metro's flat requirements instantly.

## 5. Inspector Integration
The ZAP Inspector `Elevation` modules parse active shadow variables and allow runtime modification of the blur radius, X/Y axes, and overall opacity against the Layer Context rendering dynamically without page reloads.
