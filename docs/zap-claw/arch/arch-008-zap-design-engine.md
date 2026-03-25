# arch-008: ZAP Design Engine (Neo-Brutalism Strategy)

**Date:** March 1, 2026
**Topic:** Architecting the 7-Level Design System over the Metronic Tailwind Template
**Status:** PROPOSED

## 1. The Directive

The goal is to build the **ZAP Design Engine**, a definitive, top-level workspace (`~/Workspace/zap-design`) that sits squarely alongside `zap-claw`. This repository is the absolute core foundation where we build themes, templates, and components for our customers.

We are adopting the **Metronic Tailwind HTML Template** (`~/Workspace/metronic`) as the initial base layer—*not* ZAP's internal design language yet. This ensures our language, classes, and structures are hyper-standardized, AI-friendly, and industry-ready out of the box.

**Tech Stack Mandate (Strict Enforcement):**

* **Framework:** Next.js (React 19) + TypeScript exclusively.
* **Styling:** Tailwind CSS v4 (CSS-first configuration).
* **Typography:** Google Fonts (via `@next/font/google` for zero-layout-shift).
* **Iconography:** Google Material Symbols/Icons (replacing any native Metronic icon libraries).
* **Animation:** Framer Motion (via ZAP `motion` skill for micro-interactions and gestures).

**The Workflow:**

1. The Design Engine ingests Metronic components.
2. The elements are structured into a strict 7-level Atomic React hierarchy utilizing the strict Tech Stack defined above.
3. **Naming Stricture:** Absolutely no Metronic naming conventions or proprietary utility classes will survive extraction. Everything must be mapped to standard **ISO naming conventions**, **Google Default** structures, and semantic HTML5 for maximum SEO indexing.
4. The resulting modular system allows customers to use ZAP tools to deeply fine-tune their aesthetic (scale, typography, branding).
5. We will build two foundational themes to prove this engine:
   * **"Metro"**: The baseline translation of Metronic into our standard, SEO-optimized semantic React architecture.
   * **"Neo"**: The ultimate proof-of-concept, mutating "Metro" into the stark Neo-Brutalist aesthetic referenced previously.

## 2. The 7-Level Component architecture (Atomic+)

We build from the sub-atomic physics up to the full application page. Every level *only* imports elements from the levels below it.

### Level 1: The Physics (Design Tokens)

The fundamental constants controlled by the Merchant in the Admin Portal. These are CSS variables injected at the `:root` level and intercepted by Tailwind v4.

* **Stitch Project:** `ZAP - 7 levels - Atoms` (ID: `5879712876464146958`)
* **Examples:** `--font-sans` (Google Font reference), `--color-primary`, `--border-radius-hard`
* **Location:** `src/app/globals.css`

### Level 2: The Primitives (The Atoms)

The rawest HTML elements wrapped in React, enforcing the Level 1 physics. They have zero business logic. In the **Genesis Master Mold**, these are organized into 6 pillars:

1. **Typography** (`typography/`) - Headings, Body, Mono.
2. **Colors & Surface** (`colors/`) - Cards, Dividers, Overlays.
3. **Icons** (`icons/`) - Brand and System iconography.
4. **Interactive Elements** (`interactive/`) - Buttons, Inputs, Toggles.
5. **Status & Indicators** (`status/`) - Badges, Alerts, Tooltips.
6. **Layout** (`layout/`) - Spacing, Grid units, Containers.

* **Naming Convention:** ISO-standard generic names (e.g., `Heading`, `Button`, `Surface`)
* **Folder:** `src/genesis/atoms/`

### Level 3: The Elements (The Molecules)

Combinations of Primitives that perform a single interactive function. This is where Metronic's core UI elements are mapped.

* **Naming Convention:** Standard UI noun (e.g., `Button`, `Input`, `Badge`, `Checkbox`)
* **Examples:** `<Button variant="brutal" size="lg">`, `<Input type="text" hasError={true}>`
* **Folder:** `src/components/ui/elements/`

### Level 4: The Components (The Organisms)

Distinct, reusable sections of UI built entirely from Level 3 Elements. They hold localized presentation logic and strict **Framer Motion** declarative animations (e.g., hover states, intro staggers).

* **Naming Convention:** Noun + Context (e.g., `FormGroup`, `ProductCard`, `StatPill`)
* **Examples:** `<LoginFormGroup>`, `<MetricCard value="120" trend="+5%">`
* **Folder:** `src/components/ui/components/`

### Level 5: The Widgets (The Assemblies)

The heavy lifters extracted from Metronic. These are data-rich assemblies that often fetch their own state or manage complex internal states (like graphs or data tables).

* **Naming Convention:** Domain + `Widget` (e.g., `SalesChartWidget`, `RecentOrdersTableWidget`)
* **Examples:** `<SalesOverviewWidget>`, `<ChatInterfaceWidget>`
* **Folder:** `src/components/widgets/`

### Level 6: The Layouts (The Scaffolding)

Structural containers that arrange Widgets and Components on the screen according to the device (Mobile, Kiosk, Desktop).

