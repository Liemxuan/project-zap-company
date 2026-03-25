# SOP-011: Design to Code Pipeline (ZAP-OS)

**Status:** ACTIVE | **Project:** ZAP-OS / OLYMPUS | **Protocol:** THE ARMORY / STITCH

## 1. Executive Summary

This SOP defines the strict 4-Phase handoff protocol between the human design team (Figma), the generative AI systems (Stitch), and the Olympus Swarm (Antigravity/Hydra) for autonomous code assembly. This eliminates pixel-tweaking loops and ensures 100% brand integrity.

## 2. The 4-Phase Pipeline

### Phase 1: The Brand Shell (OpenPencil Engine)

* **Action:** The OpenPencil Core Engine (via local TSX scripts) programmatically generates the skeletal grid, typography baselines, spacing primitives, and locked brand elements into a native `.fig` file.
* **Goal:** Establish absolute constraints (the "Shell") using strict Genesis components (e.g., `<Canvas>`, `<Panel>`, `<Card>`). Everything must map to `theme.json`, entirely bypassing Figma's web application.

### Phase 2: Generative Injection (Stitch / AI)

* **Action:** The Figma shell is fed to Stitch via MCP or OAuth. Stitch generates the "creative meat" (data tables, internal card layouts, complex interactions) *strictly within the borders* of the established shell.
* **Goal:** Rapidly ideate layouts without breaking the brand structure.

### Phase 3: Human Refinement (OpenPencil Desktop)

* **Action:** The generated Stitch artifacts are opened natively in the OpenPencil Desktop app. The design team reviews, aligns to the pixel grid, strips AI hallucinations, and saves the `.fig` file.
* **Goal:** Human-in-the-loop quality control occurring entirely on local `.fig` binaries.

### Phase 4: Autonomous Assembly (The Swarm / AI)

* **Action:** Antigravity (or the Swarm) processes the finalized local `.fig` file. Using the OpenPencil CLI/engine, the Swarm reads the precise JSON/CSS properties from the file.
* **Goal:** Direct 1:1 translation from the open `.fig` metadata to React code using the `src/genesis` components. Zero guesswork.

## 3. The Prime Directive: Component Symmetry

To prevent Stitch from hallucinating or destroying our internal design standards during generative phases, there must be absolute **1:1 Component Symmetry**:

* **Figma Component Name:** `Genesis / Atoms / Typography / Heading`
* **React Component Path:** `@/genesis/atoms/typography/headings.tsx`
* **Stitch Token Mapping:** If Stitch tries to introduce a new component, it must map to the closest existing structural atom, or it gets rejected in Phase 3.

This guarantees that when Stitch brings an ideation back into our ecosystem, it speaks our exact component language, preserving the ZAP-OS architecture.

---

## 4. Typography Test Case (The Proving Ground)

**Target:** `http://localhost:3002/debug/zap/atoms/typography`

To validate this pipeline, we apply it to the existing Typography component system.

**Objective:**
Map the existing React implementations of `Heading`, `Text`, and the `TypographyBody` structural layout directly into a new Figma Shell.

**Phase 1 Actions (OpenPencil Native):**

1. Execute the native TypeScript extraction loop (`extract-typography.ts`) using the `@open-pencil/core` library.
2. Generate the `.fig` shell encompassing the layouts defined in `/debug/zap/atoms/typography/page.tsx`.
3. Save the binary output directly to `/docs/designs/typography-shell.fig`.

**Next Steps:**
Pipe the `typography-shell.fig` into Stitch for generative manipulation, or manually build out the components in OpenPencil Desktop to finalize the design language.
