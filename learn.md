# ZAP Design Engine Learnings

## 🧠 Daily Intelligence Sync

**Protocol:** At the start of every daily session, the active agent must review the preceding day's learnings, journal any new structural discoveries or architectural shifts, and aggressively optimize this document.
**Objective:** `learn.md` is not a stagnant wiki. It is an evolving, high-density survival guide and the primary directive for continuous improvement across the ZAP ecosystem.

### The ZAP 4-Tier Intelligence Protocol
This document (`learn.md`) is Tier 2 of the Intelligence Cascade. Do not use it for permanent static rules if an SOP exists.
1. **Tier 1 (The Brain Stem):** `gemini.md` / `CLAUDE.md`. Permanent identity and routing.
2. **Tier 2 (The Active Buffer):** `learn.md`. You are reading it now. Use this to actively patch immediate bugs, track fresh architectural shifts, and sync daily context.
3. **Tier 3 (The Muscle Memory):** `.agent/skills/`. Permanent execution protocols (e.g., `zap-component-baseline`). Do not load these until explicitly triggered.
4. **Tier 4 (Deep Research):** ChromaDB, MongoDB, NotebookLM. Massive historical RAG memory. Query these when you need profound context beyond local workspace files.

### The Auto-Promoting Execution Gate System
Most assume an LLM simply does whatever it is told unless prompted otherwise. In the ZAP ecosystem, this is fundamentally false. We use **Execution Gates**—isolated scripts that run intercept patterns against *every single tool call*. 

If a tool call matches a forbidden pattern (e.g., writing an API key to a file, force pushing to git, or attempting a destructive workspace purge), the gate forcefully denies the execution. This is not a "preference" or a "soft warning"—it is a hard structural block at the execution link. The tool fails immediately (Exit Code 2), and the agent cannot proceed.

**The Self-Healing Loop:**
What makes the ZAP architecture autonomous is the promotion loop. Every time an agent makes a mistake and is corrected by the Chief Security Officer (Zeus), it **must** log that correction into this `learn.md` file. 

A background Sentinel script routinely scans `learn.md`, counting how many times a specific mistake has recurred. When a threshold is breached, that logged correction is **automatically promoted into a permanent blocking key** inside the Execution Gate. 

While the agent might make the initial mistake, the system reads the agent's own apology/lesson, parses the pattern, and physically alters the execution perimeter. The mistake becomes structurally impossible to repeat. This document literally builds the walls that contain the Swarm.

---

## ⛔ MANDATES (Non-Negotiable)

These are **hard rules**. No exceptions. No "just this once." Every agent, every session, every commit.

### MANDATE-001: Zero Hardcoded Fonts, Colors, or Text Casing

**Scope:** All files under `packages/zap-design/src/`

No component, page, layout, or atom may use hardcoded Tailwind values.

- **Font family:** Use `font-display`, `font-body`, `font-dev`. Never `font-sans` or `Arial`.
- **Text casing:** Use `text-transform-primary/secondary/tertiary`. Never `uppercase` or `capitalize`.
- **Text color:** Use `text-on-surface`, `text-primary`. Never `text-red-500` or `text-gray-*`.
- **Background:** Use `bg-layer-*`, `bg-surface`. Never `bg-white` or `bg-slate-*`.
- **Border:** Use `border-outline`, `border-border`. Never `border-gray-200`.

*Exceptions:* Debug colors gated by `[data-devmode="true"]`, specific inline sandbox bypasses, Inspector/Dev Tool UI headers (where precise typographic parity via `uppercase` is architecturally intended), and global Brand constants.

**Specificity Protocol (The Casing Override Trap):**
Never mix inline structural styles (`style={{ textTransform: 'inherit' }}`) with M3 Tailwind utility classes (e.g., `className="text-transform-secondary"`). Inline styles *always* win CSS specificity. If `--body-transform` implies `capitalize` but an inline style inherits `none` from its parent, the Tailwind class is silently defeated, destroying theme synchronization. If an M3 class is applied, purge competing inline style attributes entirely.

