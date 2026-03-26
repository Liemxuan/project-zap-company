'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { cn } from '../../../../../lib/utils';

/**
 * Builds the full publish payload including resolved CSS variables
 * for each visualStyle x color combination that genesis-button.css consumes.
 */
function buildPublishPayload(opts: {
    paddingX: number;
    paddingY: number;
    iconGap: number;
    borderWidth: number;
    borderRadius: number;
    variantStyle: string;
    visualStyle: string;
    buttonColor: string;
    buttonSize: string;
    iconPosition: string;
}): Record<string, string> {
    const colors = ['primary', 'secondary', 'tertiary', 'destructive'] as const;
    const errorMap: Record<string, string> = { primary: 'primary', secondary: 'secondary', tertiary: 'tertiary', destructive: 'error' };
    const payload: Record<string, string> = {
        '--button-padding-x': opts.paddingX + 'px',
        '--button-padding-y': opts.paddingY + 'px',
        '--button-icon-gap': opts.iconGap + 'px',
        '--button-border-width': opts.borderWidth + 'px',
        '--button-border-radius': opts.borderRadius + 'px',
        '--button-variant-style': opts.variantStyle,
        '--button-visual-style': opts.visualStyle,
        '--button-color': opts.buttonColor,
        '--button-size': opts.buttonSize,
        '--button-icon-position': opts.iconPosition,
    };

    // Resolve the selected visualStyle + color into --button-resolved-* variables
    // These are what .genesis-btn reads by default (no data-attribute needed)
    const vs = opts.visualStyle;
    const cc = opts.buttonColor;
    const token = errorMap[cc] || 'primary';

    if (vs === 'solid') {
        payload['--button-resolved-bg'] = `var(--color-${token})`;
        payload['--button-resolved-text'] = `var(--color-on-${token})`;
        payload['--button-resolved-border'] = 'transparent';
        payload['--button-resolved-bg-hover'] = `color-mix(in srgb, var(--color-${token}) 90%, transparent)`;
    } else if (vs === 'outline') {
        payload['--button-resolved-bg'] = 'transparent';
        payload['--button-resolved-text'] = `var(--color-${token})`;
        payload['--button-resolved-border'] = `var(--color-${token})`;
        payload['--button-resolved-bg-hover'] = `color-mix(in srgb, var(--color-${token}) 10%, transparent)`;
    } else if (vs === 'ghost') {
        payload['--button-resolved-bg'] = 'transparent';
        payload['--button-resolved-text'] = `var(--color-${token})`;
        payload['--button-resolved-border'] = 'transparent';
        payload['--button-resolved-bg-hover'] = `color-mix(in srgb, var(--color-${token}) 10%, transparent)`;
    } else if (vs === 'elevated') {
        payload['--button-resolved-bg'] = 'var(--color-layer-panel)';
        payload['--button-resolved-text'] = `var(--color-${token})`;
        payload['--button-resolved-border'] = 'transparent';
        payload['--button-resolved-bg-hover'] = 'var(--color-layer-dialog)';
        payload['--button-resolved-shadow'] = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)';
    } else if (vs === 'tonal') {
        if (cc === 'destructive') {
            payload['--button-resolved-bg'] = 'color-mix(in srgb, var(--color-error) 10%, transparent)';
            payload['--button-resolved-text'] = 'var(--color-error)';
            payload['--button-resolved-bg-hover'] = 'color-mix(in srgb, var(--color-error) 20%, transparent)';
        } else {
            payload['--button-resolved-bg'] = `var(--color-${token}-container)`;
            payload['--button-resolved-text'] = `var(--color-on-${token}-container)`;
            payload['--button-resolved-bg-hover'] = `color-mix(in srgb, var(--color-${token}-container) 80%, transparent)`;
        }
        payload['--button-resolved-border'] = 'transparent';
    }

    // Resolve variant effects into shadow
    if (opts.variantStyle === 'soft') {
        payload['--button-resolved-shadow'] = '0 25px 50px -12px currentColor';
    } else if (opts.variantStyle === 'neo') {
        payload['--button-resolved-shadow'] = '4px 4px 0px 0px currentColor';
    } else if (opts.variantStyle === 'glow') {
        payload['--button-resolved-shadow'] = '0 0 30px -5px currentColor';
    } else {
        payload['--button-resolved-shadow'] = payload['--button-resolved-shadow'] || 'none';
    }

    // Per-combination overrides (for buttons that explicitly pass props)
    for (const c of colors) {
        const t = errorMap[c];
        payload[`--button-solid-${c}-bg`] = `var(--color-${t})`;
        payload[`--button-solid-${c}-text`] = `var(--color-on-${t})`;
        payload[`--button-solid-${c}-border`] = 'transparent';
        payload[`--button-solid-${c}-bg-hover`] = `color-mix(in srgb, var(--color-${t}) 90%, transparent)`;
        payload[`--button-outline-${c}-bg`] = 'transparent';
        payload[`--button-outline-${c}-text`] = `var(--color-${t})`;
        payload[`--button-outline-${c}-border`] = `var(--color-${t})`;
        payload[`--button-outline-${c}-bg-hover`] = `color-mix(in srgb, var(--color-${t}) 10%, transparent)`;
        payload[`--button-ghost-${c}-text`] = `var(--color-${t})`;
        payload[`--button-ghost-${c}-bg-hover`] = `color-mix(in srgb, var(--color-${t}) 10%, transparent)`;
        payload[`--button-elevated-${c}-bg`] = 'var(--color-layer-panel)';
        payload[`--button-elevated-${c}-text`] = `var(--color-${t})`;
        payload[`--button-elevated-${c}-bg-hover`] = 'var(--color-layer-dialog)';
        if (c === 'destructive') {
            payload[`--button-tonal-${c}-bg`] = 'color-mix(in srgb, var(--color-error) 10%, transparent)';
            payload[`--button-tonal-${c}-text`] = 'var(--color-error)';
            payload[`--button-tonal-${c}-bg-hover`] = 'color-mix(in srgb, var(--color-error) 20%, transparent)';
        } else {
            payload[`--button-tonal-${c}-bg`] = `var(--color-${t}-container)`;
            payload[`--button-tonal-${c}-text`] = `var(--color-on-${t}-container)`;
            payload[`--button-tonal-${c}-bg-hover`] = `color-mix(in srgb, var(--color-${t}-container) 80%, transparent)`;
        }
    }

    return payload;
}

