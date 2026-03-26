/**
 * ZAP UI Registry: The Centralized Theme Variable Store
 * 
 * This registry holds the exact CSS variable mappings for the 7-layer design system.
 * It's used by the ThemeManager to inject variables into the :root and by
 * components to reference adjustable tokens.
 */

export const THEME_REGISTRY = {
    metro: {
        background: {
            '--bg-surface': '#f9fafb', // gray-50
            '--bg-card': '#ffffff',
        },
        card: {
            '--card-shadow': '0 1px 2px 0 oklab(0 0 0 / 0.05)',
            '--card-radius': '12px',
        },
        input: {
            '--input-height': '56px',
            '--input-px': '12px',
            '--input-font-size': '13px',
            '--input-radius': '6px',
            '--input-border': '#d1d5db', // gray-300
            '--input-bg': '#ffffff',
        },
        button: {
            '--btn-height': '34px',
            '--btn-px': '12px',
            '--btn-font-size': '13px',
            '--btn-weight': '500',
            '--btn-radius': '6px',
            '--btn-primary-bg': '#2563eb', // blue-600
        },
        typography: {
            '--font-h3-size': '18px',
            '--font-h3-weight': '500',
            '--font-label-size': '14px',
            '--font-label-weight': '400',
            '--font-link-size': '14px',
            '--font-link-weight': '500',
            '--font-color-main': '#111827', // gray-900
        },
    },
    neo: {
        background: {
            '--bg-surface': '#FDFDFD', // Cream Surface
            '--bg-header': '#0B132B',  // Midnight Foundation
            '--bg-sidebar': '#E9FF70', // Yellow Panels
        },
        card: {
            '--card-shadow': '4px 4px 0px 0px #000000',
            '--card-radius': '0px',
            '--card-border': '#000000',
            '--card-border-width': '3px',
        },
        input: {
            '--input-height': '40px',
            '--input-px': '16px',
            '--input-font-size': '14px',
            '--input-radius': '0px',
            '--input-border': '#000000',
            '--input-bg': '#ffffff',
        },
        button: {
            '--btn-height': '40px',
            '--btn-px': '16px',
            '--btn-font-size': '14px',
            '--btn-weight': '700',
            '--btn-radius': '0px',
            '--btn-primary-bg': '#48CAE4', // Teal Action
            '--btn-primary-text': '#000000',
        },
        typography: {
            '--font-h1-size': '32px',
            '--font-h1-weight': '700',
            '--font-h2-size': '24px',
            '--font-h2-weight': '700',
            '--font-h3-size': '20px',
            '--font-h3-weight': '700',
            '--font-color-main': '#000000',
            '--font-color-midnight': '#0B132B',
        },
    },
    core: {
        background: {
            '--bg-surface': '#F8FAFC',
            '--bg-card': '#ffffff',
        },
        card: {
            '--card-shadow': '0 4px 6px rgba(0, 0, 0, 0.05)',
            '--card-radius': '4.5px', // Core High Density
        },
        input: {
            '--input-height': '34px',
            '--input-radius': '4.5px',
            '--input-border': '#E5E5E5',
            '--input-bg': '#ffffff',
            '--input-px': '12px',
            '--input-font-size': '13px',
        },
        button: {
            '--btn-height': '34px',
            '--btn-radius': '4.5px',
            '--btn-primary-bg': '#721B32', // Core Maroon
            '--btn-primary-text': '#ffffff',
            '--btn-weight': '700',
            '--btn-px': '16px',
            '--btn-font-size': '14px',
            '--button-height': '34px', // Component compatibility
            '--button-border-radius': '4.5px',
        },
        typography: {
            '--font-h3-size': '20px',
            '--font-h3-weight': '700',
            '--font-label-size': '14px',
            '--font-label-weight': '500',
            '--font-link-size': '14px',
            '--font-link-weight': '700',
            '--font-color-main': '#1A1A14',
        },
    },
};

export type ThemeType = 'metro' | 'neo';

export function getThemeVariables(theme: ThemeType) {
    const selected = THEME_REGISTRY[theme];
    return {
        ...selected.background,
        ...selected.card,
        ...selected.input,
        ...selected.button,
        ...selected.typography,
    };
}
