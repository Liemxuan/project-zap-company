# Colors — L1 Token Specification

**Tier:** L1 (Physics) | **Category:** Colors
**Source:** `globals.css`, `color-topology.md` | **Last Updated:** 2026-03-28

## 1. Token Registry

### Core Identity & Brand
| Token Name | CSS Variable | Default Value | Theme-Aware |
|------------|-------------|---------------|-------------|
| Brand Midnight | `--color-brand-midnight` | `#1A1A14` | Yes |
| Brand Teal | `--color-brand-teal` | `#94A3B8` | Yes |
| Brand Yellow | `--color-brand-yellow` | `#F1F5F9` | Yes |
| Brand Magenta | `--color-brand-magenta` | `#CBD5E1` | Yes |
| Off White | `--color-off-white` | `#F4F4F5` | No |
| Cream White | `--color-cream-white` | `#FDFDFD` | No |
| Zinc Cream | `--color-zinc-cream` | `#F5F5F0` | No |

### Semantic Brand Mapping
| Token Name | CSS Variable | Maps To | Theme-Aware |
|------------|-------------|---------|-------------|
| Primary Brand | `--color-brand-primary` | `var(--color-brand-yellow)` | Yes |
| Secondary Brand | `--color-brand-secondary` | `var(--color-brand-teal)` | Yes |
| Tertiary Brand | `--color-brand-tertiary` | `var(--color-brand-magenta)` | Yes |

### 3-Layer Semantic System (M3 / ZAP Surface Containers)
| Layer Level | Semantic Token | M3 Mapping | Purpose |
|-------------|----------------|------------|---------|
| **L0** Base | `--color-layer-base` | `--md-sys-color-surface-container-lowest` | Lowest background behind canvas |
| **L1** Canvas | `--color-layer-canvas` | `--md-sys-color-surface-container-low` | The ultimate background of the page or workspace |
| **L2** Cover | `--color-layer-cover` | `--md-sys-color-surface-container` | Primary content containers (Cards, Sections, Blocks) |
| **L3** Panel | `--color-layer-panel` | `--md-sys-color-surface-container-high` | Interactive sidebars, navigation pods, floating menus |
| **L4** Dialog | `--color-layer-dialog` | `--md-sys-color-surface-container-highest` | Modals, overlays |
| **L5** Modal | `--color-layer-modal` | `--md-sys-color-surface-container-highest` | Top-most alerts |

### Functional States (ISO Standard)
| Token Name | CSS Variable | Default Value | Purpose |
|------------|-------------|---------------|---------|
| Success | `--color-state-success` | `#2E7D32` | Success actions, completed states |
| Error | `--color-state-error` | `#B3261E` | Destructive actions, warnings |
| Warning | `--color-state-warning` | `#FF8F00` | Cautions, pending states |
| Info | `--color-state-info` | `#0288D1` | Information, secondary focus |
| Focus | `--color-state-focus` | `#0288D1` | Keyboard focus ring outlines |

### Neutral Scale (ISO Standard)
| Token Name | CSS Variable | Default Value |
|------------|-------------|---------------|
| Black | `--color-iso-black` | `#000000` |
| White | `--color-iso-white` | `#FFFFFF` |
| Gray 900 | `--color-iso-gray-900` | `#1A1A14` |
| Gray 600 | `--color-iso-gray-600` | `#475569` |
| Gray 400 | `--color-iso-gray-400` | `#94A3B8` |
| Gray 100 | `--color-iso-gray-100` | `#F1F5F9` |

## 2. Semantic Mapping
Our architecture follows a **3-Layer Semantic System** (L1, L2, L3) to ensure that whether we are in a dense technical view (METRO) or a vibrant brutalist layout (NEO), the structural hierarchy remains intact. Formats dynamically adjust based on the body's active theme scope.

Deep M3 mappings translate direct standard `--md-sys-*` tokens via the M3 Core Bridge for pure material compliance, resolving `--color-primary`, `--color-surface`, and `--color-error` directly.

## 3. Theme Variants

| Theme | Vibe | L1 (Canvas) | L2 (Cover) | L3 (Panel) | Key Brand Driver |
|-------|------|-------------|------------|------------|------------------|
| **CORE** (Baseline) | Neutral, high-legibility developer feel | `#F8FAFC` | `#FFFFFF` | `#F1F5F9` | `#1A1A14` (Midnight) |
| **NEO** (Brutalist) | Raw, high-contrast, aggressive states | `#bdf2d5` (Mint) | `#ffffff` | `#fdf6b0` (Yellow) | `#1e293b` (Thick borders) |
| **METRO** (Dense) | Compact, flat, Windows-style | `#F3F2F1` (Gray) | `#FFFFFF` | `#FAFAFA` (Ghost) | `#0078D4` (Microsoft Blue) |
| **WIX** (Dark) | Future-tech, dark mode | `#090014` (Deep Space) | `#1A0B2E` | `#2D1445` (Royal) | Neon Magenta / Cyan |

## 4. Usage Rules
- **✅ DO Use Layer Tokens (L1, L2, L3)** for layout surfaces (e.g. `bg-layer-canvas`).
- **✅ DO Use Brand Tokens** for identity points, accents, and hero text.
- **✅ DO Respect M3 Overrides** — `globals.css` bridges them. Rely on semantic names.
- **❌ DON'T Hardcode Hex Values** — Ever. Anywhere. Hardcoding breaks thematic rendering.
- **❌ DON'T Use Arbitrary Opacity** on surfaces. Surface hierarchy is managed by the system.

## 5. Inspector Integration
- **Layer Debug System**: Toggling `[data-devmode="true"]` visually reveals L0-L5 structure natively via `color-mix()` injecting rainbow debug colors.
- **Dynamic Publishers**: `--layer-X-bg-opacity`, border colors, and border parameters dynamically mutate at runtime via the ZAP Inspector.
