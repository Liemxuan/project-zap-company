'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Textarea } from '../../../../../genesis/atoms/interactive/textarea';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Select as ZapSelect } from '../../../../../genesis/atoms/interactive/option-select';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, ZAP_LAYER_MAP } from '../../../../../zap/sections/atoms/foundations/schema';
import { toast } from 'sonner';

export default function TextareaSandbox() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';

    // Local sandbox state
    const [minHeight, setMinHeight] = useState([80]);
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
    const effectiveProps = getEffectiveProps('Textarea');
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '8px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '1px';

    const previewBgLayer = state.components['Textarea']?.bg || '';
    const previewBgTokenDef = ZAP_LAYER_MAP.find(L => L.zapToken === previewBgLayer);
    const previewBgCssVar = previewBgTokenDef 
        ? `var(--color-${previewBgTokenDef.m3Token.replace('bg-', '')})` 
        : 'var(--color-surface-container-highest)';

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

    const renderBgSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(L4 Default)', value: 'inherit' },
            ...ZAP_LAYER_MAP.map(L => ({ label: `${L.zapLayer} (${L.zapToken})`, value: L.zapToken }))
        ];
        return (
            <ZapSelect 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(L4 Default)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
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
                    variables: { '--textarea-min-height': `${minHeight[0]}px` }
                })
            });

            // 2. Publish global border radius state (links back to L1)
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res1.ok && res2.ok) {
                toast.success(`Published Textarea to ${activeTheme}`);
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

    const handleLoadedVariables = React.useCallback((variables: Record<string, string>) => {
        if (variables['--textarea-min-height']) setMinHeight([parseCssToNumber(variables['--textarea-min-height'])]);
    }, []);

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/textarea/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Textarea Structural Settings", type: "Docs Link", filePath: "zap/atoms/textarea/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            {/* Min Height — local sandbox slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--textarea-min-height</span>
                                    <span className="font-bold">{minHeight[0]}px</span>
                                </div>
                                <Slider value={minHeight} onValueChange={setMinHeight} min={40} max={300} step={10} className="w-full" />
                            </div>

                            {/* Border Width — L1 token selector */}
                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Textarea']?.width || '',
                                    (val) => {
                                        if (val === '') clearComponentOverride('Textarea', 'width');
                                        else setComponentOverride('Textarea', 'width', val);
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
                                    state.components['Textarea']?.radius || '',
                                    (val) => {
                                        if (val === '') clearComponentOverride('Textarea', 'radius');
                                        else setComponentOverride('Textarea', 'radius', val);
                                    }
                                )}
                            </div>

                            {/* Color / Layer — L1 token selector */}
                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Color / Layer</span>
                                    <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-2 max-w-[120px]">{previewBgTokenDef ? previewBgTokenDef.zapLayer : 'L4 Default'}</span>
                                </span>
                                {renderBgSelect(
                                    state.components['Textarea']?.bg || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Textarea', 'bg');
                                        else setComponentOverride('Textarea', 'bg', val);
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
            componentName="Textarea"
            tier="L3 ATOM"
            status="Verified"
            importPath="@/genesis/atoms/interactive/textarea"
            filePath="src/genesis/atoms/interactive/textarea.tsx"
            inspectorControls={inspectorControls}
            inspectorFooter={
                <ThemePublisher
                    theme={activeTheme}
                    filePath="src/genesis/atoms/interactive/textarea.tsx"
                    onPublish={handlePublish}
                    isLoading={isSubmitting}
                />
            }
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', 'bg-layer-dialog', 'border-outline-variant'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Supported",
                mobile: "Touch Supported"
            }}
            foundationRules={[
                "CSS var driven: --textarea-min-height, --textarea-border-radius, --textarea-border-width",
                "Border radius & width inherit from L1 Universal via useBorderProperties",
                "Dual-publish: component vars to theme + border state to L1 registry"
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .textarea-preview-sandbox {
                    --textarea-min-height: ${minHeight[0]}px;
                    --textarea-border-radius: ${previewRadius};
                    --textarea-border-width: ${previewWidth};
                    --textarea-bg: ${previewBgCssVar};
                }
            ` }} />
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 textarea-preview-sandbox"
            >
                <div className="w-full flex flex-col items-center justify-center p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-[length:var(--card-border-radius,12px)] min-h-[400px]">
                    <div className="w-full max-w-md bg-layer-dialog border border-outline-variant rounded-[length:var(--card-border-radius,12px)] shadow-xl overflow-hidden flex flex-col">
                        
                        <div className="p-6 border-b border-border/40">
                            <h2 className="text-title-small font-semibold text-transform-primary mb-1">System Prompt</h2>
                            <p className="text-body-small text-muted-foreground font-body leading-relaxed">
                                Configure the base behavior of the underlying assistant model.
                            </p>
                        </div>

                        <div className="p-6 flex flex-col gap-4 bg-layer-surface/30">
                            <div className="w-full flex items-center justify-center">
                                <Textarea
                                    placeholder="You are a helpful coding assistant..."
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
