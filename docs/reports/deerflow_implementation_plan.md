# Implementation Plan: Deerflow 2.0 Fleet Manager

**Status:** PENDING USER APPROVAL | **Target:** `/apps/zap-swarm/src/app/agents/page.tsx`

## Phase 1: Purge & Scaffold
1. Wipe the current contents of `page.tsx` inside the `zap-swarm` app agent route.
2. Inject the 3-Pane HUD shell (`<ThemeHeader>`, Left Nav, Center Canvas, Right Inspector).
3. Bind the layout strictly to METRO's `bg-layer-base` and `bg-layer-cover`.

## Phase 2: Atom Composition (Spike's Domain)
1. Import the audited `Accordion`, `AccordionItem`, `AccordionTrigger`, and `AccordionContent` atoms from `@/genesis/atoms/layout/AccordionItem.tsx`.
2. Construct the Inspector panel on the right with three Accordion sections:
   * **Agent Identity:** Status toggles.
   * **Routing Matrix:** A `<Select>` atom locking the model to `gemini-3.1-pro-preview` or `gemini-2.5-flash` natively.
   * **Titan Memory:** VFS payload stats for media assets (`/tmp/zap-assets`).
3. Build the Center Canvas using Mock Data mapping to Deerflow Job Objects (ID, Phase, Model, Tokens). Render them as dense `Card` atoms (`bg-layer-cover`).

## Phase 3: The Watchdog Audit (Jerry's Sweep)
1. Verify no Ghost Classes (`text-sm`, `font-bold`) bled into the page.
2. Validate the layout padding dynamically uses `var(--spacing-lg)` and borders use `var(--card-radius)`.
3. Start the Next.js dev server verify the DOM visually via `localhost:3000`.

**Requirement:** Before I touch the actual React implementation in `page.tsx`, I need absolute user sign-off on this plan.
