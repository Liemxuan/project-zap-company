

// =============================================================================
// DESIGN FOUNDATIONS — SCHEMA (L1: Physics Layer)
// Single Source of Truth for all M3 design tokens across Web + Mobile
// =============================================================================

// --- COLOR -------------------------------------------------------------------

export interface ColorRole {
    name: string;
    token: string;
    description: string;
    cssVar: string;
    tailwind: string;
    flutter: string;
}

export interface ColorGroup {
    group: string;
    roles: ColorRole[];
}

export const COLOR_GROUPS: ColorGroup[] = [
    {
        group: 'Primary',
        roles: [
            { name: 'Primary', token: 'primary', description: 'High-emphasis fills, text, icons', cssVar: '--color-primary', tailwind: 'bg-primary', flutter: 'colorScheme.primary' },
            { name: 'On Primary', token: 'on-primary', description: 'Content on primary fills', cssVar: '--color-on-primary', tailwind: 'text-on-primary', flutter: 'colorScheme.onPrimary' },
            { name: 'Primary Container', token: 'primary-container', description: 'Standout fill color against surface', cssVar: '--color-primary-container', tailwind: 'bg-primary-container', flutter: 'colorScheme.primaryContainer' },
            { name: 'On Primary Container', token: 'on-primary-container', description: 'Content on primary container', cssVar: '--color-on-primary-container', tailwind: 'text-on-primary-container', flutter: 'colorScheme.onPrimaryContainer' },
        ]
    },
    {
        group: 'Secondary',
        roles: [
            { name: 'Secondary', token: 'secondary', description: 'Less prominent fills and text', cssVar: '--color-secondary', tailwind: 'bg-secondary', flutter: 'colorScheme.secondary' },
            { name: 'On Secondary', token: 'on-secondary', description: 'Content on secondary fills', cssVar: '--color-on-secondary', tailwind: 'text-on-secondary', flutter: 'colorScheme.onSecondary' },
            { name: 'Secondary Container', token: 'secondary-container', description: 'Secondary standout fill', cssVar: '--color-secondary-container', tailwind: 'bg-secondary-container', flutter: 'colorScheme.secondaryContainer' },
            { name: 'On Secondary Container', token: 'on-secondary-container', description: 'Content on secondary container', cssVar: '--color-on-secondary-container', tailwind: 'text-on-secondary-container', flutter: 'colorScheme.onSecondaryContainer' },
        ]
    },
    {
        group: 'Tertiary',
        roles: [
            { name: 'Tertiary', token: 'tertiary', description: 'Accent and complementary fills', cssVar: '--color-tertiary', tailwind: 'bg-tertiary', flutter: 'colorScheme.tertiary' },
            { name: 'On Tertiary', token: 'on-tertiary', description: 'Content on tertiary fills', cssVar: '--color-on-tertiary', tailwind: 'text-on-tertiary', flutter: 'colorScheme.onTertiary' },
            { name: 'Tertiary Container', token: 'tertiary-container', description: 'Tertiary standout fill', cssVar: '--color-tertiary-container', tailwind: 'bg-tertiary-container', flutter: 'colorScheme.tertiaryContainer' },
            { name: 'On Tertiary Container', token: 'on-tertiary-container', description: 'Content on tertiary container', cssVar: '--color-on-tertiary-container', tailwind: 'text-on-tertiary-container', flutter: 'colorScheme.onTertiaryContainer' },
        ]
    },
    {
        group: 'Error',
        roles: [
            { name: 'Error', token: 'error', description: 'Error indicators, destructive actions', cssVar: '--color-error', tailwind: 'bg-error', flutter: 'colorScheme.error' },
            { name: 'On Error', token: 'on-error', description: 'Content on error fills', cssVar: '--color-on-error', tailwind: 'text-on-error', flutter: 'colorScheme.onError' },
            { name: 'Error Container', token: 'error-container', description: 'Error standout fill', cssVar: '--color-error-container', tailwind: 'bg-error-container', flutter: 'colorScheme.errorContainer' },
            { name: 'On Error Container', token: 'on-error-container', description: 'Content on error container', cssVar: '--color-on-error-container', tailwind: 'text-on-error-container', flutter: 'colorScheme.onErrorContainer' },
        ]
    },
    {
        group: 'Neutral',
        roles: [
            { name: 'Surface', token: 'surface', description: 'Default background', cssVar: '--color-surface', tailwind: 'bg-surface', flutter: 'colorScheme.surface' },
            { name: 'On Surface', token: 'on-surface', description: 'Primary text on surfaces', cssVar: '--color-on-surface', tailwind: 'text-on-surface', flutter: 'colorScheme.onSurface' },
            { name: 'Surface Container Lowest', token: 'surface-container-lowest', description: 'Lowest emphasis container', cssVar: '--color-surface-container-lowest', tailwind: 'bg-surface-container-lowest', flutter: 'colorScheme.surfaceContainerLowest' },
            { name: 'Surface Container Low', token: 'surface-container-low', description: 'Low emphasis container', cssVar: '--color-surface-container-low', tailwind: 'bg-surface-container-low', flutter: 'colorScheme.surfaceContainerLow' },
            { name: 'Surface Container', token: 'surface-container', description: 'Default emphasis container', cssVar: '--color-surface-container', tailwind: 'bg-surface-container', flutter: 'colorScheme.surfaceContainer' },
            { name: 'Surface Container High', token: 'surface-container-high', description: 'High emphasis container', cssVar: '--color-surface-container-high', tailwind: 'bg-surface-container-high', flutter: 'colorScheme.surfaceContainerHigh' },
            { name: 'Surface Container Highest', token: 'surface-container-highest', description: 'Highest emphasis container', cssVar: '--color-surface-container-highest', tailwind: 'bg-surface-container-highest', flutter: 'colorScheme.surfaceContainerHighest' },
            { name: 'Outline', token: 'outline', description: 'Important boundaries, dividers', cssVar: '--color-outline', tailwind: 'border-outline', flutter: 'colorScheme.outline' },
            { name: 'Outline Variant', token: 'outline-variant', description: 'Decorative borders', cssVar: '--color-outline-variant', tailwind: 'border-outline-variant', flutter: 'colorScheme.outlineVariant' },
            { name: 'Scrim', token: 'scrim', description: 'Modal backdrop overlay', cssVar: '--color-scrim', tailwind: 'bg-scrim', flutter: 'colorScheme.scrim' },
        ]
    },
];