**Implementation Enforcement (Anti-Slop Protocol):**
All agents generating or modifying UI MUST adhere to the `/Users/zap/Workspace/olympus/.agent/skills/impeccable-frontend-design/SKILL.md` skill context. This skill guarantees ZAP-compliant typography, colors, layout depth (L0-L5), and explicitly forbids generic "AI Slop" aesthetics. Furthermore, all generated code is strictly verified against these mandates by the `gsd-ui-auditor.md` (Pillar 7: Anti-Patterns) which runs hard `grep` assertions for forbidden utilities (e.g., `bg-white`, `uppercase`, `font-sans`).

### MANDATE-003: Pure CSS Variable Inheritance for Components

**Scope:** All core UI primitives (like Button, Input, Card) and their respective showcase pages.

Do not hardcode Tailwind structural utilities (like `border-2`, `px-4`, `w-10`) on primitive variants if those properties are meant to be governed by global theme tokens (like `--button-border-width` or `--button-padding-x`).

- **Borders:** If a visual variant (like `outline`) requires a border, define the style (`border-solid`) but **never** hardcode the width (e.g., `border-2`). Always allow the root component to inherit the thickness dynamically via `border-[length:var(--button-border-width,1px)]`.
- **Showcases & Previews:** Do not inject localized sizing utilities (`w-10 h-10 px-0`) on component instances inside showcase pages (like `body.tsx`) simply to force a shape, such as an icon button. Forcefully overriding padding (`px-0`) permanently severs the component's ability to mirror live token changes from the Inspector. If an "Icon Only" visual is required, engineer a native `size="icon"` property into the primitive that respects the global variable cascade.

### MANDATE-004: Dynamic Routing & Immutable Theme IDs

**Scope:** All Publisher Actions, Inspector Hooks, and Foundation Pages

Never hardcode theme identifiers (e.g., `'metro'` or `'core'`) in API fetch requests or publish button text.

- **Routing Context:** Foundation hooks (`useLayerProperties`, `useTypography`, etc.) MUST extract the active theme from the dynamic route using Next.js `useParams().theme`.
- **Publish Actions:** API payloads for `POST /api/.../publish` must dynamically pass the resolved `themeId`. If a theme is hardcoded, the publish button will blindly overwrite the wrong theme or fail completely when tested on new themes.
- **Button Text:** Publisher buttons MUST use the dynamic `{themeId} Theme` string, combined with the `text-transform-secondary` CSS utility from Mandate-001 instead of manually capitalizing the text.

### MANDATE-005: Live Token Registry Verification (Typography)

**Scope:** All typography, font, and capitalization audits across ZAP Design Engine.

Before declaring any typographic pairing (e.g., `.font-body` with `.text-transform-secondary`) as "incorrect" or mismatching the system, the active agent MUST verify the live theme registry.

1. **Read the JSON Registry:** Open `src/themes/{ACTIVE_THEME}/theme.json` (e.g., `src/themes/METRO/theme.json`).
2. **Extract the Configuration:** Map exactly what `fontBody` and `bodyTransform` (the structural drivers for `.font-secondary` and `.text-transform-secondary`) are currently set to.
3. **Source of Truth:** Use that live JSON configuration as the absolute baseline truth. Never rely on assumptions about what "primary" or "secondary" casing looks like.

---

## 1. Layer Architecture Token System
The engine strictly enforces a 6-layer 3D ascension architecture using `--color-layer-*` CSS variables.

- **L0 Base:** `bg-layer-base` (surface)
- **L1 Canvas:** `bg-layer-canvas` (surface-container-low)
- **L2 Cover:** `bg-layer-cover` (surface-container)
- **L3 Panel:** `bg-layer-panel` (surface-container-high)
- **L4 Dialog:** `bg-layer-dialog` (surface-container-highest)
- **L5 Modal:** `bg-layer-modal` (surface-container-highest)

**Audit Method:** Swap M3 tokens with neon debug hex colors in `globals.css` `@theme` to visually verify hierarchy compliance.

**Table Compliance:** Tables are never transparent. Body rows must sit at `bg-layer-dialog` (L4). Column headers and title bars always ascend one step above to `bg-layer-modal` (L5).

---

## 2. Component Integration & Templates

