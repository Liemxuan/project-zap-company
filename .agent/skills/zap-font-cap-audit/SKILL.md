---
name: zap-font-cap-audit
description: Generates a Font and Capitalization Audit Table to detect typography mismatches against the Metronic design token system. Use this skill when the user asks to debug typography issues, font family errors, or capitalization/text-transform breaks across components or pages.
---

# ZAP Font & Cap Audit Protocol

When tasked with auditing fonts and capitalization styles across a page or within components, you must systematically trace how the UI consumes typography tokens and detect any hardcoded utilities that break the ZAP Metronic theme. 

## The Core Rule
All UI elements must utilize dynamic `var(--font-display)`, `var(--font-body)`, or `var(--font-dev)` CSS variables (often through Tailwind classes like `font-display`, `font-body`) AND bind caps transformations to `text-transform-primary`, `text-transform-secondary`, or `text-transform-tertiary` synchronously. **Fonts and Text Casing MUST be updated and audited together. They are a single atomic pair in M3.** Hardcoded overrides like `uppercase` or `font-sans` are strictly forbidden unless acting as absolute raw atoms.

⚠️ **CRITICAL WARNING: TRUELLY watch out for Text casing!** Visual compliance is meaningless if the underlying structural tags aren't explicitly mapped. You must guarantee that every generic text string natively inherits text casing according to the theme governor (`globals.css`), preventing unexpected capitalization breaks when the active theme swaps `--body-transform` or `--heading-transform`.

### ⚠️ Strict Implicit Token Rule (The "Missing Token" Trap - March 2026)
It is **not enough** to simply scan for explicit hardcoded classes like `uppercase` or `font-sans`. The most insidious typography bugs occur when text nodes *lack* M3 tokens entirely and implicitly fall back to browser defaults (e.g., standard spacing, Title Case rendering).

**The Strict Audit Rule:**
- Any text node (e.g., `span`, `p`, `div` containing raw text) without an explicit M3 typography token pair is an **immediate failure**.
- Generic utility classes like `text-[15px] font-medium` alone are illegal for UI labels, descriptions, and structural text unless explicitly designated as raw atoms.
- They MUST be accompanied by an M3 mapping (e.g., `font-body text-transform-secondary` or `font-dev text-transform-tertiary`).
- **Visual Verification is Mandatory:** Typography audits must end with visual DOM verification (screenshots or visual diffs). The eye catches implicit inheritance failures (like Title Case rendering when a theme mandates secondary text be lowercase) that basic code scanning misses.

## ⚠️ GHOST CLASS DETECTION (CRITICAL — March 2026)

**This is the #1 silent killer in the ZAP Design Engine typography system.**

A "ghost class" is a CSS class name used in JSX `className` attributes that **does not exist** in `globals.css`, Tailwind config, or any CSS file. The class does nothing — no error, no warning — and the element silently falls back to CSS inheritance (usually inheriting the wrong font from a parent element).

### Known Ghost Classes (Resolved)
These classes were used across 6+ files but never defined. They have since been added as semantic aliases in `globals.css`:

| Ghost Class | What It Did | Resolution |
|---|---|---|
| `.font-secondary` | **Nothing** — fell back to Pacifico via `h1-h6` heading inheritance | Added to `globals.css` → `font-family: var(--font-body)` |
| `.font-tertiary` | **Nothing** — same silent fallback | Added to `globals.css` → `font-family: var(--font-dev)` |
| `.font-primary` | **Nothing** — silently ignored | Replaced with `.font-body` or `.font-display` depending on context |

### Mandatory Ghost Class Audit Step
Before declaring any font class "correct", you MUST verify it exists in `globals.css`. Run:
```bash
grep -n "\.font-display\|\.font-body\|\.font-dev\|\.font-secondary\|\.font-tertiary" src/app/globals.css
```

### The Complete Valid Class Map (Source of Truth)

**Font Family Classes** (defined in `globals.css` `@layer base`):
| CSS Class | CSS Variable | Default Fallback | Role |
|---|---|---|---|
| `.font-display` | `var(--font-display)` | Space Grotesk | Primary/Display headings |
| `.font-body` | `var(--font-body)` | Inter | Body/Readable text |
| `.font-dev` | `var(--font-dev)` | JetBrains Mono | Developer/Mono text |
| `.font-secondary` | `var(--font-body)` | Inter | Semantic alias for `.font-body` |
| `.font-tertiary` | `var(--font-dev)` | JetBrains Mono | Semantic alias for `.font-dev` |

