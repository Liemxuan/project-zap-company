# B.L.A.S.T. EXECUTION PLAN: THEME REMIX QA PROTOCOL

**Status:** ACTIVE
**Objective:** Establish a systematic, repeatable testing protocol for verifying the Theme Remix Engine refactor across the ZAP-Design component ecosystem.
**Prerequisite:** Local dev server MUST be running at `http://localhost:3000`.

> **CRITICAL DIRECTIVE:** We are testing the strict separation of structure (React) and paint (CSS variables). The ultimate test is that toggling between contrasting themes (e.g., "ZAP" vs "Midnight" or "Cyberpunk") results in a flawless visual morph, with absolutely *zero* hardcoded Neo-Brutalist remnants (like unexpected `#000` borders or `bg-white` patches).

---

## [B] - Blueprint (Test Target Identification)

We are systematically verifying the rendering of atomic elements, molecular compositions, and overarching structural organisms.

**Target URLs for Verification:**

1. **Inputs & Forms:** `http://localhost:3000/debug/zap/inputs`
2. **Navigation & Shell:** `http://localhost:3000/debug/zap/navigation`
3. **Spatial architecture:** `http://localhost:3000/debug/zap/layout-layers`
4. **Color Systems:** `http://localhost:3000/debug/zap/color`
5. **Interactive Primitives:** `http://localhost:3000/debug/zap/interactive`
6. **Typography & Scale:** `http://localhost:3000/debug/zap/typography`
7. **Status Indicators:** `http://localhost:3000/debug/zap/status`

## [L] - Logic (Evaluation Criteria)

For every target page, we evaluate against the following strict B.L.A.S.T. token logic:

1. **Surfaces (`bg-*`):** Are all backgrounds mapping to `--color-layer-canvas`, `--color-layer-cover`, and `--color-layer-panel`? Look for rogue bright white (`#FFF`) or stark black (`#000`) patches that don't shift when the theme changes.
2. **Borders (`border-*`):** Are all borders using `--color-card-border`, `--color-input-border`, or `--color-btn-border`? Look for hardcoded `border-black` or `border-2`.
3. **Radii (`rounded-*`):** Are all corner radii mapping to `--card-radius`, `--btn-radius`, or `--input-radius`? Look for elements that stay sharp (`rounded-none`) when a rounded theme is applied.
4. **Shadows (`shadow-*`):** Are all drop shadows mapping to `--shadow-card`, `--shadow-btn`, etc.? Look for hardcoded pixel translations (e.g., `4px 4px 0px #000`).
5. **Typography (`text-*`):** Is text contrast maintained? Are we using `--color-brand-midnight` (or inverted equivalents) instead of generic `text-black`?

## [A] - architecture (Testing Methodology)

Testing must be performed iteratively, shifting environmental variables to expose hardcoded flaws.

**The "Morph" Test Sequence:**

1. **Baseline (ZAP Default):** Load the target page. Ensure it matches the expected Neo-Brutalist brand baseline.
2. **Theme Switch:** Open the Theme Switcher (in the Vertical Navigation or at `/debug/zap/theme-remix`).
3. **Inversion (Midnight/Dark Mode):** Switch to a dark theme.
    * *Failure Mode:* Look for unreadable dark text on dark backgrounds or glaring white boxes (hardcoded `bg-white`).
4. **Softness (Curve/Modern):** Switch to a theme with soft shadows and rounded corners (e.g., Wix/Modern).
    * *Failure Mode:* Look for sharp 90-degree corners or harsh, solid-color drop shadows that didn't adapt to the blur.
5. **Dev Mode Overlay:** Toggle global `devMode` ON (`Ctrl/Cmd + D` if hotkeyed, or via UI toggle). Ensure all `<ContainerDevWrapper>` boundaries appear correctly layered and legible regardless of the current theme.

## [S] - Styling (Sequential Execution Plan)

We will execute this protocol one target at a time to isolate and destroy rogue tokens.

* [ ] **Phase 1: Foundation Check** -> `layout-layers` & `color`
* [ ] **Phase 2: Atomic Primitives** -> `typography`, `status`, `interactive`
* [ ] **Phase 3: Molecular Assembly** -> `inputs`
* [ ] **Phase 4: Organism Integration** -> `navigation`

## [T] - Tracking (Correction Loop)

When a rogue token is discovered during the sequence:

1. **Halt** the sequence.
2. **Identify** the exact file and line number using the React DevTools or Inspector.
3. **Execute** a targeted `replace_file_content` or `multi_replace_file_content` to swap the hardcoded Tailwind class (e.g., `bg-black`) for the semantic token (e.g., `bg-brand-midnight`).
4. **Verify** the fix in the browser across at least two contrasting themes.
5. **Resume** the sequence.