// --- TYPOGRAPHY --------------------------------------------------------------

export interface TypeStyle {
    name: string;
    role: 'display' | 'headline' | 'title' | 'body' | 'label';
    size: 'large' | 'medium' | 'small';
    fontSize: number;      // px
    fontSizeRem: string;   // rem
    lineHeight: number;    // multiplier
    letterSpacing: number; // px
    fontWeight: number;
    cssClass: string;
    flutter: string;
}

export const TYPE_STYLES: TypeStyle[] = [
    { name: 'Display Large', role: 'display', size: 'large', fontSize: 57, fontSizeRem: '3.5625rem', lineHeight: 1.12, letterSpacing: -0.25, fontWeight: 400, cssClass: 'text-display-lg', flutter: 'displayLarge' },
    { name: 'Display Medium', role: 'display', size: 'medium', fontSize: 45, fontSizeRem: '2.8125rem', lineHeight: 1.16, letterSpacing: 0, fontWeight: 400, cssClass: 'text-display-md', flutter: 'displayMedium' },
    { name: 'Display Small', role: 'display', size: 'small', fontSize: 36, fontSizeRem: '2.25rem', lineHeight: 1.22, letterSpacing: 0, fontWeight: 400, cssClass: 'text-display-sm', flutter: 'displaySmall' },
    { name: 'Headline Large', role: 'headline', size: 'large', fontSize: 32, fontSizeRem: '2rem', lineHeight: 1.25, letterSpacing: 0, fontWeight: 400, cssClass: 'text-headline-lg', flutter: 'headlineLarge' },
    { name: 'Headline Medium', role: 'headline', size: 'medium', fontSize: 28, fontSizeRem: '1.75rem', lineHeight: 1.29, letterSpacing: 0, fontWeight: 400, cssClass: 'text-headline-md', flutter: 'headlineMedium' },
    { name: 'Headline Small', role: 'headline', size: 'small', fontSize: 24, fontSizeRem: '1.5rem', lineHeight: 1.33, letterSpacing: 0, fontWeight: 400, cssClass: 'text-headline-sm', flutter: 'headlineSmall' },
    { name: 'Title Large', role: 'title', size: 'large', fontSize: 22, fontSizeRem: '1.375rem', lineHeight: 1.27, letterSpacing: 0, fontWeight: 400, cssClass: 'text-title-lg', flutter: 'titleLarge' },
    { name: 'Title Medium', role: 'title', size: 'medium', fontSize: 16, fontSizeRem: '1rem', lineHeight: 1.5, letterSpacing: 0.15, fontWeight: 500, cssClass: 'text-title-md', flutter: 'titleMedium' },
    { name: 'Title Small', role: 'title', size: 'small', fontSize: 14, fontSizeRem: '0.875rem', lineHeight: 1.43, letterSpacing: 0.1, fontWeight: 500, cssClass: 'text-title-sm', flutter: 'titleSmall' },
    { name: 'Body Large', role: 'body', size: 'large', fontSize: 16, fontSizeRem: '1rem', lineHeight: 1.5, letterSpacing: 0.5, fontWeight: 400, cssClass: 'text-body-lg', flutter: 'bodyLarge' },
    { name: 'Body Medium', role: 'body', size: 'medium', fontSize: 14, fontSizeRem: '0.875rem', lineHeight: 1.43, letterSpacing: 0.25, fontWeight: 400, cssClass: 'text-body-md', flutter: 'bodyMedium' },
    { name: 'Body Small', role: 'body', size: 'small', fontSize: 12, fontSizeRem: '0.75rem', lineHeight: 1.33, letterSpacing: 0.4, fontWeight: 400, cssClass: 'text-body-sm', flutter: 'bodySmall' },
    { name: 'Label Large', role: 'label', size: 'large', fontSize: 14, fontSizeRem: '0.875rem', lineHeight: 1.43, letterSpacing: 0.1, fontWeight: 500, cssClass: 'text-label-lg', flutter: 'labelLarge' },
    { name: 'Label Medium', role: 'label', size: 'medium', fontSize: 12, fontSizeRem: '0.75rem', lineHeight: 1.33, letterSpacing: 0.5, fontWeight: 500, cssClass: 'text-label-md', flutter: 'labelMedium' },
    { name: 'Label Small', role: 'label', size: 'small', fontSize: 11, fontSizeRem: '0.6875rem', lineHeight: 1.45, letterSpacing: 0.5, fontWeight: 500, cssClass: 'text-label-sm', flutter: 'labelSmall' },
];

