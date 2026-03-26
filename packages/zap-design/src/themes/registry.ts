/**
 * Theme Registry — Single source of truth for all theme configurations.
 *
 * Architecture:
 *   - Built-in themes (core, metro) are defined here as static configs.
 *   - Customer themes are loaded from MongoDB at runtime.
 *   - Every theme resolves to a ThemeConfig, which drives:
 *       1. CSS token injection (colors, typography, elevation, spacing)
 *       2. Feature gating (which molecules/pages are available)
 *       3. Layout shell selection (MetroShell, CoreShell, minimal)
 *
 * Adding a new theme:
 *   1. Define a ThemeConfig object
 *   2. Register it in THEME_REGISTRY
 *   3. It's immediately available at /design/[themeId]/...
 */

// ─── TYPES ──────────────────────────────────────────────────────────────────────

export type ThemeEngine = 'shadcn' | 'm3' | 'hybrid';
export type ShellType = 'metro-shell' | 'core-shell' | 'minimal';
export type SidebarVariant = 'full' | 'mini' | 'none';
export type InspectorPosition = 'right' | 'bottom' | 'none';

export interface ColorTokenSet {
    /** M3 source color — the single hex that generates the full palette */
    sourceColor: string;
    /** M3 scheme variant */
    scheme: 'tonal-spot' | 'neutral' | 'vibrant' | 'expressive' | 'rainbow' | 'fruit-salad' | 'monochrome' | 'fidelity' | 'content';
    /** Optional overrides for specific token values */
    overrides?: Record<string, string>;
}

