---
name: import-stitch-snippet
description: Standard procedure for importing parts (snippets) of Stitch MCP screens (e.g., Body, Inspector) into the ZAP ecosystem (Olympus).
---

# Stitch Snippet Import SOP (Olympus)

When the user asks you to import a screen from Stitch MCP, but specifies to only extract **parts** (e.g. Body and Inspector, omitting Navigation):

## 1. Retrieve the Source File

1. Use `mcp_StitchMCP_get_screen` to fetch the screen details based on the project ID and screen ID.
2. The response will contain an `htmlCode.downloadUrl`.
3. Use `curl -L '<downloadUrl>' -o /tmp/stitch_html.html` or similar, to fetch the raw generated HTML.

## 2. Locate and Extract Target Snippets

1. Read the fetched HTML file.
2. Locate the specific structural segments requested by the user:
   - For the **Body**: Typically found inside `<section class="flex-1... p-10">` or `<main>`.
   - For the **Inspector**: Typically found inside a `<aside>` element acting as the right-hand panel (e.g., `<aside class="relative w-80 shrink-0 border-l neo-border bg-panel-white flex flex-col hidden lg:flex">`).
3. Omit the top Header and Left Vertical Nav unless explicitly requested.

## 3. Convert to ZAP React Components

1. **Standard Naming SOP:** Components should be named after the page domain (e.g. `MoleculeNavigation`). Create distinct files for parts, usually combining into a `src/zap/sections/[page_name]/` directory.
   - `body.tsx` (e.g. `MoleculeNavigationBody`)
   - `inspector.tsx` (e.g. `MoleculeNavigationInspector`)
2. **Format Conversion:**
   - Convert all `class=` attributes to `className=`.
   - Self-close void elements (`<br />`, `<hr />`, `<img />`, `<input />`).
   - Convert `-` separated inline styles to camelCase (`style={{ backgroundImage: 'url(...)' }}`).
   - Handle html comments `<!-- comment -->` into `{/* comment */}`.

## 4. Integrate into Master Shell

1. ZAP guidelines dictate that imported screens should be demoed on a Next.js App directory page.
2. Route example: `src/app/debug/zap/[page_name]/page.tsx`
3. Wrap the content using the master shell `<MasterVerticalShell>`:
   - Pass the Body to `children`.
   - Pass the Inspector component to the `inspectorContent` prop.
   - Configure `breadcrumbs` and `activeItem` to match the navigation guidelines.

By following this, the Body and Inspector are maintained cleanly separate, but are tied together through Next.js compositional architecture inside the Shell.
