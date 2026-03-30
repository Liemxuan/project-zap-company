'use client';

import React, { useState, useEffect } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { useTheme } from '../../../../../components/ThemeContext';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, ZAP_LAYER_MAP, COLOR_GROUPS } from '../../../../../zap/sections/atoms/foundations/schema';
import { Select } from '../../../../../genesis/atoms/interactive/option-select';
import { toast } from 'sonner';

import { Toggle } from '../../../../../genesis/atoms/interactive/toggle';
import { ToggleGroup, ToggleGroupItem } from '../../../../../genesis/atoms/interactive/toggle-group';
import { Toggle as GenesisToggle } from '../../../../../genesis/atoms/interactive/custom-toggle';
import { Bold, Italic, AlignCenter, LayoutGrid, List, Columns, GalleryHorizontalEnd } from 'lucide-react';

export default function ToggleSandboxPage() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const [visualStyle, setVisualStyle] = useState<'solid' | 'outline' | 'ghost'>('solid');
    const [switchOn, setSwitchOn] = useState(true);
    const [switchOff, setSwitchOff] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Global Registry Link
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

    const effectiveProps = getEffectiveProps('Toggle');

    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '24px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '0px';

    const renderRadiusSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit)', value: 'inherit' },
            ...BORDER_RADIUS_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <Select
                value={safeValue}
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit L2/L4)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const renderWidthSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit)', value: 'inherit' },
            ...BORDER_WIDTH_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <Select
                value={safeValue}
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit L2/L4)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };


    const getCssVar = (token: string) => {
        if (!token) return '';
        const layerDef = ZAP_LAYER_MAP.find(L => L.zapToken === token);
        if (layerDef) return `var(--color-${layerDef.m3Token.replace('bg-', '')})`;
        if (token.startsWith('bg-')) return `var(--color-${token.replace('bg-', '')})`;
        return '';
    };

    const previewBgGroup = getCssVar(state.components['ToggleGroup']?.bgGroup || '');

    const previewBgLayer = state.components['Toggle']?.bg || '';
    const previewBgTokenDef = ZAP_LAYER_MAP.find(L => L.zapToken === previewBgLayer);
    const previewBgCssVar = previewBgTokenDef
        ? `var(--color-${previewBgTokenDef.m3Token.replace('bg-', '')})`
        : ''; // Fallback to CSS inline var

    const renderBgSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit L4)', value: 'inherit' },
            { label: '--- STRUCTURAL LAYERS ---', value: 'structural', disabled: true },
            ...ZAP_LAYER_MAP.map(L => ({ label: `${L.zapLayer} (${L.zapToken})`, value: L.zapToken })),
            { label: '--- SEMANTIC COLORS ---', value: 'semantic', disabled: true }
        ];

        COLOR_GROUPS.forEach(group => {
            group.roles.forEach(role => {
                if (role.tailwind.startsWith('bg-')) {
                    options.push({ label: `${role.name} (${role.tailwind})`, value: role.tailwind });
                }
            });
        });

        return (
            <div className="[--input-height:32px]">
                <Select
                    value={safeValue}
                    onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                    options={options}
                    placeholder="(Inherit L4)"
                    className={`w-full bg-layer-base text-label-small ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
                />
            </div>
        );
    };
    const previewItemRadius = BORDER_RADIUS_TOKENS.find(t => t.token === state.components['Toggle']?.itemRadius)?.value.split(' ')[0] || '';
    const previewItemWidth = BORDER_WIDTH_TOKENS.find(t => t.token === state.components['Toggle']?.itemWidth)?.value.split(' ')[0] || '';

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/toggle/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Toggle Structural Settings", type: "Docs Link", filePath: "zap/atoms/toggle/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="p-3 text-body-small text-muted-foreground bg-layer-surface border border-border/50 rounded-md">
                            Both Toggle Styles inherit from <code className="text-primary font-mono text-label-small">--toggle-border-radius</code> and <code className="text-primary font-mono text-label-small">--toggle-border-width</code>.
                        </div>

                        <div className="space-y-4">
                            
                            {/* OVERALL TRACK SECTION */}
                            <div className="space-y-4 mt-6 pt-6 border-t border-border/50">
                                <h5 className="text-label-small font-bold text-muted-foreground uppercase tracking-wider">Track Container</h5>
                                
                                <div className="space-y-1">
                                    <span className="text-label-small text-muted-foreground flex justify-between">
                                        <span>Track Radius</span>
                                        <span className="font-bold">{previewRadius}</span>
                                    </span>
                                    {renderRadiusSelect(
                                        state.components['Toggle']?.radius || '',
                                        (val) => {
                                            if (val === '') clearComponentOverride('Toggle', 'radius');
                                            else setComponentOverride('Toggle', 'radius', val);
                                        }
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <span className="text-label-small text-muted-foreground flex justify-between">
                                        <span>Track Border Width</span>
                                        <span className="font-bold">{previewWidth}</span>
                                    </span>
                                    {renderWidthSelect(
                                        state.components['Toggle']?.width || '',
                                        (val) => {
                                            if (val === '') clearComponentOverride('Toggle', 'width');
                                            else setComponentOverride('Toggle', 'width', val);
                                        }
                                    )}
                                </div>
                            </div>
                            
                            {/* INNER THUMB SECTION */}
                            <div className="space-y-4 mt-6 pt-6 border-t border-border/20">
                                <h5 className="text-label-small font-bold text-muted-foreground uppercase tracking-wider">Inner Thumb Button</h5>

                                <div className="space-y-1">
                                    <span className="text-label-small text-muted-foreground flex justify-between">
                                        <span>Thumb Radius</span>
                                        <span className="font-bold">{previewItemRadius || previewRadius}</span>
                                    </span>
                                    {renderRadiusSelect(
                                        state.components['Toggle']?.itemRadius || '',
                                        (val) => {
                                            if (val === '') clearComponentOverride('Toggle', 'itemRadius');
                                            else setComponentOverride('Toggle', 'itemRadius', val);
                                        }
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <span className="text-label-small text-muted-foreground flex justify-between">
                                        <span>Thumb Border Width</span>
                                        <span className="font-bold">{previewItemWidth || previewWidth}</span>
                                    </span>
                                    {renderWidthSelect(
                                        state.components['Toggle']?.itemWidth || '',
                                        (val) => {
                                            if (val === '') clearComponentOverride('Toggle', 'itemWidth');
                                            else setComponentOverride('Toggle', 'itemWidth', val);
                                        }
                                    )}
                                </div>
                            </div>

                        {/* ToggleGroup Inspector Section */}
                        <div className="space-y-4 mt-8 pt-8 border-t border-border/50">
                            <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Segmented Overrides (ToggleGroup)</h4>

                            <div className="space-y-1">
                                <label className="text-label-small text-muted-foreground">Track Background</label>
                                {renderBgSelect(state.components['ToggleGroup']?.bgGroup || '', val => val === '' ? clearComponentOverride('ToggleGroup', 'bgGroup') : setComponentOverride('ToggleGroup', 'bgGroup', val))}
                            </div>

                            <div className="space-y-1">
                                <label className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Active Selection</span>
                                    <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-2 max-w-[120px]">{previewBgTokenDef ? previewBgTokenDef.zapLayer : 'Default'}</span>
                                </label>
                                {renderBgSelect(
                                    state.components['Toggle']?.bg || '',
                                    (val) => {
                                        if (val === '') clearComponentOverride('Toggle', 'bg');
                                        else setComponentOverride('Toggle', 'bg', val);
                                    }
                                )}
                            </div>
                        </div>

                        </div>

                    </div>
                </Wrapper>

            </div>
        </Wrapper>
    );

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            // Publish border radius, width, and background globally
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res2.ok) {
                toast.success(`Toggle Settings Published`, { description: `Successfully synced values to the ${activeTheme} theme.` });
            } else {
                throw new Error("Failed to publish global settings");
            }
        } catch (error) {
            console.error("Publish Error:", error);
            toast.error(`Publish Failed`, { description: `Failed to sync values.` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--button-visual-style']) {
            setVisualStyle(variables['--button-visual-style'] as 'solid' | 'outline' | 'ghost');
        }
    };

    return (
        <ComponentSandboxTemplate
            componentName="Toggle"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/components/ui/toggle.tsx"
            importPath="@/components/ui/toggle"
            inspectorControls={inspectorControls}
            inspectorFooter={
                <ThemePublisher
                    theme={activeTheme}
                    onPublish={handlePublish}
                    isLoading={isSubmitting}
                    filePath={`app/design/zap/atoms/toggle/page.tsx`}
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
                "Arbitrary Token Syntax Only."
            ]} onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                .toggle-preview-sandbox {
                    --toggle-border-radius: ${previewRadius};
                    --toggle-border-width: ${previewWidth};
                    ${previewBgCssVar ? `--toggle-bg: ${previewBgCssVar};` : ''}
                    ${previewBgGroup ? `--toggle-group-bg: ${previewBgGroup};` : ''}
                    ${previewItemRadius ? `--toggle-item-border-radius: ${previewItemRadius};` : ''}
                    ${previewItemWidth ? `--toggle-item-border-width: ${previewItemWidth};` : ''}
                }
            ` }} />
            <div className="w-full space-y-12 animate-in fade-in duration-500 pb-16 toggle-preview-sandbox">

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 1. TRACK BACKGROUND FIRST                                       */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="p-12 bg-layer-panel shadow-sm border border-outline-variant flex flex-col items-center justify-center text-on-surface w-full min-h-[160px] rounded-[var(--layer-border-radius)]">
                    <div className="flex flex-col gap-12 items-start justify-center w-full max-w-sm">
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Track Background</span>
                            <span className="text-label-small font-dev text-muted-foreground">
                                Inherits: <code>--toggle-group-bg</code>
                            </span>
                            <div className="flex gap-8 items-center p-8 bg-layer-surface border border-outline/20 rounded-md">
                                <div className="relative p-3 rounded-xl border border-dashed border-primary/30 flex items-center justify-center">
                                    <div className="absolute -top-2 left-3 px-2 bg-layer-surface text-[9px] font-bold text-primary tracking-widest uppercase">
                                        PREVIEW
                                    </div>
                                    <div className="w-[340px] pt-4 pb-2 flex justify-center">
                                        {/* 4-Button View Mode Segmented Control (Active vs Inactive color demonstration) */}
                                        <ToggleGroup visualStyle="segmented" spacing={1} type="single" defaultValue="grid" className="w-full max-w-[200px] h-10 text-on-surface flex tracking-tight">
                                            <ToggleGroupItem value="grid" className="flex-1 h-full"><LayoutGrid className="size-4" /></ToggleGroupItem>
                                            <ToggleGroupItem value="columns" className="flex-1 h-full"><Columns className="size-4" /></ToggleGroupItem>
                                            <ToggleGroupItem value="list" className="flex-1 h-full"><List className="size-4" /></ToggleGroupItem>
                                            <ToggleGroupItem value="gallery" className="flex-1 h-full"><GalleryHorizontalEnd className="size-4" /></ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* GENESIS SWITCH TOGGLE - Consumes --toggle-border-* foundation */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="p-12 bg-layer-panel shadow-sm border border-outline-variant flex flex-col items-center justify-center text-on-surface w-full min-h-[160px] rounded-[var(--layer-border-radius)]">
                    <div className="flex flex-col gap-12 items-start justify-center w-full max-w-sm">

                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Genesis Switch Toggle</span>
                            <span className="text-label-small font-dev text-muted-foreground">
                                Inherits: <code>--toggle-border-radius</code> · <code>--toggle-border-width</code> · <code>--toggle-bg</code>
                            </span>
                            <div className="flex gap-6 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                                <div className="flex flex-col items-center gap-1">
                                    <GenesisToggle checked={switchOn} onChange={setSwitchOn} ariaLabel="Switch on" />
                                    <span className="text-label-small font-dev text-muted-foreground">{switchOn ? 'ON' : 'OFF'}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <GenesisToggle checked={switchOff} onChange={setSwitchOff} ariaLabel="Switch off" />
                                    <span className="text-label-small font-dev text-muted-foreground">{switchOff ? 'ON' : 'OFF'}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <GenesisToggle checked={true} onChange={() => { }} disabled ariaLabel="Disabled on" />
                                    <span className="text-label-small font-dev text-muted-foreground">DISABLED</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Small Size</span>
                            <div className="flex gap-6 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                                <div className="flex flex-col items-center gap-1">
                                    <GenesisToggle checked={switchOn} onChange={setSwitchOn} size="sm" ariaLabel="Small switch" />
                                    <span className="text-label-small font-dev text-muted-foreground">sm</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <GenesisToggle checked={false} onChange={() => { }} size="sm" ariaLabel="Small off" />
                                    <span className="text-label-small font-dev text-muted-foreground">sm off</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* SHADCN BUTTON-STYLE TOGGLE - Inherits from Toggle foundation    */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="p-12 bg-layer-panel shadow-sm border border-outline-variant flex flex-col items-center justify-center text-on-surface w-full min-h-[160px] rounded-[var(--layer-border-radius)]">
                    <div className="flex flex-col gap-12 items-start justify-center w-full max-w-sm">

                        {/* Interactive Uncontrolled Example */}
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Button-Style Toggle (Shadcn)</span>
                            <span className="text-label-small font-dev text-muted-foreground">
                                Inherits: <code>--toggle-border-radius</code> · <code>--toggle-border-width</code>
                            </span>
                            <div className="flex gap-4 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                                <Toggle size="default" visualStyle={visualStyle} aria-label="Toggle bold">
                                    <Bold className="size-4" />
                                    <span className="font-bold">Bold</span>
                                </Toggle>
                                <span className="text-body-small text-on-surface-variant">
                                    Click to toggle state natively without passing \`pressed\`.
                                </span>
                            </div>
                        </div>

                        {/* Interactive Disabled Example */}
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Disabled Toggle</span>
                            <div className="flex gap-4 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                                <Toggle size="default" visualStyle={visualStyle} disabled>
                                    <Italic className="size-4" />
                                    <span className="italic">Italic</span>
                                </Toggle>
                                <span className="text-body-small text-on-surface-variant">
                                    Disabled state, non-interactive.
                                </span>
                            </div>
                        </div>


                        {/* Sizes Example */}
                        <div className="flex flex-col gap-2 w-full">
                            <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Sizes</span>
                            <div className="flex gap-4 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                                <Toggle size="sm" visualStyle={visualStyle}>
                                    <AlignCenter className="size-3" /> Sm
                                </Toggle>
                                <Toggle size="default" visualStyle={visualStyle}>
                                    <AlignCenter className="size-4" /> Default
                                </Toggle>
                                <Toggle size="default" visualStyle={visualStyle}>
                                    <AlignCenter className="size-5" /> Lg
                                </Toggle>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
