

// M3 Typography Registry — Single source of truth for the ZAP Design Engine.
// Defines all 15 M3 type styles + ZAP dev extensions.
// Source: https://m3.material.io/styles/typography/type-scale-tokens

export type M3Role = 'display' | 'headline' | 'title' | 'body' | 'label' | 'dev';
export type M3Size = 'large' | 'medium' | 'small';
export type FontFamilyRole = 'primary' | 'secondary' | 'tertiary';

export interface TypographyTokenMap {
    id: string;
    m3Name: string;
    m3Role: M3Role;
    m3Size: M3Size;
    alias: string;
    description: string;
    component: '<Heading>' | '<Text>' | 'Custom';
    propValue: string;
    fontFamilyRole: FontFamilyRole;
    fontSize: number;       // px
    fontWeight: number;     // 100–900
    lineHeight: number;     // px
    letterSpacing: number;  // px (can be negative)
    // Legacy compat
    desktopSize: number | string;
    mobileSize: number | string;
    isLocked: boolean;
    legacyId?: string;      // maps to old ZAP token name
}

// ─── M3 TYPE SCALE ─────────────────────────────────────────────────────────────

export const TYPOGRAPHY_REGISTRY: Record<string, TypographyTokenMap> = {

    // ═══ DISPLAY ═══
    'display-large': {
        id: 'display-large', m3Name: 'displayLarge', m3Role: 'display', m3Size: 'large',
        alias: 'Hero', description: 'Landing pages, marketing heroes, splash screens.',
        component: '<Heading>', propValue: 'level={1}',
        fontFamilyRole: 'primary', fontSize: 57, fontWeight: 400, lineHeight: 64, letterSpacing: -0.25,
        desktopSize: 57, mobileSize: 36, isLocked: true,
    },
    'display-medium': {
        id: 'display-medium', m3Name: 'displayMedium', m3Role: 'display', m3Size: 'medium',
        alias: 'Marquee', description: 'Large promotional text, feature callouts.',
        component: '<Heading>', propValue: 'level={1}',
        fontFamilyRole: 'primary', fontSize: 45, fontWeight: 400, lineHeight: 52, letterSpacing: 0,
        desktopSize: 45, mobileSize: 32, isLocked: true,
    },
    'display-small': {
        id: 'display-small', m3Name: 'displaySmall', m3Role: 'display', m3Size: 'small',
        alias: 'Banner', description: 'Secondary marketing text, sub-heroes.',
        component: '<Heading>', propValue: 'level={2}',
        fontFamilyRole: 'primary', fontSize: 36, fontWeight: 400, lineHeight: 44, letterSpacing: 0,
        desktopSize: 36, mobileSize: 28, isLocked: true,
    },

    // ═══ HEADLINE ═══
    'headline-large': {
        id: 'headline-large', m3Name: 'headlineLarge', m3Role: 'headline', m3Size: 'large',
        alias: 'Big Boss', description: 'The main title of a page. Only one per page.',
        component: '<Heading>', propValue: 'level={1}',
        fontFamilyRole: 'primary', fontSize: 32, fontWeight: 400, lineHeight: 40, letterSpacing: 0,
        desktopSize: 48, mobileSize: 32, isLocked: true, legacyId: 'h1',
    },
    'headline-medium': {
        id: 'headline-medium', m3Name: 'headlineMedium', m3Role: 'headline', m3Size: 'medium',
        alias: 'Section', description: 'For the big chapters or sections of a page.',
        component: '<Heading>', propValue: 'level={2}',
        fontFamilyRole: 'primary', fontSize: 28, fontWeight: 400, lineHeight: 36, letterSpacing: 0,
        desktopSize: 38, mobileSize: 28, isLocked: true, legacyId: 'h2',
    },
    'headline-small': {
        id: 'headline-small', m3Name: 'headlineSmall', m3Role: 'headline', m3Size: 'small',
        alias: 'Module', description: 'For cards, widgets, or blocks of content.',
        component: '<Heading>', propValue: 'level={3}',
        fontFamilyRole: 'primary', fontSize: 24, fontWeight: 400, lineHeight: 32, letterSpacing: 0,
        desktopSize: 31, mobileSize: 24, isLocked: true, legacyId: 'h3',
    },

    // ═══ TITLE ═══
    'title-large': {
        id: 'title-large', m3Name: 'titleLarge', m3Role: 'title', m3Size: 'large',
        alias: 'Small Title', description: 'For smaller groups within a module.',
        component: '<Heading>', propValue: 'level={4}',
        fontFamilyRole: 'primary', fontSize: 22, fontWeight: 400, lineHeight: 28, letterSpacing: 0,
        desktopSize: 25, mobileSize: 20, isLocked: true, legacyId: 'h4',
    },
    'title-medium': {
        id: 'title-medium', m3Name: 'titleMedium', m3Role: 'title', m3Size: 'medium',
        alias: 'Bold Label', description: 'Use this for a title that needs to stand out but stay small.',
        component: '<Heading>', propValue: 'level={5}',
        fontFamilyRole: 'primary', fontSize: 16, fontWeight: 500, lineHeight: 24, letterSpacing: 0.15,
        desktopSize: 20, mobileSize: 18, isLocked: true, legacyId: 'h5',
    },
    'title-small': {
        id: 'title-small', m3Name: 'titleSmall', m3Role: 'title', m3Size: 'small',
        alias: 'Micro Title', description: 'For very small labels that still need to be "titles."',
        component: '<Heading>', propValue: 'level={6}',
        fontFamilyRole: 'primary', fontSize: 14, fontWeight: 500, lineHeight: 20, letterSpacing: 0.1,
        desktopSize: 16, mobileSize: 14, isLocked: true, legacyId: 'h6',
    },

    // ═══ BODY ═══
    'body-large': {
        id: 'body-large', m3Name: 'bodyLarge', m3Role: 'body', m3Size: 'large',
        alias: 'Intro', description: 'Use for the first paragraph of an article.',
        component: '<Text>', propValue: 'size="body-large"',
        fontFamilyRole: 'secondary', fontSize: 16, fontWeight: 400, lineHeight: 24, letterSpacing: 0.5,
        desktopSize: 18, mobileSize: 16, isLocked: true,
    },
    'body-medium': {
        id: 'body-medium', m3Name: 'bodyMedium', m3Role: 'body', m3Size: 'medium',
        alias: 'Standard', description: 'Use for 90% of all text. Very easy to read.',
        component: '<Text>', propValue: 'size="body-main"',
        fontFamilyRole: 'secondary', fontSize: 14, fontWeight: 400, lineHeight: 20, letterSpacing: 0.25,
        desktopSize: 16, mobileSize: 16, isLocked: true, legacyId: 'body-main',
    },
    'body-small': {
        id: 'body-small', m3Name: 'bodySmall', m3Role: 'body', m3Size: 'small',
        alias: 'Detail', description: 'Use for captions, dates, or secondary info.',
        component: '<Text>', propValue: 'size="body-small"',
        fontFamilyRole: 'secondary', fontSize: 12, fontWeight: 400, lineHeight: 16, letterSpacing: 0.4,
        desktopSize: 14, mobileSize: 12, isLocked: true,
    },

    // ═══ LABEL ═══
    'label-large': {
        id: 'label-large', m3Name: 'labelLarge', m3Role: 'label', m3Size: 'large',
        alias: 'Action', description: 'Button text, navigation items, prominent labels.',
        component: '<Text>', propValue: 'size="label-large"',
        fontFamilyRole: 'secondary', fontSize: 14, fontWeight: 500, lineHeight: 20, letterSpacing: 0.1,
        desktopSize: 14, mobileSize: 14, isLocked: true,
    },
    'label-medium': {
        id: 'label-medium', m3Name: 'labelMedium', m3Role: 'label', m3Size: 'medium',
        alias: 'Tag', description: 'Chips, breadcrumbs, filter labels.',
        component: '<Text>', propValue: 'size="label-medium"',
        fontFamilyRole: 'secondary', fontSize: 12, fontWeight: 500, lineHeight: 16, letterSpacing: 0.5,
        desktopSize: 12, mobileSize: 12, isLocked: true,
    },
    'label-small': {
        id: 'label-small', m3Name: 'labelSmall', m3Role: 'label', m3Size: 'small',
        alias: 'Overline', description: 'Badges, status indicators, category eyebrows.',
        component: '<Text>', propValue: 'size="label-small"',
        fontFamilyRole: 'secondary', fontSize: 11, fontWeight: 500, lineHeight: 16, letterSpacing: 0.5,
        desktopSize: 11, mobileSize: 11, isLocked: true,
    },

    // ═══ DEV SERIES (ZAP Extension — outside M3 scope) ═══
    'dev-wrapper': {
        id: 'dev-wrapper', m3Name: 'devWrapper', m3Role: 'dev', m3Size: 'medium',
        alias: 'Component Tag', description: 'Shows Div classes, Component Names, or Z-Index.',
        component: '<Text>', propValue: 'size="dev-wrapper"',
        fontFamilyRole: 'tertiary', fontSize: 13, fontWeight: 400, lineHeight: 18, letterSpacing: 0.5,
        desktopSize: 13, mobileSize: 11, isLocked: false,
    },
    'dev-note': {
        id: 'dev-note', m3Name: 'devNote', m3Role: 'dev', m3Size: 'medium',
        alias: 'Team Note', description: 'Internal team notes or "To-Do" left in the UI.',
        component: '<Text>', propValue: 'size="dev-note"',
        fontFamilyRole: 'tertiary', fontSize: 13, fontWeight: 700, lineHeight: 18, letterSpacing: 0.5,
        desktopSize: 13, mobileSize: 11, isLocked: false,
    },
    'dev-metric': {
        id: 'dev-metric', m3Name: 'devMetric', m3Role: 'dev', m3Size: 'small',
        alias: 'Analytics', description: 'Page load speed, API latency, or "Heartbeat" status.',
        component: '<Text>', propValue: 'size="dev-metric"',
        fontFamilyRole: 'tertiary', fontSize: 11, fontWeight: 400, lineHeight: 16, letterSpacing: 0.5,
        desktopSize: 11, mobileSize: 9, isLocked: false,
    },
};