// --- ICONS -------------------------------------------------------------------

export interface IconSize {
    name: string;
    size: number;
    usage: string;
}

export const ICON_SIZES: IconSize[] = [
    { name: 'Small (Dense)', size: 20, usage: 'Compact UIs, inline indicators, badges' },
    { name: 'Default', size: 24, usage: 'Standard actions, navigation, toolbars' },
    { name: 'Prominent', size: 40, usage: 'Hero actions, empty states, feature highlights' },
];

export const ICON_WEIGHTS = {
    light: 300,
    regular: 400,
    bold: 700,
} as const;

// --- ELEVATION ---------------------------------------------------------------

export interface ElevationLevel {
    level: number;
    dp: number;
    tintOpacity: number;
    shadowLight: string;
    shadowDark: string;
    useCase: string;
    components: string[];
}

export const ELEVATION_LEVELS: ElevationLevel[] = [
    { level: 0, dp: 0, tintOpacity: 0, shadowLight: 'none', shadowDark: 'none', useCase: 'Flat surfaces, disabled states', components: ['Disabled Button', 'Chip (unselected)'] },
    { level: 1, dp: 1, tintOpacity: 5, shadowLight: '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)', shadowDark: '0 1px 3px 1px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)', useCase: 'Cards, navigation drawers, bottom sheets', components: ['Card', 'Navigation Drawer', 'Bottom Sheet', 'Bottom App Bar'] },
    { level: 2, dp: 3, tintOpacity: 8, shadowLight: '0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)', shadowDark: '0 1px 2px rgba(0,0,0,0.6), 0 2px 6px 2px rgba(0,0,0,0.4)', useCase: 'Menus, elevated buttons on hover', components: ['Menu', 'Dropdown', 'Sub-menu', 'Select', 'Top App Bar (scrolled)'] },
    { level: 3, dp: 6, tintOpacity: 11, shadowLight: '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)', shadowDark: '0 4px 8px 3px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.6)', useCase: 'Dialogs, FABs', components: ['Dialog', 'FAB', 'Date Picker', 'Time Picker', 'Search Bar'] },
    { level: 4, dp: 8, tintOpacity: 12, shadowLight: '0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)', shadowDark: '0 6px 10px 4px rgba(0,0,0,0.4), 0 2px 3px rgba(0,0,0,0.6)', useCase: 'FABs (hovered), extended sheets', components: ['FAB (hovered)', 'Navigation Drawer (hovered)'] },
    { level: 5, dp: 12, tintOpacity: 14, shadowLight: '0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.3)', shadowDark: '0 8px 12px 6px rgba(0,0,0,0.4), 0 4px 4px rgba(0,0,0,0.6)', useCase: 'Highest emphasis, rarely used', components: ['Modal Side Sheet'] },
];

// --- SPACING -----------------------------------------------------------------

export interface SpacingToken {
    name: string;
    value: number;  // px
    rem: string;
    tailwind: string;
    flutter: string;
    usage: string;
}

