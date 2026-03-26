'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Wrapper } from '../../../../components/dev/Wrapper';
import { Slider } from '../../../../genesis/atoms/interactive/slider';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { defaultGeometrySettings, GeometrySettings } from './schema';
import { toast } from 'sonner';

interface GeometryBodyProps {
    theme: 'core' | 'metro';
}

export const GeometryBody = ({ theme }: GeometryBodyProps) => {
    const [settings, setSettings] = useState<GeometrySettings>(defaultGeometrySettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch(`/api/geometry/publish?theme=${theme}`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.data && json.data.settings) {
                        setSettings({ ...defaultGeometrySettings, ...json.data.settings });
                    }
                }
            } catch (error) {
                console.error('Failed to load geometry settings', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSettings();
    }, [theme]);

    const updateSetting = (key: keyof GeometrySettings, value: number) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const generateCss = useCallback(() => {
        return `:root[data-theme="${theme}"] {
    /* Cards */
    --radius-card: ${settings.cardRadius}px;
    --card-border-width: ${settings.cardBorderWidth}px;
    --card-max-width: ${settings.cardMaxWidth}px;
    
    /* Spacing */
    --spacing-card-pad: ${settings.spacingCardPad}px;
    --spacing-form-gap: ${settings.spacingFormGap}px;
    
    /* Inputs */
    --input-height: ${settings.inputHeight}px;
    --radius-input: ${settings.inputRadius}px;
    
    /* Buttons */
    --btn-height: ${settings.buttonHeight}px;
    --btn-height-lg: ${settings.buttonHeightLarge}px;
    --radius-btn: ${settings.buttonRadius}px;
    
    /* Checkboxes */
    --checkbox-size: ${settings.checkboxSize}px;
    --checkbox-radius: ${settings.checkboxRadius}px;
}`;
    }, [settings, theme]);

    useEffect(() => {
        if (!isLoading) {
            const styleId = `zap-geometry-preview-${theme}`;
            let styleTag = document.getElementById(styleId);
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = styleId;
                document.head.appendChild(styleTag);
            }
            styleTag.innerHTML = generateCss();
        }
    }, [settings, generateCss, isLoading, theme]);

    const handlePublish = async () => {
        setIsSaving(true);
        try {
            const cssOutput = generateCss();
            const res = await fetch('/api/geometry/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme, cssOutput, settings })
            });
            const result = await res.json();
            if (res.ok) {
                toast.success('Typography saved successfully!');
            } else {
                toast.error(result.error || 'Failed to save');
            }
        } catch {
            toast.error('Network error during save');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8">Loading geometry settings...</div>;

    const sections = [
        {
            title: "Cards & Containers",
            controls: [
                { label: "Card Radius (--radius-card)", key: "cardRadius", min: 0, max: 48 },
                { label: "Card Border Width (--card-border-width)", key: "cardBorderWidth", min: 0, max: 10 },
                { label: "Card Max Width (--card-max-width)", key: "cardMaxWidth", min: 280, max: 800 },
                { label: "Card Padding (--spacing-card-pad)", key: "spacingCardPad", min: 0, max: 96 },
                { label: "Form Gap (--spacing-form-gap)", key: "spacingFormGap", min: 0, max: 64 },
            ]
        },
        {
            title: "Inputs & Fields",
            controls: [
                { label: "Input Height (--input-height)", key: "inputHeight", min: 24, max: 72 },
                { label: "Input Radius (--radius-input)", key: "inputRadius", min: 0, max: 36 },
            ]
        },
        {
            title: "Buttons",
            controls: [
                { label: "Button Height (--btn-height)", key: "buttonHeight", min: 24, max: 72 },
                { label: "Button Height Large (--btn-height-lg)", key: "buttonHeightLarge", min: 32, max: 96 },
                { label: "Button Radius (--radius-btn)", key: "buttonRadius", min: 0, max: 48 },
            ]
        },
        {
            title: "Checkboxes",
            controls: [
                { label: "Checkbox Size (--checkbox-size)", key: "checkboxSize", min: 12, max: 48 },
                { label: "Checkbox Radius (--checkbox-radius)", key: "checkboxRadius", min: 0, max: 24 },
            ]
        }
    ];

    return (
        <Wrapper
            identity={{
                displayName: "GeometryBody",
                filePath: "zap/sections/atoms/geometry/body.tsx",
                parentComponent: "GeometryPage",
                type: "Organism/Page",
                architecture: "SYSTEMS // CORE"
            }}
        >
            <div className="flex flex-col md:flex-row h-full">
                {/* Left Panel: Controls */}
                <div className="w-full md:w-[400px] border-r border-border bg-layer-panel overflow-y-auto flex flex-col h-[calc(100vh-64px)]">
                    <div className="p-6 space-y-8 flex-1">
                        <div>
                            <h2 className="text-xl font-black uppercase mb-2">Geometry & Sizing</h2>
                            <p className="text-sm text-theme-muted">Manage spatial variables for the {theme.toUpperCase()} theme.</p>
                        </div>

                        {sections.map((section, i) => (
                            <div key={i} className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-base/60 border-b border-border pb-2">{section.title}</h3>
                                {section.controls.map(control => (
                                    <div key={control.key} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-medium text-theme-base">{control.label}</label>
                                            <span className="text-xs font-bold font-dev bg-layer-canvas px-2 py-0.5 rounded border border-border">
                                                {settings[control.key as keyof GeometrySettings]}px
                                            </span>
                                        </div>
                                        <Slider
                                            min={control.min}
                                            max={control.max}
                                            step={1}
                                            value={[settings[control.key as keyof GeometrySettings]]}
                                            onValueChange={([val]: number[]) => updateSetting(control.key as keyof GeometrySettings, val)}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-border bg-layer-cover sticky bottom-0">
                        <Button 
                            onClick={handlePublish} 
                            disabled={isSaving}
                            className="w-full font-bold uppercase"
                        >
                            {isSaving ? "Publishing..." : `Publish ${theme.toUpperCase()} Dimensions`}
                        </Button>
                    </div>
                </div>

                {/* Right Panel: Preview */}
                <div className="flex-1 bg-layer-canvas overflow-y-auto p-12 flex justify-center items-start">
                    <div className="w-full max-w-[var(--card-max-width)]">
                        <Wrapper identity={{ displayName: "Preview Shell", type: "Wrapped Snippet", filePath: "zap/sections/atoms/geometry/body.tsx" }}>
                            <div 
                                className="bg-layer-cover border-card-border shadow-card flex flex-col rounded-[var(--radius-card)] border-[length:var(--card-border-width)] p-[var(--spacing-card-pad)]"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-brand-midnight">Preview Sign In</h3>
                                    <p className="text-sm text-theme-muted mt-2">Observe real-time geometry changes.</p>
                                </div>

                                <div className="flex flex-col gap-[var(--spacing-form-gap)]">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase text-theme-base">Email</label>
                                        <input 
                                            disabled 
                                            placeholder="admin@zap.dev"
                                            className="w-full border border-input-border bg-layer-canvas px-3 text-sm h-[var(--input-height)] rounded-[var(--radius-input)]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase text-theme-base">Password</label>
                                        <input 
                                            disabled 
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full border border-input-border bg-layer-canvas px-3 text-sm h-[var(--input-height)] rounded-[var(--radius-input)]"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="border border-input-border bg-layer-canvas shrink-0 w-[var(--checkbox-size)] h-[var(--checkbox-size)] rounded-[var(--checkbox-radius)]"
                                        />
                                        <span className="text-xs font-medium text-theme-base">Remember Me</span>
                                    </div>

                                    <button 
                                        className="w-full bg-brand-midnight text-white font-bold uppercase tracking-wider hover:bg-brand-midnight/90 transition-colors h-[var(--btn-height-lg)] rounded-[var(--radius-btn)]"
                                    >
                                        Sign In Now
                                    </button>
                                </div>
                            </div>
                        </Wrapper>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};