// ─── M3 TYPE SCALE (ordered for iteration) ─────────────────────────────────────

export const M3_ROLE_ORDER: M3Role[] = ['display', 'headline', 'title', 'body', 'label'];

export const M3_ROLE_META: Record<M3Role, { label: string; fontFamily: FontFamilyRole; description: string }> = {
    display: { label: 'Display', fontFamily: 'primary', description: 'Hero sections, marketing, splash screens.' },
    headline: { label: 'Headline', fontFamily: 'primary', description: 'Page-level headings and major sections.' },
    title: { label: 'Title', fontFamily: 'primary', description: 'Section headings, card titles, dialog headers.' },
    body: { label: 'Body', fontFamily: 'secondary', description: 'Paragraph text, descriptions, data content.' },
    label: { label: 'Label', fontFamily: 'secondary', description: 'Buttons, navigation, chips, badges.' },
    dev: { label: 'Dev', fontFamily: 'tertiary', description: 'ZAP Extension — debug overlays and system UI.' },
};

/** All 15 M3 type tokens in spec order (Display → Headline → Title → Body → Label). */
export const M3_TYPE_SCALE: TypographyTokenMap[] = M3_ROLE_ORDER.flatMap(role =>
    ['large', 'medium', 'small']
        .map(size => Object.values(TYPOGRAPHY_REGISTRY).find(t => t.m3Role === role && t.m3Size === size))
        .filter((t): t is TypographyTokenMap => t !== undefined)
);

