# SOP-008: OLYMPUS UI EXTRACTION PROTOCOL

**Objective:** To achieve pixel-perfect, zero-bloat UI translation from Metronic Demo 1 to the ZAP Design Engine.

## The 3-Phase Pipeline

### Phase 1: Raw Extraction (Metronic Layout 1)

- **Goal:** Establish an offline structural reference.
- **Action:** Extract the raw HTML from `metronic-tailwind-html-demos/dist/html/demo1/` for the target page.
- **Command:** `npx serve -l 3001 /Users/zap/Workspace/metronic/metronic-tailwind-html-demos/dist`
- **Verification URL:** `http://localhost:3001/signin` (Maps to `/html/demo1/authentication/classic/sign-in.html` via `serve.json`)
- **Rule:** Do NOT use the Metronic React components yet (Port 3001 is for visual check only). Use the HTML (HTML is truth).

### Phase 2: Internal Refinement (The `Metro` Baseline)

- **Goal:** Replace raw HTML with ZAP Internal Atomic Components.
- **Action:**
    1. Map HTML elements to `MetroButton`, `MetroInput`, `MetroCard`, etc.
    2. Audit the local `dist/assets/css/styles.css` to match exact baseline variables (height, padding, radius).
    3. Ensure `http://localhost:3000/metro/[page]` is a 1:1 visual match to the local Metronic reference.
- **Rule:** This route must remain CLEAN and unbranded. It is our "Reference Base".

### Phase 3: Neo Theming (The `Neo` Adaptation)

- **Goal:** Apply the ZAP Brand/Neo-Brutalist visual layer.
- **Action:**
    1. Duplicate the `metro/[page]/page.tsx` structure into `neo/[page]/page.tsx`.
    2. Apply aggressive stylistic overrides (hard shadows, thick borders, `#facc15` highlights).
    3. Inject ZAP branding (ZapLogo, customized verbiage).
- **Rule:** Maintain structural parity with the Metro baseline. If the structure changes in Metro, it must change in Neo.

## Baseline Standards (Demo 1)

| Component | Height | Padding | Font Size | Radius |
| :--- | :--- | :--- | :--- | :--- |
| **Input (md)** | `h-8.5` | `px-3` | `0.8125rem` | `rounded-md (-2px)` |
| **Input (lg)** | `h-10` | `px-4` | `var(--text-sm)` | `rounded-md (-2px)` |
| **Button** | Matches Input | Matches Input | `font-medium` | Matches Input |

## Verification Protocol

1. **Visual Delta:** Open `3001` (Metronic) and `3000/metro` side-by-side. Use a specialized "Claw Team" prompt to audit for pixel shifts.
2. **Structural Audit:** Compare React Tree depth. Aim for flat, non-nested structures.
3. **Vietnamese Team Sync:** All extractions must be committed with the prefix `FEAT(metro): [page] extraction` before moving to Neo.
