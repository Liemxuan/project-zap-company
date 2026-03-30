# UI-SPEC: Deerflow 2.0 Fleet Manager

**Status:** DRAFT | **Theme:** METRO | **Architecture:** ZAP-OS / 3-Pane HUD

## 1. Top-Level Layout (The Core Shell)
The UI leverages the strict 3-pane Command Center architecture.
*   **Container Shell:** `div` with `bg-layer-base h-screen flex flex-row overflow-hidden`
*   **Left Pane (Nav):** `w-64 bg-layer-cover border-r border-[var(--color-outline-variant)]`
*   **Center Canvas:** `flex-1 bg-layer-base overflow-y-auto`
*   **Right Inspector (Settings):** `w-80 bg-layer-panel border-l border-[var(--color-outline-variant)]`

## 2. Atoms -> Metro Mapping
*   **Nav Item (Channels/Queues):**
    *   `className`: `text-on-surface-variant hover:text-on-surface hover:bg-[var(--color-layer-base)] p-[var(--spacing-md)] rounded-[var(--card-radius)]`
    *   **Typography:** `<span className="font-m3-label-medium">`
*   **Job Row (Center Canvas):**
    *   A grid of `Card` elements mapping to `bg-layer-cover` with `shadow-[var(--shadow-elevation-1)]`.
    *   Job ID **Typography:** `<span className="font-m3-title-medium text-on-surface">`
    *   Status **Badge:** `<Badge className="bg-state-success text-on-success font-m3-label-small">Active</Badge>`
*   **Inspector Accordions (Right Pane):**
    *   Consumes the audited `<Accordion>` atom.
    *   Background strictly bound to `{ bg: 'var(--color-layer-panel)' }`.
    *   Content sections for `Model Routing (Gemini 3.1 Pro -> Spike)`, `VFS Paths`, `Token Burn Rate`.

## 3. Strict Prohibitions (Jerry's Guardrails)
*   **NO** `bg-white`, `bg-gray-100`, `text-black`, `text-blue-500`.
*   **NO** inline `<h1 className="text-2xl font-bold">`.
*   **MUST** rely entirely on the ZAP Design Engine context and dynamic properties.
