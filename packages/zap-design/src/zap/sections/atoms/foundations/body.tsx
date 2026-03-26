'use client';

import React from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { Platform, SectionHeader, TokenTable, CodeBlock } from './components';
import {
    COLOR_GROUPS, TYPE_STYLES, ICON_SIZES, ICON_WEIGHTS,
    ELEVATION_LEVELS, SPACING_SCALE, SIZE_TOKENS,
    BREAKPOINTS, STATE_LAYERS, SCRIM_VALUES,
    MOTION_CURVES, MOTION_DURATIONS,
    ZAP_LAYER_MAP, COMPONENT_ELEVATION_MAP,
    FOUNDATION_SECTIONS,
} from './schema';

export const FoundationsBody = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-20 pb-24">

            {/* ============================================================= */}
            {/* 01. COLOR                                                      */}
            {/* ============================================================= */}
            <section className="space-y-8">
                <SectionHeader {...FOUNDATION_SECTIONS[0]} />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30 space-y-4">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 defines <strong>29 semantic color roles</strong> organized into 5 groups: Primary, Secondary, Tertiary, Error, and Neutral.
                        Each has a base, <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">on-</code>, container, and <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">on-container</code> variant.
                        All generated from a single seed color.
                    </p>
                </div>

                {COLOR_GROUPS.map((group) => (
                    <div key={group.group} className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-primary" />
                            {group.group}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {group.roles.map((role) => (
                                <div key={role.token} className="group border border-border/30 rounded-lg p-4 hover:border-primary/30 transition-colors bg-layer-panel">
                                    <div className={cn(
                                        "w-full h-12 rounded-md mb-3 border border-border/20",
                                        `bg-${role.token}`
                                    )} style={Object.assign({}, { backgroundColor: `var(--color-${role.token})` })} />
                                    <p className="text-xs font-bold text-foreground">{role.name}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{role.description}</p>
                                    <div className="mt-2 pt-2 border-t border-border/20">
                                        <p className="text-[10px] font-dev text-transform-tertiary text-primary">
                                            {role.tailwind}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <CodeBlock
                    platform="web"
                    label="Tailwind / CSS"
                    web={`/* Generate full scheme from seed */
:root {
  --color-primary: oklch(0.55 0.24 264);
  --color-on-primary: oklch(1 0 0);
  --color-primary-container: oklch(0.92 0.04 264);
  /* ... 26 more roles auto-generated */
}

/* Usage */
<div className="bg-primary text-on-primary">
<div className="bg-surface-container border border-outline-variant">`}
                    mobile={`// Generate full scheme from seed
final colorScheme = ColorScheme.fromSeed(
  seedColor: const Color(0xFF6750A4),
  brightness: Brightness.light,
);

// Usage
MaterialApp(
  theme: ThemeData(colorScheme: colorScheme),
);

// Access in widgets
Theme.of(context).colorScheme.primary
Theme.of(context).colorScheme.onPrimary`}
                />
            </section>

            {/* ============================================================= */}
            {/* 02. TYPOGRAPHY                                                 */}
            {/* ============================================================= */}
            <section className="space-y-8">
                <SectionHeader {...FOUNDATION_SECTIONS[1]} />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30 space-y-4">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 defines <strong>15 type styles</strong> across 5 roles (Display, Headline, Title, Body, Label) × 3 sizes (Large, Medium, Small).
                        Each style specifies font size, line height, letter spacing, and weight.
                    </p>
                </div>

                {/* Type scale visual specimens */}
                <div className="space-y-1">
                    {TYPE_STYLES.map((style) => (
                        <div key={style.name} className="flex items-baseline gap-6 py-3 px-4 rounded-lg hover:bg-on-surface/3 transition-colors group last:border-0">
                            <span
                                className="text-foreground shrink-0 w-[280px]"
                                style={Object.assign({}, { fontSize: Math.min(style.fontSize, 40), lineHeight: style.lineHeight, fontWeight: style.fontWeight, letterSpacing: style.letterSpacing })}
                            >
                                {style.name}
                            </span>
                            <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-dev text-transform-tertiary shrink-0">
                                <span>{style.fontSize}px</span>
                                <span>/ {style.lineHeight}</span>
                                <span>{style.letterSpacing}px</span>
                                <span>w{style.fontWeight}</span>
                            </div>
                            <span className="text-[10px] font-dev text-transform-tertiary text-primary ml-auto hidden group-hover:inline">
                                {style.cssClass}
                            </span>
                        </div>
                    ))}
                </div>

                <TokenTable
                    headers={['Style', 'Size (px)', 'Size (rem)', 'Line Height', 'Letter Spacing', 'CSS Class']}
                    rows={TYPE_STYLES.map(s => [s.name, s.fontSize, s.fontSizeRem, s.lineHeight, `${s.letterSpacing}px`, s.cssClass])}
                    highlight={5}
                />

                <CodeBlock
                    platform="web"
                    label="CSS Custom Properties"
                    web={`.text-display-lg {
  font-size: 3.5625rem; /* 57px */
  line-height: 1.12;
  letter-spacing: -0.25px;
  font-weight: 400;
}
.text-body-md {
  font-size: 0.875rem; /* 14px */
  line-height: 1.43;
  letter-spacing: 0.25px;
  font-weight: 400;
}
.text-label-lg {
  font-size: 0.875rem; /* 14px */
  line-height: 1.43;
  letter-spacing: 0.1px;
  font-weight: 500;
}`}
                    mobile={`TextTheme(
  displayLarge: TextStyle(
    fontSize: 57, height: 1.12,
    letterSpacing: -0.25, fontWeight: FontWeight.w400,
  ),
  bodyMedium: TextStyle(
    fontSize: 14, height: 1.43,
    letterSpacing: 0.25, fontWeight: FontWeight.w400,
  ),
  labelLarge: TextStyle(
    fontSize: 14, height: 1.43,
    letterSpacing: 0.1, fontWeight: FontWeight.w500,
  ),
)`}
                />
            </section>

            {/* ============================================================= */}
            {/* 03. ICONS                                                      */}
            {/* ============================================================= */}
            <section className="space-y-8">
                <SectionHeader {...FOUNDATION_SECTIONS[2]} />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        Material Symbols (variable font) with 4 adjustable axes: <strong>fill</strong> (0/1), <strong>weight</strong> (100–700),
                        <strong> grade</strong> (-25 to 200), <strong>optical size</strong> (20–48).
                    </p>
                </div>

                {/* Icon size comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {ICON_SIZES.map((s) => (
                        <div key={s.name} className="border border-border/30 rounded-lg p-6 bg-layer-panel flex flex-col items-center gap-4 hover:border-primary/30 transition-colors">
                            <Icon name="star" size={s.size} className="text-primary" />
                            <div className="text-center">
                                <p className="text-sm font-bold text-foreground">{s.size}px</p>
                                <p className="text-xs text-muted-foreground">{s.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">{s.usage}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Weight comparison */}
                <div className="flex items-center justify-center gap-12 py-6 bg-layer-panel rounded-xl border border-border/30">
                    {Object.entries(ICON_WEIGHTS).map(([name, weight]) => (
                        <div key={name} className="flex flex-col items-center gap-2">
                            <Icon name="home" size={24} weight={weight} className="text-foreground" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {name} ({weight})
                            </span>
                        </div>
                    ))}
                    <div className="flex flex-col items-center gap-2">
                        <Icon name="home" size={24} weight={400} fill={1} className="text-foreground" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Filled (active)
                        </span>
                    </div>
                </div>

                <CodeBlock
                    platform="web"
                    label="React Component"
                    web={`// Standard icon
<Icon name="chevron_right" size={24} weight={400} />

// Active/selected state (filled)
<Icon name="home" size={24} weight={700} fill={1} />

// CSS (variable font)
font-variation-settings: 'wght' 400, 'FILL' 0, 'GRAD' 0, 'opsz' 24;`}
                    mobile={`// Standard icon
Icon(Icons.chevron_right, size: 24)

// Material Symbols (variable)
Icon(Symbols.home, size: 24, weight: 700, fill: 1)

// Requires: google_fonts package for variable Material Symbols`}
                />
            </section>

            {/* ============================================================= */}
            {/* 04. ELEVATION & SHADOW                                         */}
            {/* ============================================================= */}
            <section className="space-y-8">
                <SectionHeader {...FOUNDATION_SECTIONS[3]} />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30 space-y-3">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 uses <strong>surface tint</strong> (not shadow) as the primary elevation indicator.
                        6 levels (0–5), each with a tint opacity and optional shadow.
                    </p>
                    <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-4 py-2">
                        <Icon name="info" size={16} className="text-primary shrink-0" />
                        <p className="text-xs text-primary font-medium">
                            Key insight: Elevation is communicated through surface tint color, shadows are supplementary.
                        </p>
                    </div>
                </div>

                {/* Visual elevation cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {ELEVATION_LEVELS.map((level) => (
                        <div
                            key={level.level}
                            className="rounded-xl p-6 border border-border/30 flex flex-col gap-3 transition-all"
                            style={Object.assign({}, {
                                boxShadow: level.shadowLight,
                                backgroundColor: level.tintOpacity > 0
                                    ? `color-mix(in srgb, var(--color-primary) ${level.tintOpacity}%, var(--color-surface-container-lowest))`
                                    : undefined,
                            })}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-foreground">L{level.level}</span>
                                <span className="text-[10px] font-dev text-transform-tertiary bg-layer-dialog px-2 py-1 rounded text-muted-foreground">{level.dp}dp</span>
                            </div>
                            <p className="text-xs font-medium text-foreground">{level.useCase}</p>
                            <p className="text-[10px] text-muted-foreground">
                                Tint: {level.tintOpacity}% • {level.components.slice(0, 2).join(', ')}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ZAP Layer Mapping */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-primary" />
                        ZAP Layer → M3 Elevation Mapping
                    </h3>
                    <TokenTable
                        headers={['ZAP Layer', 'Token', 'M3 Level', 'Tint %', 'Z-Index', 'Description']}
                        rows={ZAP_LAYER_MAP.map(l => [l.zapLayer, l.zapToken, l.m3Elevation === -1 ? 'N/A' : l.m3Elevation, `${l.tintOpacity}%`, l.zIndex, l.description])}
                        highlight={1}
                    />
                </div>

                {/* Component elevation reference */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-primary" />
                        Component Elevation Reference
                    </h3>
                    <TokenTable
                        headers={['Component', 'Default', 'Hovered', 'Pressed', 'Disabled']}
                        rows={COMPONENT_ELEVATION_MAP.map(c => [c.component, c.default, c.hovered, c.pressed, c.disabled])}
                    />
                </div>

                <CodeBlock
                    platform="web"
                    label="CSS / Tailwind"
                    web={`/* Elevation with tint-first approach */
.elevation-1 {
  box-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15);
  background: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface));
}

/* Tailwind utilities */
<div className="shadow-elevation-1 bg-surface-tint-1">
<div className="shadow-elevation-3 bg-surface-tint-3"> /* Dialog */`}
                    mobile={`// Flutter handles tint automatically via Material widget
Material(
  elevation: 1,
  surfaceTintColor: colorScheme.surfaceTint,
  child: Card(...),
)

// Or via theme
CardTheme(
  data: CardThemeData(elevation: 1),
)`}
                />
            </section>

            {/* ============================================================= */}
            {/* 05. SPACING                                                    */}
            {/* ============================================================= */}
            <section className="space-y-8">
                <SectionHeader {...FOUNDATION_SECTIONS[4]} />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 uses a <strong>4dp base grid</strong>. All spacing values are multiples of 4. The 8dp content grid
                        aligns elements for consistent rhythm. Tailwind&apos;s default scale maps 1:1 (p-1 = 4px).
                    </p>
                </div>

                {/* Visual spacing ruler */}
                <div className="space-y-2">
                    {SPACING_SCALE.map((s) => (
                        <div key={s.name} className="flex items-center gap-4 py-1 group hover:bg-on-surface/3 rounded-lg px-4 transition-colors">
                            <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground w-24 shrink-0">{s.name}</span>
                            <div
                                className="h-4 bg-primary/20 border border-primary/30 rounded-sm transition-all"
                                style={Object.assign({}, { width: Math.max(s.value, 2) })}
                            />
                            <span className="text-[10px] font-dev text-transform-tertiary text-foreground w-16 shrink-0">{s.value}px</span>
                            <span className="text-[10px] font-dev text-transform-tertiary text-primary w-16 shrink-0">
                                {s.tailwind}
                            </span>
                            <span className="text-[10px] text-muted-foreground hidden group-hover:inline">{s.usage}</span>
                        </div>
                    ))}
                </div>

                <CodeBlock
                    platform="web"
                    label="Tailwind Classes"
                    web={`/* Tailwind spacing maps 1:1 to M3 4dp grid */
p-1  → 4px    (spacing-1)
p-2  → 8px    (spacing-2)
p-4  → 16px   (spacing-4)
p-6  → 24px   (spacing-6)
p-12 → 48px   (spacing-12)

/* Semantic aliases */
--spacing-page-margin: var(--spacing-6);    /* 24px */
--spacing-section-gap: var(--spacing-8);    /* 32px */
--spacing-card-padding: var(--spacing-4);   /* 16px */`}
                    mobile={`// Flutter uses logical pixels = dp = same numbers
EdgeInsets.all(16)              // spacing-4
EdgeInsets.symmetric(
  horizontal: 24,              // spacing-6
  vertical: 16,                // spacing-4
)
SizedBox(height: 32)           // spacing-8

// Semantic constants
const kPageMargin = 24.0;      // spacing-6
const kSectionGap = 32.0;      // spacing-8
const kCardPadding = 16.0;     // spacing-4`}
                />
            </section>

            {/* ============================================================= */}
            {/* 06. SIZING                                                     */}
            {/* ============================================================= */}
            <section className="space-y-8">
                <SectionHeader {...FOUNDATION_SECTIONS[5]} />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30 space-y-3">
                    <p className="text-sm text-foreground leading-relaxed">
                        <strong>48dp minimum touch target</strong> — non-negotiable for accessibility. Component heights support 3 density levels:
                        Compact (admin UIs), Default (standard), Comfortable (consumer-facing).
                    </p>
                    <div className="flex items-center gap-2 bg-error/10 rounded-lg px-4 py-2">
                        <Icon name="warning" size={16} className="text-error shrink-0" />
                        <p className="text-xs text-error font-medium">
                            Touch targets below 48dp fail WCAG 2.5.5 (AAA) and 2.5.8 (AA).
                        </p>
                    </div>
                </div>

                <TokenTable
                    headers={['Token', 'Value', 'Tailwind', 'Usage']}
                    rows={SIZE_TOKENS.map(s => [s.name, `${s.value}px`, s.tailwind, s.usage])}
                    highlight={0}
                />

                {/* Visual size comparison */}
                <div className="flex items-end gap-4 justify-center py-8 bg-layer-panel rounded-xl border border-border/30">
                    {[32, 40, 48, 56].map(h => (
                        <div key={h} className="flex flex-col items-center gap-2">
                            <div
                                className="bg-primary rounded-lg flex items-center justify-center text-on-primary"
                                style={Object.assign({}, { width: h, height: h })}
                            >
                                <Icon name="add" size={Math.min(h * 0.5, 24)} />
                            </div>
                            <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground">{h}px</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============================================================= */}
            {/* 07. LAYOUT GRID                                                */}
            {/* ============================================================= */}
            <section className="space-y-8">
                <SectionHeader {...FOUNDATION_SECTIONS[6]} />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 defines <strong>5 window classes</strong> with responsive columns, margins, and gutters.
                        Navigation patterns shift between Bottom Nav (phone) → Rail (tablet) → Drawer (desktop).
                    </p>
                </div>

                <TokenTable
                    headers={['Breakpoint', 'Window Class', 'Min Width', 'Columns', 'Margins', 'Gutters', 'Tailwind']}
                    rows={BREAKPOINTS.map(b => [
                        b.name, b.windowClass, `${b.minWidth}px`, b.columns, `${b.margins}dp`, `${b.gutters}dp`,
                        b.tailwindBreakpoint
                    ])}
                />

                <CodeBlock
                    platform="web"
                    label="Responsive Layout"
                    web={`/* Tailwind breakpoints aligned to M3 window classes */
/* default: 0-599px   (Compact / 4 cols) */
/* sm:      600-839px (Medium / 8 cols)  */
/* md:      840px+    (Expanded / 12 cols) */

<div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2 sm:gap-4 md:gap-6">
  <div className="col-span-4 sm:col-span-4 md:col-span-6">
    Main Content
  </div>
</div>

/* Container queries for component-level responsiveness */
@container (min-width: 840px) { /* expanded layout */ }`}
                    mobile={`LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth < 600) {
      return CompactLayout();     // 4 cols, Bottom Nav
    }
    if (constraints.maxWidth < 840) {
      return MediumLayout();      // 8 cols, Navigation Rail
    }
    return ExpandedLayout();      // 12 cols, Navigation Drawer
  },
)

// Navigation pattern per breakpoint
NavigationBar()       // Compact (phone)
NavigationRail()      // Medium (tablet)
NavigationDrawer()    // Expanded (desktop)`}
                />
            </section>

            {/* ============================================================= */}
            {/* 08. OVERLAYS & SCRIMS                                          */}
            {/* ============================================================= */}
            <section className="space-y-8">
                <SectionHeader {...FOUNDATION_SECTIONS[7]} />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        <strong>State layers</strong> are translucent overlays on interactive elements.
                        <strong> Scrims</strong> are backdrop overlays behind modals and dialogs.
                        Both use the component&apos;s <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">on-</code> color at specified opacities.
                    </p>
                </div>

                {/* State layers visual */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {STATE_LAYERS.map((sl) => (
                        <div key={sl.state} className="border border-border/30 rounded-lg overflow-hidden bg-layer-panel">
                            <div className="h-16 bg-primary relative flex items-center justify-center">
                                <div
                                    className="absolute inset-0 bg-on-primary"
                                    style={Object.assign({}, { opacity: sl.opacity / 100 })}
                                />
                                <span className="relative text-on-primary text-xs font-bold uppercase">{sl.state}</span>
                            </div>
                            <div className="p-3 text-center">
                                <span className="text-lg font-black text-foreground">{sl.opacity}%</span>
                                <p className="text-[10px] text-muted-foreground mt-1">{sl.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scrim values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-border/30 rounded-lg p-6 bg-layer-panel space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Light Mode Scrim</h4>
                        <div className="h-20 bg-layer-dialog rounded-lg relative flex items-center justify-center border border-border/20">
                            <div className="absolute inset-0 rounded-lg bg-black" style={Object.assign({}, { opacity: SCRIM_VALUES.light })} />
                            <span className="relative text-white text-sm font-bold">{(SCRIM_VALUES.light * 100)}% opacity</span>
                        </div>
                    </div>
                    <div className="border border-border/30 rounded-lg p-6 bg-layer-panel space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Dark Mode Scrim</h4>
                        <div className="h-20 bg-layer-dialog rounded-lg relative flex items-center justify-center border border-border/20">
                            <div className="absolute inset-0 rounded-lg bg-black" style={Object.assign({}, { opacity: SCRIM_VALUES.dark })} />
                            <span className="relative text-white text-sm font-bold">{(SCRIM_VALUES.dark * 100)}% opacity</span>
                        </div>
                    </div>
                </div>

                <CodeBlock
                    platform="web"
                    label="CSS / Tailwind"
                    web={`/* State layers via Tailwind opacity modifiers */
<button className="hover:bg-on-surface/8 focus:bg-on-surface/10 active:bg-on-surface/10">

/* Scrim */
<div className="fixed inset-0 bg-scrim z-40" />
/* Or: bg-black/32 for light, bg-black/52 for dark */

/* Premium blur effect */
<div className="fixed inset-0 bg-scrim backdrop-blur-sm z-40" />`}
                    mobile={`// State layers — automatic via InkWell/InkResponse
InkWell(
  onTap: () {},
  hoverColor: colorScheme.onSurface.withOpacity(0.08),
  focusColor: colorScheme.onSurface.withOpacity(0.10),
  child: ...
)

// Scrim
ModalBarrier(color: Colors.black.withOpacity(0.32))

// Premium blur
BackdropFilter(
  filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
  child: Container(color: Colors.black.withOpacity(0.32)),
)`}
                />
            </section>

            {/* ============================================================= */}
            {/* 09. MOTION                                                     */}
            {/* ============================================================= */}
            <section className="space-y-8">
                <SectionHeader {...FOUNDATION_SECTIONS[8]} />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 defines <strong>6 easing curves</strong> and <strong>16 duration tokens</strong>.
                        Enter/exit transitions use asymmetric durations — enter is slower (decelerate), exit is faster (accelerate).
                    </p>
                </div>

                {/* Easing curves */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-primary" />
                        Easing Curves
                    </h3>
                    <TokenTable
                        headers={['Curve', 'CSS Value', 'Usage']}
                        rows={MOTION_CURVES.map(c => [c.name, c.value, c.usage])}
                        highlight={1}
                    />
                </div>

                {/* Durations */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-primary" />
                        Duration Tokens
                    </h3>
                    <div className="space-y-1">
                        {MOTION_DURATIONS.map((d) => (
                            <div key={d.name} className="flex items-center gap-4 py-1.5 px-4 rounded-lg hover:bg-on-surface/3 transition-colors group">
                                <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground w-28 shrink-0">{d.name}</span>
                                <div className="flex-1 h-2 bg-layer-dialog rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={Object.assign({}, { width: `${Math.min((d.ms / 1000) * 100, 100)}%` })}
                                    />
                                </div>
                                <span className="text-[10px] font-dev text-transform-tertiary text-foreground w-16 shrink-0 text-right">{d.ms}ms</span>
                                <span className="text-[10px] text-muted-foreground hidden group-hover:inline">{d.usage}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <CodeBlock
                    platform="web"
                    label="CSS Transitions"
                    web={`/* Standard transition */
transition: all 300ms cubic-bezier(0.2, 0, 0, 1);

/* Enter (decelerate) */
transition: transform 400ms cubic-bezier(0, 0, 0, 1);

/* Exit (accelerate) */
transition: opacity 200ms cubic-bezier(0.3, 0, 1, 1);

/* CSS custom properties */
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--duration-medium-2: 300ms;`}
                    mobile={`// Standard transition
AnimatedContainer(
  duration: Duration(milliseconds: 300),
  curve: Curves.easeInOutCubicEmphasized,
)

// Enter (decelerate)
SlideTransition(
  position: animation.drive(
    Tween(begin: Offset(0, 1), end: Offset.zero)
      .chain(CurveTween(curve: Curves.decelerate)),
  ),
)

// Motion constants
const kDurationMedium2 = Duration(milliseconds: 300);`}
                />
            </section>
        </div>
    );
};