export const SPACING_SCALE: SpacingToken[] = [
    { name: 'spacing-0', value: 0, rem: '0', tailwind: 'p-0', flutter: '0', usage: 'Reset, flush edges' },
    { name: 'spacing-1', value: 4, rem: '0.25rem', tailwind: 'p-1', flutter: '4', usage: 'Tightest spacing, icon padding' },
    { name: 'spacing-2', value: 8, rem: '0.5rem', tailwind: 'p-2', flutter: '8', usage: 'Compact element gaps, badge padding' },
    { name: 'spacing-3', value: 12, rem: '0.75rem', tailwind: 'p-3', flutter: '12', usage: 'Button vertical padding, chip gaps' },
    { name: 'spacing-4', value: 16, rem: '1rem', tailwind: 'p-4', flutter: '16', usage: 'Standard card padding, section gaps' },
    { name: 'spacing-5', value: 20, rem: '1.25rem', tailwind: 'p-5', flutter: '20', usage: 'Comfortable card padding' },
    { name: 'spacing-6', value: 24, rem: '1.5rem', tailwind: 'p-6', flutter: '24', usage: 'Page margins (mobile), section spacing' },
    { name: 'spacing-8', value: 32, rem: '2rem', tailwind: 'p-8', flutter: '32', usage: 'Large section gaps, dialog padding' },
    { name: 'spacing-10', value: 40, rem: '2.5rem', tailwind: 'p-10', flutter: '40', usage: 'Hero section spacing' },
    { name: 'spacing-12', value: 48, rem: '3rem', tailwind: 'p-12', flutter: '48', usage: 'Page margins (desktop), major sections' },
    { name: 'spacing-16', value: 64, rem: '4rem', tailwind: 'p-16', flutter: '64', usage: 'Page top padding, large gaps' },
    { name: 'spacing-20', value: 80, rem: '5rem', tailwind: 'p-20', flutter: '80', usage: 'Hero spacing, landing sections' },
    { name: 'spacing-24', value: 96, rem: '6rem', tailwind: 'p-24', flutter: '96', usage: 'Maximum spacing, page bookends' },
];

// --- SIZING ------------------------------------------------------------------

export interface SizeToken {
    name: string;
    value: number;
    tailwind: string;
    flutter: string;
    usage: string;
}

export const SIZE_TOKENS: SizeToken[] = [
    { name: 'size-icon-sm', value: 20, tailwind: 'w-5 h-5', flutter: 'size: 20', usage: 'Dense/compact icon' },
    { name: 'size-icon-md', value: 24, tailwind: 'w-6 h-6', flutter: 'size: 24', usage: 'Default icon' },
    { name: 'size-icon-lg', value: 40, tailwind: 'w-10 h-10', flutter: 'size: 40', usage: 'Prominent icon' },
    { name: 'size-touch-min', value: 48, tailwind: 'min-h-12 min-w-12', flutter: 'SizedBox(48, 48)', usage: 'Minimum touch target (WCAG)' },
    { name: 'size-button-sm', value: 32, tailwind: 'h-8', flutter: 'height: 32', usage: 'Compact button' },
    { name: 'size-button-md', value: 40, tailwind: 'h-10', flutter: 'height: 40', usage: 'Default button' },
    { name: 'size-button-lg', value: 56, tailwind: 'h-14', flutter: 'height: 56', usage: 'Large/FAB button' },
    { name: 'size-avatar-sm', value: 32, tailwind: 'w-8 h-8', flutter: 'radius: 16', usage: 'Compact avatar (lists)' },
    { name: 'size-avatar-md', value: 40, tailwind: 'w-10 h-10', flutter: 'radius: 20', usage: 'Default avatar' },
    { name: 'size-avatar-lg', value: 56, tailwind: 'w-14 h-14', flutter: 'radius: 28', usage: 'Profile/hero avatar' },
    { name: 'size-input-md', value: 56, tailwind: 'h-14', flutter: 'height: 56', usage: 'Default text field height' },
];

// --- LAYOUT GRID -------------------------------------------------------------

export interface Breakpoint {
    name: string;
    windowClass: string;
    minWidth: number;
    maxWidth: number | null;
    columns: number;
    margins: number;
    gutters: number;
    tailwindBreakpoint: string;
    navPattern: string;
    icon?: string;
}

export const BREAKPOINTS: Breakpoint[] = [
    { name: 'Compact', windowClass: 'Phone', minWidth: 0, maxWidth: 599, columns: 4, margins: 16, gutters: 8, tailwindBreakpoint: 'default', navPattern: 'Bottom Navigation', icon: 'smartphone' },
    { name: 'Medium', windowClass: 'Tablet', minWidth: 600, maxWidth: 839, columns: 8, margins: 24, gutters: 16, tailwindBreakpoint: 'sm', navPattern: 'Navigation Rail', icon: 'tablet_mac' },
    { name: 'Expanded', windowClass: 'Small Desktop', minWidth: 840, maxWidth: 1199, columns: 12, margins: 24, gutters: 24, tailwindBreakpoint: 'md', navPattern: 'Navigation Drawer', icon: 'laptop_mac' },
    { name: 'Large', windowClass: 'Desktop', minWidth: 1200, maxWidth: 1599, columns: 12, margins: 24, gutters: 24, tailwindBreakpoint: 'lg', navPattern: 'Navigation Drawer', icon: 'desktop_windows' },
    { name: 'Extra Large', windowClass: 'Wide Desktop', minWidth: 1600, maxWidth: null, columns: 12, margins: 24, gutters: 24, tailwindBreakpoint: 'xl', navPattern: 'Navigation Drawer', icon: 'tv' },
];

