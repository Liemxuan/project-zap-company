'use client';
import { parseCssToNumber } from '../../../../../lib/utils';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { RadioGroup, RadioGroupItem } from '../../../../../genesis/atoms/interactive/radio-group';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { Select } from '../../../../../genesis/atoms/interactive/option-select';
import { toast } from 'sonner';

export default function RadioSandboxPage() {
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

    const effectiveProps = getEffectiveProps('Radio');
    const overrideRadius = state.components['Radio']?.radius;
    
    // Radios ignore the global universal radius and default to circular (9999px)
    // unless explicitly overridden by the Component overrides.
    const previewRadius = overrideRadius 
        ? BORDER_RADIUS_TOKENS.find(t => t.token === overrideRadius)?.value.split(' ')[0] || '9999px' 
        : '9999px';

    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '1px';

    const renderRadiusSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit: rounded-full by default)', value: 'inherit' },
            ...BORDER_RADIUS_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <Select 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit: rounded-full by default)"
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
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/radio/page.tsx" }}>
            <div className="space-y-4">

                <Wrapper identity={{ displayName: "Radio Structural Settings", type: "Docs Link", filePath: "zap/atoms/radio/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--radio-size</span>
                                    <span className="font-bold">{size[0]}px</span>
                                </div>
                                <Slider value={size} onValueChange={setSize} min={12} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Radio']?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Radio', 'width');
                                        else setComponentOverride('Radio', 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Radio']?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Radio', 'radius');
                                        else setComponentOverride('Radio', 'radius', val);
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </Wrapper>

                <Wrapper identity={{ displayName: "Disabled State Toggle Row", type: "Control Row", filePath: "zap/atoms/radio/page.tsx" }}>
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-label-medium font-bold font-display text-transform-primary text-muted-foreground">Disabled State</span>
                        <Switch size="sm" checked={disabled} onCheckedChange={setDisabled} />
                    </div>
                </Wrapper>

                <Wrapper identity={{ displayName: "Architecture Docs Section", type: "Docs Link", filePath: "zap/atoms/radio/page.tsx" }}>
                    <div className="pt-4 mt-4 border-t border-border/50">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider mb-2">Architecture Docs</h4>
                        <div className="bg-layer-panel p-3 rounded-lg border border-outline-variant text-center space-y-2">
                            <p className="text-label-medium text-surface-foreground/80 font-dev text-transform-tertiary">Radio follows generic Checkbox Token Sync logic.</p>
                        </div>
                    </div>
                </Wrapper>

            </div>
        </Wrapper>
    );

    const handleLoadedVariables = React.useCallback((variables: Record<string, string>) => {
        if (variables['--radio-size']) setSize([parseCssToNumber(variables['--radio-size'])]);
    }, []);

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            // Publish specific size
            const res1 = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables: { '--radio-size': size[0] + 'px' }})
            });

            // Publish border radius & width globally
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res1.ok && res2.ok) {
                toast.success(`Radio Settings Published`, { description: `Successfully synced values to the ${activeTheme} theme.` });
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
            filePath={`app/design/zap/atoms/radio/page.tsx`}
        />
    );

    return (
        <ComponentSandboxTemplate
            componentName="Radio"
            tier="L3 ATOM"
            status="In Progress"
            filePath="src/components/ui/radio-group.tsx"
            importPath="@/components/ui/radio-group"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-on-primary', '--md-sys-color-surface-container-highest'],
                typographyScales: ['--font-body (labelLarge)']
            }}
            platformConstraints={{
                web: "Radio uses 16px size by default with a fully-rounded corner.",
                mobile: "Touch targets for radio and labels must be at least 48px high to comply with a11y standards."
            }}
            foundationRules={[
                "Radios must use [data-slot='radio-group-item'] for external theme injection.",
                "Primary labels should use var(--font-body) and text-transform-secondary.",
                "Disabled states must apply 38% opacity similar to Checkboxes."
            ]}
            inspectorFooter={inspectorFooter}
            onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .radio-preview-sandbox {
                    --radio-size: ${size[0]}px;
                    --radio-border-width: ${previewWidth};
                    --radio-border-radius: ${previewRadius};
                }
            ` }} />
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 radio-preview-sandbox"
            >

                {/* Standard States Section */}
                <section className="space-y-6">
                    <Wrapper identity={{ displayName: "Section Header", type: "Header", filePath: "zap/atoms/radio/page.tsx" }} className="w-fit inline-block">
                        <div className="flex items-center justify-start gap-2 text-muted-foreground pb-2 px-2">
                            <Icon name="info" size={14} className="opacity-60" />
                            <h3 className="font-display text-titleSmall tracking-tight text-transform-primary uppercase">Standard States</h3>
                        </div>
                    </Wrapper>

                    <div className="bg-layer-panel rounded-[24px] border border-border/50 p-8 md:p-12 relative overflow-hidden">
                        <Wrapper identity={{ displayName: "States Grid Container", type: "Container", filePath: "zap/atoms/radio/page.tsx" }}>
                            <div className="grid grid-cols-1 select-none md:grid-cols-3 gap-8 md:gap-12 items-start">

                                {/* Column 1: Standard */}
                                <Wrapper identity={{ displayName: "Standard States Column", type: "Column", filePath: "zap/atoms/radio/page.tsx" }}>
                                    <div className="space-y-6">
                                        <div className="text-labelSmall font-body text-transform-secondary text-theme-muted tracking-widest uppercase mb-4 opacity-50">Standard Molecule (Group)</div>
                                        <RadioGroup defaultValue="standard-active" disabled={disabled}>
                                            <Wrapper identity={{ displayName: "Standard Unchecked", type: "Wrapped Snippet", filePath: "zap/atoms/radio/page.tsx" }}>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="standard-inactive" id="rb-unchecked" />
                                                    <label htmlFor="rb-unchecked" className="text-[length:calc(var(--radio-size,16px)*0.875)] font-body text-transform-secondary cursor-pointer mt-px leading-none">Unchecked Label</label>
                                                </div>
                                            </Wrapper>
                                            <Wrapper identity={{ displayName: "Standard Checked", type: "Wrapped Snippet", filePath: "zap/atoms/radio/page.tsx" }}>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value="standard-active" id="rb-checked" />
                                                    <label htmlFor="rb-checked" className="text-[length:calc(var(--radio-size,16px)*0.875)] font-body text-transform-secondary cursor-pointer mt-px leading-none">Checked Label</label>
                                                </div>
                                            </Wrapper>
                                        </RadioGroup>
                                    </div>
                                </Wrapper>

                                {/* Column 2: Specific Scopes */}
                                <Wrapper identity={{ displayName: "Protocol Scopes Column", type: "Column", filePath: "zap/atoms/radio/page.tsx" }}>
                                    <div className="space-y-6">
                                        <div className="text-labelSmall font-body text-transform-secondary text-theme-muted tracking-widest uppercase mb-4 opacity-50">Protocol Mapping</div>
                                        <div className="flex flex-col gap-2 p-4 bg-white/40 rounded-lg border border-border/30">
                                            <RadioGroup defaultValue="protocol-active" disabled={disabled}>
                                                <Wrapper identity={{ displayName: "Protocol Scope", type: "Wrapped Snippet", filePath: "zap/atoms/radio/page.tsx" }}>
                                                    <div className="flex items-center gap-3">
                                                        <RadioGroupItem value="protocol-active" id="rb-protocol" />
                                                        <label htmlFor="rb-protocol" className="text-[length:calc(var(--radio-size,16px)*0.875)] font-body text-transform-secondary font-bold mt-px leading-none">Primary Scope</label>
                                                    </div>
                                                </Wrapper>
                                            </RadioGroup>
                                            <p className="text-label-small font-dev text-transform-tertiary text-muted-foreground ml-7 uppercase tracking-wider">
                                                Inherits Secondary Protocol
                                            </p>
                                        </div>
                                    </div>
                                </Wrapper>

                                {/* Column 3: Disabled */}
                                <Wrapper identity={{ displayName: "Disabled States Column", type: "Column", filePath: "zap/atoms/radio/page.tsx" }}>
                                    <div className="space-y-6">
                                        <div className="text-labelSmall font-body text-transform-secondary text-theme-muted tracking-widest uppercase mb-4 opacity-50">Disabled / Force-State</div>
                                        <RadioGroup defaultValue="disabled-active">
                                            <Wrapper identity={{ displayName: "Disabled Unchecked", type: "Wrapped Snippet", filePath: "zap/atoms/radio/page.tsx" }}>
                                                <div className="flex items-center gap-3 opacity-38">
                                                    <RadioGroupItem value="disabled-inactive" id="rb-disabled-1" disabled />
                                                    <label htmlFor="rb-disabled-1" className="text-[length:calc(var(--radio-size,16px)*0.875)] font-body text-transform-secondary cursor-not-allowed mt-px leading-none">Always Disabled</label>
                                                </div>
                                            </Wrapper>
                                            <Wrapper identity={{ displayName: "Disabled Checked", type: "Wrapped Snippet", filePath: "zap/atoms/radio/page.tsx" }}>
                                                <div className="flex items-center gap-3 opacity-38">
                                                    <RadioGroupItem value="disabled-active" id="rb-disabled-2" disabled />
                                                    <label htmlFor="rb-disabled-2" className="text-[length:calc(var(--radio-size,16px)*0.875)] font-body text-transform-secondary cursor-not-allowed mt-px leading-none">Checked Disabled</label>
                                                </div>
                                            </Wrapper>
                                        </RadioGroup>
                                    </div>
                                </Wrapper>

                            </div>
                        </Wrapper>
                    </div>
                </section>

                {/* Anatomy Labels (Identity System / Tertiary) */}
                <section className="space-y-6 select-none">
                    <Wrapper identity={{ displayName: "Anatomy Section Header", type: "Header", filePath: "zap/atoms/radio/page.tsx" }} className="w-fit inline-block">
                        <div className="flex items-center justify-start gap-2 text-muted-foreground pb-2 px-2">
                            <Icon name="biotech" size={14} className="opacity-60" />
                            <h3 className="font-display text-titleSmall tracking-tight text-transform-primary uppercase">Anatomy Inspection</h3>
                        </div>
                    </Wrapper>
                    <div className="bg-layer-panel rounded-[24px] border border-border/50 p-8 flex flex-col gap-8">
                        <Wrapper identity={{ displayName: "Anatomy Visual Block", type: "Visual Guide", filePath: "zap/atoms/radio/page.tsx" }}>
                            <div className="flex gap-12 items-center">
                                <div className="relative p-6 bg-white rounded-xl border border-border shadow-sm">
                                    <RadioGroup defaultValue="anatomy">
                                        <RadioGroupItem value="anatomy" id="anatomy-rb" />
                                    </RadioGroup>
                                    <div className="absolute -top-3 -right-4 bg-brand-midnight text-white px-2 py-0.5 text-[9px] font-dev text-transform-tertiary rounded whitespace-nowrap">
                                        [data-slot=&quot;radio-group-item&quot;]
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-labelSmall font-dev text-transform-tertiary uppercase tracking-widest">Size: var(--radio-size)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-labelSmall font-dev text-transform-tertiary uppercase tracking-widest">Border: var(--radio-border-width)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-labelSmall font-dev text-transform-tertiary uppercase tracking-widest">Radius: var(--radio-border-radius)</span>
                                    </div>
                                </div>
                            </div>
                        </Wrapper>
                    </div>
                </section>

            </div>
        </ComponentSandboxTemplate>
    );
}
