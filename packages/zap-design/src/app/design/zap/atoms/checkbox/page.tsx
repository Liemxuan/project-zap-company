'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Checkbox } from '../../../../../genesis/atoms/interactive/checkbox';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { Select } from '../../../../../genesis/atoms/interactive/option-select';
import { toast } from 'sonner';

export default function CheckboxSandboxPage() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    
    const [disabled, setDisabled] = useState(false);
    const [size, setSize] = useState([16]);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const effectiveProps = getEffectiveProps('Checkbox');
    
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '12px';
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
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/checkbox/page.tsx" }}>
            <div className="space-y-4">

                {/* Structure Theme Section */}
                <Wrapper identity={{ displayName: "Checkbox Structural Settings", type: "Docs Link", filePath: "zap/atoms/checkbox/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--checkbox-size</span>
                                    <span className="font-bold">{size[0]}px</span>
                                </div>
                                <Slider value={size} onValueChange={setSize} min={12} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Checkbox']?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Checkbox', 'width');
                                        else setComponentOverride('Checkbox', 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Checkbox']?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Checkbox', 'radius');
                                        else setComponentOverride('Checkbox', 'radius', val);
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </Wrapper>

                <Wrapper identity={{ displayName: "Disabled State Toggle Row", type: "Control Row", filePath: "zap/atoms/checkbox/page.tsx" }}>
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-[11px] font-bold font-display text-transform-primary text-muted-foreground">Disabled State</span>
                        <Switch size="sm" checked={disabled} onCheckedChange={setDisabled} />
                    </div>
                </Wrapper>

                <Wrapper identity={{ displayName: "Architecture Docs Section", type: "Docs Link", filePath: "zap/atoms/checkbox/page.tsx" }}>
                    <div className="pt-4 mt-4 border-t border-border/50">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider mb-2">Architecture Docs</h4>
                        <div className="bg-layer-panel p-3 rounded-lg border border-outline-variant">
                            <p className="text-[11px] text-surface-foreground/80 font-dev text-transform-tertiary mb-2">Checkbox Typography & Publish Protocol</p>
                            <a href="vscode://file/Users/zap/Workspace/olympus/packages/zap-design/src/genesis/atoms/interactive/checkbox-publish-protocol.md" className="block w-full text-center text-[10px] py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded font-bold tracking-widest transition-colors">
                                OPEN PROTOCOL.MD
                            </a>
                        </div>
                    </div>
                </Wrapper>

            </div>
        </Wrapper>
    );

            const handleLoadedVariables = React.useCallback((variables: Record<string, string>) => {
                if (variables['--checkbox-size']) setSize([parseCssToNumber(variables['--checkbox-size'])]);
            }, []);
        
            const handlePublish = async () => {
                setIsSubmitting(true);
                try {
                    // Publish specific size
                    const res1 = await fetch('/api/theme/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: activeTheme, variables: { '--checkbox-size': size[0] + 'px' }})
                    });

                    // Publish border radius & width globally
                    const res2 = await fetch('/api/border_radius/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: activeTheme, state })
                    });

                    if (res1.ok && res2.ok) {
                        toast.success(`Checkbox Settings Published`, { description: `Successfully synced values to the ${activeTheme} theme.` });
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
                    filePath={`app/design/zap/atoms/checkbox/page.tsx`}
                />
            );

    return (
        <ComponentSandboxTemplate
            componentName="Checkbox"
            tier="L3 ATOM"
            status="In Progress"
            filePath="src/components/ui/checkbox.tsx"
            importPath="@/components/ui/checkbox"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-on-primary', '--md-sys-color-surface-container-highest'],
                typographyScales: ['--font-body (labelLarge)']
            }}
            platformConstraints={{
                web: "Checkboxes use a 16px size by default with a subtle rounded corner. Labels are positioned to the right with an 8px-12px gap.",
                mobile: "Touch targets for checkboxes and their labels must be at least 48px high to comply with accessibility standards."
            }}
            foundationRules={[
                "Checkboxes must use [data-slot='checkbox'] for external theme injection.",
                "Labels must be bound via htmlFor to the checkbox ID.",
                "Primary labels should use var(--font-body) and text-transform-secondary.",
                "Disabled states must apply 38% opacity to both the box and the label."
            ]}
            inspectorFooter={inspectorFooter}
            onLoadedVariables={handleLoadedVariables}
        >
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16"
                style={Object.assign({}, {
                    '--checkbox-size': `${size[0]}px`,
                    '--checkbox-border-width': previewWidth,
                    '--checkbox-border-radius': previewRadius
                } as React.CSSProperties)}
            >

                {/* Standard States Section */}
                <section className="space-y-6">
                    <Wrapper identity={{ displayName: "Section Header", type: "Header", filePath: "zap/atoms/checkbox/page.tsx" }} className="w-fit inline-block">
                        <div className="flex items-center justify-start gap-2 text-muted-foreground pb-2 px-2">
                            <Icon name="info" size={14} className="opacity-60" />
                            <h3 className="font-display text-titleSmall tracking-tight text-transform-primary uppercase">Standard States</h3>
                        </div>
                    </Wrapper>

                    <div className="bg-layer-panel rounded-[24px] border border-border/50 p-8 md:p-12 relative overflow-hidden">
                        <Wrapper identity={{ displayName: "States Grid Container", type: "Container", filePath: "zap/atoms/checkbox/page.tsx" }}>
                            <div className="grid grid-cols-1 select-none md:grid-cols-3 gap-8 md:gap-12 items-start">

                                {/* Column 1: Standard */}
                                <Wrapper identity={{ displayName: "Standard States Column", type: "Column", filePath: "zap/atoms/checkbox/page.tsx" }}>
                                    <div className="space-y-6">
                                        <div className="text-labelSmall font-body text-transform-secondary text-theme-muted tracking-widest uppercase mb-4 opacity-50">Standard</div>
                                        <Wrapper identity={{ displayName: "Standard Unchecked", type: "Wrapped Snippet", filePath: "zap/atoms/checkbox/page.tsx" }}>
                                            <div className="flex items-center gap-3">
                                                <Checkbox id="cb-unchecked" disabled={disabled} />
                                                <label htmlFor="cb-unchecked" style={Object.assign({}, { fontSize: 'calc(var(--checkbox-size, 16px) * 0.875)' })} className="font-body text-transform-secondary cursor-pointer mt-px leading-none">Unchecked Label</label>
                                            </div>
                                        </Wrapper>
                                        <Wrapper identity={{ displayName: "Standard Checked", type: "Wrapped Snippet", filePath: "zap/atoms/checkbox/page.tsx" }}>
                                            <div className="flex items-center gap-3">
                                                <Checkbox id="cb-checked" defaultChecked disabled={disabled} />
                                                <label htmlFor="cb-checked" style={Object.assign({}, { fontSize: 'calc(var(--checkbox-size, 16px) * 0.875)' })} className="font-body text-transform-secondary cursor-pointer mt-px leading-none">Checked Label</label>
                                            </div>
                                        </Wrapper>
                                    </div>
                                </Wrapper>

                                {/* Column 2: Specific Scopes */}
                                <Wrapper identity={{ displayName: "Protocol Scopes Column", type: "Column", filePath: "zap/atoms/checkbox/page.tsx" }}>
                                    <div className="space-y-6">
                                        <div className="text-labelSmall font-body text-transform-secondary text-theme-muted tracking-widest uppercase mb-4 opacity-50">Protocol Mapping</div>
                                        <div className="flex flex-col gap-2 p-4 bg-white/40 rounded-lg border border-border/30">
                                            <Wrapper identity={{ displayName: "Protocol Scope", type: "Wrapped Snippet", filePath: "zap/atoms/checkbox/page.tsx" }}>
                                                <div className="flex items-center gap-3">
                                                    <Checkbox id="cb-protocol" disabled={disabled} />
                                                    <label htmlFor="cb-protocol" style={Object.assign({}, { fontSize: 'calc(var(--checkbox-size, 16px) * 0.875)' })} className="font-body text-transform-secondary font-bold mt-px leading-none">Primary Scope</label>
                                                </div>
                                            </Wrapper>
                                            <p className="text-[10px] font-dev text-transform-tertiary text-muted-foreground ml-7 uppercase tracking-wider">
                                                Inherits Secondary Protocol
                                            </p>
                                        </div>
                                    </div>
                                </Wrapper>

                                {/* Column 3: Disabled */}
                                <Wrapper identity={{ displayName: "Disabled States Column", type: "Column", filePath: "zap/atoms/checkbox/page.tsx" }}>
                                    <div className="space-y-6">
                                        <div className="text-labelSmall font-body text-transform-secondary text-theme-muted tracking-widest uppercase mb-4 opacity-50">Disabled / Force-State</div>
                                        <Wrapper identity={{ displayName: "Disabled Unchecked", type: "Wrapped Snippet", filePath: "zap/atoms/checkbox/page.tsx" }}>
                                            <div className="flex items-center gap-3 opacity-38">
                                                <Checkbox id="cb-disabled-1" disabled />
                                                <label htmlFor="cb-disabled-1" style={Object.assign({}, { fontSize: 'calc(var(--checkbox-size, 16px) * 0.875)' })} className="font-body text-transform-secondary cursor-not-allowed mt-px leading-none">Always Disabled</label>
                                            </div>
                                        </Wrapper>
                                        <Wrapper identity={{ displayName: "Disabled Checked", type: "Wrapped Snippet", filePath: "zap/atoms/checkbox/page.tsx" }}>
                                            <div className="flex items-center gap-3 opacity-38">
                                                <Checkbox id="cb-disabled-2" checked disabled />
                                                <label htmlFor="cb-disabled-2" style={Object.assign({}, { fontSize: 'calc(var(--checkbox-size, 16px) * 0.875)' })} className="font-body text-transform-secondary cursor-not-allowed mt-px leading-none">Checked Disabled</label>
                                            </div>
                                        </Wrapper>
                                    </div>
                                </Wrapper>

                            </div>
                        </Wrapper>
                    </div>
                </section>

                {/* Anatomy Labels (Identity System / Tertiary) */}
                <section className="space-y-6 select-none">
                    <Wrapper identity={{ displayName: "Anatomy Section Header", type: "Header", filePath: "zap/atoms/checkbox/page.tsx" }} className="w-fit inline-block">
                        <div className="flex items-center justify-start gap-2 text-muted-foreground pb-2 px-2">
                            <Icon name="biotech" size={14} className="opacity-60" />
                            <h3 className="font-display text-titleSmall tracking-tight text-transform-primary uppercase">Anatomy Inspection</h3>
                        </div>
                    </Wrapper>
                    <div className="bg-layer-panel rounded-[24px] border border-border/50 p-8 flex flex-col gap-8">
                        <Wrapper identity={{ displayName: "Anatomy Visual Block", type: "Visual Guide", filePath: "zap/atoms/checkbox/page.tsx" }}>
                            <div className="flex gap-12 items-center">
                                <div className="relative p-6 bg-white rounded-xl border border-border shadow-sm">
                                    <Checkbox id="anatomy-cb" />
                                    <div className="absolute -top-3 -right-4 bg-brand-midnight text-white px-2 py-0.5 text-[9px] font-dev text-transform-tertiary rounded whitespace-nowrap">
                                        [data-slot=&quot;checkbox&quot;]
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-labelSmall font-dev text-transform-tertiary uppercase tracking-widest">Size: var(--checkbox-size)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-labelSmall font-dev text-transform-tertiary uppercase tracking-widest">Border: var(--checkbox-border-width)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-labelSmall font-dev text-transform-tertiary uppercase tracking-widest">Radius: var(--checkbox-border-radius)</span>
                                    </div>
                                </div>
                            </div>
                        </Wrapper>
                    </div>
                </section>

                {/* Protocol Info */}
                <Wrapper identity={{ displayName: "Protocol Engine Badge", type: "Badge", filePath: "zap/atoms/checkbox/page.tsx" }} className="mt-8 flex justify-center opacity-40 w-fit mx-auto">
                    <div className="flex items-center gap-2 bg-warning-container text-on-warning-container px-3 py-1.5 rounded-full text-[10px] font-dev tracking-widest text-transform-tertiary uppercase">
                        <Icon name="published_with_changes" size={14} className="text-current" />
                        ZAP Typography Publish Engine Enabled
                    </div>
                </Wrapper>

            </div>
        </ComponentSandboxTemplate>
    );
}