export const CORE_BREAKPOINTS: Breakpoint[] = [
    { name: 'Compact', windowClass: 'Phone', minWidth: 0, maxWidth: 599, columns: 4, margins: 16, gutters: 16, tailwindBreakpoint: 'base', navPattern: 'Drawer', icon: 'smartphone' },
    { name: 'Medium', windowClass: 'Tablet', minWidth: 600, maxWidth: 839, columns: 8, margins: 24, gutters: 24, tailwindBreakpoint: 'sm', navPattern: 'Collapsible', icon: 'tablet_mac' },
    { name: 'Expanded', windowClass: 'Small Desktop', minWidth: 840, maxWidth: 1199, columns: 12, margins: 24, gutters: 24, tailwindBreakpoint: 'md', navPattern: 'Sidebar', icon: 'laptop_mac' },
    { name: 'Large', windowClass: 'Desktop', minWidth: 1200, maxWidth: 1439, columns: 12, margins: 24, gutters: 24, tailwindBreakpoint: 'lg', navPattern: 'Sidebar', icon: 'desktop_windows' },
    { name: 'Extra Large', windowClass: 'Wide Desktop (1440px max)', minWidth: 1440, maxWidth: null, columns: 12, margins: 24, gutters: 24, tailwindBreakpoint: 'xl', navPattern: 'Sidebar', icon: 'tv' },
];

// --- OVERLAYS & SCRIMS -------------------------------------------------------

export interface StateLayer {
    state: string;
    opacity: number;
    description: string;
}

export const STATE_LAYERS: StateLayer[] = [
    { state: 'Hover', opacity: 8, description: 'Mouse cursor enters interactive element' },
    { state: 'Focus', opacity: 10, description: 'Keyboard focus ring / focus visible' },
    { state: 'Pressed', opacity: 10, description: 'Active press / tap / click' },
    { state: 'Dragged', opacity: 16, description: 'Element being dragged or moved' },
];

export const CORE_STATE_LAYERS: StateLayer[] = [
    { state: 'Hover', opacity: 10, description: 'Cursor interaction (higher contrast neutral)' },
    { state: 'Focus', opacity: 15, description: 'Focus visible ring indicator' },
    { state: 'Pressed', opacity: 20, description: 'Active tap or click depression' },
    { state: 'Dragged', opacity: 25, description: 'Element surface being dragged' },
];

export const SCRIM_VALUES = {
    light: 0.32,
    dark: 0.52,
    blur: 8,
} as const;

export const CORE_SCRIM_VALUES = {
    light: 0.8,
    dark: 0.8,
    blur: 4, // Core traditionally uses backdrop-blur-sm
} as const;

// --- MOTION ------------------------------------------------------------------

export interface MotionCurve {
    name: string;
    value: string;
    flutter: string;
    usage: string;
}

export const MOTION_CURVES: MotionCurve[] = [
    { name: 'Standard', value: 'cubic-bezier(0.2, 0, 0, 1)', flutter: 'Curves.easeInOutCubicEmphasized', usage: 'Default for most transitions' },
    { name: 'Standard Decelerate', value: 'cubic-bezier(0, 0, 0, 1)', flutter: 'Curves.decelerate', usage: 'Elements entering the screen' },
    { name: 'Standard Accelerate', value: 'cubic-bezier(0.3, 0, 1, 1)', flutter: 'Curves.easeIn', usage: 'Elements leaving the screen' },
    { name: 'Emphasized', value: 'cubic-bezier(0.2, 0, 0, 1)', flutter: 'Curves.easeInOutCubicEmphasized', usage: 'Large/expressive transitions' },
    { name: 'Emphasized Decelerate', value: 'cubic-bezier(0.05, 0.7, 0.1, 1)', flutter: 'Curves.easeOutCubic', usage: 'Large elements entering' },
    { name: 'Emphasized Accelerate', value: 'cubic-bezier(0.3, 0, 0.8, 0.15)', flutter: 'Curves.easeInCubic', usage: 'Large elements leaving' },
];

export const CORE_MOTION_CURVES: MotionCurve[] = [
    { name: 'Ease In Out', value: 'ease-in-out', flutter: 'Curves.easeInOut', usage: 'Default smooth standard UX' },
    { name: 'Ease Out', value: 'ease-out', flutter: 'Curves.easeOut', usage: 'UI Deceleration (exiting)' },
    { name: 'Ease In', value: 'ease-in', flutter: 'Curves.easeIn', usage: 'UI Acceleration (entering)' },
    { name: 'Linear', value: 'linear', flutter: 'Curves.linear', usage: 'Mechanical/robotic consistency' },
];


