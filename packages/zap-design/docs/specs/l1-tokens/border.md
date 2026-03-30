# Border — L1 Token Specification

**Tier:** L1 (Physics) | **Category:** Border
**Source:** `globals.css` | **Last Updated:** 2026-03-28

## 1. Token Registry

### Structural Radii (Component-Level)
| Token Name | CSS Variable | Default Value | Purpose |
|------------|-------------|---------------|---------|
| Base Radius | `--radius` | `0.5rem` | Universal fallback curve |
| Card Radius | `--card-radius` | `4px` | Curve for primary L2 surface containers |
| Button Radius | `--btn-radius` | `4px` | Curve for interactive primary atoms |
| Input Radius | `--input-radius` | `8px` | Curve for interactive data fields |

### Shape System (M3 Base Variants)
| Token Name | CSS Variable | M3 Core Base | Purpose |
|------------|-------------|--------------|---------|
| Shape Small | `--radius-shape-small` | `4px` | Badges, tooltips |
| Shape Medium| `--radius-shape-medium` | `var(--card-radius)` | Dialogs, menus |
| Shape Large | `--radius-shape-large` | `24px` | Sub-sections, large overlays |

### Border Colors & Widths
| Token Name | CSS Variable | Default Value | Purpose |
|------------|-------------|---------------|---------|
| Card Border | `--card-border` | `#E5E5E5` | L2 explicit boundary |
| Input Border | `--input-border` | `#E5E5E5` | Active data form field boundary |
| Card Border W | `--card-border-width` | `1px` | Variable thickness for hierarchy |
| Button BorderW| `--button-border-width` | `1px` | Used dynamically in `.btn-border-width` utils |
| Outline Var | `--color-outline-variant` | From M3 Sys | Disabled elements, subdued borders |
| Outline | `--color-outline` | From M3 Sys | High contrast structural borders |

## 2. Semantic Mapping
Borders are a critical design tool in rendering active "Modes" across themes. M3's `--color-outline-variant` represents the most subtle layer, while theme variables inject specific structural boundaries.

All components alias to `--radius-btn`, `--radius-input` and `--radius-card` rather than using the baseline `rounded-md` class from Tailwind, which allows universal visual theme changes.

## 3. Theme Variants

| Theme | Vibe | Border Strategy | Border Width Standard | Radius Strategy |
|-------|------|-----------------|-----------------------|-----------------|
| **CORE** (Baseline) | High-legibility | Subtle light gray `1px` bounds | `1px` | Relaxed (`4-8px`) |
| **NEO** (Brutalist) | High-contrast | Extremely aggressive solid black | `3px-4px` | Sharp (`0px`) |
| **METRO** (Dense) | Flat | Non-existent, or soft 1px gray dividers | `1px` | Sharp (`0px`) |
| **WIX** (Dark) | Future-tech | Thicker neon boundaries or inset glows | `2px` | High-curve/Pill (`99px`) |

## 4. Usage Rules
- **✅ DO Use Semantic Radix Overrides**: Map components directly to `var(--btn-radius)` instead of explicitly passing strings like `4px`.
- **✅ DO Implement Dynamic Border Width Utility**: Use `.btn-border-width` helper which automatically evaluates the `max(var(--button-border-width, 1px), 1px)` logic per component style.
- **❌ DON'T Apply `border-2` Tailwind arbitrary classes**: This actively rejects the Neo-Brutalism theme which scales border widths up programmatically based on user selections.

## 5. Inspector Integration
The Inspector provides global radius sliders (e.g., sharp corners `0px` vs pill-buttons `999px`) tracking strictly to `--btn-radius` and `--card-radius`. Border Width dynamically expands based on style selection.
