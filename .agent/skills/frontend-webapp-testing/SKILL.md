---
name: frontend-webapp-testing
description: Toolkit for interacting with and testing local web applications using dev-browser. Supports verifying frontend functionality, debugging UI behavior, and capturing browser screenshots without bloating the LLM context.
license: Complete terms in LICENSE.txt
---

# Web Application Testing

To test local web applications, you **MUST** use `dev-browser` (by SawyerHood) instead of raw Playwright scripts.
`dev-browser` runs in a sandboxed QuickJS context and provides a robust CLI interface.

**Always run `dev-browser --help` first** to see usage and the detailed LLM API guide.
DO NOT write Python `playwright` scripts or use the Playwright MCP server.

## Installation 

```bash
npm install -g dev-browser@latest
dev-browser install
```

## Decision Tree: Choosing Your Approach

```text
User task → Is it a web app?
    ├─ Yes (dynamic webapp) → Is the server already running?
        ├─ No → Run your dev server (e.g., `pnpm run dev`) in the background.
        │        Then use `dev-browser` to inspect or test.
        │
        └─ Yes → Reconnaissance-then-action:
            1. Use `dev-browser --headless` and navigate
            2. Take screen snapshot for AI: `await page.snapshotForAI()`
            3. Execute actions using Playwright's Page API via dev-browser script
```

## Example: Using dev-browser

To create an automation script, just pipe your JS to the CLI:

```bash
dev-browser --headless <<'EOF'
const page = await browser.getPage("main");
await page.goto("http://localhost:3500");
await page.waitForLoadState('networkidle'); // CRITICAL: Wait for JS to execute

// Take a snapshot
console.log(await page.title());
const buf = await page.screenshot({ fullPage: true });
const path = await saveScreenshot(buf, "preview.png");
console.log("Screenshot saved to: " + path);
EOF
```

## Reconnaissance-Then-Action Pattern

1. **Get an AI-friendly snapshot**:

   ```javascript
   const snapshot = await page.snapshotForAI();
   console.log(JSON.stringify(snapshot, null, 2));
   ```

2. **Identify selectors** from inspection results.

3. **Execute actions** using discovered selectors:

   ```javascript
   await page.fill('input[type="email"]', 'zeus@zap.com');
   await page.click('button:has-text("Login")');
   ```

## Best Practices

- **Use dev-browser as a black box** - Handle complex interactions via QuickJS sandbox scripts.
- Use `page.waitForLoadState('networkidle')` before asserting on dynamic content.
- Always use descriptive selectors.
- No Python, No MCP plugin context bloating. Use `dev-browser --headless`.
