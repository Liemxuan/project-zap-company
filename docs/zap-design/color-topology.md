# ZAP Design Engine: Color Topology

**Last Updated:** 2026-03-05
**Architecture:** SYSTEMS // CORE

This document defines the 4-theme color distribution system. Our architecture follows a **3-Layer Semantic System** (L1, L2, L3) to ensure that whether we are in a dense technical view (METRO) or a vibrant brutalist layout (NEO), the structural hierarchy remains intact.

---

## 01. The 3-Layer Semantic System

| Layer | Semantic Token | Purpose |
| :--- | :--- | :--- |
| **L1 (Foundation)** | `--color-layer-canvas` | The ultimate background of the page or workspace. |
| **L2 (Surface)** | `--color-layer-cover` | Primary content containers (Cards, Sections, Blocks). |
| **L3 (Panel)** | `--color-layer-panel` | Interactive sidebars, navigation pods, and floating menus. |

---

## 02. Theme-Specific Color Formats

### 🌑 CORE (Baseline Technical)

* **Vibe:** Neutral, high-legibility, standard "Developer" feel.
* **L1:** `#F8FAFC` (Slate 50)
* **L2:** `#FFFFFF` (White)
* **L3:** `#F1F5F9` (Slate 100)
* **Key Brand:** `--color-brand-midnight` (#1A1A14)

### ⚡ NEO (Neo-Brutalist)

* **Vibe:** Raw, high-contrast, aggressive interactive states.
* **L1:** `#bdf2d5` (Bright Mint)
* **L2:** `#ffffff` (White)
* **L3:** `#fdf6b0` (Soft Yellow)
* **Key Brand:** High-contrast thick borders (`#1e293b`)

### 🏙️ METRO (Dense Productivity)

* **Vibe:** Compact, flat, productivity-first (Windows 10/11 style).
* **L1:** `#F3F2F1` (Neutral Gray)
* **L2:** `#FFFFFF` (White)
* **L3:** `#FAFAFA` (Ghost White)
* **Key Brand:** Microsoft-standard Blue (`#0078D4`)

### 🔮 WIX (Experimental Dark)

* **Vibe:** Future-tech, dark-mode, neon highlights.
* **L1:** `#090014` (Deep Space)
* **L2:** `#1A0B2E` (Midnight Purple)
* **L3:** `#2D1445` (Royal Panel)
* **Key Brand:** Neon Magenta (`#FF007F`) and Cyan (`#00F0FF`)

---

## 03. Functional State Standards

All themes must map their specific colors to these functional tokens to maintain logic compatibility throughout the engine:

* `--color-state-success`: Green range.
* `--color-state-error`: Red range.
* `--color-state-warning`: Orange/Amber range.
* `--color-state-info`: Blue/Teal range.

---

## Audit Mandate

1. **Never hardcode hex values** in components.
2. **Use Layer Tokens** (L1, L2, L3) for layouts.
3. **Use Brand Tokens** for identity points.
