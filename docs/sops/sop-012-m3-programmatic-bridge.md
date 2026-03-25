# SOP-012: The M3 Programmatic Bridge (ZAP-OS)

**Status:** ACTIVE | **Project:** ZAP-OS / OLYMPUS | **Protocol:** THE ARMORY

## 1. Executive Summary

This SOP defines the universal architectural strategy for token management across the ZAP engine. It formally establishes **Material Design 3 (M3)** as the core mathematical backend for all design decisions, decoupling design logic from downstream implementation syntaxes like CSS (Tailwind) and Dart (Flutter).

## 2. ZAP as the "Middleman"

The core philosophy of the Olympus pipeline is that **ZAP sits in the middle**.

1. **Core Definition (M3 Logic):** We use M3's physics, HCT (Hue, Chroma, Tone) color spaces, and strict layer/typography semantics as the absolute source of truth. This provides mathematical certainty for accessibility and contrast ratios.
2. **The Central Engine (ZAP TOON Layer):** The `.context/tokens.toon` file holds our proprietary "ZAP Tokens," derived entirely natively from the M3 algorithms via a headless Node.js generator script.
3. **The Downstream Sinks (Tailwind/Flutter):** We execute the absolute *bare minimum* required to map these ZAP Tokens into Tailwind for the Web and Dart for Mobile.

Tailwind is treated strictly as a "dumb pipe"—a styling compiler that simply paints the pixels commanded by the `.toon` context layer.

## 3. The Programmatic Pipeline

We bypass Figma entirely for core token generation relying on the official `@material/material-color-utilities`.

### Generating Tokens

1. **Input:** A seed color (e.g., `#DFFF00`) is fed into `packages/zap-design/scripts/m3-theme-generator.ts`.
2. **Algorithm:** The script calculates the 0-100 tonal palette using HCT algorithms.
3. **Output (Context):** The system serializes the palette and outputs to `.context/tokens.toon`.
4. **Output (CSS):** The system generates the bridge file `packages/zap-design/src/styles/m3_tokens.css` mapping HCT hex values to CSS variables (e.g., `--md-sys-color-primary`).

### Consuming Tokens

- **React/Next.js:** `globals.css` and the `tailwind.config` consume the `m3_tokens.css` variables. Developers use semantic classes (e.g., `bg-primary`, `text-on-surface-variant`). **No hardcoded arbitrary values or legacy Tailwind colors are authorized.**
- **Flutter:** Mobile pipelines read the exact same `.toon` file to generate `zap_theme.dart`.

## 4. Subsystem Governance

### Elevation

Traditional drop-shadow elevation is deprecated. ZAP uses **M3 Tonal Elevation**, primarily relying on Surface Container scaling (`surface-container-lowest` to `surface-container-highest`) to create physical depth.

### Typography

All web typography must abide by the five-role M3 scale:

1. `Display`
2. `Headline`
3. `Title`
4. `Body`
5. `Label`
*(Each with Small, Medium, Large variants).*

This universal plan ensures that the design system remains purely "Mobile First" and fully cross-platform, as the design logic lives in mathematics rather than a specific frontend framework.
