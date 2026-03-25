---
name: page-atom-breakdown
description: Breaks down a Page into a detailed Atomic Component Table to identify hardcoded HTML vs. Managed Atoms. Use when asked to audit or break down a page's elements.
---

# Page Atom Breakdown Skill

This skill provides a standardized operating procedure for auditing any page within the ZAP ecosystem, breaking down its visual and structural nodes into an "Atomic Breakdown Table."

## Objective
To identify all interactive, visual, typographic, and structural elements on a page, and determine whether they are managed by an Administrative Controller (like Metro) or if they are hardcoded native HTML tags that need to be transformed.

## Trigger
Use this skill when the user asks to "break down a page," "audit page atoms," "what atoms are on this page," or requests an atomic table for a specific layout.

## Procedure

1. **Scan the Target Page:** Analyze the target file (usually a `page.tsx` or complex component).
2. **Identify Every Node:** Treat every single visual and structural node as a distinct atom. Look for:
   - Form Inputs, Buttons, Cards (L3)
   - SVG Icons, Images (L2 Visual)
   - Headings, Paragraphs, Spans (L2 Typography)
   - Layout Elements: Divs, Forms, Sections (L1 Layout)
3. **Determine Management Status:** For each element type, determine:
   - Does Metro have an Admin Controller for it? (e.g., `/design/metro/typography`, `/design/zap/atoms/button`)
   - Does Core have an Admin Controller for it?

## Output Format
Always output the breakdown as a Markdown table with the following specific columns:

| Atom / Element Type | HTML/JSX Nodes | Category | Total Count | Metro Admin/Controller | Core Admin/Controller |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **GenesisButton** | `<GenesisButton>` | L3 Interactive | **count** | `/design/zap/atoms/button` | ❌ None |
| **Native Checkbox** | `<input type="checkbox">` | L3 Form | **count** | `/design/zap/atoms/checkbox` | ❌ None |
| **Structural Containers** | `<div>`, `<section>` | L1 Layout | **count** | `/design/metro/layout` | ❌ None |

### Table Columns Defined
- **Atom / Element Type**: A human-readable identifier (e.g., "Custom SVG", "Inline Text", "GenesisCard").
- **HTML/JSX Nodes**: The actual tags used in the code (e.g., `<h1>`, `<svg>`, `<GenesisInput>`).
- **Category**: The ZAP structural level (e.g., "L3 Interactive", "L2 Typography", "L1 Layout / Spacing").
- **Total Count**: Count of recurrences on the page.
- **Metro Admin/Controller**: URL or location of the Metro admin interface managing this. Say "N/A" if none.
- **Core Admin/Controller**: URL or location of the Core admin interface managing this. If none, write "❌ None".

## Post-Audit Action
After presenting the table, summarize the findings (Insights) indicating the dominant elements (e.g., layout vs. typography) and distinctly calling out any raw HTML tags (like `<input>`, `<button>`, or raw `<svg>`) that constitute an "oversight" and should be extracted into proper Genesis Atoms.
