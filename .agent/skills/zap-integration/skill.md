---
name: zap-integration
description: Automates the application of ZAP Design System standards (Identity Pills, Dev Wrappers) to React components.
---

# ZAP Integration Skill

This skill automates the process of "ZAP-ifying" a React component. It wraps the component in a `ContainerDevWrapper` with a standardized identity schema and correct positioning logic.

## 1. The Wrapper Pattern

All structural or major UI components must be wrapped in `ContainerDevWrapper`.

```tsx
import { ContainerDevWrapper } from 'relative/path/to/components/DevDocBanner';

// ... inside render ...
<ContainerDevWrapper
    showClassNames={showDevMode}
    atomic="Organism" // or Molecule, Atom
    identity={{
        displayName: "MyComponent",
        filePath: "components/MyComponent.tsx",
        parentComponent: "ParentView",
        type: "Organism/Section" // [architecture]/[Role]
    }}
>
    {/* Component Content */}
</ContainerDevWrapper>
```

## 2. Identity Schema Rules

The `identity` object MUST follow this schema:

| Key | Description | Example |
| :--- | :--- | :--- |
| `displayName` | Human-readable name of the component | `"ProductCard"`, `"SidebarInspector"` |
| `filePath` | Relative path from project root or detailed path | `"components/molecules/ProductCard.tsx"` |
| `parentComponent` | The logical parent or context | `"ProductGrid"`, `"App"` |
| `type` | **[architecture]/[Role]** format | `"Molecule/Card"`, `"Organism/Section"`, `"Page/Container"` |
| `architecture` | **High-Density Context** | `"SYSTEMS // PALETTE"`, `"LAYOUT // GRID"` |

### architecture Ranks (The 7-Level Hierarchy)

| Lvl | ZAP Term | Atomic Equiv. | Wrapping Rule |
| :--- | :--- | :--- | :--- |
| **1** | **Shell** | *Environment* | `type: "Organism/Shell"` |
| **2** | **Blueprint** | *Template* | `type: "Template/Blueprint"` |
| **3** | **Layout** | *Template* | `type: "Template/Layout"` |
| **4** | **Zone** | *Region* | `type: "Region/Zone"` |
| **5** | **Block** | *Organism* | `type: "Organism/Block"` |
| **6** | **Part** | *Molecule* | `type: "Molecule/Part"` |
| **7** | **Token** | *Atom* | `type: "Atom/Token"` |

### Terminology Maps (The Toggle)

The ZAP Design Engine supports two terminology modes. Your `type` string is the bridge between them.

* **ZAP Mode (Merchant)**: Shell, Blueprint, Layout, Zone, Block, Part, Token.
* **Atomic Mode (Engineer)**: Environment, Template, Region, Organism, Molecule, Atom.

**Rule**: Always write the `type` in the format `[AtomicTerm]/[ZapTerm]` (e.g., `Organism/Block`) so the system can toggle correctly.

### Structural Roles

* **Page**: Root route or view container.
* **Section**: Major horizontal block.
* **Controller**: Logic-heavy container or UI tool (Inspector).
* **Element**: detailed UI piece.

## 3. Positioning Logic (Critical)

ZAP uses a **"Straddle"** positioning system for identity pills.

* **Standard (Default)**: Use for Atoms, Molecules, Sections, Organisms.
  * The wrapper handles this automatically (`top-0 -translate-y-1/2`).
  * **Action**: No special props needed, just wrap it.

* **Root Pages**: Use for full-screen `Page/Container` components.
  * **Action**: Ensure `type` includes "Page". The wrapper allows the pill to sit *inside* the container (`top-6`) to avoid being clipped by the browser viewport.

## 4. Execution Steps

When asked to "ZAP a component":

1. **Identify** the component's Atomic Rank and Structural Role.
2. **Import** `ContainerDevWrapper`.
3. **Wrap** the root element (or the main content block if the root is structural).
4. **Construct** the `identity` object using the schema above.
5. **Preserve** existing `className` and structure. Don't break the layout!

## 5. Example Transformation

**Input (Raw):**

```tsx
export const Hero = () => {
    return <section className="h-screen bg-blue-500"><h1>Hello</h1></section>;
}
```

**Output (ZAP-ified):**

```tsx
import { ContainerDevWrapper } from '../DevDocBanner';

export const Hero = ({ showDevMode }) => {
    return (
        <ContainerDevWrapper
            showClassNames={showDevMode}
            atomic="Organism"
            identity={{
                displayName: "Hero",
                filePath: "components/Hero.tsx",
                parentComponent: "App",
                filePath: "components/Hero.tsx",
                parentComponent: "App",
                type: "Organism/Block", // Correctly maps to Block(Zap) / Organism(Atomic)
                architecture: "FOUNDATIONS // HERO"
            }}
        >
            <section className="h-screen bg-blue-500"><h1>Hello</h1></section>
        </ContainerDevWrapper>
    );
}
```

## 6. Layout & Spacing Rules

When wrapping high-level containers (Pages/Sections), you must handle the physical space the Dev UI occupies.

### The "Header Overlap" Problem

The `DevDocBanner` (Identity Pill) sits on the top edge. If your component is at the very top of the page (under a global header), the pill might get hidden or clip.

**Rule**: For `Page/Canvas` or Root `Organism` components:

1. Check if `showClassNames` (Dev Mode) is active.
2. Apply `mt-14` (margin-top 3.5rem) to push the content down.
3. Ensure the wrapper has `relative` positioning.

```tsx
<ContainerDevWrapper
    showClassNames={show}
    // Push content down when DevMode is on to reveal the "Page Identity" pill
    className={`... ${show ? 'mt-14 border-2 border-dashed ...' : ''}`}
    identity={{ type: "Page/Canvas", ... }}
>
```

### Z-Index Layering

* **Headers/Nav**: `z-50` (Always on top)
* **Inspector Panels**: `z-20` (Sticky sidebars)
* **Dev Pills**: `z-10` (Attached to components)
* **Content**: `z-0` (Default)

## 7. Zero Footprint Constraint (CRITICAL)

The "Dev Layer" (wrappers, pills, spacing) must be **invisible** in Production/Standard mode.

* **Logic**: Always gate dev-only styles with `showClassNames`.
* **No Leaks**: Don't add persistent margins or borders that shift the production layout.
* **AI Context**: The `identity` metadata is strictly for the AI/Dev interaction layer. It should not affect the end-user experience.
* **Pixel Perfect**: When `showClassNames` is false, the component must match the Figma design exactly.
