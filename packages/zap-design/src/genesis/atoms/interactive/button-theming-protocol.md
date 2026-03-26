# Button Theming & Typography Publish Protocol

**Date:** March 2026
**Scope:** `components/ui/button.tsx`, `genesis/atoms/interactive/buttons.tsx`, and the Typography Engine

## The Prime Directive

The core button component files must **never be touched** or hardcoded with specific fonts or casing. The integrity of the foundational atoms remains pristine.

## How Per-Theme Button Typography Works

ZAP Design Engine supports multiple simultaneous themes (Core, Metro, Neo, Fun). Each theme has its own typographic identity.

Instead of hardcoding fonts into the `<Button />`, we utilize a targeted CSS Variable injection strategy managed by the `ThemeContext`.

1. **The Sandbox Publish:** When a user tweaks the Button's font settings (Font Family or Text Casing) in the Typography Playground and clicks **Publish**, the `TypographyPlaygroundStage` captures just those `components.button` settings.
2. **The Backend:** The `/api/typography/publish` endpoint ingests these scoped settings and persists them to the theme's JSON file (e.g., `.zap-settings/typography-metro.json`).
3. **The Global Context:** On load, `ThemeContext.tsx` reads these settings. If custom button overrides exist for the active theme, it dynamically injects a `<style id="m3-dynamic-typography">` block into the DOM.
4. **The Override:** This style block specifically targets `[data-slot="button"]` and `.rounded-btn` (Genesis buttons) within the `[data-zap-theme="..."]` scope, enforcing the chosen font family and text transform via `!important` to override native Tailwind classes.

## Example Injected CSS

```css
[data-zap-theme] button[data-slot="button"],
[data-zap-theme] .rounded-btn {
    font-family: var(--font-pacifico), cursive !important;
    text-transform: uppercase !important;
}
```

This ensures extreme scalability. We can add 50 new themes tomorrow, and the core Button component will cleanly adapt to all of them without a single line of code changing in `button.tsx`.
