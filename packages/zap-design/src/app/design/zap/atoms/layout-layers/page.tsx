'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function LayoutLayersSandboxPage() {
    const [isolation, setIsolation] = useState('merged');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Depth Isolation</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={isolation}
                            onChange={(e) => setIsolation(e.target.value)}
                        >
                            <option value="merged">Merged (Standard)</option>
                            <option value="exploded">Exploded (Technical)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ComponentSandboxTemplate
            componentName="Layout Layers"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/zap/sections/atoms/layout-layers/body.tsx"
            importPath="@/zap/sections/atoms/layout-layers/body"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-surface', '--md-sys-color-surface-container', '--md-sys-color-surface-container-highest'],
                typographyScales: []
            }}
            platformConstraints={{
                web: "3-tier depth stack (L1/L2/L3) mapped to M3 semantic containers.",
                mobile: "Optimized for hardware-accelerated stacking and hardware-clipping."
            }}
            foundationRules={[
                "L1: Canvas (Root) must use --md-sys-color-surface-container-lowest.",
                "L2: Cover (Work area) must use --md-sys-color-surface.",
                "L3: Panels (Utility) must use --md-sys-color-surface-container-highest."
            ]}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="3d-architecture" 
                        number="01"
                        title="3D Architecture"
                        icon="layers"
                        description="Structural isometric depth testing across the ZAP-OS tiering stack."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full h-[500px] flex items-center justify-center [perspective:1200px]">
                            <div className={cn(
                                "relative w-[400px] h-[300px] [transform:rotateX(60deg)_rotateZ(-45deg)] [transform-style:preserve-3d] transition-all duration-700",
                                isolation === 'exploded' ? "gap-y-32" : ""
                            )}>
                                {/* L1 Canvas */}
                                <div className={cn(
                                    "absolute inset-0 bg-layer-canvas border border-border/40 shadow-sm flex items-end p-4 transition-transform duration-700",
                                    isolation === 'exploded' ? "[transform:translateZ(0px)]" : ""
                                )}>
                                    <span className="text-[10px] font-black uppercase text-primary opacity-40">L1: Foundation (Canvas)</span>
                                </div>
                                
                                {/* L2 Surface */}
                                <div className={cn(
                                    "absolute inset-12 bg-layer-surface border border-border/20 shadow-xl flex items-end p-4 transition-transform duration-700",
                                    isolation === 'exploded' ? "[transform:translateZ(80px)]" : "[transform:translateZ(20px)]"
                                )}>
                                    <span className="text-[10px] font-black uppercase text-primary opacity-60">L2: Surface (Cover)</span>
                                </div>

                                {/* L3 Panel */}
                                <div className={cn(
                                    "absolute top-24 left-24 right-12 bottom-12 bg-layer-panel border border-primary/20 shadow-2xl flex items-end p-4 transition-transform duration-700",
                                    isolation === 'exploded' ? "[transform:translateZ(160px)]" : "[transform:translateZ(40px)]"
                                )}>
                                    <span className="text-[10px] font-black uppercase text-primary">L3: Utility (Panel)</span>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="depth-governance" 
                        number="02"
                        title="Depth Governance"
                        icon="gavel"
                        description="Technical rules for semantic elevation and spatial boundaries."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                            {[
                                { tier: 'L1', role: 'Canvas', token: '--md-sys-color-surface-container-lowest', use: 'Global root, sidebars, shell.' },
                                { tier: 'L2', role: 'Cover', token: '--md-sys-color-surface', use: 'Main work area, documents, lists.' },
                                { tier: 'L3', role: 'Panel', token: '--md-sys-color-surface-container-highest', use: 'Contextual inspectors, drawers, modals.' },
                            ].map((l) => (
                                <div key={l.tier} className="p-8 bg-layer-panel border border-border/40 rounded-2xl flex flex-col gap-4">
                                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                        <span className="text-labelSmall font-body font-black text-primary">{l.tier}: {l.role}</span>
                                        <div className="h-4 w-4 rounded-full border border-border/50" style={{ backgroundColor: `var(${l.token})` }} />
                                    </div>
                                    <div className="text-[10px] font-mono text-muted-foreground opacity-40">{l.token}</div>
                                    <div className="text-bodySmall font-body text-muted-foreground leading-relaxed">{l.use}</div>
                                </div>
                            ))}
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
