---
name: Zap Spike Extraction Protocol
description: The rigorous standard for extracting Metro React structural components, stripping proprietary CSS, and injecting M3 design tokens. Mandatory for Spike when constructing the Olympus shell.
---

# ZAP Spike Extraction Protocol (Phase 2 Skinning)

## Objective

Spike's primary directive is to act as the primary structural engineer for the Olympus Project. This involves extracting DOM layouts from the Metro Core Theme and converting them into strict ZAP M3 components.

## The Absolute "No-CSS" Rule

You are strictly forbidden from writing custom CSS, inline arrays, or hardcoded hex values (`#FF0000`). If you generate `style={{ color: 'red' }}`, you have failed your mission objective.

## 4-Step Extraction Procedure

### 1. Extract the DOM Structure

Locate the relevant component in the Metro reference library (`/Users/zap/Workspace/references/metronic/metronic-tailwind-react-demos/`). Extract the React component structure (`div`, `span`, `Card`, `Table`, etc.).

### 2. Purge Proprietary Styles

Remove any Metro-specific formatting that clashes with M3. Look critically at the `className` strings.

* **Remove:** Hardcoded layout breaks or heights that feel like patches.
* **Keep:** Tailwind structural utilities like `flex`, `grid`, `gap-4`, `p-5`, `items-center`.

### 3. Inject ZAP M3 Tokens

Replace semantic colors with ZAP M3 variables.
Because Metro's core config (`config.reui.css`) was overridden in `m3_mapping.css`, many default Tailwind strings in Metro will automatically work (e.g., `text-primary` now maps to `var(--md-sys-color-primary)`).

However, you must actively convert hardcoded gray scales and borders to the M3 variables if they leak through:

* Instead of `text-gray-900`, use `text-foreground`.
* Instead of `bg-white dark:bg-slate-900`, use `bg-card` or `bg-background`.
* Instead of `border-gray-200`, use `border-border`.

### 4. Wire the API Shell

Hook the clean structural shell up to the properties required by Tommy's OpenClaw API Gateway specifications. The component must be ready to accept live data props immediately.

## Example: The Conversion

**BAD (Metro Extract with rogue styles):**

```tsx
<div className="bg-white border border-gray-200 p-5" style={{ borderRadius: '8px', color: '#333' }}>
  <span className="text-blue-500 font-bold">Hello</span>
</div>
```

**GOOD (ZAP M3 Compliant Shell):**

```tsx
<div className="bg-card border border-border p-5 rounded-lg text-foreground">
  <span className="text-primary font-bold">Hello</span>
</div>
```

## Validation

Before submitting the code, run a regex or manual scan for `style=`, `#`, and `gray-` utility classes. If found, correct them. ZAP (CSO) will reject the commit if rogue CSS is detected.
