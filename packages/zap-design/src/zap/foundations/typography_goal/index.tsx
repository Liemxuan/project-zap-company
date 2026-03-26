'use client';

import React, { useState } from 'react';
import { LaboratoryTemplate } from '../../../zap/templates/LaboratoryTemplate';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { useTheme } from '../../../components/ThemeContext';
import { useParams } from 'next/navigation';
import { TerminalIcon } from 'lucide-react';

import { FontInspectorPanel } from '../../../zap/organisms/typography_factory/FontInspectorPanel';
import { TypographyCanvasStage } from '../../../zap/organisms/typography_factory/TypographyCanvasStage';
import { TypographyTokenStage } from '../../../zap/organisms/typography_factory/TypographyTokenStage';
import { TypographyPlaygroundStage } from '../../../zap/organisms/typography_factory/TypographyPlaygroundStage';

import { basicThemeData, corpThemeData, funThemeData, wildThemeData, metroThemeData } from '../../../zap/sections/atoms/typography/schema';
import type { TypographyTemplate } from '../../../zap/sections/atoms/typography/inspector';

const TYPOGRAPHY_TABS = [
    { id: 'preview', label: 'LIVE PREVIEW' },
    { id: 'details', label: 'FONT DETAILS' },
    { id: 'playground', label: 'PLAYGROUND' },
];