- **LaboratoryTemplate is Mandatory:** All design pages must route through `<LaboratoryTemplate>`. Do not hand-wire `AppShell`, `Canvas`, and `Inspector` manually. The template owns the architecture; the page stays thin providing only header mode, inspector config, and the body element.
- **Iconography:** Rely on Google Fonts' `material-symbols-outlined` for unified, offline-capable iconography. Avoid importing Lucide SVGs unless functionally necessary.

---

## 3. Typography Systems Synchronization
**Dual-Store Sync:** The engine uses two typography backends.

1. Global ThemeContext (`/api/typography/publish` -> `.zap-settings/typography-{theme}.json`)
2. Page-Level Config (`/api/theme/settings` -> `src/themes/{THEME}/theme.json`)

**Rule:** Always write to both endpoints in parallel (`Promise.all`). Writing to only the theme JSON leaves the rest of the app on stale cache.

**Casing Indicators:** Preview badges showing text transformations ("Aa" vs "AA") must render in a neutral system font (Inter/sans-serif). Script fonts (like Pacifico) have identical glyphs for upper/lowercase, rendering the toggle indicator structurally useless if previewed in the active script font.

---

## 4. Interactive Component States & Property Mapping

When building toggles, options, or Sandboxes leveraging core Atoms:

- **Decoupled Radio Toggles:** Never pass the mapped ID structurally back to the toggle button (`variant={v.id}`). This causes the button to masquerade as the target variant. Use explicit structural states entirely independent of the preview context (`visualStyle='solid'` for active, `visualStyle='ghost'` for inactive).
- **Geometric Strictness:** Size preset variants (`tiny`, `expanded`) must only define geometry (height, padding, gap, typography scale). They must never hardcode structural styles like `border-0` which destroy visual variants requiring active borders (like `outline` borders).
- **Explicit None States:** Optional structural props (like `iconPosition`) must explicitly define a `none` or `hidden` option in their validation schema (CVA/Zod). Do not rely on empty strings or structurally fragile default fallbacks like 'left'.
- **Compound Publisher Buttons:** When building wrapper/publisher components (like `ThemePublisher`) that pass structural props down to an underlying `<Button>`, explicitly evaluate states like `iconPosition === 'none'` if injecting hardcoded `<Icon>` children blocks. A prop like `iconPosition="none"` only controls Tailwind alignment classes; it does not automatically delete hardcoded React nodes!

---

## 5. Component Isolation & Reconstitution Strategy

When identifying, replacing, or debugging structural regions (especially Inspectors and Footers):

- **Template Prop Injection:** Components are frequently not rendered in the direct DOM tree but passed as React nodes into template configs (e.g., `inspectorConfig.footer` in `<LaboratoryTemplate>`). When hunting a rogue component, check the props passed to the top-level Page Template.
- **Aggressive Purge of Clones:** If a feature (like "Publish to Theme") exists natively as `<ThemePublisher>`, any raw HTML `<button>` clones found inside Foundation pages must be aggressively purged and replaced. Hardcoded clones cause systemic styling desyncs (like the colors page failing to inherit button settings).
- **Universal Sinks:** `ThemePublisher` is a systemic sink that fetches and inherits global `atoms/button` configurations seamlessly via its `useEffect`. **Never** hardcode visual overrides (e.g., `buttonProps={{ color: 'destructive' }}`) onto the Publisher when dropping it into an Inspector, or it will permanently sever its ability to mirror the sandbox state.
- **Structural Bleeds over CSS Hacks:** When a component is bleeding UI (like the green `[data-devmode="true"]` overlay), fix it **structurally**, not with CSS. Wrapping the component in a new `<section className="bg-layer-panel">` inside its Dev Wrapper successfully blocked the Inspector's green layer from piercing the transparent button, completely invalidating the need for hacky `!bg-red-500` brute-force CSS classes. 

---

## 6. CSS Cascade & Dynamic Theme Injection

- **DOM Root Inheritance Context:** All theme variables (`--button-border-radius`, etc.) saved globally to a CSS file (`theme-core.css`) require a matching root class (e.g., `.theme-core`) injected into the DOM (e.g., `<html>` or `<body>`) to cascade down to components. If atomic components correctly load variables inside Sandboxes but fail in global layouts, check the dynamic class injection manager (e.g., `<ThemeManager>`).
- **Do Not Blacklist Baseline Themes:** If your class injector intentionally skips injecting a default or "baseline" theme class (such as `core`), all user-authored CSS variables saved to that theme's configuration will be abruptly severed from the cascade, causing components to instantly revert to raw Tailwind fallbacks (e.g. pill buttons instead of 4px border-radius) outside of their sandboxed preview wrappers.

