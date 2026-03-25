# ZEO Handoff: Metro / Neo Design Engine

## Authorization Level: MAXIMUM

**To:** Spike, Jerry, and the Claude Development Team  
**From:** CSO (Antigravity) & Zeus Tom  
**Clearance:** You have **FULL POWER** and autonomy to build and integrate the remainder of this system.

---

## 1. The Strategy: Two Paradigms

We are building the ZAP Design Engine utilizing a strict **7-Level Atomic Design** structure. To ensure component stability and theme flexibility, we operate with two separate testing routes:

### Route A: `/metro` (The Baseline)

- **Purpose:** 1:1 semantic translation of the "Metronic" template.
- **Rules:** Do not mutate the baseline DOM structure of Metronic components. If Metronic uses an `input` inside a `label`, we do the same. This is our control group.

### Route B: `/neo` (The Override)

- **Purpose:** A demonstration of Neo-Brutalism applied *directly* over the Metro baseline components.
- **Rules:** Both routes must share the exact same structural layout (e.g., standard Horizontal Header + Left Sidebar). In `/neo`, we pass aggressive Tailwind override classes (e.g., `border-2 border-black rounded-none shadow-[4px_4px_0_0_#000]`) into the baseline components via the `className` prop.

**Proof of Concept:**
The `TransactionTableWidget` successfully renders in both `/metro` and `/neo`, proving we can skin complex Level 5 Organisms entirely via context or prop injection without rewriting the components.

---

## 2. Your Mission

### A. Metronic Extraction

- Review the Stitch/Metronic HTML templates (`metronic-tailwind-react-demos`).
- Extract the remaining missing elements, widgets, and generic page layouts.
- Rebuild them as standard React 19 / Next.js 15 components inside `src/components/ui/` (Level 1-4) or `src/components/widgets/` (Level 5-6).

### B. Route Integration

- Once extracted, place instances of the new components inside `src/app/metro/page.tsx` to prove they work cleanly.
- Immediately mirror that layout inside `src/app/neo/page.tsx`, but coat them in the brutalist styling mechanics.

### C. Scaling SEO & Pages

- Ensure all main content structures are built *as distinct routes/pages* rather than singular SPA blobs. This guarantees SEO indexability and makes the engine easily scalable for future modules.

---

## 3. Engineering Constraints (No BS)

- **Tech Stack:** Next.js 15 (App Router, Turbopack), React 19, Tailwind CSS v4, TypeScript, generic Radix UI primitives.
- **Complexity limits:** Components over 300 lines must be aggressively refactored. Keep the extraction clean.
- **Focus:** No fluff. Only raw functionality and stark precision. If you hit an error, fix your own shit. The CSO expects autonomous problem solving. No "it depends." Pick the right way and build it.

Run fast. Hit hard.
**END OF BRIEF**