export interface TypographyTokenSet {
    primaryFont: string;
    secondaryFont: string;
    tertiaryFont: string;
    primaryTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    secondaryTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    tertiaryTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export interface ElevationTokenSet {
    system: 'm3-standard' | 'flat' | 'neumorphic' | 'brutal';
}

export interface SpacingTokenSet {
    baseUnit: number; // e.g. 4 for 4px grid
    scale: 'compact' | 'standard' | 'comfortable';
}

export interface GeometryTokenSet {
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    cardBorderWidth: number;
}

export interface MotionTokenSet {
    curve: 'ease-out' | 'ease-in-out' | 'spring' | 'linear';
    durationMs: number;
    reducedMotion: boolean;
}

export interface ThemeFeatures {
    hasInspector: boolean;
    hasDebugAuditor: boolean;
    hasFoundations: string[];
    hasAtoms: string[];
    hasMolecules: string[];
    hasOrganisms: string[];
    hasLabs: string[];
}

export interface ThemeLayout {
    shell: ShellType;
    sidebar: SidebarVariant;
    inspector: InspectorPosition;
}

export interface CustomerBinding {
    id: string;
    name: string;
    logo?: string;
    surfaces: ('admin' | 'storefront' | 'mobile')[];
}

export interface ThemeConfig {
    id: string;
    name: string;
    description: string;
    engine: ThemeEngine;
    tokens: {
        colors: ColorTokenSet;
        typography: TypographyTokenSet;
        elevation: ElevationTokenSet;
        spacing: SpacingTokenSet;
        geometry: GeometryTokenSet;
        motion: MotionTokenSet;
    };
    features: ThemeFeatures;
    layout: ThemeLayout;
    customer?: CustomerBinding;
}

// ─── BUILT-IN THEMES ────────────────────────────────────────────────────────────

export const CORE_THEME: ThemeConfig = {
    id: 'core',
    name: 'Core (Shadcn)',
    description: 'Metronic/Shadcn design system — clean, utility-first, Radix-based components.',
    engine: 'shadcn',
    tokens: {
        colors: {
            sourceColor: '#6750A4',
            scheme: 'tonal-spot',
        },
        typography: {
            primaryFont: 'var(--font-inter), sans-serif',
            secondaryFont: 'var(--font-inter), sans-serif',
            tertiaryFont: 'var(--font-jetbrains), monospace',
            primaryTransform: 'none',
            secondaryTransform: 'none',
            tertiaryTransform: 'none',
        },
        elevation: { system: 'm3-standard' },
        spacing: { baseUnit: 4, scale: 'standard' },
        geometry: { borderRadius: 'md', cardBorderWidth: 1 },
        motion: { curve: 'ease-out', durationMs: 200, reducedMotion: false },
    },
    features: {
        hasInspector: true,
        hasDebugAuditor: true,
        hasFoundations: [
            'colors', 'typography', 'elevation', 'spacing', 'border_radius',
            'icons', 'layout', 'overlay', 'motion'
        ],
        hasAtoms: [
            'accordion', 'avatar', 'badge', 'breadcrumb-pill', 'button', 'canvas', 'card',
            'checkbox', 'formatters', 'indicator', 'input', 'label', 'live-blinker',
            'navlink', 'panel', 'pill', 'property-box', 'radio', 'scroll-area', 'search-input',
            'select', 'separator', 'skeleton', 'slider', 'surface', 'switch',
            'table', 'tabs', 'textarea', 'toggle'
        ],
        hasMolecules: [
            // Showcase molecules
            'cards', 'dialogs', 'horizontal-navigation', 'inputs',
            // Sandbox molecules
            'dropzone',
            'profile-switcher', 'quick-navigate', 'rating',
            'steppers',
            'user-session',
            // Additional molecules
            'alert', 'breadcrumb', 'dropdown-menu', 'form',
            'pagination', 'progress', 'tabs', 'tooltip', 'theme-header',
        ],
        hasOrganisms: [
            'dashboard', 'billing', 'kanban', 'login',
            'profile', 'settings', 'activities', 'system-logs'
        ],
        hasLabs: [
            'color-architect', 'typography-architect', 'swarm'
        ],
    },
    layout: {
        shell: 'core-shell',
        sidebar: 'full',
        inspector: 'right',
    },
};

export const METRO_THEME: ThemeConfig = {
    id: 'metro',
    name: 'Metro (Material 3)',
    description: 'Material Design 3 system — dynamic color, tonal surfaces, M3 spatial depth.',
    engine: 'm3',
    tokens: {
        colors: {
            sourceColor: '#6750A4',
            scheme: 'tonal-spot',
        },
        typography: {
            primaryFont: 'var(--font-space-grotesk), sans-serif',
            secondaryFont: 'var(--font-inter), sans-serif',
            tertiaryFont: 'var(--font-jetbrains), monospace',
            primaryTransform: 'uppercase',
            secondaryTransform: 'uppercase',
            tertiaryTransform: 'lowercase',
        },
        elevation: { system: 'm3-standard' },
        spacing: { baseUnit: 4, scale: 'standard' },
        geometry: { borderRadius: 'lg', cardBorderWidth: 2 },
        motion: { curve: 'ease-out', durationMs: 200, reducedMotion: false },
    },
    features: {
        hasInspector: true,
        hasDebugAuditor: true,
        hasFoundations: [
            'colors', 'typography', 'elevation', 'spacing', 'border_radius',
            'icons', 'layout', 'overlay', 'motion'
        ],
        hasAtoms: [
            'accordion', 'avatar', 'badge', 'breadcrumb-pill', 'button', 'canvas', 'card',
            'checkbox', 'indicator', 'input', 'label', 'live-blinker', 'navlink', 'panel', 'pill',
            'property-box', 'radio', 'scroll-area', 'search-input', 'select', 'separator', 'skeleton',
            'slider', 'switch', 'table', 'tabs', 'textarea', 'toggle'
        ],
        hasMolecules: [
            // Showcase molecules
            'cards', 'dialogs', 'horizontal-navigation', 'inputs',
            // Sandbox molecules
            'dropzone',
            'profile-switcher', 'quick-navigate', 'rating',
            'steppers',
            'user-session',
            // Additional molecules
            'alert', 'breadcrumb', 'dropdown-menu', 'form',
            'pagination', 'progress', 'tabs', 'tooltip', 'theme-header',
        ],
        hasOrganisms: [
            'dashboard', 'billing', 'kanban', 'login',
            'profile', 'settings', 'activities', 'system-logs', 'user-management'
        ],
        hasLabs: [
            'color-architect', 'typography-architect', 'swarm'
        ],
    },
    layout: {
        shell: 'metro-shell',
        sidebar: 'full',
        inspector: 'right',
    },
};

// ─── REGISTRY ───────────────────────────────────────────────────────────────────

const THEME_REGISTRY: Record<string, ThemeConfig> = {
    core: CORE_THEME,
    metro: METRO_THEME,
};

/**
 * Get a theme config by ID.
 * Returns undefined if theme is not found (for customer themes, query MongoDB).
 */
export function getTheme(themeId: string): ThemeConfig | undefined {
    return THEME_REGISTRY[themeId];
}

/**
 * Get all registered (built-in) theme IDs.
 */
export function getThemeIds(): string[] {
    return Object.keys(THEME_REGISTRY);
}

/**
 * Get all registered themes as an array.
 */
export function getAllThemes(): ThemeConfig[] {
    return Object.values(THEME_REGISTRY);
}

/**
 * Register a new theme at runtime (for customer themes loaded from DB).
 */
export function registerTheme(config: ThemeConfig): void {
    THEME_REGISTRY[config.id] = config;
}

/**
 * Check if a theme ID is valid (registered).
 */
export function isValidTheme(themeId: string): boolean {
    return themeId in THEME_REGISTRY;
}

/**
 * Foundation pages available to all themes.
 */
export const FOUNDATION_PAGES = [
    { id: 'colors', label: 'Colors', icon: 'palette' },
    { id: 'typography', label: 'Typography', icon: 'text_fields' },
    { id: 'elevation', label: 'Elevation', icon: 'layers' },
    { id: 'spacing', label: 'Spacing', icon: 'space_bar' },
    { id: 'icons', label: 'Icons', icon: 'emoji_symbols' },
    { id: 'geometry', label: 'Geometry', icon: 'hexagon' },
    { id: 'layout', label: 'Layout', icon: 'grid_view' },
    { id: 'motion', label: 'Motion', icon: 'animation' },
    { id: 'overlay', label: 'Overlay', icon: 'filter_none' },
] as const;
