'use client';

import React, { useState } from 'react';
import { parseCssToNumber } from '../../../../../lib/utils';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { CardsSection } from '../../../../../zap/sections/molecules/containment/CardsSection';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function CardSandboxPage() {
    // ── L1 Inspector State ──────────────────────────────────────────
    // Defaults mirror CSS fallback: --card-border-* → --layer-border-* → hardcoded
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([16]);
    const [padding, setPadding] = useState([24]);
    const [sourceWidth, setSourceWidth] = useState<'card' | 'layer' | 'default'>('default');
    const [sourceRadius, setSourceRadius] = useState<'card' | 'layer' | 'default'>('default');
    const [sourcePadding, setSourcePadding] = useState<'card' | 'default'>('default');

    // ── Source label helper ─────────────────────────────────────────
    const sourceLabel = (src: string) =>
        src === 'card' ? '← L3 published' : src === 'layer' ? '← L1 foundation' : '← default';

    // ── L1 Inspector Controls ───────────────────────────────────────
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/card/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Card L1 Controls", type: "Docs Link", filePath: "zap/atoms/card/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">L1 Foundation Controls</h4>

                        {/* --card-border-width */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                <span>--card-border-width</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                    <span className="text-primary/60 normal-case">{sourceLabel(sourceWidth)}</span>
                                </div>
                            </div>
                            <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                        </div>

                        {/* --card-border-radius */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                <span>--card-border-radius</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{borderRadius[0]}px</span>
                                    <span className="text-primary/60 normal-case">{sourceLabel(sourceRadius)}</span>
                                </div>
                            </div>
                            <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={64} step={1} className="w-full" />
                        </div>

                        {/* --spacing-card-pad */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                <span>--spacing-card-pad</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{padding[0]}px</span>
                                    <span className="text-primary/60 normal-case">{sourceLabel(sourcePadding)}</span>
                                </div>
                            </div>
                            <Slider value={padding} onValueChange={setPadding} min={0} max={64} step={1} className="w-full" />
                        </div>

                        {/* Cascade info */}
                        <div className="p-3 text-[10px] font-dev text-muted-foreground bg-layer-surface border border-border/50 rounded-md space-y-1">
                            <p><strong>L1</strong> → <code>--layer-border-*</code> (Border & Radius foundation)</p>
                            <p><strong>L3</strong> → <code>--card-border-*</code>, <code>--card-border-radius</code> (component override)</p>
                            <p className="pt-1 text-muted-foreground/60">Sliders seed from L3 if published, else fall through to L1 foundation values.</p>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    // ── Load saved values: L3 component → L1 foundation → hardcoded default ──
    const handleLoadedVariables = (variables: Record<string, string>) => {
        // Width cascade: --card-border-width → --layer-border-width → 1px
        if (variables['--card-border-width']) {
            setBorderWidth([parseCssToNumber(variables['--card-border-width'])]);
            setSourceWidth('card');
        } else if (variables['--layer-border-width']) {
            setBorderWidth([parseCssToNumber(variables['--layer-border-width'])]);
            setSourceWidth('layer');
        }
        // Radius cascade: --card-border-radius → --layer-border-radius → 16px
        if (variables['--card-border-radius']) {
            setBorderRadius([parseCssToNumber(variables['--card-border-radius'])]);
            setSourceRadius('card');
        } else if (variables['--layer-border-radius']) {
            setBorderRadius([parseCssToNumber(variables['--layer-border-radius'])]);
            setSourceRadius('layer');
        }
        // Padding: --spacing-card-pad → 24px (no L1 foundation equivalent)
        if (variables['--spacing-card-pad']) {
            setPadding([parseCssToNumber(variables['--spacing-card-pad'])]);
            setSourcePadding('card');
        }
    };

    // ── CSS var injection (L1 → L3 cascade) ─────────────────────────
    const cssVars = {
        '--card-border-width': `${borderWidth[0]}px`,
        '--card-border-radius': `${borderRadius[0]}px`,
        '--spacing-card-pad': `${padding[0]}px`,
    } as React.CSSProperties;

    return (
        <ComponentSandboxTemplate
            componentName="Cards & Containers"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/zap/sections/molecules/containment/CardsSection.tsx"
            importPath="@/zap/sections/molecules/containment/CardsSection"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: [
                    'bg-layer-panel (L3 section container)',
                    'bg-layer-dialog (L4 elevated/filled cards)',
                    'bg-card (outlined card)',
                    'bg-primary-container / bg-secondary-container / bg-tertiary-container (icon badges)',
                ],
                typographyScales: ['text-foreground', 'text-muted-foreground'],
            }}
            platformConstraints={{
                web: 'User Mini Cards grid is 3-col on desktop, 2-col on tablet, 1-col on mobile. Standard Cards are 3-col on desktop, 1-col on mobile.',
                mobile: 'Cards stack vertically. Padding and gaps reduce. Touch targets remain accessible.',
            }}
            foundationRules={[
                'Section containers use bg-layer-panel (L3 surface).',
                'Inner cards that need elevation use bg-layer-dialog (L4 surface).',
                'Outlined cards use bg-card with border — no layer tag needed.',
                'Buttons inside cards are EXEMPT from layer tagging — they use M3 color roles.',
                'Border radius cascades: --card-border-radius → --layer-border-radius → 16px',
                'Border width cascades: --card-border-width → --layer-border-width → 1px',
            ]}
            publishPayload={{
                '--card-border-width': `${borderWidth[0]}px`,
                '--card-border-radius': `${borderRadius[0]}px`,
                '--spacing-card-pad': `${padding[0]}px`,
            }}
            onLoadedVariables={handleLoadedVariables}
        >
            <div className="w-full flex flex-col gap-8 py-8" style={cssVars}>
                <CardsSection />
            </div>
        </ComponentSandboxTemplate>
    );
}
