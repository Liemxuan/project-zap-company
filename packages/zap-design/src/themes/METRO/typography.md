# ZAP Typography Protocol (METRO)

> [!WARNING]
> **STRICT BAN ON HARDCODED CASING & SIZING CLASSES**
> **Do NOT use** `uppercase`, `lowercase`, `capitalize`, `text-[size]`, or `font-[weight]` directly in classNames when building with ZAP Typography Atoms (Heading / Text). Always rely on the M3 token props (e.g., `size`, `weight`, `transform`) and the global theme dictionary. Hardcoding tailwind classes overrides the theme and creates illegal Ghost Classes.

> This document is auto-generated upon Theme Publishing. It represents the single source of truth for ZAP-OS Typography semantics for this theme.
> Last Sync: 2026-03-27T20:50:00.000Z

## 1. Global Font Assignments
The Metro theme enforces a 3-tier system for font families, rigidly bound by M3 roles:

- **Primary Font:** `var(--font-pacifico)` (Cursive)
  *Scope:* Display, Headline, Title. Used for high-impact branding and section headers.
- **Secondary Font:** `var(--font-inter)` (Sans-serif)
  *Scope:* Body, Label. Used for high legibility, paragraph text, and UI controls.
- **Tertiary Font:** `var(--font-jetbrains)` (Monospace)
  *Scope:* Dev series. Used exclusively for ZAP-OS developer overlays, debug metrics, and sandbox wrappers.

### Text Transformations
The Metro theme defaults to **NO** forced text transformations (`none`) to preserve the natural curves of the Pacifico script.

## 2. The Typographic Scale (15 + 3)
All typography across the application must map to one of these predefined semantic scales.

### M3 Semantic Definitions
*   **Display (Large: 57px, Medium: 45px, Small: 36px):** High-impact, short-form text (Landing pages, marketing heroes).
*   **Headline (Large: 32px, Medium: 28px, Small: 24px):** Primary page headers and major sections.
*   **Title (Large: 22px, Medium: 16px, Small: 14px):** Section boundaries, card headers, and dialog titles.
*   **Body (Large: 16px, Medium: 14px, Small: 12px):** Standard paragraph reading and descriptions.
*   **Label (Large: 14px, Medium: 12px, Small: 11px):** Utility text, buttons, badging, and navigation.

### ZAP Dev Extensions
*   **devWrapper (13px):** Component Tag (Shows Div classes, Component Names, or Z-Index).
*   **devNote (13px, Bold):** internal team notes or "To-Do" left in the UI.
*   **devMetric (11px):** Analytics (Page load speed, API latency).

## 3. L2 Component → Token Mapping (The UI Contract)
Developers must not declare raw pixel sizes or weights. UI structural components must bind directly to the M3 Role Token. This is the L2 contract.

| Component | M3 Token | Notes |
| :--- | :--- | :--- |
| Hero Title | `displayLarge` | Landing/marketing hero sections |
| Page Title (H1) | `headlineLarge` | Single per page |
| Section Title (H2) | `headlineMedium` | Major page divisions |
| Card Title | `titleMedium` | Card/widget headers |
| Dialog Title | `titleLarge` | Modal/dialog headers |
| Navigation Item | `labelLarge` | Sidebar, top nav items |
| Button Label | `labelLarge` | All button text |
| Tab Label | `titleSmall` | Tab bar items |
| Chip Label | `labelMedium` | Filter chips, selection chips |
| Badge | `labelSmall` | Status badges, notification dots |
| Body Text | `bodyMedium` | Default paragraph text |
| Intro Paragraph | `bodyLarge` | Lead-in / first paragraph |
| Caption | `bodySmall` | Dates, metadata, secondary info |
| Input Label | `bodySmall` | Form field labels |
| Breadcrumb | `labelMedium` | Navigation breadcrumbs |
| Tooltip | `bodySmall` | Hover tooltips |
| Footer Text | `bodySmall` | Footer copy |
| Overline / Eyebrow | `labelSmall` | Category tags above titles |
| Table Header | `labelMedium` | Table column titles (12px, bold) |
| Table Data | `labelSmall` | Standard table cells (11px) |