---

## 7. Component Prop Inheritance & Theme Synchronization

- **Avoid Hardcoding Theme Variants on Instances:** Never explicitly hardcode variation props (e.g., `visualStyle="solid"`, `size="expanded"`, `iconPosition="right"`) directly onto reusable component instances (like `<GenesisButton>`) scattered throughout standard pages (like `combat-signin`) unless that specific instance *must* intentionally diverge from the global theme. 
- **The Override Trap:** Hardcoding these props forcefully overrides the global aesthetic configurations saved by the user in the Theme Inspector. If the user globally switches their button aesthetic to `outlined`, any button with explicitly defined `visualStyle` props will silently fail to update, fragmenting the application's visual consistency.
- **Solution:** When styling instances to match the global theme, strip out explicit variant assignments (or ensure they perfectly mirror the exact saved parameters if dynamic wiring is still pending) to ensure the component remains visually synchronized with the core theme architecture.

---

## 8. Structural Border Cascades

- **The Zero-Hardcoded-Border Rule for Structural Covers (L2):** Never hardcode `border` or `rounded-*` utilities onto structural layer containers like `bg-layer-cover` (L2). 
- **The COMPONENT_BORDER_MAP:** M3 specifies that structural layers (Cover, Panel, Modal) dictate their own border width and radius natively via `COMPONENT_BORDER_MAP` (e.g., L2 defaults to `rounded-[32px]` and `border-0`).
- **Anti-Pattern:** Hardcoding `border border-border rounded-xl` onto a `<GenesisCard className="bg-layer-cover">` forcefully short-circuits the global spatial depth rules and severs the publisher's ability to structurally mute or elevate the Cover component. Strip these inline structural overrides so the element purely inherits its geometry from the CSS variable cascade (`--layer-2-border-*` or native component fallback).
- **Layer-Specific Token Binding (`--layer-X-border-radius`)**: When building macro layout containers (e.g., `bg-layer-cover` for L2, `bg-layer-panel` for L3), developers must bind the inline style strictly to the corresponding semantic layer token (`style={{ borderRadius: 'var(--layer-3-border-radius)' }}`) rather than relying on generic component radius tokens like `var(--card-radius)`. This ensures that the L1-L5 spatial architecture remains fully governed by the Inspector's master layer dials.

---

## 9. Inspector Layout & AppShell Styling

- **AppShell Border Management:** The `<AppShell>` template component natively provides a full-height `border-l border-border/50` container wrapping anything passed to its `inspector` prop. 
- **The Double Border Trap:** When authoring localized `<Inspector>` components to pass into `<AppShell>`, **never** explicitly apply a left border (e.g., `border-l border-border/50`) to your root element. This stacks the borders side-by-side against the AppShell's container, causing a visually jarring 2px thick line. Local Inspector components must rely entirely on `<AppShell>` for edge separation.

---

## 10. Dynamic Properties & Tailwind v4 Parser Conflicts

- **Avoid Arbitrary Tailwind Classes for Complex CSS Variables:** When wiring dynamic properties governed by CSS variables with complex fallbacks (e.g., `var(--input-border-radius, var(--layer-border-radius, 8px))`), **never** map them using Tailwind's arbitrary class syntax like `rounded-[length:var(...)]` or `border-[length:var(...)]`. 
- **The Bug:** Tailwind v4's class JIT compiler and `twMerge` can silently fail to parse these nested comma declarations or wrongly strip them when conflicting with arbitrary color classes (e.g. `border-outline-variant`). This results in the DOM erasing the explicit geometric property, causing utilities like `ring-3` (which relies on `border-radius` for its `box-shadow`) to wildly fallback to a `9999px` pill-shape radius instead of the intended `0px` sharp edge when "None" is selected in the Inspector.
- **The Protocol:** Bypass Tailwind's string parser entirely. Inject dynamic geometric properties strictly via React's native inline `style={{ borderRadius: 'var(...)', borderWidth: 'var(...)' }}` object on the raw atomic DOM element. This guarantees standard CSS specification mapping and permanently inoculates the component against `twMerge` runtime stripping.
- **The Invisible Layer Override Trap:** CSS specificity cascade order can silently kill component borders. Even if an atom (like `Input` or `Textarea`) uses Tailwind's `border-solid` class, a parent layout container powered by a M3 Zap token (like `bg-layer-dialog` from `globals.css`) injects `border-style: var(--layer-border-style)`. Because `globals.css` layer tokens load later in the CSS pipeline than Tailwind classes, the layer forcibly overwrites the component's border style to `none`, rendering any inline `borderWidth` overrides invisible (0px). **Always map `borderStyle: 'var(--component-border-style, solid)'` explicitly inside your React inline styles for structural inputs to permanently shield them against invisible layer-level overrides.**

