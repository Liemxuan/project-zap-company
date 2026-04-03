'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Canvas } from '../../../../../genesis/atoms/surfaces/canvas';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function CanvasSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[2].value); // Default to medium rounded
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[0].value); // Default to 0

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Canvas Radius</label>
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
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Canvas Stroke</label>
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
        if (variables['--canvas-border-width']) setBorderWidth(variables['--canvas-border-width']);
        if (variables['--canvas-border-radius']) setBorderRadius(variables['--canvas-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Canvas"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/surfaces/canvas.tsx"
            importPath="@/genesis/atoms/surfaces/canvas"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-surface-container-lowest', '--md-sys-color-outline-variant'],
                typographyScales: []
            }}
            platformConstraints={{
                web: "Primary page-level surface container with high-density layout support.",
                mobile: "Ensures content clipping and proper safe-area-inset padding."
            }}
            foundationRules={[
                "Canvas represents the lowest semantic layer (L1) at the page root.",
                "Transitions should use --motion-duration-standard for surface entry."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="wallpaper"
                        description="Live-configured root surface testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-8" style={{ borderRadius: '24px' }}>
                           <Canvas 
                               className="w-48 h-48 flex items-center justify-center bg-layer-surface shadow-inner"
                               style={{ 
                                   '--canvas-border-width': borderWidth,
                                   '--canvas-border-radius': borderRadius,
                                   borderRadius: borderRadius,
                                   borderWidth: borderWidth,
                                   borderColor: 'var(--md-sys-color-outline-variant)'
                               } as any}
                           >
                               <div className="text-center font-display font-bold text-primary uppercase tracking-widest text-[10px]">
                                   Surface L1
                               </div>
                           </Canvas>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="layered-architecture" 
                        number="02"
                        title="Layered Architecture"
                        icon="layers"
                        description="Structural testing of nested surface hierarchies (L1 Canvas + L2 Panels)."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-4xl p-8 bg-layer-panel border border-border/40 rounded-xl" style={{ borderRadius: borderRadius }}>
                            <div className="flex items-center gap-2 mb-6">
                                <Icon name="schema" className="text-primary w-4 h-4" />
                                <span className="text-labelSmall font-body text-primary tracking-widest uppercase font-bold">Cortex Shell</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-layer-surface border border-border/10 rounded-lg shadow-sm flex items-center justify-center">
                                        <span className="text-[10px] font-mono text-muted-foreground opacity-40">NODE_LAYER_0{i}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