export interface MotionDuration {
    name: string;
    ms: number;
    usage: string;
}

export const MOTION_DURATIONS: MotionDuration[] = [
    { name: 'Short 1', ms: 50, usage: 'Micro-interactions, opacity toggles' },
    { name: 'Short 2', ms: 100, usage: 'Small selection changes, state toggles' },
    { name: 'Short 3', ms: 150, usage: 'Icon morphs, small element transitions' },
    { name: 'Short 4', ms: 200, usage: 'Button state changes, chips' },
    { name: 'Medium 1', ms: 250, usage: 'Cards, small dialogs entering' },
    { name: 'Medium 2', ms: 300, usage: 'Standard transition duration' },
    { name: 'Medium 3', ms: 350, usage: 'Navigation transitions' },
    { name: 'Medium 4', ms: 400, usage: 'Complex component transitions' },
    { name: 'Long 1', ms: 450, usage: 'Large dialogs, full-screen transitions' },
    { name: 'Long 2', ms: 500, usage: 'Sheet transitions, drawer open/close' },
    { name: 'Long 3', ms: 550, usage: 'Hero animations, page transitions' },
    { name: 'Long 4', ms: 600, usage: 'Complex orchestrated transitions' },
    { name: 'Extra Long 1', ms: 700, usage: 'Full layout shifts' },
    { name: 'Extra Long 2', ms: 800, usage: 'Multi-element choreography' },
    { name: 'Extra Long 3', ms: 900, usage: 'Extended reveal animations' },
    { name: 'Extra Long 4', ms: 1000, usage: 'Maximum transition duration' },
];

export const CORE_MOTION_DURATIONS: MotionDuration[] = [
    { name: '75', ms: 75, usage: 'Tailwind duration-75 (Micro)' },
    { name: '100', ms: 100, usage: 'Tailwind duration-100' },
    { name: '150', ms: 150, usage: 'Tailwind duration-150 (Default)' },
    { name: '200', ms: 200, usage: 'Tailwind duration-200 (Buttons)' },
    { name: '300', ms: 300, usage: 'Tailwind duration-300 (Dialogs)' },
    { name: '500', ms: 500, usage: 'Tailwind duration-500 (Panels)' },
    { name: '700', ms: 700, usage: 'Tailwind duration-700 (Layout Shifts)' },
    { name: '1000', ms: 1000, usage: 'Tailwind duration-1000 (Hero)' },
];

// --- ZAP LAYER MAPPING -------------------------------------------------------

export interface ZapLayerMapping {
    zapLayer: string;
    zapToken: string;
    m3Token: string;
    flutterToken: string;
    m3Elevation: number;
    tintOpacity: number;
    zIndex: string;
    description: string;
}

export const ZAP_LAYER_MAP: ZapLayerMapping[] = [
    { zapLayer: 'L0: Base', zapToken: 'bg-layer-base', m3Token: 'bg-surface-container-lowest', flutterToken: 'colorScheme.surfaceContainerLowest', m3Elevation: 0, tintOpacity: 0, zIndex: '0', description: 'Absolute root document background (M3 Surface Lowest). Sits beneath all layout.' },
    { zapLayer: 'L1: Canvas', zapToken: 'bg-layer-canvas', m3Token: 'bg-surface-container-low', flutterToken: 'colorScheme.surfaceContainerLow', m3Elevation: 1, tintOpacity: 5, zIndex: '10', description: 'Base routing floor and foundation wrapper (M3 Surface Low). e.g., the primary App Canvas.' },
    { zapLayer: 'L2: Cover', zapToken: 'bg-layer-cover', m3Token: 'bg-surface-container', flutterToken: 'colorScheme.surfaceContainer', m3Elevation: 2, tintOpacity: 8, zIndex: '100', description: 'Primary content surfaces, workspace sandboxes, and internal Page Headers (M3 Surface Container).' },
    { zapLayer: 'L3: Panels', zapToken: 'bg-layer-panel', m3Token: 'bg-surface-container-high', flutterToken: 'colorScheme.surfaceContainerHigh', m3Elevation: 3, tintOpacity: 11, zIndex: '1000+', description: 'Generic UI Cards, Global side/horizontal navigation, Inspector covers, and Global AppShell Headers (M3 Surface High).' },
    { zapLayer: 'L4: Dialogs', zapToken: 'bg-layer-dialog', m3Token: 'bg-surface-container-highest', flutterToken: 'colorScheme.surfaceContainerHighest', m3Elevation: 4, tintOpacity: 12, zIndex: '2000+', description: 'Modal dialogs, popovers, confirmations. Also: encapsulated inner detail wrappers inside L3 panels — Inspector accordion sections, Quick Ref cards, Platform toggles, SideNav footer controls (theme switcher, dev toggle), and any sub-container that floats above the L3 panel surface (M3 Surface Highest).' },
    { zapLayer: 'L5: Modals', zapToken: 'bg-layer-modal', m3Token: 'bg-surface-container-highest', flutterToken: 'colorScheme.surfaceContainerHighest', m3Elevation: 5, tintOpacity: 14, zIndex: '3000', description: 'Highest-elevation surfaces. Includes: blocking full-screen modal prompts + scrim, but also any surface that floats above L4 — Inspector quick-ref cards, active selected items, tooltip surfaces, inline chips on dark panels, and status badges nested inside dialog/accordion content (M3 Surface Highest + Scrim).' },
];

