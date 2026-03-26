'use client';

import { useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';

/**
 * ThemeManager: Dynamic CSS Class Injector
 * 
 * This component listens to the current theme state from ThemeContext
 * and injects the corresponding CSS class into the document root.
 * This triggers the Theme Remix Engine (CSS cascade) globally.
 */

const THEME_CLASSES = ['theme-core', 'theme-neo', 'theme-metro', 'theme-wix'];

export function ThemeManager() {
    const { theme } = useTheme();

    useEffect(() => {
        const root = document.documentElement;

        // Strip all existing theme classes to prevent collisions
        root.classList.remove(...THEME_CLASSES);

        // Inject new theme class
        root.classList.add(`theme-${theme}`);

        // Debug
        root.setAttribute('data-zap-theme', theme);
    }, [theme]);

    return null;
}
