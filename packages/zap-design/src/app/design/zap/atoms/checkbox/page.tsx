'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Checkbox } from '../../../../../genesis/atoms/interactive/checkbox';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { L5Inspector } from '../../../../../genesis/organisms/inspector';

export default function CheckboxSandboxPage() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    
    // Core States
    const [disabled, setDisabled] = useState(false);
    
    // Unified Template States (Adopted from Button)
    const [checkboxColor, setCheckboxColor] = useState<string>('primary');
    const [checkboxSize, setCheckboxSize] = useState<string>('medium');
    
    // Sandbox manual sizes (for granular testing if Scale preset is overridden)
    const [size, setSize] = useState([16]);

    // Dynamic Database State
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

    // Map Density to physical size via direct handler
    const handleSizeChange = (newSize: string) => {
        setCheckboxSize(newSize);
        switch (newSize) {
            case 'tiny': setSize([14]); break;
            case 'compact': setSize([18]); break;
            case 'medium': setSize([24]); break;
            case 'expanded': setSize([32]); break;
        }
    };

    const effectiveProps = getEffectiveProps('Checkbox');
    
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '12px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '0px';

    const inspectorControls = (
        <L5Inspector
            componentName="Checkbox"
            activeColor={checkboxColor}
            onColorChange={setCheckboxColor}
            activeSize={checkboxSize}
            onSizeChange={handleSizeChange}
            customVariableLabel="--checkbox-size"
            customVariableValue={size}
            onCustomVariableChange={setSize}
            customVariableMin={12}
            customVariableMax={48}
            customVariableStep={2}
            borderState={state}
            setComponentOverride={setComponentOverride}
            clearComponentOverride={clearComponentOverride}
            effectiveProps={effectiveProps}
            disabled={disabled}
            onDisabledChange={setDisabled}
            docsLabel="Typography & Publish Protocol"
            docsHref="vscode://file/Users/zap/Workspace/olympus/packages/zap-design/src/genesis/atoms/interactive/checkbox-publish-protocol.md"
            publishContext={{
                activeTheme,
                filePath: "app/design/zap/atoms/checkbox/page.tsx",
                customVariables: { '--checkbox-size': size[0] + 'px' }
            }}
        />
    );

    const handleLoadedVariables = React.useCallback((variables: Record<string, string>) => {
        if (variables['--checkbox-size']) setSize([parseCssToNumber(variables['--checkbox-size'])]);
    }, []);

    // Dynamic color re-mapping for Semantic visual testing!
    const previewColorVar = checkboxColor === 'destructive' ? 'var(--color-error)' : `var(--color-${checkboxColor})`;
    const previewOnColorVar = checkboxColor === 'destructive' ? 'var(--color-on-error)' : `var(--color-on-${checkboxColor})`;

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
                web: "Checkboxes use a scalable sizing system driven by density. Labels are positioned to the right.",
                mobile: "Touch targets for checkboxes and their labels must be at least 48px high to comply with accessibility standards."
            }}
            foundationRules={[
                "Checkboxes must use [data-slot='checkbox'] for external theme injection.",
                "Labels must be bound via htmlFor to the checkbox ID.",
                "Primary labels should use var(--font-body) and text-transform-secondary.",
                "Dynamic properties Inspector is the Unified standard for all future Atom sandboxes!"
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16"
                style={Object.assign({}, {
                    '--checkbox-size': `${size[0]}px`,
                    '--checkbox-border-width': previewWidth,
                    '--checkbox-border-radius': previewRadius,
                    '--color-primary': previewColorVar,
                    '--color-on-primary': previewOnColorVar
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
                                            <p className="text-label-small font-dev text-transform-tertiary text-muted-foreground ml-7 uppercase tracking-wider">
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
                                    <Checkbox id="anatomy-cb" defaultChecked />
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

                <Wrapper identity={{ displayName: "Protocol Engine Badge", type: "Badge", filePath: "zap/atoms/checkbox/page.tsx" }} className="mt-8 flex justify-center opacity-40 w-fit mx-auto">
                    <div className="flex items-center gap-2 bg-warning-container text-on-warning-container px-3 py-1.5 rounded-full text-label-small font-dev tracking-widest text-transform-tertiary uppercase">
                        <Icon name="verified" size={14} className="text-current" />
                        Unified Dynamic Properties Template Enabled
                    </div>
                </Wrapper>

            </div>
        </ComponentSandboxTemplate>
    );
}
