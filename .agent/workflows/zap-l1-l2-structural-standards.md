---
description: Mandatory M3 spatial depth and layout protocols (Layer 1 and Layer 2) that MUST be followed when creating any new site, page, or component in the ZAP ecosystem.
---

# ZAP L1-L2 Structural Layout Standards

This workflow defines the **absolute required structural hierarchy** for all AI Agents (Claude, Spike, Recon) and Human Engineers when building new UI pages or components. 

**DO NOT hardcode background colors on your root elements.** You must allow the global shell to handle the L1 and L2 spatial depth, or you will create massive rework debts.

---

## The Spatial Depth Rules (M3)

In the ZAP Architecture, physical depth is managed by the unified `MetroShell`. When you build a new page (`page.tsx`), you are injecting content *into* these pre-existing layers.

### Layer 1 (The Base Canvas)
*   **Definition:** The absolute bottom physical layer of the screen.
*   **Token:** `bg-surface-container-lowest`
*   **Governance:** Handled automatically by the `<main>` tag inside `@/zap/layout/MetroShell.tsx`.
*   **Rule for Builders:** **DO NOT** apply inline background colors or `bg-surface-*` Tailwind classes to the root `<div>` of your page canvas. Let the transparency fall through to Layer 1.

### Layer 2 (The Shell & Panels)
*   **Definition:** The elevated interactive layers (Sidebars, Topbars, Inspector Panels, Cards).
*   **Token:** `bg-surface`
*   **Governance:** Handled automatically by the `<aside>` sidebar containers and `<header>` inside `@/zap/layout/MetroShell.tsx` and `@/zap/layout/Inspector.tsx`.
*   **Rule for Builders:** When building an `Inspector` control panel or a floating card, **DO NOT** apply `style={{ backgroundColor: ... }}` to the root wrapper. Rely on the L2 token inheritance.

---

## 🚫 The "Corporate Rot" Anti-Patterns
When AI agents or humans hallucinate generic layouts, they often commit "Corporate Rot" by hardcoding backgrounds. 

**NEVER DO THIS WHEN CREATING A PAGE:**
```tsx
// ❌ WRONG: Hardcoded L1 background breaks M3 global token updates
<div className="flex-1 w-full p-6" style={{ backgroundColor: 'var(--md-sys-color-surface-container-lowest)' }}>
    <MyComponent />
</div>

// ❌ WRONG: Hardcoded L2 background breaks Inspector global theme
const customInspector = (
    <Inspector>
        <div style={{ backgroundColor: 'var(--md-sys-color-surface)' }}>
            <Controls />
        </div>
    </Inspector>
);
```

**ALWAYS DO THIS (Clean Shell Delegation):**
```tsx
// ✅ CORRECT: Clean transparent wrapper passes layout to L1 MetroShell
<div className="flex-1 w-full p-6 text-on-surface">
    <MyComponent />
</div>

// ✅ CORRECT: Clean transparent wrapper passes layout to L2 Inspector Shell
const customInspector = (
    <Inspector>
        <div className="p-4 space-y-6">
            <Controls />
        </div>
    </Inspector>
);
```

## Enforcement Summary
If you are generating a new page, your job is to build the molecular content (the atoms and layouts) and explicitly **avoid** coloring the root wrapper backgrounds. Pass the background rendering responsibility up to the `MetroShell` layout.
