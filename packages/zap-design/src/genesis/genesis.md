# Genesis: The Master Mold

This directory contains the **Level 1: Atoms** that form the DNA of the ZAP Design Engine.

## Atom Structure (The 6 Pillars)

1. **Typography** (`typography/` folder) - Headings, Body Text, Mono, Display.
2. **Colors & Surface** (`surfaces/` folder) - Backgrounds, Borders, Dividers, Overlays.
3. **Icons** (`icons/` folder) - Material Symbols, Custom SVGs, Brand Logos.
4. **Interactive Elements** (`interactive/` folder) - Buttons, Inputs, Checkboxes, Toggles.
5. **Status & Indicators** (`status/` folder) - Badges, Progress Bars, Tooltips, Alerts.
6. **Layout** (`layout/` folder) - Grid units, Spacing tokens, Containers.

## Inheritance Pattern

To create a derivative theme (e.g., **ZAP**, **Neo**, **Metro**), copy this folder structure into a new directory and replace the internal variables. Filenames MUST remain identical for 1:1 swappability.

| Atom Pilar | Genesis Component (Master) | Implementation Rule |
| :--- | :--- | :--- |
| **1. Typography** | `atoms/typography/*.tsx` | Swap font families and scales. |
| **2. Surfaces** | `atoms/surfaces/*.tsx` | Swap background hex and border-widths. |
| **3. Icons** | `atoms/icons/*.tsx` | Swap icon sets or weights. |
| **4. Interactive** | `atoms/interactive/*.tsx` | Swap hover/active states and rounding. |
| **5. Status** | `atoms/status/*.tsx` | Swap semantic color tokens (Success/Error). |
| **6. Layout** | `atoms/layout/*.tsx` | Swap spacing and grid increments. |

## The Swap Rule

1. **Folder Identity**: Only the parent folder name (e.g., `genesis`, `zap`, `neo`) changes.
2. **File Consistency**: Filenames (e.g., `headings.tsx`) MUST remain identical across all themes.
3. **Internal logic**: Component identities (e.g., `export const Heading`) are consistent for 1:1 replacement.

## Theme IDs

- **Genesis**: `000` (Standard Baseline)
- **ZAP**: `001` (Neo-Brutalist / Heavy Borders)
- **Metro**: `002` (Modern SaaS / Clean)
- **Neo**: `003` (Glassmorphism / Blurs)
