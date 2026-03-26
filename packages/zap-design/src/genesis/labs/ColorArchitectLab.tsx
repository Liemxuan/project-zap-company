'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { LaboratoryTemplate } from '../../zap/templates/LaboratoryTemplate';
import { ThemeHeader } from '../../genesis/molecules/layout/ThemeHeader';
import { ColorInspectorPanel } from '../../zap/organisms/color_factory/ColorInspectorPanel';
import { DevicePreviewStage } from '../../zap/organisms/color_factory/DevicePreviewStage';
import { ThemePublisher } from '../../components/dev/ThemePublisher';
import { PaletteGridStage } from '../../zap/organisms/color_factory/PaletteGridStage';
import {
    Hct,
    TonalPalette,
    argbFromHex,
    hexFromArgb,
    SchemeTonalSpot,
    SchemeNeutral,
    SchemeVibrant,
    SchemeExpressive,
    SchemeRainbow,
    SchemeFruitSalad,
    SchemeMonochrome,
    SchemeFidelity,
    SchemeContent,
} from "@material/material-color-utilities";


export default function ColorArchitectLab() {

    // 1. PAGE LEVEL STATE
    const [seedColor, setSeedColor] = useState('#576500');
    const [seedImage, setSeedImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('preview');
    const [schemeVariant, setSchemeVariant] = useState('TonalSpot');
    const [customOverrides, setCustomOverrides] = useState<Record<string, string>>({
        secondary: '',
        tertiary: '',
        error: '',
        neutral: '',
        neutralVariant: ''
    });

    // 2. M3 LOGIC & THEME GENERATION
    const { lightScheme, darkScheme, palettes } = useMemo(() => {
        let argb;
        try { argb = argbFromHex(seedColor); } catch { argb = argbFromHex('#FF68A5'); }

        const hct = Hct.fromInt(argb);

        const schemeMap: Record<string, typeof SchemeTonalSpot> = {
            'TonalSpot': SchemeTonalSpot,
            'Neutral': SchemeNeutral,
            'Vibrant': SchemeVibrant,
            'Expressive': SchemeExpressive,
            'Rainbow': SchemeRainbow,
            'FruitSalad': SchemeFruitSalad,
            'Monochrome': SchemeMonochrome,
            'Fidelity': SchemeFidelity,
            'Content': SchemeContent,
        };

        const SchemeClass = schemeMap[schemeVariant] || SchemeTonalSpot;
        const contrast = 0.0;

        const schemeLight = new SchemeClass(hct, false, contrast);
        const schemeDark = new SchemeClass(hct, true, contrast);

        const palettes: Record<string, TonalPalette> = {
            primary: schemeLight.primaryPalette,
            secondary: schemeLight.secondaryPalette,
            tertiary: schemeLight.tertiaryPalette,
            error: schemeLight.errorPalette,
            neutral: schemeLight.neutralPalette,
            neutralVariant: schemeLight.neutralVariantPalette
        };

        // Process custom overrides
        if (customOverrides) {
            Object.keys(customOverrides).forEach((paletteKey) => {
                const hex = customOverrides[paletteKey];
                if (hex && /^#[0-9A-F]{6}$/i.test(hex)) {
                    try {
                        const customPalette = TonalPalette.fromInt(argbFromHex(hex));
                        palettes[paletteKey] = customPalette;

                        // Inject the custom palette into both light and dark schemes
                        (schemeLight as unknown as Record<string, unknown>)[`${paletteKey}Palette`] = customPalette;
                        (schemeDark as unknown as Record<string, unknown>)[`${paletteKey}Palette`] = customPalette;
                    } catch (e) {
                        console.error(`Invalid custom override hex for ${paletteKey}:`, hex, e);
                    }
                }
            });
        }

        return { lightScheme: schemeLight, darkScheme: schemeDark, palettes };
    }, [seedColor, schemeVariant, customOverrides]);

    // Inject M3 CSS Variables dynamically to power the Tailwind previews
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const generateCssVars = (scheme: any) => {
            const m3Colors = {
                primary: hexFromArgb(scheme.primary),
                "on-primary": hexFromArgb(scheme.onPrimary),
                "primary-container": hexFromArgb(scheme.primaryContainer),
                "on-primary-container": hexFromArgb(scheme.onPrimaryContainer),

                secondary: hexFromArgb(scheme.secondary),
                "on-secondary": hexFromArgb(scheme.onSecondary),
                "secondary-container": hexFromArgb(scheme.secondaryContainer),
                "on-secondary-container": hexFromArgb(scheme.onSecondaryContainer),

                tertiary: hexFromArgb(scheme.tertiary),
                "on-tertiary": hexFromArgb(scheme.onTertiary),
                "tertiary-container": hexFromArgb(scheme.tertiaryContainer),
                "on-tertiary-container": hexFromArgb(scheme.onTertiaryContainer),

                error: hexFromArgb(scheme.error),
                "on-error": hexFromArgb(scheme.onError),
                "error-container": hexFromArgb(scheme.errorContainer),
                "on-error-container": hexFromArgb(scheme.onErrorContainer),

                background: hexFromArgb(scheme.background),
                "on-background": hexFromArgb(scheme.onBackground),

                surface: hexFromArgb(scheme.surface),
                "surface-dim": hexFromArgb(scheme.surfaceDim),
                "surface-bright": hexFromArgb(scheme.surfaceBright),
                "surface-container-lowest": hexFromArgb(scheme.surfaceContainerLowest),
                "surface-container-low": hexFromArgb(scheme.surfaceContainerLow),
                "surface-container": hexFromArgb(scheme.surfaceContainer),
                "surface-container-high": hexFromArgb(scheme.surfaceContainerHigh),
                "surface-container-highest": hexFromArgb(scheme.surfaceContainerHighest),
                "on-surface": hexFromArgb(scheme.onSurface),
                "surface-variant": hexFromArgb(scheme.surfaceVariant),
                "on-surface-variant": hexFromArgb(scheme.onSurfaceVariant),

                "inverse-surface": hexFromArgb(scheme.inverseSurface),
                "inverse-on-surface": hexFromArgb(scheme.inverseOnSurface),
                "inverse-primary": hexFromArgb(scheme.inversePrimary),

                outline: hexFromArgb(scheme.outline),
                "outline-variant": hexFromArgb(scheme.outlineVariant),

                shadow: hexFromArgb(scheme.shadow),
                scrim: hexFromArgb(scheme.scrim),
            };

            let css = '';
            for (const [key, val] of Object.entries(m3Colors)) {
                css += `    --md-sys-color-${key}: ${val};\n`;
            }
            return css;
        };

        const cssOutput = `
            :root, [data-zap-theme="metro"] {
${generateCssVars(lightScheme)}
            }
            .dark, [data-theme="dark"] {
${generateCssVars(darkScheme)}
            }
        `;

        let styleTag = document.getElementById('m3-dynamic-theme');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'm3-dynamic-theme';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = cssOutput;
    }, [lightScheme, darkScheme, palettes]);

    const handlePublish = async () => {
        const styleTag = document.getElementById('m3-dynamic-theme');
        const cssOutput = styleTag ? styleTag.innerHTML : '';
        
        try {
            const res = await fetch('/api/colors/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme: 'metro',
                    cssOutput: cssOutput,
                    colors: {
                        seedColor,
                        schemeVariant,
                        customOverrides
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Colors saved! Seed: ${seedColor} (${schemeVariant})`);
            } else {
                alert("Failed to save color settings: " + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error("Error saving colors:", err);
            alert("Network error saving colors.");
        }
    };

    return (
        <LaboratoryTemplate
            componentName="Color Goal Factory"
            tier="L1 TEMPLATE TEST"
            filePath="src/app/design/metro/color_goal/page.tsx"
            headerMode={
                <ThemeHeader
                    title={activeTab === 'preview' ? 'Preview Mockup' : 'Color Matrices'}
                    breadcrumb="L1 FOUNDATION / COLOR / HUB"
                    badge="Experimental Page Build"
                    tabs={[{ id: 'preview', label: 'PREVIEW' }, { id: 'colors', label: 'COLORS' }]}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    liveIndicator={true}
                />
            }
            inspectorConfig={{
                title: "Color Architect",
                width: 380,
                footer: (
                    <ThemePublisher 
                        theme="metro"
                        onPublish={handlePublish}
                        filePath="src/genesis/labs/ColorArchitectLab.tsx"
                        buttonProps={{ visualStyle: 'solid', color: 'destructive' }}
                    />
                ),
                content: (
                    <ColorInspectorPanel 
                        seedColor={seedColor}
                        setSeedColor={setSeedColor}
                        seedImage={seedImage}
                        setSeedImage={setSeedImage}
                        customOverrides={customOverrides}
                        setCustomOverrides={setCustomOverrides}
                        schemeVariant={schemeVariant}
                        setSchemeVariant={setSchemeVariant}
                        lightScheme={lightScheme}
                        palettes={palettes}
                    />
                )
            }}
        >
            <div className="p-8 w-full max-w-[1240px] mx-auto min-h-full">
                {activeTab === 'preview' && (
                    <div className="w-full mt-10">
                        <DevicePreviewStage scheme={lightScheme} />
                    </div>
                )}
                {activeTab === 'colors' && (
                    <PaletteGridStage lightScheme={lightScheme} darkScheme={darkScheme} palettes={palettes} />
                )}
            </div>
        </LaboratoryTemplate>
    );
}