**Text Transform Classes** (defined in `globals.css` `@layer utilities`):
| CSS Class | CSS Variable | Fallback |
|---|---|---|
| `.text-transform-primary` | `var(--heading-transform)` | `none` |
| `.text-transform-secondary` | `var(--body-transform)` | `none` |
| `.text-transform-tertiary` | `var(--dev-transform)` | `none` |

**Global Heading Rule** (`globals.css`):
All `h1`-`h6` tags automatically get:
- `font-family: var(--font-display)` — inherits Primary/Display font
- `text-transform: var(--heading-transform, none)` — inherits Primary transform

This means: if you use `font-secondary` on an `<h2>`, it must **override** the global `h1-h6` rule. If `font-secondary` is a ghost class, it does nothing and the `<h2>` renders in Pacifico.

## Shell vs. Content Typography Roles

### Shell Accordion Titles (SideNav, Inspector)
Must match the canonical `AccordionItem` atom (`genesis/atoms/layout/AccordionItem.tsx`):
```
font-display font-medium text-titleSmall text-transform-primary tracking-tight
```
**No hardcoded casing.** Primary transform flows through.

### Shell Header Titles (Inspector header, SideNav header)
```
font-display text-transform-primary
```

### Navigation Sub-Items (functional labels like "Colors", "Typography")
```
font-body text-transform-secondary
```
Readable body font with secondary transform.

### Section Headers (content page titles like "01. Font Families")
```
font-secondary (h2 inherits text-transform from global heading rule)
```
Readable Inter via `.font-secondary`, casing follows `--heading-transform` automatically through the `h2` global rule.

### The `cn` (Tailwind Merge) Hazard (Navigation, Inspector, Body)
When auditing **Vertical Navigation**, **Horizontal Navigation**, **Body**, or **Inspector** components, be highly suspicious of the `cn()` utility wrapper. `tailwind-merge` has an aggressive regex that often strips out custom `text-transform-[role]` classes when paired with things like `text-muted-foreground` (assuming they are clashing text color properties). If casing isn't rendering on a component visually, pull the casing utility *outside* of the `cn()` block entirely to force its application in the React DOM.

### ⚠️ Script Font Casing Indicator Trap (March 2026)
Script/calligraphic fonts (e.g., **Pacifico**, Dancing Script, Great Vibes) render uppercase glyphs that look identical to lowercase — by typeface design. `text-transform: uppercase` DOES change the codepoints, but the rendered output is visually indistinguishable.

**Impact:** Any casing indicator ("Aa"/"AA"/"aa"), transform state badge, or preview label rendered in a script font becomes meaningless. The user has no way to tell if uppercase is active.

**Rule:** Casing indicators and transform labels MUST render in a **neutral system font** (`var(--font-inter, Inter, sans-serif)`) — never in the active display font.

```tsx
// ❌ Indicator in Pacifico — "AA" looks identical to "aa"
<span style={{ fontFamily: fontValue }}>AA</span>

// ✅ Indicator in Inter — "AA" vs "aa" is visually obvious
<span style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>AA</span>
```

### ⚠️ Hardcoded Casing on Shared Components (March 2026)
Shared layout components like `SectionHeader` (`foundations/components.tsx`) and `ExperimentalHeader` are used across ALL design pages. If they have hardcoded `uppercase` in their className, the user's dynamic text casing settings are completely bypassed.

**Audit target list for hardcoded casing:**
- `SectionHeader` → title span
- `ExperimentalHeader` → LIVE indicator, badge text
- `PageHeader` → breadcrumb, title, badge (these are already correct — uses `text-transform-primary`)
- `AccordionItem` → trigger text
- Any component in `foundations/`, `layout/`, or `genesis/molecules/`

**Rule:** Replace hardcoded `uppercase` / `lowercase` / `capitalize` with the appropriate `text-transform-primary`, `text-transform-secondary`, or `text-transform-tertiary` utility class.

### The Sandbox Global Variable Freeze (Preview Labs)
When auditing typography preview components that must instantly react to state overrides (before hitting an API submit/publish button), you cannot use utility classes (`font-display`, `text-transform-primary`). Global CSS overrides typically inject the `!important` tag on M3 tokens, locking the preview component to the previous "published" state. You must violently bypass this by injecting **raw inline React state mapping** directly into the element: `style={{ fontFamily: fontValue, textTransform: activeTransform }}`.

## Execution Steps