* **Naming Convention:** Context + `Layout` (e.g., `AdminSidebarLayout`, `PosGridScreenLayout`)
* **Examples:** `<DashboardGrid>`, `<KioskSplitScreen>`
* **Folder:** `src/components/layouts/`

### Level 7: The Pages (The Surfaces)

The Next.js Application Route itself. It glues the Layouts to the actual data fetching layer (tRPC/Next.js Server Actions) and handles auth logic. It has almost zero styling code.

> [!CAUTION]
> **STRICT SEO MANDATE:** We explicitly *ban* the Single Page Application (SPA) "bunching" anti-pattern here. You may not build a single monolithic `<App>` component that conditionally swaps views based on React state.
> Every distinct feature, view, or template must be its own discrete, physically separate directory in the App Router (e.g., `app/dashboard/page.tsx`, `app/settings/profile/page.tsx`). This guarantees the Next.js compiler creates distinct HTML snapshots for Google bots and heavily splits the Javascript bundles for maximum performance and native SEO indexing.

* **Naming Convention:** Route based (e.g., `app/(admin)/dashboard/page.tsx`)
* **Examples:** `DashboardPage`, `CheckoutPage`
* **Folder:** `src/app/`

---

## 3. Folder Structure architecture (`zap-design`)

```text
Workspace/
├── zap-claw/             # Core Backend, Agent Workflows, Business Logic
└── zap-design/           # The Universal Design Engine (Peer to zap-claw)
    ├── src/app/
    │   ├── debug/zap/                  # ZAP Atom debug/doc routes (Level 1)
    │   │   ├── typography/page.tsx     #   1. Typography     - Headings, Body, Mono
    │   │   ├── colors/page.tsx         #   2. Colors & Surface - Cards, Dividers, Overlays
    │   │   ├── icons/page.tsx          #   3. Icons           - Brand & System Iconography
    │   │   ├── interactive/page.tsx    #   4. Interactive     - Buttons, Inputs, Toggles
    │   │   ├── status/page.tsx         #   5. Status          - Badges, Alerts, Tooltips
    │   │   └── layout/page.tsx         #   6. Layout          - Spacing, Grid, Containers
    │   ├── metro/        # QA Route: The 1:1 pure semantic translation of Metronic.
    │   └── neo/          # QA Route: The Neo-Brutalist design override applied.
    ├── src/zap/
    │   ├── layout/       #   Master shells (MasterVerticalShell, VerticalNav, etc.)
    │   └── sections/     #   Per-atom body components (typography/, color/, icons/, ...)
    └── engine/           # The 7-Level Atomic React Factory
        ├── l1-tokens/    #   Level 1: Physics (CSS Variables → Tailwind tokens)
        ├── l2-primitives/#   Level 2: Typography, Icons, Dividers
        ├── l3-elements/  #   Level 3: Buttons, Inputs, Selects
        ├── l4-components/#   Level 4: Cards, Modals, Form Groups
        ├── l5-widgets/   #   Level 5: Charts, Data Tables, AI Chat Windows
        └── l6-layouts/   #   Level 6: Sidebars, Headers, Grid Scaffoldings
```

---

## 4. The Metronic Dissection Workflow (Step-by-Step)

When it is time to build a page (e.g., an Admin Dashboard), we follow this strict pipeline:

**Step 1. Identify the Metronic Widget:**
Find the targeted UI in the `~/Workspace/metronic/metronic-tailwind-html-demos` folder.

**Step 2. Map the Physics (Level 1 & 2):**
Identify the Tailwind colors and spacing used in the HTML. Map them to our ZAP variables (e.g., change `text-blue-500` to `text-zap-primary`). Apply hard borders `border-2 border-black` for the Neo-Brutal aesthetic.

**Step 3. Extract the Elements (Level 3):**
If the widget uses a specific button style, create or update `src/components/ui/elements/Button.tsx`. Ensure it accepts standard props (`variant`, `size`, `onClick`) so the merchant can globally override its roundness or shadow heavily.

**Step 4. Reconstruct the Component/Widget (Level 4 & 5):**
Build the `.tsx` file in `src/components/widgets/`. Replace raw HTML generic tags with our Level 2/3 imports (`<Typography>`, `<Button>`).

**Step 5. Mount to Layout and Page (Level 6 & 7):**
Drop the Widget into the predefined Layout container for the respective route (`page.tsx`).

---

## 5. Next Steps: The Engine Blast

Because extracting Metronic and converting it to a highly customizable React engine is massive, we must establish the semantic baseline ("Metro") first before applying the fine-tuning logic for "Neo".

If you approve this structure and naming convention, the first execution phase (The Engine Blast) will be:

1. **Initialize Workspace:** Establish `~/Workspace/zap-design/` repository.
2. **The Metro Extraction:** Isolate core UI Elements (Button, Input, Card) from Metronic HTML, strictly mapping them to ISO/Google SEO semantic defaults, leaving behind all proprietary naming conventions.
3. **The Parameter Layer:** Implement the ZAP theme-variable overlay system for customer fine-tuning.
4. **The Neo Transformation:** Bootstrap the **"Neo"** template to verify the engine can transform the baseline "Metro" components into the targeted Neo-Brutalist reference design via visual parameter tweaking.