// ─── L2 COMPONENT → TOKEN MAPPING ──────────────────────────────────────────────

export interface ComponentTokenMapping {
    component: string;
    m3Token: string;
    notes: string;
}

export const L2_COMPONENT_MAP: ComponentTokenMapping[] = [
    { component: 'Hero Title', m3Token: 'displayLarge', notes: 'Landing/marketing hero sections' },
    { component: 'Page Title (H1)', m3Token: 'headlineLarge', notes: 'Single per page' },
    { component: 'Section Title (H2)', m3Token: 'headlineMedium', notes: 'Major page divisions' },
    { component: 'Card Title', m3Token: 'titleMedium', notes: 'Card/widget headers' },
    { component: 'Dialog Title', m3Token: 'titleLarge', notes: 'Modal/dialog headers' },
    { component: 'Navigation Item', m3Token: 'labelLarge', notes: 'Sidebar, top nav items' },
    { component: 'Button Label', m3Token: 'labelLarge', notes: 'All button text' },
    { component: 'Tab Label', m3Token: 'titleSmall', notes: 'Tab bar items' },
    { component: 'Chip Label', m3Token: 'labelMedium', notes: 'Filter chips, selection chips' },
    { component: 'Badge', m3Token: 'labelSmall', notes: 'Status badges, notification dots' },
    { component: 'Body Text', m3Token: 'bodyMedium', notes: 'Default paragraph text' },
    { component: 'Intro Paragraph', m3Token: 'bodyLarge', notes: 'Lead-in / first paragraph' },
    { component: 'Caption', m3Token: 'bodySmall', notes: 'Dates, metadata, secondary info' },
    { component: 'Input Label', m3Token: 'bodySmall', notes: 'Form field labels' },
    { component: 'Breadcrumb', m3Token: 'labelMedium', notes: 'Navigation breadcrumbs' },
    { component: 'Tooltip', m3Token: 'bodySmall', notes: 'Hover tooltips' },
    { component: 'Footer Text', m3Token: 'bodySmall', notes: 'Footer copy' },
    { component: 'Overline / Eyebrow', m3Token: 'labelSmall', notes: 'Category tags above titles' },
    { component: 'Table Header', m3Token: 'labelMedium', notes: 'Table column titles (12px, bold)' },
    { component: 'Table Data', m3Token: 'labelSmall', notes: 'Standard table cells (11px)' },
];

// ─── FONT FAMILY CONSTANTS ─────────────────────────────────────────────────────

export const FONT_FAMILIES = {
    primary: 'var(--font-space-grotesk), sans-serif',
    secondary: 'var(--font-inter), sans-serif',
    tertiary: 'var(--font-jetbrains), monospace',
};

/** Resolve a fontFamilyRole to the actual CSS font-family value. */
export const resolveFontFamily = (role: FontFamilyRole): string => FONT_FAMILIES[role];