// --- COMPONENT ELEVATION MAP -------------------------------------------------

export interface ComponentElevation {
    component: string;
    default: number;
    hovered: number | null;
    pressed: number | null;
    disabled: number;
    zapToken?: string;
}

export const COMPONENT_ELEVATION_MAP: ComponentElevation[] = [
    { component: 'Card', default: 1, hovered: 2, pressed: 1, disabled: 0, zapToken: 'bg-layer-panel' },
    { component: 'Button (Filled)', default: 0, hovered: 1, pressed: 0, disabled: 0, zapToken: 'bg-layer-base' },
    { component: 'Button (Tonal)', default: 0, hovered: 1, pressed: 0, disabled: 0, zapToken: 'bg-layer-base' },
    { component: 'FAB', default: 3, hovered: 4, pressed: 3, disabled: 0, zapToken: 'bg-layer-modal' },
    { component: 'Dialog', default: 3, hovered: null, pressed: null, disabled: 0, zapToken: 'bg-layer-dialog' },
    { component: 'Navigation Drawer', default: 1, hovered: null, pressed: null, disabled: 0 },
    { component: 'Bottom Sheet', default: 1, hovered: null, pressed: null, disabled: 0, zapToken: 'bg-layer-modal' },
    { component: 'Menu', default: 2, hovered: null, pressed: null, disabled: 0, zapToken: 'bg-layer-panel' },
    { component: 'Top App Bar (scroll)', default: 2, hovered: null, pressed: null, disabled: 0, zapToken: 'bg-layer-panel' },
    { component: 'Chip (selected)', default: 1, hovered: 2, pressed: 1, disabled: 0 },
];

// --- BORDER & RADIUS ---------------------------------------------------------

export interface BorderRadiusToken {
    name: string;
    token: string;
    value: string;
    usage: string;
}

export const BORDER_RADIUS_TOKENS: BorderRadiusToken[] = [
    { name: 'None', token: 'rounded-none', value: '0px', usage: 'Sharp corners, flush edges' },
    { name: 'Small (sm)', token: 'rounded-sm', value: '0.125rem (2px)', usage: 'Small components, badges' },
    { name: 'Base', token: 'rounded', value: '0.25rem (4px)', usage: 'Default for most standard UI' },
    { name: 'Medium (md)', token: 'rounded-md', value: '0.375rem (6px)', usage: 'Cards, modest containers' },
    { name: 'Large (lg)', token: 'rounded-lg', value: '0.5rem (8px)', usage: 'Dialogs, larger surfaces' },
    { name: 'Extra Large (xl)', token: 'rounded-xl', value: '0.75rem (12px)', usage: 'Prominent floating elements' },
    { name: '2XL', token: 'rounded-2xl', value: '1rem (16px)', usage: 'Bottom sheets, huge modals' },
    { name: '3XL', token: 'rounded-3xl', value: '1.5rem (24px)', usage: 'Maximum standard rounding' },
    { name: 'Full', token: 'rounded-full', value: '9999px', usage: 'Pills, circular avatars, FABs' },
];

export interface BorderWidthToken {
    name: string;
    token: string;
    value: string;
    usage: string;
}

export const BORDER_WIDTH_TOKENS: BorderWidthToken[] = [
    { name: 'None', token: 'border-0', value: '0px', usage: 'No border' },
    { name: 'Base', token: 'border', value: '1px', usage: 'Default border thickness' },
    { name: 'Thick (2)', token: 'border-2', value: '2px', usage: 'Emphasized borders, focus rings' },
    { name: 'Thicker (4)', token: 'border-4', value: '4px', usage: 'Heavy borders, active states' },
    { name: 'Max (8)', token: 'border-8', value: '8px', usage: 'Rare decorative borders' },
];

export interface BorderStyleToken {
    name: string;
    token: string;
    usage: string;
}

