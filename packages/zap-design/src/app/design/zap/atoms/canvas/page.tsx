
'use client';

import React, { useState } from 'react';
import { parseCssToNumber } from '../../../../../lib/utils';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Canvas } from '../../../../../genesis/atoms/surfaces/canvas';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function CanvasSandboxPage() {
    // ── L1 Inspector State ──────────────────────────────────────────
    // Defaults mirror CSS fallback chain: --canvas-* → --layer-* → hardcoded
    const [borderWidth, setBorderWidth] = useState([0]);
    const [borderRadius, setBorderRadius] = useState([8]);
    const [sourceWidth, setSourceWidth] = useState<'canvas' | 'layer' | 'default'>('default');
    const [sourceRadius, setSourceRadius] = useState<'canvas' | 'layer' | 'default'>('default');

    // ── L1 Inspector Controls ───────────────────────────────────────
    const sourceLabel = (src: 'canvas' | 'layer' | 'default') =>
        src === 'canvas' ? '← L3 published' : src === 'layer' ? '← L1 foundation' : '← default';

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/canvas/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Canvas L1 Controls", type: "Docs Link", filePath: "zap/atoms/canvas/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">L1 Foundation Controls</h4>

                        {/* --canvas-border-width */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                <span>--canvas-border-width</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                    <span className="text-primary/60 normal-case">{sourceLabel(sourceWidth)}</span>
                                </div>
                            </div>
                            <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                        </div>

                        {/* --canvas-border-radius */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                <span>--canvas-border-radius</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{borderRadius[0]}px</span>
                                    <span className="text-primary/60 normal-case">{sourceLabel(sourceRadius)}</span>
                                </div>
                            </div>
                            <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={64} step={1} className="w-full" />
                        </div>

                        {/* Cascade info */}
                        <div className="p-3 text-label-small font-dev text-muted-foreground bg-layer-surface border border-border/50 rounded-md space-y-1">
                            <p><strong>L1</strong> → <code>--layer-border-*</code> (Border & Radius foundation)</p>
                            <p><strong>L3</strong> → <code>--canvas-border-*</code> (component override)</p>
                            <p className="pt-1 text-muted-foreground/60">Sliders seed from L3 if published, else fall through to L1 foundation values.</p>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    // ── Load saved values: L3 component → L1 foundation → hardcoded default ──
    const handleLoadedVariables = (variables: Record<string, string>) => {
        // Width cascade: --canvas-border-width → --layer-border-width → 0px
        if (variables['--canvas-border-width']) {
            setBorderWidth([parseCssToNumber(variables['--canvas-border-width'])]);
            setSourceWidth('canvas');
        } else if (variables['--layer-border-width']) {
            setBorderWidth([parseCssToNumber(variables['--layer-border-width'])]);
            setSourceWidth('layer');
        }
        // Radius cascade: --canvas-border-radius → --layer-border-radius → 8px
        if (variables['--canvas-border-radius']) {
            setBorderRadius([parseCssToNumber(variables['--canvas-border-radius'])]);
            setSourceRadius('canvas');
        } else if (variables['--layer-border-radius']) {
            setBorderRadius([parseCssToNumber(variables['--layer-border-radius'])]);
            setSourceRadius('layer');
        }
    };

    // ── CSS var injection (L1 → L3 cascade) ─────────────────────────
    const cssVars = {
        '--canvas-border-width': `${borderWidth[0]}px`,
        '--canvas-border-radius': `${borderRadius[0]}px`,
    } as React.CSSProperties;

    return (
        <ComponentSandboxTemplate
            componentName="Canvas"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/genesis/atoms/surfaces/canvas.tsx"
            importPath="@/genesis/atoms/surfaces/canvas"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--color-layer-canvas', '--color-on-surface'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{ web: "Full support", mobile: "Full support" }}
            foundationRules={[
                "Canvas is the L1 page-level surface.",
                "Height is organic — driven by content + padding/spacing.",
                "Border radius cascades: --canvas-border-radius → --layer-border-radius → 8px",
                "Border width cascades: --canvas-border-width → --layer-border-width → 0px",
            ]}
            publishPayload={{
                '--canvas-border-width': `${borderWidth[0]}px`,
                '--canvas-border-radius': `${borderRadius[0]}px`,
            }}
            onLoadedVariables={handleLoadedVariables}
        >
            <div className="w-full space-y-8 animate-in fade-in duration-500 pb-8" style={cssVars}>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* CANVAS SURFACE                                         */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Canvas Surface</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        L3: <code>--canvas-border-radius</code> · <code>--canvas-border-width</code>
                    </span>
                    <Canvas className="flex flex-col items-center justify-center p-8 gap-3 border-solid border-outline-variant w-full">
                        <span className="font-display font-medium text-body-medium">Canvas Surface</span>
                        <span className="text-label-small font-dev text-muted-foreground">
                            border: {borderWidth[0]}px · radius: {borderRadius[0]}px
                        </span>
                    </Canvas>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* CANVAS + NESTED L2 CARD                                */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Canvas + Nested Card</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        L3 Canvas wrapping L2 Card — card inherits L2 layer tokens
                    </span>
                    <Canvas className="flex flex-col items-center justify-center p-6 gap-4 border-solid border-outline-variant w-full">
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 w-full max-w-md shadow-sm">
                            <h3 className="font-display font-semibold text-body-small text-foreground">L2 Card</h3>
                            <p className="text-label-small text-muted-foreground mt-1">
                                Card border-radius follows <code className="font-dev text-primary">--card-border-radius</code> → <code className="font-dev text-primary">--layer-border-radius</code>
                            </p>
                        </div>
                    </Canvas>
                </div>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* CANVAS + GRID LAYOUT                                   */}
                {/* ═══════════════════════════════════════════════════════ */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Canvas + Grid Layout</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        Canvas as a layout container with multiple L2 card surfaces
                    </span>
                    <Canvas className="p-6 gap-4 border-solid border-outline-variant w-full">
                        <div className="grid grid-cols-3 gap-4 w-full">
                            {['Panel A', 'Panel B', 'Panel C'].map((label) => (
                                <div key={label} className="bg-layer-panel border border-card-border rounded-lg p-4 shadow-sm text-center">
                                    <span className="text-label-small font-semibold text-foreground">{label}</span>
                                    <p className="text-label-small font-dev text-muted-foreground mt-1">L2 Surface</p>
                                </div>
                            ))}
                        </div>
                    </Canvas>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