---

## 11. Typography Auditing: The Strict Implicit Token Rule

- **The Missing Token Trap:** When auditing for typography compliance (MANDATE-001), it is not enough to simply grep for explicit hardcoded classes (`uppercase`, `font-sans`). The most insidious bugs occur when generic text nodes (`<p className="text-sm">`) lack M3 tokens entirely, causing them to implicitly fall back to standard browser rendering (e.g., Title Case, default system font).
- **The Primitive Replacement Mandate ("Shadcn Halo Effect"):** All raw structural text nodes (`<h1>`, `<h2>`, `<p>`, `<span>`, `<div>`) must be rigorously replaced with ZAP Atomic Primitives (`<Heading>`, `<Text>`, `<Label>`). Relying on raw HTML with injected Tailwind classes is a legacy Shadcn practice that leads to fractured typography inheritance. Do not manually format text nodes; wrap them in Genesis atoms and let the internal token mapping handle weights and transforms.
- **The Strict Rule:** Any structural UI text node (labels, descriptions, headers) that lacks an explicit M3 typography token pair or wrapper atom is an immediate audit failure. Generic utility classes alone are illegal.
- **Visual Verification is Mandatory:** Code scanners will consistently miss implicit inheritance fallbacks. All typography audits must conclude with a visual inspection (screenshot or visual diff) to guarantee that the rendered casing and font perfectly align with the active theme matrix.

---

## 12. ZAP Swarm Virtual File System (VFS)

- **The 3-Primitive Mandate:** Do not teach agents specific database APIs (Prisma, MongoDB). All inter-agent and storage I/O must route through the Swarm VFS using strictly `read`, `write`, and `list` primitives.
- **Context Conservation (`tmp://`):** Heavy research or intermediate state must be dumped to `tmp://` and passed as a URI reference to subsequent agents to prevent context window exhaustion and prompt collapse.
- **Architectural Decoupling (`shared://`):** Treat the VFS translation layer as the absolute boundary. Agents must never know if `shared://` is backed by MongoDB, S3, or Postgres. Everything is a file.

---

## 13. M3 Elevation & Motion Standards

- **Physics-Based Spring Animations:** When building page-level entry animations or elevating M3 surface panels, rely strictly on `framer-motion` wrappers (`<motion.div>`) to govern entrance physics. Avoid raw CSS keyframes (`@keyframes`) or predefined Tailwind animation utilities that use rigid bezier curves.
- **The M3 Elevation Profile:** The standard ZAP architectural entry profile is a dampened spring (`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}`). 
- **Decoupled Animation Wrappers:** Never inject `framer-motion` directly into core primitive atoms (`<Button>`, `<Input>`). Physics wrappers must wrap the *composition* of atoms at the layout or page level to prevent hydration mismatches and physics collisions on rerenders.

---

## 14. The V4 Post-Mortem: 10 Anti-Patterns That Sever Inspector Tethering

**Origin:** Sign-In V4 build (March 2026). Every mistake below violated a single root principle: **if the Inspector controls it, the page doesn't touch it.**

### Anti-Pattern 1: Explicit Visual Props on Genesis Atoms
Passing `visualStyle="solid" color="primary" size="expanded"` onto `<Button>` forcefully overrides the Inspector's active global config (e.g., Tonal + Glow + Medium). **Rule:** Omit visual/size props entirely unless the instance *must* intentionally diverge from the global theme.

