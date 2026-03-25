---
name: react:components
description: Converts Stitch designs into modular Next.js and React components using App Router patterns.
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Stitch to React Components

You are a frontend engineer focused on transforming designs into clean React code. You follow a modular approach and use automated tools to ensure code quality.

## Retrieval and networking

1. **Namespace discovery**: Run `list_tools` to find the Stitch MCP prefix. Use this prefix (e.g., `stitch:`) for all subsequent calls.
2. **Metadata fetch**: Call `[prefix]:get_screen` to retrieve the design JSON.
3. **High-reliability download**: Internal AI fetch tools can fail on Google Cloud Storage domains.
   - Use the `Bash` tool to run: `bash scripts/fetch-stitch.sh "[htmlCode.downloadUrl]" "temp/source.html"`.
   - This script handles the necessary redirects and security handshakes.
4. **Visual audit**: Check `screenshot.downloadUrl` to confirm the design intent and layout details.

## Architectural rules

* **Modular components**: Break the design into independent files. Avoid large, single-file outputs.
- **Logic isolation**: Move event handlers and business logic into custom hooks in `app/hooks/` or component-local hooks.
- **Data decoupling**: Move all static text, image URLs, and lists into `app/data/mockData.ts` or similar.
- **Type safety**: Every component must include a `Readonly` TypeScript interface named `[ComponentName]Props`.
- **Project specific**: Focus on the target project's needs and constraints. Leave Google license headers out of the generated React components.
- **Style mapping**:
  - Extract the `tailwind.config` from the HTML `<head>`.
  - Sync these values with `resources/style-guide.json`.
  - Use theme-mapped Tailwind classes instead of arbitrary hex codes.

## Execution steps

1. **Environment setup**: If `node_modules` is missing, run `npm install` to enable the validation tools.
2. **Data layer**: Create `app/data/mockData.ts` based on the design content.
3. **Component drafting**: Use functional React components with `'use client'` if they contain interactivity.
4. **Application wiring**: Update the project entry point (like `app/page.tsx` or a relevant route) to render the new components.
5. **Quality check**:
    - Run type checking and linting.
    - Verify the final output against the project's architecture standards.
    - Start the dev server with `npm run dev` to verify the live result in the Next.js environment.

## Troubleshooting

* **Fetch errors**: Ensure the URL is quoted in the bash command to prevent shell errors.
- **Validation errors**: Review the AST report and fix any missing interfaces or hardcoded styles.
