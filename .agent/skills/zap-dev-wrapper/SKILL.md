---
name: ZAP Dev Wrapper Protocol
description: Standard operating procedure for applying the generic Wrapper component to isolate and identify UI snippets for AI extraction.
tags: [frontend, zap-design, UI, snippet, wrapper, dev-mode, identity]
---

# ZAP Dev Wrapper Protocol

This skill dictates how to wrap pages, sections, atom views, and deep nested atomic UI components in the ZAP Design Engine using the generic `<Wrapper>` component. This ensures flawless extraction of UI snippets by AI agents during development and design phases.

## 1. The `<Wrapper>` Component

Location: `@/components/dev/Wrapper`

The `<Wrapper>` component is a lightweight, generic boundary tool. When "Dev Mode" is active, it traces a dashed red border around its children and displays a hoverable "COPY SNIPPET" badge. It allows developers and AI agents to instantly identify and copy the exact code block for a specific UI element.

It *does not* enforce layout constraints like padding, margin, or max-width unless you explicitly pass them via `className`. It shrinks or expands to fit its content by default (`w-full`), allowing you to wrap flex items, grids, or full pages without breaking their built-in layouts.

### Props

- `identity` (**REQUIRED**): An object providing dense context to the AI when extracted. Replacing the legacy `title` prop. Example: `{ displayName: "Heading Standards Table", filePath: "zap/sections/typography/body.tsx", type: "Wrapped Snippet", architecture: "SYSTEMS // CORE" }`
- `className` (optional): To override the default `w-full` if wrapping small flex items, passing `w-auto` is common.
- `align` (optional): Defaults to `'right'`. Use `'left'` if the outer parent badge is right-aligned to avoid overlap.

## 2. Usage Rules

### Rule A: Granular Deep Wrapping (The "All The Way Down" Mandate)

We wrap all the way down to the distinct functional element or snippet level for *every single section*. This means in a page, we have multiple atom views, and inside every atom view we must get down to the **wrapped snippet** level. It does not stop until each individual atomic unit (a sticker, a specific table, a card, an icon block) has a wrapper. This applies across all tabs, templates, and views.

### Rule B: Section and Layout Headers

Every major section or layout sub-division must have its title/header area specifically wrapped and typed as a `Wrapped Snippet` with a `displayName` starting with `"Section Header: [Name]"`. This creates a consistent naming convention that defines the main parts and sub parts of a page, ensuring that the AI can easily identify the semantic beginning of any new Atom/View.

### Rule C: The Root Page Wrap

Every target page (`page.tsx`) must have its core content wrapped with an overarching `<Wrapper>`. If a page is using a full-screen Canvas or Master layout, the wrapper usually sits *directly around the Canvas* or *inside the primary content column*, ensuring you can copy out an entire page's code structure in one click.

### Rule D: Component Isolation without Flow Breakage

If wrapping an item inside a flexbox row (e.g., `justify-between` header or horizontal `gap-6` toggles/badges), pass `className="w-fit"` (or `w-auto`) so the wrapper doesn't force 100% width and break the horizontal flex layout layout by pushing elements to the next line.

```tsx
<div className="relative z-10 w-full flex justify-between items-end px-12 pt-12 pb-8">
  {/* Left flex item */}
  <Wrapper identity={{ displayName: "Typography Title", filePath: "zap/atoms/typography/page.tsx", type: "Wrapped Snippet" }} className="w-auto">
    <div className="flex flex-col items-start pl-2">
      <h1 className="text-[64px] font-black uppercase">WILD MODE</h1>
      <div className="bg-brand-midnight text-white px-3 py-1.5">EXPERIMENTAL PREVIEW</div>
    </div>
  </Wrapper>

  {/* Right flex item */}
  <Wrapper identity={{ displayName: "Live Status Indicator", filePath: "zap/atoms/typography/page.tsx", type: "Wrapped Snippet" }} className="w-auto">
    <div className="flex items-center gap-2 pr-2">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <span>LIVE PREVIEW</span>
    </div>
  </Wrapper>
</div>
```

### Rule E: Iterative or Grid-Based Sub-Wrapping

When a section loops through items (like `.map`) or lists a grid of visually identical structural components (like atomic color swatches, icon grids, or repeating cards), wrap the **individual grid items** or the mapped elements.

This ensures that the AI can perfectly extract just "One Functional Element", rather than having to parse a giant chunk of code representing multiple parallel items.

If wrapping inside a `.map` function, remember to pass the `key` to the `<Wrapper>` component and dynamically set the `displayName` within the identity object:

```tsx
{[...functionalColors].map((c) => (
  <Wrapper key={c.label} identity={{ displayName: `Functional Color: ${c.label}`, filePath: "zap/sections/color.tsx", type: "Wrapped Snippet" }}>
    <div className="flex flex-col shadow-dialog rounded-card">
      {/* ...color content... */}
    </div>
  </Wrapper>
))}
```

### Rule F: Inspector Sidebars & Pill Labels

The inspector blocks on the right-hand sidebar must not be wrapped as one giant block. Wrap each individual sub-section (such as "Hover State", "Specifications", "Action CTA"). Apply the same granular rule to tiny pill labels or tags (like "Component", "Foundation", "Material Outlined") inside the main body.

### Rule G: Dynamic Sandbox Inheritance (Inline `style`)

When applying a `<Wrapper>` around a component that relies on dynamically changing Sandbox variables (like `--button-border-radius`, padding, or layout bounds), the `<Wrapper>`'s dashed dev-mode boundary might "cut off" or disobey the component's shape if it relies on static utility classes like `rounded-lg`. 

To force the Dev Wrapper dotted lines to perfectly hug dynamic components (like pill buttons with high border radii), you must pass the exact dynamic inline style to the `Wrapper` so it structurally mirrors its children:

```tsx
<Wrapper 
  identity={{ displayName: "Theme Publisher", type: "Publish Action", filePath: "zap/atoms/button/page.tsx" }}
  style={{ borderRadius: 'var(--button-border-radius, 9999px)' }}
>
  <Button size={buttonSize}>Publish Theme</Button>
</Wrapper>
```

## Summary of the Latest Update

The `<Wrapper>` component strictly expects the rich `identity` prop. Moreover, applying `className="w-fit"` is critical for inline flex components (tags, toggles). Wrapping protocol demands **granular deep wrapping** (The "All The Way Down" Mandate). This enables AI to grab tiny, perfectly isolated sub-components (like a specific "Toggle State" or an "Inspector Spec Table") knowing exactly which file and architectural layer they belong to without breaking visual CSS flex alignment.