export const BORDER_STYLE_TOKENS: BorderStyleToken[] = [
    { name: 'None', token: 'border-none', usage: 'No visible line' },
    { name: 'Solid', token: 'border-solid', usage: 'Standard solid line' },
    { name: 'Dashed', token: 'border-dashed', usage: 'Dashed dividing line' },
    { name: 'Dotted', token: 'border-dotted', usage: 'Dotted subtle line' },
];

export interface OpacityToken {
    name: string;
    token: string;
    usage: string;
}

export const OPACITY_TOKENS: OpacityToken[] = [
    { name: '100%', token: '100%', usage: 'Fully opaque' },
    { name: '90%', token: '90%', usage: 'Subtle transparency' },
    { name: '75%', token: '75%', usage: 'Noticeable transparency' },
    { name: '50%', token: '50%', usage: 'Half transparent' },
    { name: '25%', token: '25%', usage: 'Mostly transparent' },
    { name: '0%', token: '0%', usage: 'Fully transparent' },
];

export interface ComponentBorderMapping {
    component: string;
    defaultRadius: string;
    defaultWidth: string;
}

export const COMPONENT_BORDER_MAP: ComponentBorderMapping[] = [
    { component: 'Button', defaultRadius: 'rounded-full', defaultWidth: 'border-0' },
    { component: 'Card', defaultRadius: 'rounded-2xl', defaultWidth: 'border' },
    { component: 'Input Field', defaultRadius: 'rounded-md', defaultWidth: 'border' },
    { component: 'Dialog', defaultRadius: 'rounded-3xl', defaultWidth: 'border-0' },
    { component: 'Badge', defaultRadius: 'rounded-full', defaultWidth: 'border-0' },
    { component: 'Checkbox', defaultRadius: 'rounded-sm', defaultWidth: 'border-2' },
    { component: 'Chip', defaultRadius: 'rounded-lg', defaultWidth: 'border' },
    { component: 'Textarea', defaultRadius: 'rounded-lg', defaultWidth: 'border' },
    { component: 'Toggle', defaultRadius: 'rounded-full', defaultWidth: 'border-0' },
    { component: 'Canvas (L1)', defaultRadius: 'rounded-lg', defaultWidth: 'border-0' },
    { component: 'Cover (L2)', defaultRadius: 'rounded-[32px]', defaultWidth: 'border-0' },
    { component: 'Panel (L3)', defaultRadius: 'rounded-2xl', defaultWidth: 'border-0' },
    { component: 'Modal (L5)', defaultRadius: 'rounded-3xl', defaultWidth: 'border-0' },
    { component: 'Accordion', defaultRadius: 'rounded-lg', defaultWidth: 'border' },
    { component: 'Avatar', defaultRadius: 'rounded-full', defaultWidth: 'border-2' },
    { component: 'Select', defaultRadius: 'rounded-md', defaultWidth: 'border' },
    { component: 'Slider', defaultRadius: 'rounded-full', defaultWidth: 'border-0' },
    { component: 'Tabs', defaultRadius: 'rounded-none', defaultWidth: 'border-0' },
    { component: 'Table', defaultRadius: 'rounded-lg', defaultWidth: 'border' },
];

// --- SECTION METADATA --------------------------------------------------------

export interface FoundationSection {
    id: string;
    number: string;
    title: string;
    icon: string;
    description: string;
    anchor: string;
}

export const FOUNDATION_SECTIONS: FoundationSection[] = [
    { id: 'color', number: '01', title: 'Color', icon: 'palette', description: '29 semantic roles from a single seed color', anchor: '#color' },
    { id: 'typography', number: '02', title: 'Typography', icon: 'text_fields', description: '15 type styles across 5 roles × 3 sizes', anchor: '#typography' },
    { id: 'icons', number: '03', title: 'Icons', icon: 'interests', description: 'Material Symbols with variable axes', anchor: '#icons' },
    { id: 'elevation', number: '04', title: 'Elevation & Shadow', icon: 'layers', description: '6 levels with tint-first depth hierarchy', anchor: '#elevation' },
    { id: 'spacing', number: '05', title: 'Spacing', icon: 'space_bar', description: '4dp base grid, 13-value scale', anchor: '#spacing' },
    { id: 'sizing', number: '06', title: 'Sizing', icon: 'straighten', description: 'Touch targets, component heights, density', anchor: '#sizing' },
    { id: 'layout', number: '07', title: 'Layout Grid', icon: 'grid_view', description: '5 M3 breakpoints with responsive columns', anchor: '#layout' },
    { id: 'overlays', number: '08', title: 'Overlays & Scrims', icon: 'filter_drama', description: 'State layers, scrims, backdrop blur', anchor: '#overlays' },
    { id: 'motion', number: '09', title: 'Motion', icon: 'animation', description: 'Easing curves and duration tokens', anchor: '#motion' },
];
