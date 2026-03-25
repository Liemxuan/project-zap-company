# ZAP Design Engine Strictness Protocol

## 1. ZAP as the Bridge (The Core Architecture)

M3 is the absolute, unquestionable source of truth for all design definitions, from Color to Typography to Layers.
ZAP sits directly in the middle as the translation layer.

- **Web/Tailwind** is merely a downstream output target, kept as minimal as possible.
- **App/Flutter** is a separate downstream output target.
We mirror M3 functionality completely to create our signature ZAP tokens.

## 2. Absolute Token Enforcement

The ZAP Design Engine operates on a strict **Three-Tier Token Hierarchy (M3 Standard)**:

1. **Reference Tokens (ref):** Raw foundational values (e.g., `#6750A4`). NEVER use these directly in components.
2. **System Tokens (sys):** Semantic roles that define the character of the theme (e.g., `md.sys.color.primary`).
3. **Component Tokens (comp):** Specific attributes for UI elements (e.g., `md.comp.filled-button.container.color`).

**CRITICAL RULE:** The usage of arbitrary values (magic numbers like `14px`, `#333`, `1rem`) is **STRICTLY FORBIDDEN**.
Agents and Engineers MUST exclusively use semantic tokens defined in the `.context/` Layer.

## 3. Context Layer (TOON)

Token-Oriented Object Notation (TOON) is the single source of truth for the design system.
All design decisions must be validated against the definitions in the `.context` directory. Do not hallucinate or guess hex values or pixel counts.

## 4. M3 Architectural Principles

* **Elevation:** Do not use legacy shadow-only elevation (drop shadows). Use **M3 Tonal Elevation** formulas combining appropriate system shadow tokens.
- **Typography:** Adhere strictly to the simplified M3 five-role scale: `Display`, `Headline`, `Title`, `Body`, and `Label` (each with `Small`, `Medium`, and `Large` variants). No ad-hoc `text-sm` unless mapped strictly to a defined role.
- **Color Model:** Colors are designed in the HCT (Hue, Chroma, Tone) space for perceptual uniformity. Do not arbitrarily shift hex codes without consulting the semantic intent.

If you are asked to style a component, you MUST scan the `.context/tokens/` directory first to find the appropriate mapping.
