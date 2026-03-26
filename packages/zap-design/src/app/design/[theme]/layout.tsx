'use client';

/**
 * Dynamic Theme Layout
 *
 * This layout wraps all pages under /design/[theme]/...
 * It resolves the theme from the URL param and injects the correct
 * ThemeConfig into the rendering context.
 *
 * Routes:
 *   /design/acme/colors   → theme='acme' (customer theme via dynamic route)
 *
 * Note: Static routes (/design/core/, /design/metro/) take precedence
 * over this dynamic route in Next.js, so existing pages keep working.
 */

import React from 'react';
import { useParams } from 'next/navigation';
import { getTheme, isValidTheme, type ThemeConfig } from '../../../themes/registry';

interface ThemeLayoutProps {
    children: React.ReactNode;
}

// ─── Theme Context for Dynamic Routes ───────────────────────────────────────────

interface DynamicThemeContextType {
    themeId: string;
    config: ThemeConfig;
}

const DynamicThemeContext = React.createContext<DynamicThemeContextType | null>(null);

export function useDynamicTheme() {
    const ctx = React.useContext(DynamicThemeContext);
    if (!ctx) throw new Error('useDynamicTheme must be used inside /design/[theme]/ route');
    return ctx;
}

// ─── Layout Component ───────────────────────────────────────────────────────────

export default function ThemeLayout({ children }: ThemeLayoutProps) {
    const params = useParams();
    const themeId = params.theme as string;

    // Validate theme exists — client-side 404 fallback
    if (!isValidTheme(themeId)) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-layer-canvas">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black text-foreground tracking-tight">404</h1>
                    <p className="text-lg text-muted-foreground">
                        Theme <code className="font-dev text-primary">&quot;{themeId}&quot;</code> not found in registry.
                    </p>
                    <p className="text-sm text-muted-foreground/60">
                        Register it in <code className="font-dev">src/themes/registry.ts</code> or load from MongoDB.
                    </p>
                </div>
            </div>
        );
    }

    const config = getTheme(themeId)!;

    return (
        <DynamicThemeContext.Provider value={{ themeId, config }}>
            {children}
        </DynamicThemeContext.Provider>
    );
}