export default function TypographyGoalPage() {
    const params = useParams();
    const themeId = (params?.theme as string) || 'metro';
    const [activeTemplate, setActiveTemplate] = useState<TypographyTemplate>('metro');
    const [activeTab, setActiveTab] = useState<string>('playground');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Extracted state for transformations
    const [activeFont, setActiveFont] = useState<string | undefined>(undefined);
    const [secondaryFont, setSecondaryFont] = useState<string | undefined>(undefined);
    const [tertiaryFont, setTertiaryFont] = useState<string | undefined>(undefined);
    const [transforms, setTransforms] = React.useState<Record<'primary' | 'secondary' | 'tertiary', 'uppercase' | 'lowercase' | 'capitalize' | 'none' | undefined>>({
        primary: undefined,
        secondary: undefined,
        tertiary: undefined,
    });

    const [isLoaded, setIsLoaded] = useState(false);
    const { setTypographyOverrides } = useTheme();

    React.useEffect(() => {
        const loadInitialSettings = async () => {
            try {
                const res = await fetch(`/api/typography/publish?theme=${themeId}`);
                const result = await res.json();
                if (result.success && result.data) {
                    if (result.data.primaryFont) setActiveFont(result.data.primaryFont);
                    if (result.data.secondaryFont) setSecondaryFont(result.data.secondaryFont);
                    if (result.data.tertiaryFont) setTertiaryFont(result.data.tertiaryFont);
                    if (result.data.secondaryTransform || result.data.tertiaryTransform) {
                        setTransforms(prev => ({
                            ...prev,
                            primary: result.data.primaryTransform || prev.primary,
                            secondary: result.data.secondaryTransform || prev.secondary,
                            tertiary: result.data.tertiaryTransform || prev.tertiary,
                        }));
                    }
                }
            } catch (err) {
                console.error("Failed to load existing typography settings:", err);
            } finally {
                setIsLoaded(true);
            }
        };

        if (!isLoaded) {
            loadInitialSettings();
        }
    }, [isLoaded, themeId]);

    const getThemeData = (template: TypographyTemplate) => {
        switch (template) {
            case 'corp': return corpThemeData;
            case 'fun': return funThemeData;
            case 'wild': return wildThemeData;
            case 'metro': return metroThemeData;
            case 'basic':
            default: return basicThemeData;
        }
    };

    const baseTheme = getThemeData(activeTemplate);

    const targetTheme = React.useMemo(() => ({
        ...baseTheme,
        global: {
            ...baseTheme.global,
            primaryTransform: transforms?.primary ?? baseTheme.global.primaryTransform,
            secondaryTransform: transforms?.secondary ?? baseTheme.global.secondaryTransform,
            tertiaryTransform: transforms?.tertiary ?? baseTheme.global.tertiaryTransform,
            primaryFont: activeFont || baseTheme.global.primaryFont,
            secondaryFont: secondaryFont || baseTheme.global.secondaryFont,
            tertiaryFont: tertiaryFont || baseTheme.global.tertiaryFont,
        }
    }), [baseTheme, transforms, activeFont, secondaryFont, tertiaryFont]);

    React.useEffect(() => {
        setTypographyOverrides({
            primaryFont: targetTheme.global.primaryFont,
            primaryTransform: targetTheme.global.primaryTransform,
            secondaryFont: targetTheme.global.secondaryFont,
            secondaryTransform: targetTheme.global.secondaryTransform,
            tertiaryFont: targetTheme.global.tertiaryFont,
            tertiaryTransform: targetTheme.global.tertiaryTransform,
        });
    }, [targetTheme, setTypographyOverrides]);

    const handleFontChange = (role: 'primary' | 'secondary' | 'tertiary', fontValue: string) => {
        if (role === 'primary') setActiveFont(fontValue);
        else if (role === 'secondary') setSecondaryFont(fontValue);
        else if (role === 'tertiary') setTertiaryFont(fontValue);
    };

    const handleTransformChange = (role: 'primary' | 'secondary' | 'tertiary', transform: 'uppercase' | 'lowercase' | 'capitalize' | 'none') => {
        setTransforms(prev => ({ ...prev, [role]: transform }));
    };

    const handlePublish = async () => {
        setIsSubmitting(true);
        console.log("Publishing global typography settings:", targetTheme.global);
        try {
            const res = await fetch('/api/typography/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme: themeId,
                    primaryFont: targetTheme.global.primaryFont,
                    primaryTransform: targetTheme.global.primaryTransform,
                    secondaryFont: targetTheme.global.secondaryFont,
                    secondaryTransform: targetTheme.global.secondaryTransform,
                    tertiaryFont: targetTheme.global.tertiaryFont,
                    tertiaryTransform: targetTheme.global.tertiaryTransform,
                })
            });

            const data = await res.json();
            if (data.success) {
                alert(`Typography saved! Primary: ${targetTheme.global.primaryFont} (${targetTheme.global.primaryTransform})`);
            } else {
                alert("Failed to save typography settings: " + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error("Error saving typography:", err);
            alert("Network error saving typography.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LaboratoryTemplate
            componentName="Typography Factory"
            tier="L1 TEMPLATE TEST"
            filePath="src/app/design/metro/typography_goal/page.tsx"
            headerMode={
                <ThemeHeader
                    title={
                        activeTab === 'preview' ? (activeTemplate === 'fun' ? 'Fun Mode' : 'Live Preview')
                            : activeTab === 'details' ? 'Font Details' : 'Playground'
                    }
                    badge={
                        activeTab === 'preview' ? 'Experimental Typography Preview'
                            : activeTab === 'details' ? 'Foundational Type System (Level 1)'
                                : 'Stylization Lab'
                    }
                    breadcrumb={`Zap Design Engine / ${themeId} / Foundations`}
                    tabs={TYPOGRAPHY_TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    liveIndicator={activeTab === 'preview'}
                />
            }
            inspectorConfig={{
                title: "Typography",
                width: 340,
                footer: (
                    <div className="space-y-3">
                        <button
                            onClick={handlePublish}
                            disabled={isSubmitting}
                            className={`group relative w-full overflow-hidden rounded bg-primary p-3 shadow-lg transition-all ${isSubmitting ? 'opacity-80 cursor-wait' : 'hover:translate-y-[-2px] active:translate-y-0 hover:shadow-primary/20'}`}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                <TerminalIcon className="w-4 h-4 text-on-primary" />
                                <span className="font-black text-on-primary tracking-widest text-[11px] uppercase">
                                    {isSubmitting ? "Publishing..." : `Publish to ${themeId} Theme`}
                                </span>
                            </div>
                            {!isSubmitting && <div className="absolute inset-0 translate-y-[100%] bg-on-primary/10 transition-transform group-hover:translate-y-0" />}
                        </button>
                    </div>
                ),
                content: (
                    <FontInspectorPanel
                        activeTemplate={activeTemplate}
                        setActiveTemplate={setActiveTemplate}
                    />
                )
            }}
        >
            <div className="w-full mx-auto md:p-8 flex flex-col gap-8">
                {activeTab === 'preview' && (
                    <TypographyCanvasStage themeData={targetTheme} />
                )}
                {activeTab === 'details' && (
                    <TypographyTokenStage
                        themeData={targetTheme}
                        onFontChange={handleFontChange}
                        onTransformChange={handleTransformChange}
                        transforms={transforms}
                    />
                )}
                {activeTab === 'playground' && (
                    <TypographyPlaygroundStage
                        key={activeTemplate}
                        initialTheme={targetTheme}
                    />
                )}
            </div>
        </LaboratoryTemplate>
    );
}
