'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

/**
 * Builds the full publish payload including resolved CSS variables
 * for each visualStyle x color combination that genesis-button.css consumes.
 */
function buildPublishPayload(opts: {
    paddingX: string;
    paddingY: string;
    iconGap: string;
    borderWidth: string;
    borderRadius: string;
    variantStyle: string;
    visualStyle: string;
    buttonColor: string;
    buttonSize: string;
    iconPosition: string;
}): Record<string, string> {
    const errorMap: Record<string, string> = { primary: 'primary', secondary: 'secondary', tertiary: 'tertiary', destructive: 'error' };
    const payload: Record<string, string> = {
        '--button-padding-x': opts.paddingX,
        '--button-padding-y': opts.paddingY,
        '--button-icon-gap': opts.iconGap,
        '--button-border-width': opts.borderWidth,
        '--button-border-radius': opts.borderRadius,
        '--button-variant-style': opts.variantStyle,
        '--button-visual-style': opts.visualStyle,
        '--button-color': opts.buttonColor,
        '--button-size': opts.buttonSize,
        '--button-icon-position': opts.iconPosition,
    };

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

    if (opts.variantStyle === 'soft') {
        payload['--button-resolved-shadow'] = '0 25px 50px -12px currentColor';
    } else if (opts.variantStyle === 'neo') {
        payload['--button-resolved-shadow'] = '4px 4px 0px 0px currentColor';
    } else if (opts.variantStyle === 'glow') {
        payload['--button-resolved-shadow'] = '0 0 30px -5px currentColor';
    } else {
        payload['--button-resolved-shadow'] = payload['--button-resolved-shadow'] || 'none';
    }

    return payload;
}