### Anti-Pattern 2: Tailwind Padding/Shadow on Buttons
Adding `py-3`, `shadow-lg`, `hover:shadow-xl` via className overrides `--button-padding-y` and `--button-height`. **Rule:** Zero structural Tailwind utilities on Genesis button instances.

### Anti-Pattern 3: Hardcoded Icon Gap (`mr-2`)
Using `mr-2` on icon children instead of letting `--button-icon-gap` handle spacing via CVA `gap`. **Rule:** Never manually space children inside Genesis atoms.

### Anti-Pattern 4: Hardcoded Hover Background
SSO buttons had `hover:bg-on-surface/5` overriding theme-resolved hover states from `genesis-button.css`. **Rule:** Hover states are owned by the CSS theme layer, not className.

### Anti-Pattern 5: Using Generic `<Input>` Instead of Specialized Atoms
Used `<Input type="email">` instead of `<EmailInput>` which is specifically wired to the Input Settings page with `leadingIcon="mail"`. **Rule:** Always check `genesis/atoms/interactive/` for specialized wrappers before using the base primitive.

### Anti-Pattern 6: Hardcoded `variant` on Inputs
Forced `variant="outlined"` instead of letting the default cascade from the Inspector. **Rule:** Omit the `variant` prop to inherit the global configuration.

### Anti-Pattern 7: Invalid Variant Values
Passed `variant="lg"` which doesn't exist on `InputProps` (`'outlined' | 'filled'`), causing a TypeScript error. **Rule:** Always verify the component's type interface before passing props.

### Anti-Pattern 8: Mismatched className Between Sibling Inputs
EmailInput had `focus:shadow-[0_0_0_2px_...]` while PasswordInput had `shadow-sm` — two different hardcoded behaviors on siblings that should be identical. **Rule:** If two sibling instances use the same atom, they must have identical (or zero) className overrides.

### Anti-Pattern 9: Asymmetric Leading Icons
`EmailInput` atom had `leadingIcon="mail"` but `PasswordInput` had none. **Rule:** When building specialized input wrappers, ensure visual symmetry by providing consistent icon patterns across the set.

### Anti-Pattern 10: Dev Artifacts in Production UI
Left "V4" version labels in the heading, floating badge, and footer. **Rule:** Version markers are dev artifacts and must never ship to production showcases.

### The V4 Golden Rule
> **Strip everything. Trust the cascade. If a Genesis atom accepts it as a prop, the Inspector already controls it. Your job as a page author is to compose atoms, not style them.**

---

## 15. The Pre-Flight Skill Audit & Business/Tech Dual-Layer Protocol

**Origin:** Merchant Digital Workspace Sandbox execution (March 2026).

### 15.1 The Pre-Flight Skill Audit is Mandatory
Before proposing any architectural flow, drawing any layout skeletons, or generating a `UI-SPEC.md`, agents must structurally verify the boundaries of the engine by reading the master skills (`zap-build.md`, `audit-and-fix.md`, `zap-foundation-enforcer.md`). Proposing UI shapes without establishing the L0-L5 Layer Depth and Inspector Tethering rules results in generic designs that fracture the ecosystem. **Rule:** Read the law before you draft the blueprint.

### 15.2 The `Object.assign` Reflex
Generic Tailwind classes (`rounded-md`, `p-4`) are forbidden on complex structural containers governed by the Theme Engine. **Rule:** When elevating a structural floating pane (L1-L5), agents must instinctively utilize the runtime bypass to enforce Metronic Inspector compliance: `style={Object.assign({}, { borderRadius: 'var(--layer-[level]-border-radius)' })}`.

### 15.3 The Dual-Layer Communication Standard
When projecting a new feature, architecture, or plan to the user, answers must be strictly decoupled into two distinct blocks:
1. **Layer 1 (The Business Value):** Plain English. Explain what the feature *does* for the merchant, customer, or workflow. Zero technical jargon.
2. **Layer 2 (The Technical Engine):** Unabridged technical jargon. The exact Docker architecture, Next.js routing logic, L1-L4 tokens, Postgres schemas, and security gates driving Layer 1.