const Object_assign = Object.assign;

export default function ButtonSandboxPage() {
    const [variantStyle, setVariantStyle] = useState<'flat' | 'soft' | 'neo' | 'glow'>('flat');
    const [visualStyle, setVisualStyle] = useState<'solid' | 'outline' | 'ghost' | 'elevated' | 'tonal'>('solid');
    const [buttonColor, setButtonColor] = useState<'primary' | 'secondary' | 'tertiary' | 'destructive'>('primary');
    const [buttonSize, setButtonSize] = useState<'default' | 'tiny' | 'compact' | 'medium' | 'expanded'>('medium');
    const [iconPosition, setIconPosition] = useState<'left' | 'right' | 'top' | 'none'>('left');
    const [paddingX, setPaddingX] = useState([24]);
    const [paddingY, setPaddingY] = useState([12]);
    const [iconGap, setIconGap] = useState([8]);
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([4]);    const tonalClasses = buttonColor === 'primary' ? 'bg-primary-container text-on-primary-container hover:bg-primary-container/80' :
        buttonColor === 'secondary' ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80' :
        buttonColor === 'tertiary' ? 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80' :
        'bg-destructive/10 text-destructive hover:bg-destructive/20';

    const fabColorClasses = buttonColor === 'primary' ? 'bg-primary text-on-primary hover:bg-primary/90' :
        buttonColor === 'secondary' ? 'bg-secondary text-on-secondary hover:bg-secondary/90' :
        buttonColor === 'tertiary' ? 'bg-tertiary text-on-tertiary hover:bg-tertiary/90' :
        'bg-destructive text-on-destructive hover:bg-destructive/90';

    const ripplerColor = buttonColor === 'primary' ? 'bg-on-primary/10' :
        buttonColor === 'secondary' ? 'bg-on-secondary/10' :
        buttonColor === 'tertiary' ? 'bg-on-tertiary/10' :
        'bg-on-destructive/10';

    const textGhostClasses = buttonColor === 'primary' ? 'text-primary' :
        buttonColor === 'secondary' ? 'text-secondary' :
        buttonColor === 'tertiary' ? 'text-tertiary' :
        'text-destructive';

    const getVariantClasses = () => {
        switch (variantStyle) {
            case 'soft':
                return 'shadow-2xl shadow-primary/30 border-transparent';
            case 'neo':
                return 'shadow-[4px_4px_0px_0px_currentColor] !border-2 !border-current hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[5px_5px_0px_0px_currentColor] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none';
            case 'glow':
                return 'shadow-[0_0_30px_-5px] shadow-primary/60 ring-2 ring-primary/50 border-transparent';
            case 'flat':
            default:
                return 'shadow-none';
        }
    };

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/button/page.tsx" }}>
            <div 
                className="space-y-4 transition-all duration-300"
                style={Object_assign({
                    '--button-padding-x': `${paddingX[0]}px`,
                    '--button-padding-y': `${paddingY[0]}px`,
                    '--button-icon-gap': `${iconGap[0]}px`,
                    '--button-border-width': `${borderWidth[0]}px`,
                    '--button-border-radius': `${borderRadius[0]}px`
                })}
            >
                {/* Semantic Color Section */}
                <Wrapper identity={{ displayName: "Button Semantic Color", type: "Control Row", filePath: "zap/atoms/button/page.tsx" }}>
                    <div className="space-y-4 pb-4 border-b border-border/50">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Semantic Color</h4>
                        <div className="flex bg-layer-panel p-1 border border-border/50 rounded-[var(--button-border-radius,9999px)]">
                            {(['primary', 'secondary', 'tertiary', 'destructive'] as const).map((c) => (
                                <Button
                                    key={c}
                                    onClick={() => setButtonColor(c)}
                                    visualStyle={buttonColor === c ? 'solid' : 'ghost'}
                                    color={c}
                                    size="tiny"
                                    className={cn("flex-1", buttonColor !== c && "text-muted-foreground")}
                                >
                                    {c}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Wrapper>

                {/* Visual Style Section */}
                <Wrapper identity={{ displayName: "Button Visual Style", type: "Control Row", filePath: "zap/atoms/button/page.tsx" }}>
                    <div className="space-y-4 pb-4 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Visual Style</h4>
                            <span className="text-[10px] text-primary font-secondary font-bold tracking-widest text-transform-secondary">
                                {visualStyle === 'solid' ? 'FILLED' : visualStyle === 'outline' ? 'OUTLINED' : visualStyle === 'ghost' ? 'TEXT' : visualStyle.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex bg-layer-panel p-1 border border-border/50 flex-wrap gap-1 rounded-[var(--button-border-radius,9999px)]">
                            {(
                                [
                                    { id: 'solid', icon: 'format_color_fill', tooltip: 'Filled' },
                                    { id: 'outline', icon: 'check_box_outline_blank', tooltip: 'Outlined' },
                                    { id: 'ghost', icon: 'title', tooltip: 'Text' },
                                    { id: 'elevated', icon: 'flip_to_front', tooltip: 'Elevated' },
                                    { id: 'tonal', icon: 'opacity', tooltip: 'Tonal' }
                                ] as const
                            ).map((v) => (
                                <Button
                                    key={v.id}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onClick={() => setVisualStyle(v.id as any)}
                                    visualStyle={visualStyle === v.id ? 'solid' : 'ghost'}
                                    color={buttonColor}
                                    size="tiny"
                                    title={v.tooltip}
                                    className={cn("flex-1 px-0 min-w-[32px] justify-center", visualStyle !== v.id && "text-muted-foreground")}
                                >
                                    <Icon name={v.icon} size={16} />
                                </Button>
                            ))}
                        </div>
                    </div>
                </Wrapper>

                {/* Variant Style Section */}
                <Wrapper identity={{ displayName: "Button Variant Style", type: "Control Row", filePath: "zap/atoms/button/page.tsx" }}>
                    <div className="space-y-4 pb-4 border-b border-border/50">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Variant Style</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {(
                                [
                                    { id: 'flat', label: 'FLAT', icon: 'check_box_outline_blank' },
                                    { id: 'soft', label: 'SOFT', icon: 'water_drop' },
                                    { id: 'neo', label: 'NEO', icon: 'layers' },
                                    { id: 'glow', label: 'GLOW', icon: 'bolt' }
                                ] as const
                            ).map((v) => (
                                <Button
                                    key={v.id}
                                    onClick={() => setVariantStyle(v.id)}
                                    visualStyle={variantStyle === v.id ? 'solid' : 'ghost'}
                                    color={buttonColor}
                                    className="h-16 flex-col gap-1 justify-center tracking-widest text-[10px] font-secondary text-transform-secondary shadow-sm transition-all"
                                >
                                    <Icon name={v.icon} size={18} className={variantStyle === v.id ? "" : "opacity-70"} />
                                    {v.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Wrapper>

                {/* Size Style Section */}
                <Wrapper identity={{ displayName: "Button Size Style", type: "Control Row", filePath: "zap/atoms/button/page.tsx" }}>
                    <div className="space-y-4 pb-4 border-b border-border/50">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Scale & Density</h4>
                        <div className="flex flex-wrap gap-1 bg-layer-panel p-1 border border-border/50 rounded-[var(--button-border-radius,9999px)]">
                            {(['default', 'tiny', 'compact', 'medium', 'expanded'] as const).map((s) => (
                                <Button
                                    key={s}
                                    onClick={() => setButtonSize(s)}
                                    visualStyle={buttonSize === s ? 'solid' : 'ghost'}
                                    color={buttonColor}
                                    size="tiny"
                                    className={cn("flex-1", buttonSize !== s && "text-muted-foreground")}
                                >
                                    {s}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Wrapper>

                {/* Icon Position Section */}
                <Wrapper identity={{ displayName: "Button Icon Position", type: "Control Row", filePath: "zap/atoms/button/page.tsx" }}>
                    <div className="space-y-4 pb-4 border-b border-border/50">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Icon Position</h4>
                        <div className="flex bg-layer-panel p-1 border border-border/50 rounded-[var(--button-border-radius,9999px)]">
                            {(['left', 'right', 'top', 'none'] as const).map((pos) => (
                                <Button
                                    key={pos}
                                    onClick={() => setIconPosition(pos)}
                                    visualStyle={iconPosition === pos ? 'solid' : 'ghost'}
                                    color={buttonColor}
                                    size="tiny"
                                    className={cn("flex-1", iconPosition !== pos && "text-muted-foreground")}
                                >
                                    {pos}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Wrapper>

                {/* Structure Theme Section */}
                <Wrapper identity={{ displayName: "Button Structural Settings", type: "Docs Link", filePath: "zap/atoms/button/page.tsx" }}>
                    <div className={cn("space-y-6 transition-all duration-300", buttonSize !== 'default' && "opacity-40 pointer-events-none grayscale")}>
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Sandbox Variables</h4>
                                <span className="text-[9px] font-secondary font-bold tracking-widest text-transform-secondary bg-destructive/10 text-destructive px-2 py-0.5 rounded-sm">
                                    Requires Default Size
                                </span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-secondary text-transform-secondary text-muted-foreground">
                                    <span>--button-padding-x</span>
                                    <span className="font-bold">{paddingX[0]}px</span>
                                </div>
                                <Slider disabled={buttonSize !== 'default'} value={paddingX} onValueChange={setPaddingX} min={8} max={48} step={4} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-secondary text-transform-secondary text-muted-foreground">
                                    <span>--button-padding-y</span>
                                    <span className="font-bold">{paddingY[0]}px</span>
                                </div>
                                <Slider disabled={buttonSize !== 'default'} value={paddingY} onValueChange={setPaddingY} min={4} max={24} step={2} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-secondary text-transform-secondary text-muted-foreground">
                                    <span>--button-icon-gap</span>
                                    <span className="font-bold">{iconGap[0]}px</span>
                                </div>
                                <Slider disabled={buttonSize !== 'default'} value={iconGap} onValueChange={setIconGap} min={4} max={20} step={2} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-secondary text-transform-secondary text-muted-foreground">
                                    <span>--button-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider disabled={buttonSize !== 'default'} value={borderWidth} onValueChange={setBorderWidth} min={0} max={4} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-secondary text-transform-secondary text-muted-foreground">
                                    <span>--button-border-radius</span>
                                    <span className="font-bold">{borderRadius[0]}px</span>
                                </div>
                                <Slider disabled={buttonSize !== 'default'} value={borderRadius} onValueChange={setBorderRadius} min={0} max={32} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>

            </div>
        </Wrapper>
    );

            const handleLoadedVariables = (variables: Record<string, string>) => {
                if (variables['--button-padding-x']) setPaddingX([parseCssToNumber(variables['--button-padding-x'])]);
                            if (variables['--button-padding-y']) setPaddingY([parseCssToNumber(variables['--button-padding-y'])]);
                            if (variables['--button-icon-gap']) setIconGap([parseCssToNumber(variables['--button-icon-gap'])]);
                            if (variables['--button-border-width']) setBorderWidth([parseCssToNumber(variables['--button-border-width'])]);
                            if (variables['--button-border-radius']) setBorderRadius([parseCssToNumber(variables['--button-border-radius'])]);
                            if (variables['--button-variant-style'] && ['flat', 'soft', 'neo', 'glow'].includes(variables['--button-variant-style'])) {
                                setVariantStyle(variables['--button-variant-style'] as 'flat' | 'soft' | 'neo' | 'glow');
                            }
                            if (variables['--button-visual-style'] && ['solid', 'outline', 'ghost', 'elevated', 'tonal'].includes(variables['--button-visual-style'])) {
                                setVisualStyle(variables['--button-visual-style'] as 'solid' | 'outline' | 'ghost' | 'elevated' | 'tonal');
                            }
                            if (variables['--button-color'] && ['primary', 'secondary', 'tertiary', 'destructive'].includes(variables['--button-color'])) {
                                setButtonColor(variables['--button-color'] as 'primary' | 'secondary' | 'tertiary' | 'destructive');
                            }
                            if (variables['--button-size'] && ['tiny', 'compact', 'medium', 'expanded'].includes(variables['--button-size'])) {
                                setButtonSize(variables['--button-size'] as 'tiny' | 'compact' | 'medium' | 'expanded');
                            }
                            if (variables['--button-icon-position'] && ['left', 'right', 'top', 'none'].includes(variables['--button-icon-position'])) {
                                setIconPosition(variables['--button-icon-position'] as 'left' | 'right' | 'top' | 'none');
                            }
            };
        
    return (
        <div className="contents" style={Object_assign({
            '--button-padding-x': `${paddingX[0]}px`,
            '--button-padding-y': `${paddingY[0]}px`,
            '--button-icon-gap': `${iconGap[0]}px`,
            '--button-border-width': `${borderWidth[0]}px`,
            '--button-border-radius': `${borderRadius[0]}px`
        })}>
        <ComponentSandboxTemplate
            componentName="Button"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/buttons.tsx"
            importPath="@/genesis/atoms/interactive/buttons"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-on-primary', '--md-sys-color-surface-container-highest'],
                typographyScales: ['--font-body (labelLarge)']
            }}
            platformConstraints={{
                web: "Buttons maintain a consistent scalable structure using padding instead of fixed heights. Modals may use full-width buttons at the bottom edge.",
                mobile: "Touch targets require adequate padding. Floating Action Buttons (FABs) fixed to bottom right."
            }}
            foundationRules={[
                "NO STATIC HEX: All buttons MUST use semantic classes (e.g. bg-primary text-on-primary).",
                "All buttons must use M3 shape tokens (fully rounded capsules by default).",
                "Do not use inline padding overrides.",
                "Icon-only buttons must carry an aria-label."
            ]} publishPayload={buildPublishPayload({
                paddingX: paddingX[0],
                paddingY: paddingY[0],
                iconGap: iconGap[0],
                borderWidth: borderWidth[0],
                borderRadius: borderRadius[0],
                variantStyle,
                visualStyle,
                buttonColor,
                buttonSize,
                iconPosition,
            })} onLoadedVariables={handleLoadedVariables}
        >
            <div className="w-full space-y-12 animate-in fade-in duration-500 pb-16">

                {/* Main Interactive Showcase */}
                <section className="space-y-6">
                    <div className="flex items-center justify-start gap-2 text-muted-foreground pb-2 px-2">
                        <Icon name="visibility" size={14} className="opacity-60" />
                        <h3 className="font-display text-titleSmall tracking-tight text-transform-primary">Interactive Preview</h3>
                    </div>
                    <div className="bg-layer-panel rounded-[24px] border border-border/50 py-8 px-4 flex justify-center items-center overflow-hidden">
                        {/* Hero Display Canvas */}
                        <div className="flex-1 w-full min-h-[160px] flex items-center justify-center relative p-4">
                            {/* Decorative background grids/patterns could go here */}
                            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                            {/* Card L4 Surface Cover */}
                            <div className="w-[480px] min-h-[120px] bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center relative z-10 transition-all duration-500 hover:shadow-2xl">
                                <Button
                                    visualStyle={visualStyle}
                                    variant={variantStyle}
                                    size={buttonSize}
                                    color={buttonColor}
                                    iconPosition={iconPosition}
                                    className="transition-all duration-300"
                                >
                                    {iconPosition !== 'none' && <Icon name="favorite" size={18} />}
                                    <span>Action Button</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Scale & Density Testing Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-start gap-2 text-muted-foreground pb-2 px-2">
                        <Icon name="height" size={14} className="opacity-60" />
                        <h3 className="font-display text-titleSmall tracking-tight text-transform-primary">Scale & Density</h3>
                    </div>

                    <div className="bg-layer-panel rounded-[24px] border border-border/50 p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-labelSmall font-body tracking-widest text-primary text-transform-secondary">Tiny</span>
                            <Button visualStyle={visualStyle} variant={variantStyle} size="tiny" color={buttonColor} className="w-24 justify-center">Action</Button>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-labelSmall font-body tracking-widest text-primary text-transform-secondary">Compact</span>
                            <Button visualStyle={visualStyle} variant={variantStyle} size="compact" color={buttonColor} className="w-32 justify-center">Action</Button>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-labelSmall font-body tracking-widest text-primary text-transform-secondary">Medium</span>
                            <Button visualStyle={visualStyle} variant={variantStyle} size="medium" color={buttonColor} className="w-32 justify-center">Action</Button>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-labelSmall font-body tracking-widest text-primary text-transform-secondary">Expanded</span>
                            <Button visualStyle={visualStyle} variant={variantStyle} size="expanded" color={buttonColor} className="w-32 justify-center">Action</Button>
                        </div>
                    </div>
                </section>

                {/* Common Buttons Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-start gap-2 text-muted-foreground pb-2 px-2">
                        <Icon name="info" size={14} className="opacity-60" />
                        <h3 className="font-display text-titleSmall tracking-tight text-transform-primary">Common Buttons</h3>
                    </div>

                    <div className="bg-layer-panel rounded-[24px] border border-border/50 p-8 md:p-12 relative overflow-hidden">
                        <div className="grid grid-cols-1 select-none md:grid-cols-3 gap-8 md:gap-12 justify-items-center items-center">

                            {/* Column Headers */}
                            <div className="text-labelSmall font-body text-theme-muted tracking-widest text-center w-full pb-4 text-primary">Standard</div>
                            <div className="text-labelSmall font-body text-theme-muted tracking-widest text-center w-full pb-4 text-primary">With Icon</div>
                            <div className="text-labelSmall font-body text-theme-muted tracking-widest text-center w-full pb-4 text-primary">Disabled</div>

                            {/* Elevated (Using existing Zap tokens mapping to shadow) */}
                            <Button visualStyle="outline" variant={variantStyle} size={buttonSize} color={buttonColor} className={cn("w-32 justify-center bg-layer-panel shadow-md border-transparent hover:bg-layer-dialog hover:shadow-lg transition-all", textGhostClasses)}>Elevated</Button>
                            <Button visualStyle="outline" variant={variantStyle} size={buttonSize} color={buttonColor} iconPosition={iconPosition} className={cn("w-32 justify-center bg-layer-panel shadow-md border-transparent hover:bg-layer-dialog hover:shadow-lg flex items-center gap-2 transition-all", textGhostClasses)}>
                                <Icon name="add" size={18} /> <span>Icon</span>
                            </Button>
                            <Button visualStyle="outline" disabled size={buttonSize} color={buttonColor} className="w-32 justify-center bg-on-surface/5 border-transparent shadow-none text-on-surface/40">Elevated</Button>

                            {/* Filled (Solid Primary) */}
                            <Button visualStyle="solid" variant={variantStyle} size={buttonSize} color={buttonColor} className="w-32 justify-center shadow-none">Filled</Button>
                            <Button visualStyle="solid" variant={variantStyle} size={buttonSize} color={buttonColor} iconPosition={iconPosition} className="w-32 justify-center flex items-center gap-2 shadow-none">
                                <Icon name="add" size={18} /> <span>Icon</span>
                            </Button>
                            <Button visualStyle="solid" disabled size={buttonSize} color={buttonColor} className="w-32 justify-center shadow-none border border-transparent">Filled</Button>

                            {/* Tonal (Secondary Container) */}
                            <Button visualStyle="solid" variant={variantStyle} size={buttonSize} color={buttonColor} className={cn("w-32 justify-center shadow-none", tonalClasses)}>Tonal</Button>
                            <Button visualStyle="solid" variant={variantStyle} size={buttonSize} color={buttonColor} iconPosition={iconPosition} className={cn("w-32 justify-center flex items-center gap-2 shadow-none", tonalClasses)}>
                                <Icon name="add" size={18} /> <span>Icon</span>
                            </Button>
                            <Button visualStyle="solid" disabled size={buttonSize} color={buttonColor} className={cn("w-32 justify-center shadow-none opacity-50", tonalClasses)}>Tonal</Button>

                            {/* Outlined */}
                            <Button visualStyle="outline" variant={variantStyle} size={buttonSize} color={buttonColor} className="w-32 justify-center transition-all">Outlined</Button>
                            <Button visualStyle="outline" variant={variantStyle} size={buttonSize} color={buttonColor} iconPosition={iconPosition} className="w-32 justify-center flex items-center gap-2 transition-all">
                                <Icon name="add" size={18} /> <span>Icon</span>
                            </Button>
                            <Button visualStyle="outline" disabled size={buttonSize} color={buttonColor} className="w-32 justify-center shadow-none opacity-50">Outlined</Button>

                            {/* Text (Ghost) */}
                            <Button visualStyle="ghost" variant={variantStyle} size={buttonSize} color={buttonColor} className={cn("w-32 justify-center transition-all", textGhostClasses)}>Text</Button>
                            <Button visualStyle="ghost" variant={variantStyle} size={buttonSize} color={buttonColor} iconPosition={iconPosition} className={cn("w-32 justify-center flex items-center gap-2 transition-all", textGhostClasses)}>
                                <Icon name="add" size={18} /> <span>Icon</span>
                            </Button>
                            <Button visualStyle="ghost" disabled size={buttonSize} color={buttonColor} className="w-32 justify-center font-normal transition-all opacity-50">Text</Button>

                        </div>
                    </div>
                </section>

                {/* Floating Action Buttons */}
                <section className="space-y-6 select-none">
                    <div className="flex items-center justify-start gap-2 text-muted-foreground pb-2 px-2">
                        <Icon name="info" size={14} className="opacity-60" />
                        <h3 className="font-display text-titleSmall tracking-tight text-transform-primary">Floating Action Buttons</h3>
                    </div>
                    <div className="bg-layer-panel rounded-[24px] border border-border/50 p-8 flex justify-start gap-6 items-center flex-wrap">
                        {/* Small FAB */}
                        <div style={Object_assign({ borderRadius: 'var(--button-border-radius)', borderWidth: 'var(--button-border-width)', borderColor: 'transparent' })} className={cn("w-10 h-10 flex items-center justify-center shadow-md cursor-pointer transition-all", fabColorClasses, getVariantClasses().replace('!border-2', 'border-2'))}>
                            <Icon name="add" size={20} />
                        </div>
                        {/* Standard FAB */}
                        <div style={Object_assign({ borderRadius: 'var(--button-border-radius)', borderWidth: 'var(--button-border-width)', borderColor: 'transparent' })} className={cn("w-14 h-14 flex items-center justify-center shadow-lg cursor-pointer transition-all relative group", fabColorClasses, getVariantClasses().replace('!border-2', 'border-2'))}>
                            <Icon name="add" size={24} />
                            <div style={Object_assign({ borderRadius: 'var(--button-border-radius)' })} className={cn(`absolute inset-0 opacity-0 group-active:opacity-100 pointer-events-none transition-opacity`, ripplerColor, variantStyle === 'neo' && "hidden")}></div>
                        </div>
                        {/* Extended FAB */}
                        <div style={Object_assign({ borderRadius: 'var(--button-border-radius)', borderWidth: 'var(--button-border-width)', borderColor: 'transparent' })} className={cn("h-14 px-5 flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all relative group font-body font-bold tracking-wide", fabColorClasses, getVariantClasses().replace('!border-2', 'border-2'))}>
                            <Icon name="add" size={24} /> Create
                            <div style={Object_assign({ borderRadius: 'var(--button-border-radius)' })} className={cn(`absolute inset-0 opacity-0 group-active:opacity-100 pointer-events-none transition-opacity`, ripplerColor, variantStyle === 'neo' && "hidden")}></div>
                        </div>
                        {/* Large FAB */}
                        <div style={Object_assign({ borderRadius: 'var(--button-border-radius)', borderWidth: 'var(--button-border-width)', borderColor: 'transparent' })} className={cn("w-24 h-24 flex items-center justify-center shadow-xl cursor-pointer hover:shadow-2xl transition-all relative group", fabColorClasses, getVariantClasses().replace('!border-2', 'border-2'))}>
                            <Icon name="add" size={36} />
                            <div style={Object_assign({ borderRadius: 'var(--button-border-radius)' })} className={cn(`absolute inset-0 opacity-0 group-active:opacity-100 pointer-events-none transition-opacity`, ripplerColor, variantStyle === 'neo' && "hidden")}></div>
                        </div>
                    </div>
                </section>

                {/* Interactive Cloud Icon Warning */}
                <div className="mt-8 flex justify-center opacity-40">
                    <div className="flex items-center gap-2 bg-warning-container text-on-warning-container px-3 py-1.5 rounded-full text-[10px] font-secondary tracking-widest text-transform-secondary">
                        <Icon name="cloud_download" size={14} className="text-current" />
                        Google Material Symbols (Cloud Active)
                    </div>
                </div>

            </div>
        </ComponentSandboxTemplate>
        </div>
    );
}