export default function ButtonSandboxPage() {
    const [variantStyle, setVariantStyle] = useState<'flat' | 'soft' | 'neo' | 'glow'>('flat');
    const [visualStyle, setVisualStyle] = useState<'solid' | 'outline' | 'ghost' | 'elevated' | 'tonal'>('solid');
    const [buttonColor, setButtonColor] = useState<'primary' | 'secondary' | 'tertiary' | 'destructive'>('primary');
    const [buttonSize, setButtonSize] = useState<'default' | 'tiny' | 'compact' | 'medium' | 'expanded'>('medium');
    const [iconPosition, setIconPosition] = useState<'left' | 'right' | 'top' | 'none'>('left');
    const [paddingX, setPaddingX] = useState('24px');
    const [paddingY, setPaddingY] = useState('12px');
    const [iconGap, setIconGap] = useState('8px');
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[4].value);

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

    const inspectorControls = (
        <div className="space-y-4 transition-all duration-300">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Semantic Color</h4>
                <div className="flex bg-layer-panel p-1 border border-border/50 rounded-lg">
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

            <div className="space-y-4 pb-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Visual Style</h4>
                    <span className="text-label-small text-primary font-secondary font-bold tracking-widest text-transform-secondary">
                        {visualStyle.toUpperCase()}
                    </span>
                </div>
                <div className="flex bg-layer-panel p-1 border border-border/50 flex-wrap gap-1 rounded-lg">
                    {([
                        { id: 'solid', icon: 'format_color_fill', tooltip: 'Filled' },
                        { id: 'outline', icon: 'check_box_outline_blank', tooltip: 'Outlined' },
                        { id: 'ghost', icon: 'title', tooltip: 'Text' },
                        { id: 'elevated', icon: 'flip_to_front', tooltip: 'Elevated' },
                        { id: 'tonal', icon: 'opacity', tooltip: 'Tonal' }
                    ] as const).map((v) => (
                        <Button
                            key={v.id}
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

            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Scale & Density</h4>
                <div className="flex flex-wrap gap-1 bg-layer-panel p-1 border border-border/50 rounded-lg">
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

            <div className="space-y-4">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Foundation Tokens</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Border Radius</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(e.target.value)}
                        >
                            {BORDER_RADIUS_TOKENS.map(t => (
                                <option key={t.name} value={t.value}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Border Width</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={borderWidth}
                            onChange={(e) => setBorderWidth(e.target.value)}
                        >
                            {BORDER_WIDTH_TOKENS.map(t => (
                                <option key={t.name} value={t.value}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--button-padding-x']) setPaddingX(variables['--button-padding-x']);
        if (variables['--button-padding-y']) setPaddingY(variables['--button-padding-y']);
        if (variables['--button-border-width']) setBorderWidth(variables['--button-border-width']);
        if (variables['--button-border-radius']) setBorderRadius(variables['--button-border-radius']);
        if (variables['--button-variant-style'] && ['flat', 'soft', 'neo', 'glow'].includes(variables['--button-variant-style'])) {
            setVariantStyle(variables['--button-variant-style'] as any);
        }
        if (variables['--button-visual-style'] && ['solid', 'outline', 'ghost', 'elevated', 'tonal'].includes(variables['--button-visual-style'])) {
            setVisualStyle(variables['--button-visual-style'] as any);
        }
        if (variables['--button-color'] && ['primary', 'secondary', 'tertiary', 'destructive'].includes(variables['--button-color'])) {
            setButtonColor(variables['--button-color'] as any);
        }
        if (variables['--button-size'] && ['tiny', 'compact', 'medium', 'expanded'].includes(variables['--button-size'])) {
            setButtonSize(variables['--button-size'] as any);
        }
    };
        
    return (
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
                web: "Buttons maintain a consistent scalable structure using padding instead of fixed heights.",
                mobile: "Touch targets require adequate padding. Floating Action Buttons (FABs) fixed to bottom right."
            }}
            foundationRules={[
                "NO STATIC HEX: All buttons MUST use semantic classes.",
                "All buttons must use M3 shape tokens.",
                "Icon-only buttons must carry an aria-label."
            ]} 
            publishPayload={buildPublishPayload({
                paddingX,
                paddingY,
                iconGap,
                borderWidth,
                borderRadius,
                variantStyle,
                visualStyle,
                buttonColor,
                buttonSize,
                iconPosition,
            })} 
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="visibility"
                        description="Live-configured primary action button sitting on L2 cover surface."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-[480px] min-h-[160px] bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center relative z-10" style={{ borderRadius }}>
                            <Button
                                visualStyle={visualStyle}
                                variant={variantStyle}
                                size={buttonSize}
                                color={buttonColor}
                                iconPosition={iconPosition}
                                style={{ borderRadius, borderWidth } as any}
                            >
                                {iconPosition !== 'none' && <Icon name="favorite" size={18} />}
                                <span>Action Button</span>
                            </Button>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section>
                    <SectionHeader id="scale-density" 
                        number="02"
                        title="Scale & Density"
                        icon="height"
                        description="Testing responsiveness across M3 density scales."
                    />
                    <CanvasBody.Demo>
                        <div className="flex flex-wrap items-center justify-center gap-8">
                            {(['tiny', 'compact', 'medium', 'expanded'] as const).map((s) => (
                                <div key={s} className="flex flex-col items-center gap-4">
                                    <span className="text-labelSmall font-body tracking-widest text-primary uppercase">{s}</span>
                                    <Button visualStyle={visualStyle} variant={variantStyle} size={s} color={buttonColor} className="w-24 justify-center">Action</Button>
                                </div>
                            ))}
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section>
                    <SectionHeader id="common-styles" 
                        number="03"
                        title="Common Styles"
                        icon="info"
                        description="Standard visualStyle mappings and their disabled states."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center items-center w-full max-w-3xl">
                            <div className="text-labelSmall font-body text-primary tracking-widest uppercase">Standard</div>
                            <div className="text-labelSmall font-body text-primary tracking-widest uppercase">With Icon</div>
                            <div className="text-labelSmall font-body text-primary tracking-widest uppercase">Disabled</div>

                            <Button visualStyle="solid" color={buttonColor} className="w-32 justify-center">Filled</Button>
                            <Button visualStyle="solid" color={buttonColor} className="w-32 justify-center flex items-center gap-2">
                                <Icon name="add" size={18} /> <span>Icon</span>
                            </Button>
                            <Button visualStyle="solid" disabled color={buttonColor} className="w-32 justify-center">Filled</Button>

                            <Button visualStyle="outline" color={buttonColor} className="w-32 justify-center">Outlined</Button>
                            <Button visualStyle="outline" color={buttonColor} className="w-32 justify-center flex items-center gap-2">
                                <Icon name="add" size={18} /> <span>Icon</span>
                            </Button>
                            <Button visualStyle="outline" disabled color={buttonColor} className="w-32 justify-center">Outlined</Button>

                            <Button visualStyle="ghost" color={buttonColor} className={cn("w-32 justify-center", textGhostClasses)}>Text</Button>
                            <Button visualStyle="ghost" color={buttonColor} className={cn("w-32 justify-center flex items-center gap-2", textGhostClasses)}>
                                <Icon name="add" size={18} /> <span>Icon</span>
                            </Button>
                            <Button visualStyle="ghost" disabled color={buttonColor} className="w-32 justify-center opacity-50">Text</Button>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="floating-action-buttons" 
                        number="04"
                        title="Floating Action Buttons"
                        icon="ads_click"
                        description="Specialized high-emphasis trigger shapes."
                    />
                    <CanvasBody.Demo>
                        <div className="flex justify-center gap-6 items-center flex-wrap">
                            <div style={{ borderRadius, borderWidth, borderColor: 'transparent' }} className={cn("w-10 h-10 flex items-center justify-center shadow-md", fabColorClasses)}>
                                <Icon name="add" size={20} />
                            </div>
                            <div style={{ borderRadius, borderWidth, borderColor: 'transparent' }} className={cn("w-14 h-14 flex items-center justify-center shadow-lg relative group", fabColorClasses)}>
                                <Icon name="add" size={24} />
                                <div style={{ borderRadius }} className={cn(`absolute inset-0 opacity-0 group-active:opacity-100 pointer-events-none transition-opacity`, ripplerColor)}></div>
                            </div>
                            <div style={{ borderRadius, borderWidth, borderColor: 'transparent' }} className={cn("h-14 px-5 flex items-center justify-center gap-2 shadow-lg relative group font-body font-bold", fabColorClasses)}>
                                <Icon name="add" size={24} /> Create
                                <div style={{ borderRadius }} className={cn(`absolute inset-0 opacity-0 group-active:opacity-100 pointer-events-none transition-opacity`, ripplerColor)}></div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
