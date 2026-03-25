# SOP-002-TYPOGRAPHY_archITECTURE

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** B.L.A.S.T.

---

## 1. The Golden Rule

"Don't guess, just step." If a title looks too big, move it down to the next name on this list. Do not create "in-between" sizes like 17px or 33px.

## 2. Heading Standards (The "H" Series)

Used for titles and grabbing attention.

| Name | Desktop Size | Mobile Size | Human Description (When to use it) |
| :--- | :--- | :--- | :--- |
| **H1: Big Boss** | 48px | 32px | The main title of a page. Only one per page. |
| **H2: Section** | 38px | 28px | For the big chapters or sections of a page. |
| **H3: Module** | 31px | 24px | For cards, widgets, or blocks of content. |
| **H4: Small Title** | 25px | 20px | For smaller groups within a module. |
| **H5: Bold Label** | 20px | 18px | Use this for a title that needs to stand out but stay small. |
| **H6: Micro Title** | 16px | 14px | For very small labels that still need to be "titles." |

## 3. Reading Standards (The "Body" Series)

Used for paragraphs, descriptions, and data.

| Name | Desktop Size | Mobile Size | Human Description (When to use it) |
| :--- | :--- | :--- | :--- |
| **Body Large** | 18px | 16px | The "Intro": Use for the first paragraph of an article. |
| **Body Main** | 16px | 16px | The "Standard": Use for 90% of all text. Very easy to read. |
| **Body Small** | 14px | 12px | The "Detail": Use for captions, dates, or secondary info. |
| **Body Tiny** | 12px | 10px | The "Fine Print": Use for legal text or tiny tooltips. |

## 4. Brand & Impact (The "Display" Series)

Used for marketing and high-impact branding.

* **Display 1 (Huge):** 95px (Desktop) / 56px (Mobile). Use for "Welcome" screens.
* **Display 2 (Large):** 76px (Desktop) / 48px (Mobile). Use for big marketing claims.

## 5. Helpful Tips for the Team

* **For Nguyen (Design/CSS):** Always use the "Line Height" (the space between lines) to make sure the text has room to breathe.
* **For Liem/Linh (Content):** If you have more than 3 sentences, use Body Main. If it's a short "Lead-in," use Body Large.
* **For Everyone:** On Mobile, we never go smaller than 10px. If it’s smaller than that, nobody can read it!

## 6. SOP-002-TYPOGRAPHY (Addendum: Dev Tokens)

### 1. Developer Mono Scale

These are the technical "workhorse" fonts for Olympus and Zap-OS system logs.

| Token Name | Style | Visual Treatment | Purpose |
| :--- | :--- | :--- | :--- |
| **Dev-Wrapper** | 13px Mono / 400 | Magenta or Cyan text | Shows Div classes, Component Names, or Z-Index |
| **Dev-Note** | 13px Mono / 700 | Yellow Highlight BG | Internal team notes or "To-Do" left in the UI |
| **Dev-Metric** | 11px Mono / 400 | Small Gray text | Page load speed, API latency, or "Heartbeat" status |

---

## B.L.A.S.T. Integration Reminder

* **Blueprint:** Use these names in Figma.
* **Link:** Use these names in Notion.
* **Architect/Stylize:** Code these as "Primary" and "Secondary" styles.
* **Trigger:** Use these names when describing bugs (e.g., "The H2 on this page looks like an H3").
