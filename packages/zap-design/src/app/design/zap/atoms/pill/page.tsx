
'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Pill } from '../../../../../genesis/atoms/status/pills';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { Select } from '../../../../../genesis/atoms/interactive/option-select';
import { toast } from 'sonner';

export default function PillSandboxPage() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const [height, setHeight] = useState([24]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [colors, setColors] = useState({
        neutral: '',
        primary: '',
        success: '',
        warning: '',
        error: '',
        info: ''
    });

    const {
        state,
        setComponentOverride,
        clearComponentOverride,
        hydrateState,
        getEffectiveProps
    } = useBorderProperties();

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

    // Live preview values
    const effectiveProps = getEffectiveProps('Pill');
    
    // Extract pixel values from schema tokens to feed into inline styles for instant preview
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '9999px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '0px';

    const renderRadiusSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...BORDER_RADIUS_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <Select 
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
            <Select 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/pill/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Pill Structural Settings", type: "Docs Link", filePath: "zap/atoms/pill/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--pill-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={16} max={128} step={1} className="w-full" />
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Pill']?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Pill', 'width');
                                        else setComponentOverride('Pill', 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Pill']?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Pill', 'radius');
                                        else setComponentOverride('Pill', 'radius', val);
                                    }
                                )}
                            </div>

                            {Object.entries(colors).map(([variant, color]) => (
                                <div key={variant} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                        <span>--color-{variant}</span>
                                        <span className="font-bold">{color || 'Default'}</span>
                                    </div>
                                    <input 
                                        type="color" 
                                        value={color || `#${'000000'}`} 
                                        onChange={(e) => setColors(prev => ({ ...prev, [variant]: e.target.value }))}
                                        className="w-full h-8"
                                        aria-label={`Color for ${variant}`}
                                        title={`Color for ${variant}`}
                                    />
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => setColors(prev => ({ ...prev, [variant]: '' }))}
                                            className="text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase font-bold"
                                        >
                                            Reset {variant}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

            const handleLoadedVariables = React.useCallback((variables: Record<string, string>) => {
                if (variables['--pill-height']) setHeight([parseCssToNumber(variables['--pill-height'])]);
            }, []);
            
            const handlePublish = async () => {
                setIsSubmitting(true);
                try {
                    // Publish specific height
                    const res1 = await fetch('/api/theme/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: activeTheme, variables: { '--pill-height': height[0] + 'px' }})
                    });

                    // Publish border radius globally
                    const res2 = await fetch('/api/border_radius/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: activeTheme, state })
                    });

                    if (res1.ok && res2.ok) {
                        toast.success(`Pill Settings Published`, { description: `Successfully synced values to the ${activeTheme} theme.` });
                    } else {
                        throw new Error("Failed to publish one or more services");
                    }
                } catch (error) {
                    console.error("Publish Error:", error);
                    toast.error(`Publish Failed`, { description: `Failed to sync values.` });
                } finally {
                    setIsSubmitting(false);
                }
            };

            const inspectorFooter = (
                <ThemePublisher
                    theme={activeTheme}
                    onPublish={handlePublish}
                    isLoading={isSubmitting}
                    filePath={`app/design/zap/atoms/pill/page.tsx`}
                />
            );
        
    return (
        <ComponentSandboxTemplate
            componentName="Pill"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/genesis/atoms/status/pills.tsx"
            importPath="@/genesis/atoms/status/pills"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "N/A",
                mobile: "N/A"
            }}
            foundationRules={[
                "Arbitrary Token Syntax Only."
            ]}
            inspectorFooter={inspectorFooter}
            onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .pill-preview-sandbox {
                    --pill-border-width: ${previewWidth};
                    --pill-border-radius: ${previewRadius};
                    --pill-height: ${height[0]}px;
                    ${colors.primary ? `--md-sys-color-primary: ${colors.primary};` : ''}
                    ${colors.success ? `--color-state-success: ${colors.success};` : ''}
                    ${colors.warning ? `--color-state-warning: ${colors.warning};` : ''}
                    ${colors.error ? `--color-state-error: ${colors.error};` : ''}
                    ${colors.info ? `--color-state-info: ${colors.info};` : ''}
                    ${colors.neutral ? `
                        --color-layer-panel: ${colors.neutral};
                        --color-theme-base: ${colors.neutral};
                        --color-card-border: ${colors.neutral};
                    ` : ''}
                }
            ` }} />
            <div 
                id="pill-sandbox-container"
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 pill-preview-sandbox"
            >
                <div className="p-12 bg-layer-panel shadow-sm border-[length:var(--card-border-width)] border-outline-variant rounded-[length:var(--card-radius)] flex flex-wrap gap-4 items-center justify-center text-on-surface w-full min-h-[160px]">
                   <div className="flex flex-wrap gap-4 justify-center">
                       <Pill variant="neutral">Neutral</Pill>
                       <Pill variant="primary">Primary</Pill>
                       <Pill variant="success">Success</Pill>
                       <Pill variant="warning">Warning</Pill>
                       <Pill variant="error">Error</Pill>
                       <Pill variant="info">Info</Pill>
                   </div>
                   <div className="mt-8 flex flex-col items-center">
                       <span className="font-display font-medium">Pill Sandbox Mounted (M3 Token Verification)</span>
                       <span className="text-xs font-mono">Dynamically mapped to Global Theme (Border: {previewWidth}, Radius: {previewRadius})</span>
                   </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}

