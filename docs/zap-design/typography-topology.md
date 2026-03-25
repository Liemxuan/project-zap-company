# ZAP Design Engine: Typography Topology

**Last Updated:** 2026-03-05

This document serves as the definitive topology database for the ZAP Design Engine typography tokens. All components, standardizations, and design systems must wrap around these defined token schemas strictly. This ensures consistency across responsive designs (Desktop/Mobile).

---

## 01. The "H" Series (Heading Standards)

**Font Family:** Primary (`font-display` / Space Grotesk)
**Usage:** Hierarchy, module separation, and large visual points.

| Token Name | Desktop Size | Mobile Size | Purpose |
| :--- | :--- | :--- | :--- |
| `H1` | 48px | 32px | The main title of a page. Only one per page. |
| `H2` | 38px | 28px | For the big chapters or sections of a page. |
| `H3` | 31px | 24px | For cards, widgets, or blocks of content. |
| `H4` | 25px | 20px | For smaller groups within a module. |
| `H5` | 20px | 18px | Use this for a title that needs to stand out but stay small. |
| `H6` | 16px | 14px | For very small labels that still need to be "titles." |

---

## 02. The "Body" Series (Reading Standards)

**Font Family:** Secondary (`font-body` / Inter)
**Usage:** Structural text, readable content, and component labels.

| Token Name | Desktop Size | Mobile Size | Purpose |
| :--- | :--- | :--- | :--- |
| `Body Large` | 18px | 16px | The "Intro": Use for the first paragraph of an article. |
| `Body Main` | 16px | 16px | The "Standard": Use for 90% of all text. Very easy to read. |
| `Body Small` | 14px | 12px | The "Detail": Use for captions, dates, or secondary info. |
| `Body Tiny` | 12px | 10px | The "Fine Print": Use for legal text or tiny tooltips. |

---

## 03. The Dev-Overlay Tokens

**Font Family:** Mono (`font-mono` / JetBrains Mono)
**Usage:** Technical UI overlays, debugging outputs, system labels.

| Token Name | Style Target | Visual Treatment | Purpose |
| :--- | :--- | :--- | :--- |
| `Dev-Wrapper` | 13px Mono / 400 | Magenta or Cyan text | Shows Div classes, Component Names, or Z-Index |
| `Dev-Note`| 13px Mono / 700 | Yellow Highlight BG | Internal team notes or "To-Do" left in the UI |
| `Dev-Metric` | 11px Mono / 400 | Small Gray text | Page load speed, API latency, or "Heartbeat" status |

---

---

## 04. Theme-Specific Typography Formats

All themes must map to the "H" and "Body" series, but their visual implementation (weights, families, tracking) varies by theme format:

### 🌑 CORE (Standard Baseline)

* **Vibe:** Technical, neutral, standard hierarchy.
* **Header Weight:** Black (900)
* **Body Weight:** Medium (500)
* **Letter Spacing:** -0.02em (Tight)

### ⚡ NEO (Brutalist Impact)

* **Vibe:** High-impact, extreme weights.
* **Header Weight:** Extra-Black (1000)
* **Body Weight:** Semi-Bold (700)
* **Letter Spacing:** -0.05em (Ultra-Tight)
* **Effect:** Text shadows allowed (`4px 4px 0px var(--color-brand-yellow)`).

### 🏙️ METRO (Clean UI)

* **Vibe:** Flat, airy, modern-system feel.
* **Header Weight:** Bold (700)
* **Body Weight:** Regular (400)
* **Letter Spacing:** 0 (Standard)
* **Effect:** No shadows, clear contrast.

### 🔮 WIX (Dark Future)

* **Vibe:** Futuristic, high-tech, glow-friendly.
* **Header Weight:** Black (900)
* **Body Weight:** Light (300)
* **Letter Spacing:** 0.1em (Wide tracking)
* **Effect:** Subtle glowing text shadows allowed (`0 0 10px var(--color-brand-teal)`).

---

### Implementation Directives

* **Do not use arbitrary pixel values.** Always target one of the Token Names above.
* **Decoupled Scaling:** If an object is "Body Main", its numeric output handles Desktop/Mobile scaling intrinsically within the underlying CSS/Component, NOT at the application layout level.
* **Theme-Awareness:** Use the `useTheme` hook or CSS variables (`--font-weight-header`, etc.) to ensure the component adapts to the active theme's format automatically.
