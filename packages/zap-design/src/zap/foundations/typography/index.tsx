'use client';

import React from 'react';
import { toast } from 'sonner';
import { Inspector } from '../../../zap/layout/Inspector';
import { ThemePublisher } from '../../../components/dev/ThemePublisher';
import { metroThemeData, corpThemeData } from '../../../zap/sections/atoms/typography/schema';
import { useTheme } from '../../../components/ThemeContext';
import { TypographyBody } from '../../../zap/sections/atoms/typography/body';
import { Canvas } from '../../../genesis/atoms/surfaces/canvas';
import { CanvasBody } from '../../../zap/layout/CanvasBody';
import { DebugAuditor } from '../../../components/debug/auditor';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { TabItem } from '../../../genesis/atoms/interactive/Tabs';
import { TypographyInspector, type TypographyTemplate } from '../../../zap/sections/atoms/typography/inspector';

const TYPOGRAPHY_TABS: TabItem[] = [
    { id: 'details', label: 'FONT DETAILS' },
    { id: 'preview', label: 'LIVE PREVIEW' },
    { id: 'playground', label: 'PLAYGROUND' },
];

type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none';

export default function TypographyPage() {
    const [activeTab, setActiveTab] = React.useState<string>('details');
    const [activeFont, setActiveFont] = React.useState<string | undefined>(undefined);
    const [secondaryFont, setSecondaryFont] = React.useState<string | undefined>(undefined);
    const [tertiaryFont, setTertiaryFont] = React.useState<string | undefined>(undefined);
    const { theme, setTypographyOverrides } = useTheme();
    const baseThemeData = theme === 'core' ? corpThemeData : metroThemeData;

    const [transforms, setTransforms] = React.useState<Record<'primary' | 'secondary' | 'tertiary', TextTransform>>({
        primary: (baseThemeData.global.primaryTransform as TextTransform) || 'none',
        secondary: (baseThemeData.global.secondaryTransform as TextTransform) || 'none',
        tertiary: (baseThemeData.global.tertiaryTransform as TextTransform) || 'none',
    });
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isLoadedRef = React.useRef(false);
    const [activeTemplate, setActiveTemplate] = React.useState<TypographyTemplate>(theme === 'core' ? 'corp' : 'metro');

    /**
     * INITIAL LOAD
     * Fetch existing settings from the local API to prevent UI flashing and maintain state across refreshes.
     */
    React.useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch(`/api/theme/settings?theme=${theme}&section=typography`);
                const result = await res.json();
                if (result.success && result.data) {
                    const d = result.data;
                    if (d.primaryFont) setActiveFont(d.primaryFont);
                    if (d.secondaryFont) setSecondaryFont(d.secondaryFont);
                    if (d.tertiaryFont) setTertiaryFont(d.tertiaryFont);

                    setTransforms({
                        primary: (d.primaryTransform as TextTransform) || (baseThemeData.global.primaryTransform as TextTransform) || 'none',
                        secondary: (d.secondaryTransform as TextTransform) || (baseThemeData.global.secondaryTransform as TextTransform) || 'none',
                        tertiary: (d.tertiaryTransform as TextTransform) || (baseThemeData.global.tertiaryTransform as TextTransform) || 'none',
                    });
                } else {
                    // Reset to base if no stored settings found
                    setActiveFont(baseThemeData.global.primaryFont);
                    setSecondaryFont(baseThemeData.global.secondaryFont);
                    setTertiaryFont(baseThemeData.global.tertiaryFont);
                }
            } catch (err) {
                console.error('Failed to load typography settings:', err);
            } finally {
                isLoadedRef.current = true;
                setIsLoaded(true);
            }
        };
        
        // Reset state when theme changes
        setIsLoaded(false);
        isLoadedRef.current = false;
        setActiveFont(undefined);
        setSecondaryFont(undefined);
        setTertiaryFont(undefined);
        
        loadSettings();
    }, [theme, baseThemeData]);

    /**
     * STATE PUBLISHING
     * Sync local state with the central theme context to drive live updates across the application shell.
     */
    const targetTheme = React.useMemo(() => ({
        ...baseThemeData,
        global: {
            ...baseThemeData.global,
            primaryFont: activeFont || baseThemeData.global.primaryFont,
            secondaryFont: secondaryFont || baseThemeData.global.secondaryFont,
            tertiaryFont: tertiaryFont || baseThemeData.global.tertiaryFont,
            primaryTransform: transforms.primary || baseThemeData.global.primaryTransform,
            secondaryTransform: transforms.secondary || baseThemeData.global.secondaryTransform,
            tertiaryTransform: transforms.tertiary || baseThemeData.global.tertiaryTransform,
        }
    }), [baseThemeData, activeFont, secondaryFont, tertiaryFont, transforms]);

    const handleFontChange = (role: 'primary' | 'secondary' | 'tertiary', fontValue: string) => {
        if (role === 'primary') setActiveFont(fontValue);
        else if (role === 'secondary') setSecondaryFont(fontValue);
        else if (role === 'tertiary') setTertiaryFont(fontValue);
    };

    const handleTransformChange = (role: 'primary' | 'secondary' | 'tertiary', transform: 'uppercase' | 'lowercase' | 'capitalize' | 'none') => {
        setTransforms(prev => ({ ...prev, [role]: transform }));
    };

    React.useEffect(() => {
        // Don't override SSR-injected CSS variables until API data is loaded
        if (!isLoadedRef.current) return;
        setTypographyOverrides({
            primaryFont: targetTheme.global.primaryFont,
            primaryTransform: targetTheme.global.primaryTransform,
            secondaryFont: targetTheme.global.secondaryFont,
            secondaryTransform: targetTheme.global.secondaryTransform,
            tertiaryFont: targetTheme.global.tertiaryFont,
            tertiaryTransform: targetTheme.global.tertiaryTransform,
        });
    }, [targetTheme, setTypographyOverrides]);

    const handlePublish = async () => {
        setIsSubmitting(true);
        const typoPayload = {
            primaryFont: targetTheme.global.primaryFont,
            primaryTransform: targetTheme.global.primaryTransform,
            secondaryFont: targetTheme.global.secondaryFont,
            secondaryTransform: targetTheme.global.secondaryTransform,
            tertiaryFont: targetTheme.global.tertiaryFont,
            tertiaryTransform: targetTheme.global.tertiaryTransform,
        };

        try {
            // Write to both stores so every page sees the same typography
            const [settingsRes, publishRes] = await Promise.all([
                // 1. Theme settings (src/themes/METRO/theme.json)
                fetch('/api/theme/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme: theme, section: 'typography', data: typoPayload }),
                }),
                // 2. Typography publish (.zap-settings) — read by ThemeContext on all pages
                fetch('/api/typography/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme: theme, ...typoPayload }),
                }),
            ]);

            if (settingsRes.ok && publishRes.ok) {
                toast.success(`Typography published to ${theme} theme`, {
                    description: `Primary: ${transforms.primary} · Secondary: ${transforms.secondary} · Tertiary: ${transforms.tertiary}`,
                });
            } else {
                const err = !(settingsRes.ok) ? await settingsRes.json() : await publishRes.json();
                toast.error('Failed to publish typography', {
                    description: err.error || 'Unknown error',
                });
            }
        } catch (error) {
            console.error('Failed to publish typography:', error);
            toast.error('Network error', {
                description: 'Could not reach the theme settings API.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoaded) return null;

    return (
        <DebugAuditor
            componentName="Typography"
            tier="L1 TOKEN"
            status="Beta"
            filePath="src/app/debug/metro/typography/page.tsx"
            importPath="@/zap/sections/atoms/typography"
            inspector={
                <Inspector title="Typography Templates" width={320}
                    footer={
                        <ThemePublisher 
                            theme={theme}
                            onPublish={handlePublish}
                            isLoading={isSubmitting}
                            filePath="src/zap/foundations/typography/index.tsx"
                        />
                    }
                >
                    <TypographyInspector
                        activeTemplate={activeTemplate}
                        setActiveTemplate={setActiveTemplate}
                    />
                </Inspector>
            }
        >
            <Canvas className="transition-all duration-300 origin-center flex flex-col pt-0">
                <ThemeHeader
                    title="Typography Architecture"
                    badge="L1-L7 System Font Governance"
                    tabs={TYPOGRAPHY_TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    liveIndicator={true}
                    breadcrumb={`Zap Design Engine / ${theme} / Foundations`}
                />

                <CanvasBody coverTitle={
                    activeTab === 'details' ? 'Font Details'
                        : activeTab === 'preview' ? 'Live Preview'
                            : 'Playground'
                } coverBadge="L2 Cover // Typography">
                    {activeTab === 'details' && (
                        <TypographyBody 
                            themeData={targetTheme}
                            onFontChange={handleFontChange}
                            onTransformChange={handleTransformChange}
                            transforms={transforms}
                        />
                    )}
                    {activeTab === 'preview' && (
                        <div className="flex items-center justify-center h-full min-h-[400px]">
                            <p className="text-on-surface-variant font-bold">Typography Preview Coming Soon...</p>
                        </div>
                    )}
                    {activeTab === 'playground' && (
                        <div className="flex items-center justify-center h-full min-h-[400px]">
                            <p className="text-on-surface-variant font-bold">Typography Playground Coming Soon...</p>
                        </div>
                    )}
                </CanvasBody>
            </Canvas>
        </DebugAuditor>
    );
}
