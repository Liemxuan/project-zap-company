# ZAP Engine Checkpoint: architecture & pipeline Status

## 1. Theme Remix architecture (V2)

We have successfully decoupled the ZAP Engine from its original hard-coded Neo-Brutalist constraints and implemented a dynamic **4-Layer Theme Remix architecture**:

1. **CORE (Wireframe):** The neutral baseline (`src/app/globals.css`). It acts as a structural scaffold devoid of heavy opinions, leaning on light grays, whites, and subtle borders.
2. **NEO (ZAP DNA):** The high-contrast, Neo-Brutalist design (`src/themes/NEO/`). Bold borders, harsh shadows, vivid primary yellows (`#DFFF00`), and a sharp aesthetic. This is the official ZAP identity.
3. **METRO (Flat/Clean):** A reference standard referencing modern flat design aesthetics, perfect for testing less aggressive geometries.
4. **WIX (Experimental/Chaos):** A hyper-vibrant Cyberpunk/Neon "dumping ground" (`src/themes/WIX/`). Designed with `#00F0FF` cyans and `#FF007F` pinks alongside massive `9999px` corner radii and high-contrast borders specifically to test structural limits and force boundaries to break visibly.

Every theme operates via targeted CSS variable overrides mapped to HTML tags or utility wrappers (e.g. `.theme-neo`).

## 2. The Stitch Ingestion Pipeline ("Wash Protocol")

We established a formalized pipeline, the **BLAST Protocol**, to programmatically ingest raw HTML prototypes from the Stitch MCP and adapt them to the ZAP Engine:

* **Ingestion:** Implemented the "Stitch Dropzone" at `/debug/zap/stitch-dropzone` using Framer Motion. This tool natively queries Stitch, extracts the HTML, and presents it side-by-side with our translation canvas.
* **Translation Matrix (Google M3):** All semantic mapping now adheres strictly to the Material 3 standard. We mapped our arbitrary utility colors (`var(--color-layer-cover)`, `var(--color-brand-primary)`) to M3 aliases within `globals.css` (e.g., `--color-surface`, `--color-primary`).
* **Molecule Testing:**
  * **Brand Page:** Successfully transpiled the full "Design System Brand Page" through the Wash Protocol.
  * **Playful Wireframe:** Safely transplanted the complex, highly-custom "Playful About Me" wireframe into the Master Layer Shell, demonstrating that custom arbitrary Tailwind values (JIT) can co-exist alongside the M3 aliases.

## 3. Current Constraints & Limitations

### The "Wash" Abstraction Layer

The M3 Translation Matrix requires manual mapping of Stitch Tailwind classes to ZAP M3 tokens (e.g., changing `bg-[#white]` to `bg-surface` or `rounded-lg` to `rounded-shape-medium`). While we proved the concept works, scaling this requires an automated script or a stricter pre-compiler.

### Framer Motion Overhead

While Micro-animations (via Framer Motion) massively improve the subjective quality of the `StitchDropzone`, we rely heavily on the arbitrary `@/lib/animations.ts` presets. Overusing highly complex custom animations outside of this manifest could inflate the bundle size or cause hydration mismatches if not strictly controlled.

### Complex JIT Parsing (The "Playful" Edge Case)

The Playful Wireframe test proved we can ingest arbitrary inline styles (`<style dangerouslySetInnerHTML>`) and hardcoded hex values to retain specific "vibes." However, doing so breaks the 4-Layer Theme Remix. A hardcoded `bg-[#BAFFD9]` will *never* inherit a NEO or WIX theme. If a component graduates from "Wireframe" to a "Core Molecule", those hardcoded hexes MUST be mapped to the `translation_matrix_m3.md`.

## Next Strategic Moves

1. **Automated Washing:** Write a Node script capable of taking raw Stitch HTML and performing Regex replacements using the `translation_matrix_m3.md`.
2. **Organism Testing:** The Dropzone currently handles Pages/Brand Guidelines well. We need to stress-test complex interactive organisms (DataTables, Auth forms) to ensure context providers and state bindings survive the wash protocol.