### 0. Live Theme Token Verification (MANDATORY FIRST STEP)
Before declaring any typography pairings as "incorrect" or "mismatched", you MUST verify exactly what fonts and casing rules are currently registered for the active theme. Do not rely on assumptions.
1. Read `src/themes/{ACTIVE_THEME}/theme.json` (e.g., `src/themes/METRO/theme.json`).
2. Map out exactly what `fontBody` (which structurally drives `.font-secondary` reading text) and `bodyTransform` (which drives `.text-transform-secondary`) are currently set to.
3. Map out exactly what `fontDisplay` and `headingTransform` are set to.
4. Use this live JSON mapping as the absolute source of truth when identifying mismatches during your audit.

### 1. Ghost Class Scan (NEW — Run First)
Before any visual audit, scan for classes that don't exist in CSS:
```bash
# Find all font-* class usages in components
grep -rn "font-[a-z]*" src/ --include="*.tsx" | grep -oP 'font-[a-z]+' | sort -u

# Cross-reference against globals.css definitions
grep -n '^\s*\.font-' src/app/globals.css
```
Any class found in components but NOT in `globals.css` is a ghost class that must be resolved.

### 2. Code Analysis
⚠️ **The Audit Boundary Rule:** Never assume all components exist solely in `src/components/ui`. You MUST execute project-wide searches across `src/genesis`, `src/zap/sections`, and `src/app` using your directory search tools to guarantee out-of-folder components are not skipped. Prematurely declaring "all components are fixed" without validating the entire ZAP project spectrum is strictly forbidden.

Examine the source code of the target page and its imported components using `view_file` or `grep_search`. You are looking for:
- ❌ **Implicit browser fallbacks (Missing Tokens)**: Text nodes using generic utility classes (e.g., `text-[15px] font-medium`) WITHOUT an explicit M3 font/casing token pair.
- ❌ **Ghost classes**: `font-primary`, `font-sans`, `font-mono`, `font-serif` — classes that look right but don't exist in CSS.
- ❌ Hardcoded CSS overrides: `style={{ fontFamily: 'var(--font-sans)' }}`
- ❌ Hardcoded capitalization utilities: `uppercase`, `lowercase`, `capitalize` on token-governed elements.
- ❌ Casing indicators/badges rendered in the active display font instead of a neutral system font.
- ❌ Casing classes buried inside complex `className={cn(...)}` arrays on target items (e.g. Navigation Links, Breadcrumbs).
- ❌ Missing text-transform pairing: font class present but no corresponding `text-transform-*` class.
- ❌ **Dual-store desync**: Typography publish writing to only one API store (`/api/theme/settings` OR `/api/typography/publish`) instead of both — causes cross-page font/casing drift.
- ✅ Correct dynamic tokens: `font-display`, `font-body`, `font-dev`, `font-secondary`, `font-tertiary`.
- ✅ Correct transforms: `text-transform-primary`, `text-transform-secondary`, `text-transform-tertiary`.
- ✅ Casing indicators rendered in `var(--font-inter, Inter, sans-serif)` — not the active display font.
- ✅ Font and Casing tokens always paired together in the identical DOM tree element hierarchy.

### 3. Generate the Audit Table (Artifact)
Before making ANY code changes, create a Markdown artifact (e.g., `font_audit_[page].md`) explicitly detailing the findings. Use the following table format exactly:

| UI Region | Element | Font Implementation | Cap Style Implementation | Resulting Visual Glitch | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[Region Name]** | [Element Name] | `[Class/Style found]` | `[Class/Style found]` | [Description of the broken token mapping] | ❌ Broken |

*Example Table Rows:*
| **Body (Cards)** | Feature Card Tag | Inherits from `<body>` | Hardcoded `uppercase` class. | ⚠️ Caps match visually, but via static utility instead of M3 token. | ❌ Broken |
| **SideNav** | Category Title | Ghost class `font-primary` | Missing — no transform class | ⚠️ Falls back to browser default font, no casing applied | ❌ Ghost |
| **Inspector** | Accordion Title | `font-secondary` (ghost) | Hardcoded `uppercase` | ⚠️ Font shows Pacifico (inherited), casing correct but hardcoded | ❌ Ghost+Hardcoded |

### 4. Review
Notify the user and present the audit table artifact using `notify_user` with `PathsToReview`. Ask for permission to execute the fixes.

### 5. Implementation and Sign-Off
Once authorized or if you possess the mandate to fix autonomously:
1. Multi-replace or replace the incorrect hardcoded strings with the precise M3 dynamic tokens.
2. Update the markdown artifact table directly, changing the **Status** column from `❌ Broken` to `✅ Fixed` as you resolve each line item.
3. Upon completion, use the fully checked-off table as proof of sign-off and notify the user that the audit has been successfully resolved.
