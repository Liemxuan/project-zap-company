'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { Label } from '../../../../../genesis/atoms/interactive/label';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Select as ZapSelect } from '../../../../../genesis/atoms/interactive/option-select';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { toast } from 'sonner';

export default function SwitchSandbox() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';

    // Dynamic Properties State
    const [width, setWidth] = useState([44]);
    const [height, setHeight] = useState([24]);
    const [thumbSize, setThumbSize] = useState([20]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // L1 Border Properties
    const {
        state,
        setComponentOverride,
        clearComponentOverride,
        hydrateState,
        getEffectiveProps
    } = useBorderProperties();

    // Hydrate L1 border state on mount
    useEffect(() => {
        let mounted = true;
        const loadSettings = async () => {
            try {
                const res = await fetch(`/api/border_radius/publish?theme=${activeTheme}`);
                if (res.ok && mounted) {
                    const data = await res.json();
                    if (data.success && data.data && data.data.state) {
                        hydrateState(data.data.state);
                    }
                }
            } catch (err) {
                console.error("Failed to load border radius settings:", err);
            }
        };
        loadSettings();
        return () => { mounted = false; };
    }, [activeTheme, hydrateState]);

    // Compute effective values from L1
    const effectiveProps = getEffectiveProps('Switch');
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '9999px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '0px';

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--switch-track-width']) setWidth([parseCssToNumber(variables['--switch-track-width'])]);
        if (variables['--switch-track-height']) setHeight([parseCssToNumber(variables['--switch-track-height'])]);
        if (variables['--switch-thumb-size']) setThumbSize([parseCssToNumber(variables['--switch-thumb-size'])]);
    };

    // Dual-publish handler
    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            // 1. Publish component-specific variables
            const res1 = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme: activeTheme,
                    variables: {
                        '--switch-track-width': `${width[0]}px`,
                        '--switch-track-height': `${height[0]}px`,
                        '--switch-thumb-size': `${thumbSize[0]}px`
                    }
                })
            });

            // 2. Publish global border radius state (links back to L1)
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res1.ok && res2.ok) {
                toast.success(`Published Switch variables to ${activeTheme}`);
            } else {
                toast.error('Failed to publish');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error during publish');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Token selector renderers
    const renderRadiusSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...BORDER_RADIUS_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <ZapSelect
                value={safeValue}
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const renderWidthSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...BORDER_WIDTH_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <ZapSelect
                value={safeValue}
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };
        
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/switch/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Switch Structural Settings", type: "Docs Link", filePath: "zap/atoms/switch/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--switch-track-width</span>
                                    <span className="font-bold">{width[0]}px</span>
                                </div>
                                <Slider value={width} onValueChange={setWidth} min={30} max={80} step={2} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--switch-track-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={16} max={40} step={2} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--switch-thumb-size</span>
                                    <span className="font-bold">{thumbSize[0]}px</span>
                                </div>
                                <Slider value={thumbSize} onValueChange={setThumbSize} min={12} max={36} step={2} className="w-full" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/50">
                            {/* Border Width — L1 token selector */}
                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Switch']?.width || '',
                                    (val) => {
                                        if (val === '') clearComponentOverride('Switch', 'width');
                                        else setComponentOverride('Switch', 'width', val);
                                    }
                                )}
                            </div>

                            {/* Border Radius — L1 token selector */}
                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Switch']?.radius || '',
                                    (val) => {
                                        if (val === '') clearComponentOverride('Switch', 'radius');
                                        else setComponentOverride('Switch', 'radius', val);
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    return (
        <ComponentSandboxTemplate
            componentName="Switch"
            tier="L3 ATOM"
            status="Beta"
            importPath="@/genesis/atoms/interactive/switch"
            filePath="src/genesis/atoms/interactive/switch.tsx"
            inspectorControls={inspectorControls}
            inspectorFooter={
                <ThemePublisher
                    theme={activeTheme}
                    filePath="src/genesis/atoms/interactive/switch.tsx"
                    onPublish={handlePublish}
                    isLoading={isSubmitting}
                />
            }
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "N/A",
                mobile: "N/A"
            }}
            foundationRules={[
                "CSS var driven: --switch-track-width, --switch-track-height, --switch-thumb-size",
                "Border radius & width inherit from L1 Universal via useBorderProperties",
                "Dual-publish: component vars to theme + border state to L1 registry"
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .switch-preview-sandbox {
                    --switch-track-width: ${width[0]}px;
                    --switch-track-height: ${height[0]}px;
                    --switch-thumb-size: ${thumbSize[0]}px;
                    --switch-border-radius: ${previewRadius};
                    --switch-border-width: ${previewWidth};
                }
            ` }} />
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 switch-preview-sandbox"
            >
                <div className="w-full flex flex-col items-center justify-center p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-[length:var(--card-border-radius,12px)] min-h-[400px]">
                    <div className="w-full max-w-md bg-layer-dialog border border-outline-variant rounded-[length:var(--card-border-radius,12px)] shadow-xl overflow-hidden flex flex-col">
                        
                        <div className="p-6 border-b border-border/40">
                            <h2 className="text-title-small font-semibold text-transform-primary mb-1">Network Settings</h2>
                            <p className="text-body-small text-muted-foreground font-body leading-relaxed">
                                Toggle system connectivity modes.
                            </p>
                        </div>

                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="airplane-mode" className="text-body-small font-medium text-transform-secondary cursor-pointer">Airplane Mode</Label>
                                <Switch id="airplane-mode" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
