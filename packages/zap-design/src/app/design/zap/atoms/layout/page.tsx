'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { SPACING_SCALE } from '../../../../../zap/sections/atoms/foundations/schema';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function LayoutSandboxPage() {
    const [selectedSpacing, setSelectedSpacing] = useState(SPACING_SCALE[2].value);

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Spacing Unit</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={selectedSpacing}
                            onChange={(e) => setSelectedSpacing(Number(e.target.value))}
                        >
                            {SPACING_SCALE.map(t => (
                                <option key={t.name} value={t.value}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ComponentSandboxTemplate
            componentName="Grids & Spacing"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/zap/sections/atoms/foundations/schema.ts"
            importPath="@/zap/sections/atoms/foundations/schema"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-outline-variant'],
                typographyScales: []
            }}
            platformConstraints={{
                web: "Fluid 12-column grid with fixed 24px baseline gutters.",
                mobile: "Single-column fluid stack with 16px safe-area margins."
            }}
            foundationRules={[
                "All spacing must be an increment of the 8px baseline unit.",
                "Vertical rhythm must be maintained across L1, L2, and L3 layers."
            ]}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="spacing-scale" 
                        number="01"
                        title="Spacing Scale"
                        icon="straighten"
                        description="8pt baseline increments testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl items-center">
                            <div className="space-y-8 p-8 bg-layer-panel border border-border/40 rounded-2xl shadow-sm">
                                {SPACING_SCALE.map((s) => (
                                    <div key={s.name} className="flex items-center gap-6 group">
                                        <div className="w-16 shrink-0 flex flex-col">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{s.name}</span>
                                            <span className="text-[8px] font-mono text-muted-foreground opacity-40">{s.value}</span>
                                        </div>
                                        <div 
                                            className="h-4 bg-primary rounded-sm transition-all duration-300 group-hover:scale-y-125"
                                            style={{ width: s.value }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="p-8 bg-layer-panel border border-border/40 rounded-2xl flex flex-col items-center justify-center gap-6">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded shadow-inner" style={{ padding: selectedSpacing }}>
                                            <div className="w-full h-full bg-primary rounded-sm" />
                                        </div>
                                        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded shadow-inner flex items-center justify-center">
                                            <div className="bg-primary rounded-sm transition-all" style={{ width: selectedSpacing, height: selectedSpacing }} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 tracking-widest">Live Dynamic Padding: {selectedSpacing}</span>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="grid-architecture" 
                        number="02"
                        title="Grid Architecture"
                        icon="grid_on"
                        description="Structural column alignment testing across the 12pt desktop grid."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-5xl space-y-6">
                            <div className="w-full h-48 bg-layer-panel border border-border/40 rounded-2xl relative p-6 flex gap-6 overflow-hidden">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="flex-1 bg-primary/5 border-x border-primary/10 h-full flex flex-col items-center pt-2">
                                        <span className="text-[8px] font-mono text-primary/30">{i + 1}</span>
                                    </div>
                                ))}
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-primary/10" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-layer-surface border border-primary/30 px-3 py-1 rounded shadow-lg">
                                        <span className="text-[10px] font-bold text-primary uppercase">24px Gutter System</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="h-12 bg-layer-panel border border-border/40 rounded-xl flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Span 4</span>
                                </div>
                                <div className="h-12 bg-layer-panel border border-border/40 rounded-xl flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Span 4</span>
                                </div>
                                <div className="h-12 bg-layer-panel border border-border/40 rounded-xl flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Span 4</span>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
