'use client';

import * as React from 'react';

/**
 * ThemeToggleContext: Manages the live "Tuning" state
 */

export type AppTheme = 'core' | 'neo' | 'metro' | 'wix';

export type SidebarState = 'expanded' | 'minified' | 'collapsed';
export type InspectorState = 'expanded' | 'collapsed';
export type OpenCategoriesState = Record<string, boolean>;

export type TypographyOverrides = {
    primaryFont?: string;
    primaryTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    secondaryFont?: string;
    secondaryTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    tertiaryFont?: string;
    tertiaryTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    components?: {
        button?: {
            fontFamily?: string;
            textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
        },
        checkbox?: {
            fontFamily?: string;
            textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
        }
    };
};

type ThemeContextType = {
    theme: AppTheme;
    setTheme: (theme: AppTheme) => void;
    devMode: boolean;
    setDevMode: (state: boolean) => void;
    sidebarState: SidebarState;
    setSidebarState: (state: SidebarState) => void;
    inspectorState: InspectorState;
    setInspectorState: (state: InspectorState) => void;
    typographyOverrides?: TypographyOverrides | null;
    setTypographyOverrides: (state: TypographyOverrides | null) => void;
    openCategories: OpenCategoriesState;
    setOpenCategories: React.Dispatch<React.SetStateAction<OpenCategoriesState>>;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = React.useState<AppTheme>('metro');

    // Sync theme with pathname after mount to fix hydration SSR mismatch
    React.useEffect(() => {
        const path = window.location.pathname;
        let nextTheme: AppTheme | null = null;
        if (path.includes('/core')) nextTheme = 'core';
        else if (path.includes('/metro')) nextTheme = 'metro';
        else if (path.includes('/neo')) nextTheme = 'neo';
        else if (path.includes('/wix')) nextTheme = 'wix';
        
        if (nextTheme) {
            setTheme(nextTheme);
            localStorage.setItem('zap-theme', nextTheme);
        } else {
            const saved = localStorage.getItem('zap-theme') as AppTheme;
            if (saved === 'core' || saved === 'neo' || saved === 'wix' || saved === 'metro') {
                setTheme(saved);
            } else {
                setTheme('metro');
                localStorage.setItem('zap-theme', 'metro');
            }
        }
    }, []);

    // Also persist theme whenever it changes
    React.useEffect(() => {
        localStorage.setItem('zap-theme', theme);
    }, [theme]);

    const [devMode, setDevMode] = React.useState(false);

    // Sync devMode → inject/remove a <style> tag that overrides bg-layer-* token classes
    // directly. No extra debug classes needed — bg-layer-* are already on every surface.
    React.useEffect(() => {
        const STYLE_ID = 'zap-debug-layer-paint';
        document.body.setAttribute('data-devmode', devMode ? 'true' : 'false');
        if (devMode) {
            if (!document.getElementById(STYLE_ID)) {
                const style = document.createElement('style');
                style.id = STYLE_ID;
                style.textContent = `
                    .bg-layer-base   { background-color: #e5e7eb !important; }
                    .bg-layer-canvas { background-color: #f87171 !important; }
                    .bg-layer-cover  { background-color: #facc15 !important; }
                    .bg-layer-panel  { background-color: #22c55e !important; }
                    .bg-layer-dialog { background-color: #a855f7 !important; }
                    .bg-layer-modal  { background-color: #ec4899 !important; }
                `;
                document.head.appendChild(style);
            }
        } else {
            document.getElementById(STYLE_ID)?.remove();
        }
    }, [devMode]);
    const [sidebarState, setSidebarState] = React.useState<SidebarState>('expanded');
    const [inspectorState, setInspectorState] = React.useState<InspectorState>('expanded');
    const [openCategories, setOpenCategories] = React.useState<OpenCategoriesState>({
        SYS: true,
        L1: true,
        L2: true
    });
    const [typographyOverrides, setTypographyOverridesRaw] = React.useState<TypographyOverrides | null>(null);
    const setTypographyOverrides = React.useCallback((newOverrides: TypographyOverrides | null) => {
        setTypographyOverridesRaw(prev => {
            if (prev === newOverrides) return prev;
            if (prev && newOverrides && 
                prev.primaryFont === newOverrides.primaryFont &&
                prev.primaryTransform === newOverrides.primaryTransform &&
                prev.secondaryFont === newOverrides.secondaryFont &&
                prev.secondaryTransform === newOverrides.secondaryTransform &&
                prev.tertiaryFont === newOverrides.tertiaryFont &&
                prev.tertiaryTransform === newOverrides.tertiaryTransform &&
                JSON.stringify(prev.components) === JSON.stringify(newOverrides.components)) {
                return prev;
            }
            return newOverrides;
        });
    }, []);

    // Global Initialization Effect
    React.useEffect(() => {
        const initializeTheme = async () => {
            try {
                // Fetch Typography
                const typoRes = await fetch(`/api/typography/publish?theme=${theme}`);
                const typoResult = await typoRes.json();
                if (typoResult.success && typoResult.data) {
                    setTypographyOverrides({
                        primaryFont: typoResult.data.primaryFont,
                        primaryTransform: typoResult.data.primaryTransform,
                        secondaryFont: typoResult.data.secondaryFont,
                        secondaryTransform: typoResult.data.secondaryTransform,
                        tertiaryFont: typoResult.data.tertiaryFont,
                        tertiaryTransform: typoResult.data.tertiaryTransform,
                        components: typoResult.data.components,
                    });
                }
            } catch (err) {
                console.error("ThemeContext: Failed to load typography:", err);
            }

            try {
                // Fetch Colors
                const colorRes = await fetch(`/api/colors/publish?theme=${theme}`);
                const colorResult = await colorRes.json();
                
                let styleTag = document.getElementById('m3-dynamic-theme');
                if (!styleTag) {
                    styleTag = document.createElement('style');
                    styleTag.id = 'm3-dynamic-theme';
                    document.head.appendChild(styleTag);
                }

                if (colorResult.success && colorResult.data && colorResult.data.cssOutput) {
                    styleTag.innerHTML = colorResult.data.cssOutput;
                } else {
                    // CLEAR dynamic CSS if theme has no custom configuration to prevent theme bleeding
                    styleTag.innerHTML = '';
                }
            } catch (err) {
                console.error("ThemeContext: Failed to load colors:", err);
            }
        };

        initializeTheme();
    }, [theme, setTypographyOverrides]);

    React.useEffect(() => {
        // Must target body, not documentElement — Next.js font vars (--font-pacifico, etc.)
        // are scoped to <body> via module classes, so <html> can't resolve them.
        const el = document.body.style;
        const fontVars = [
            ['--font-display', typographyOverrides?.primaryFont],
            ['--font-body', typographyOverrides?.secondaryFont],
            ['--font-dev', typographyOverrides?.tertiaryFont],
        ] as const;
        const transformVars = [
            ['--heading-transform', typographyOverrides?.primaryTransform],
            ['--body-transform', typographyOverrides?.secondaryTransform],
            ['--dev-transform', typographyOverrides?.tertiaryTransform],
        ] as const;

        if (!typographyOverrides) {
            [...fontVars, ...transformVars].forEach(([prop]) => el.removeProperty(prop));
            const styleTag = document.getElementById('m3-dynamic-typography');
            if (styleTag) styleTag.innerHTML = '';
            return;
        }

        fontVars.forEach(([prop, val]) => val ? el.setProperty(prop, val) : el.removeProperty(prop));
        transformVars.forEach(([prop, val]) => val ? el.setProperty(prop, val) : el.removeProperty(prop));

        // Inject Component-Level Typography Overrides
        let styleTag = document.getElementById('m3-dynamic-typography');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'm3-dynamic-typography';
            document.head.appendChild(styleTag);
        }

        let cssContent = '';

        const btnSettings = typographyOverrides?.components?.button;
        if (btnSettings && (btnSettings.fontFamily || btnSettings.textTransform)) {
            const cssRules = [];
            if (btnSettings.fontFamily) cssRules.push(`font-family: ${btnSettings.fontFamily} !important;`);
            if (btnSettings.textTransform) cssRules.push(`text-transform: ${btnSettings.textTransform} !important;`);
            
            cssContent += `
                [data-zap-theme] button[data-slot="button"],
                [data-zap-theme] .rounded-btn {
                    ${cssRules.join('\n                    ')}
                }
            `;
        }

        const checkboxSettings = typographyOverrides?.components?.checkbox;
        if (checkboxSettings && (checkboxSettings.fontFamily || checkboxSettings.textTransform)) {
            const cssRules = [];
            if (checkboxSettings.fontFamily) cssRules.push(`font-family: ${checkboxSettings.fontFamily} !important;`);
            if (checkboxSettings.textTransform) cssRules.push(`text-transform: ${checkboxSettings.textTransform} !important;`);
            
            // Note: Targeting the label wrapper or next-sibling label depending on how Radix/Genesis structured it.
            cssContent += `
                [data-zap-theme] [data-slot="checkbox"],
                [data-zap-theme] [data-slot="checkbox"] ~ label,
                [data-zap-theme] label:has(> [data-slot="checkbox"]) {
                    ${cssRules.join('\n                    ')}
                }
            `;
        }

        styleTag.innerHTML = cssContent;
    }, [typographyOverrides]);

    return (
        <ThemeContext.Provider value={{
            theme, setTheme, devMode, setDevMode,
            sidebarState, setSidebarState,
            inspectorState, setInspectorState,
            typographyOverrides, setTypographyOverrides,
            openCategories, setOpenCategories
        }}>
            {children}
        </ThemeContext.Provider>
    );
}


export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
