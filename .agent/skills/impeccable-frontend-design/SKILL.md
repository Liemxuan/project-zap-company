---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Apache 2.0. Based on Anthropic's frontend-design skill. See NOTICE.md for attribution.
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## Context Gathering Protocol

Design skills produce generic output without project context. You MUST have confirmed design context before doing any design work.

**Required context** — every design skill needs at minimum:
- **Target audience**: Who uses this product and in what context?
- **Use cases**: What jobs are they trying to get done?
- **Brand personality/tone**: How should the interface feel?

Individual skills may require additional context — check the skill's preparation section for specifics.

**CRITICAL**: You cannot infer this context by reading the codebase. Code tells you what was built, not who it's for or what it should feel like. Only the creator can provide this context.

**Gathering order:**
1. **Check current instructions (instant)**: If your loaded instructions already contain a **Design Context** section, proceed immediately.
2. **Check .impeccable.md (fast)**: If not in instructions, read `.impeccable.md` from the project root. If it exists and contains the required context, proceed.
3. **Run teach-impeccable (REQUIRED)**: If neither source has context, you MUST run the teach-impeccable skill NOW before doing anything else. Do NOT skip this step. Do NOT attempt to infer context from the codebase instead.

---

## Design Direction

Commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work—the key is intentionality, not intensity.

Then implement working code that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

### Typography
→ *Consult [typography reference](reference/typography.md) for scales, pairing, and loading strategies.*

**ZAP MANDATE-001**: Zero Hardcoded Fonts or Text Casing. Use `font-display`, `font-body`, `font-dev`. Never `font-sans` or `Arial`. Text casing must use `text-transform-primary/secondary/tertiary`. Never `uppercase` or `capitalize`.

**DO**: Vary font weights and sizes utilizing ZAP typography tokens to create clear visual hierarchy.
**DON'T**: Import custom fonts. ZAP's Design Engine handles all font loading via `font-display` and `font-body`.
**DON'T**: Use uppercase or capitalize utilities—use `text-transform-*` tokens instead.
**DON'T**: Put large icons with rounded corners above every heading—they rarely add value and make sites look templated.

### Color & Theme
→ *Consult [color reference](reference/color-and-contrast.md) for OKLCH, palettes, and dark mode.*

**ZAP MANDATE-001**: No Hardcoded Colors. Use `text-on-surface`, `text-primary`. Never `text-red-500` or `text-gray-*`. Use `bg-layer-*` or `bg-surface`. Never `bg-white` or `bg-slate-*`.

**DO**: Rely exclusively on ZAP's semantic color tokens (`text-primary`, `bg-layer-panel`, `text-on-surface`).
**DON'T**: Invent custom `oklch`, `rgb`, or hex colors. The ZAP theme engine dynamically determines all actual color values.
**DON'T**: Use pure black (#000) or pure white (#fff)—always use the theme tokens.
**DON'T**: Use gradient text for "impact"—especially on metrics or headings; it's decorative rather than meaningful.
**DON'T**: Default to dark mode with glowing accents—it looks "cool" without requiring actual design decisions.

### Layout & Space
→ *Consult [spatial reference](reference/spatial-design.md) for grids, rhythm, and container queries.*

**ZAP MANDATE-001**: Enforce 6-layer 3D ascension architecture (`bg-layer-base` -> `bg-layer-canvas` -> `cover` -> `panel` -> `dialog` -> `modal`). Tables must use L4 for root/body and L5 for headers.

Create visual rhythm through varied spacing—not the same padding everywhere. Embrace asymmetry and unexpected compositions. Break the grid intentionally for emphasis.

**DO**: Create visual rhythm through varied spacing using ZAP's spacing tokens.
**DO**: Use proper L0-L5 layer nesting to create architectural depth. ZAP *requires* proper layer ascension.
**DON'T**: Flatten the hierarchy. A `panel` (L3) should sit on a `cover` (L2) or `canvas` (L1), not directly on the `base` (L0) if depth is required.
**DON'T**: Use the hero metric layout template—big number, small label, supporting stats, gradient accent.
**DON'T**: Center everything—left-aligned text with asymmetric layouts feels more designed.
**DON'T**: Use the same spacing everywhere—without rhythm, layouts feel monotonous.

### Visual Details
**ZAP MANDATE-001**: Borders must use `border-outline`, `border-border`. Never `border-gray-200`. Border radius relies on DOM Root class injection (e.g. `theme-core`) for CSS cascade to work.

**DO**: Use intentional, purposeful decorative elements that reinforce the ZAP theme.
**DON'T**: Use glassmorphism everywhere—blur effects, glass cards, glow borders used decoratively rather than purposefully.
**DON'T**: Use generic drop shadows directly. Tie elevation strictly to the L0-L5 layers.

### Motion
→ *Consult [motion reference](reference/motion-design.md) for timing, easing, and reduced motion.*

Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

**DO**: Use motion to convey state changes—entrances, exits, feedback
**DO**: Use exponential easing (ease-out-quart/quint/expo) for natural deceleration
**DO**: For height animations, use grid-template-rows transitions instead of animating height directly
**DON'T**: Animate layout properties (width, height, padding, margin)—use transform and opacity only
**DON'T**: Use bounce or elastic easing—they feel dated and tacky; real objects decelerate smoothly

### Interaction
→ *Consult [interaction reference](reference/interaction-design.md) for forms, focus, and loading patterns.*

Make interactions feel fast. Use optimistic UI—update immediately, sync later.

**DO**: Use progressive disclosure—start simple, reveal sophistication through interaction (basic options first, advanced behind expandable sections; hover states that reveal secondary actions)
**DO**: Design empty states that teach the interface, not just say "nothing here"
**DO**: Make every interactive surface feel intentional and responsive
**DON'T**: Repeat the same information—redundant headers, intros that restate the heading
**DON'T**: Make every button primary—use ghost buttons, text links, secondary styles; hierarchy matters

### Responsive
→ *Consult [responsive reference](reference/responsive-design.md) for mobile-first, fluid design, and container queries.*

**DO**: Use container queries (@container) for component-level responsiveness
**DO**: Adapt the interface for different contexts—don't just shrink it
**DON'T**: Hide critical functionality on mobile—adapt the interface, don't amputate it

### UX Writing
→ *Consult [ux-writing reference](reference/ux-writing.md) for labels, errors, and empty states.*

**DO**: Make every word earn its place
**DON'T**: Repeat information users can already see

---

## The AI Slop Test

**Critical quality check**: If you showed this interface to someone and said "AI made this," would they believe you immediately? If yes, that's the problem.

A distinctive interface should make someone ask "how was this made?" not "which AI made this?"

Review the DON'T guidelines above—they are the fingerprints of AI-generated work from 2024-2025.

---

## Implementation Principles

Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices across generations.

Remember: {{model}} is capable of extraordinary creative work. Don't hold back—show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
