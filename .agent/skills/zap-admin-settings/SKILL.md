---
name: zap-admin-settings
description: The standard protocol for creating new admin settings pages (e.g. Colors, Typography, Spacing, Elevation) in the ZAP Design Engine that seamlessly support both the Metro (M3) and Core (Metronic/Shadcn) themes.
---

# ZAP Admin Settings Construction Protocol

When instructed to create a new setting (e.g., Typography, Elevation, Shadows, Spacing/Sizing) in the ZAP Design Engine admin panel, you **MUST** follow this protocol to ensure the generated CSS correctly propagates to both the `m3` (Metro) frontend and the `shadcn` (Core/Metronic) frontend.

## 1. Dual-Theme CSS Output
The ZAP architecture requires outputting variables that map to two completely different theming systems:

### A. Metro Theme (Material 3 standard)
- Variables follow the M3 naming convention.
- Example: `--md-sys-color-primary`, `--md-sys-color-surface`.
- Scope selector: `:root, [data-zap-theme="metro"]`

### B. Core Theme (Shadcn standard)
- Variables follow the Shadcn naming convention.
- Example: `--primary`, `--background`, `--card`.
- Scope selector: `:root, [data-zap-theme="core"]`

When writing the CSS generation hook within the admin page (e.g., `generateCssVars`), you MUST output the Core Shadcn mappings explicitly alongside the M3 values.

```javascript
// Example: Core vs Metro Mapping inside generateCssVars
let css = ``;

// 1. Metro M3 Variables
css += `  --md-sys-color-primary: ${m3Colors.primary};\n`;
// ... other M3 vars

// 2. Core Theme Shadcn Mappings
css += `  /* Core Theme Mappings */\n`;
css += `  --background: ${m3Colors.background};\n`;
css += `  --primary: ${m3Colors.primary};\n`;
css += `  --card: ${m3Colors.surface};\n`;
// ... continue mapping Shadcn standard variables
```

## 2. Setting Storage (`.zap-settings/`)
When the user clicks "Publish", the configuration must be POSTed to an API route (e.g., `/api/[setting]/publish/route.ts`).
1. The API **must** save the generated payload (including the `cssOutput`) as a JSON file in the monorepo's `.zap-settings/` directory.
2. The file naming convention is strictly: `[setting]-[theme].json` (e.g., `colors-core.json`, `typography-metro.json`).

## 3. Server-Side Injection (SSR)
The actual frontend application (Metro on port 3000, Core on port 3200) must read these published JSON files at runtime and inject them into the `<head>` to prevent hydration mismatch (FOUT).

### In the RootLayout (`app/layout.tsx`):
1. Import `fs` and `path`.
2. Construct the absolute path to `.zap-settings/[setting]-[theme].json` (or read it from the monorepo root).
3. Extract `cssOutput` from the JSON.
4. Inject it directly into the `<head>` using a `<style>` tag:
   `<style id="m3-dynamic-[setting]" dangerouslySetInnerHTML={{ __html: initialCss }} />`

## Summary Checklist
- [ ] Admin Page UI developed in `/app/design/[theme]/[setting]/page.tsx`.
- [ ] CSS Generator outputs *both* M3 vars and Shadcn vars.
- [ ] Publish button POSTs to `/api/[setting]/publish`.
- [ ] API writes to `.zap-settings/[setting]-[theme].json`.
- [ ] Frontend `layout.tsx` reads the JSON SSR and injects a `<style>` tag.
