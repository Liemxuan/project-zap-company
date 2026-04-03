'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { ScrollArea } from '../../../../../genesis/molecules/scroll-area';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function ScrollAreaSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[2].value); // Default to medium rounded
    const [height, setHeight] = useState('240px');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Viewport Radius</label>
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
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vertical Scaling</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        >
                            {['160px', '240px', '320px', '400px', '480px'].map(h => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--scroll-area-height']) setHeight(variables['--scroll-area-height']);
        if (variables['--scroll-area-border-radius']) setBorderRadius(variables['--scroll-area-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Scroll Area"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/molecules/scroll-area.tsx"
            importPath="@/genesis/molecules/scroll-area"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container-high'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Accessible scroll container with custom themed scrollbars.",
                mobile: "Ensures native inertial scrolling is preserved on touch devices."
            }}
            foundationRules={[
                "ScrollArea should use --color-outline-variant for scrollbar tracks.",
                "Container must enforce overflow: hidden for viewport clipping."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="unfold_more"
                        description="Live-configured viewport testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-8 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col gap-6" style={{ borderRadius: '24px' }}>
                           <div className="space-y-4">
                               <div className="flex justify-between items-end border-b border-border/10 pb-2">
                                   <span className="text-labelSmall font-body text-primary uppercase tracking-widest font-bold">System Logs</span>
                                   <span className="text-[10px] text-muted-foreground font-body">Height: {height}</span>
                               </div>
                               <ScrollArea 
                                   className="border border-border/20 bg-layer-surface shadow-inner"
                                   style={{ 
                                       '--scroll-area-height': height,
                                       '--scroll-area-border-radius': borderRadius
                                   } as any}
                               >
                                   <div className="p-4 space-y-4">
                                       {Array.from({ length: 20 }).map((_, i) => (
                                           <div key={i} className="flex flex-col gap-1 border-b border-border/5 pb-3 last:border-0 last:pb-0">
                                               <span className="text-labelSmall font-mono text-primary uppercase">[LOG_EVENT_{i + 1}]</span>
                                               <span className="text-bodySmall font-body text-muted-foreground">Initializing subagent protocol sequence {i + 1}...</span>
                                               <span className="text-[10px] font-mono text-muted-foreground/40">Timestamp: 2026-04-01T11:03:{i < 10 ? `0${i}` : i}Z</span>
                                           </div>
                                       ))}
                                   </div>
                               </ScrollArea>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="layout-integration" 
                        number="02"
                        title="Layout Integration"
                        icon="view_stream"
                        description="Structural testing for high-density navigation menus and sidebars."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12" style={{ 
                            '--scroll-area-border-radius': borderRadius
                        } as any}>
                            <div className="p-6 bg-layer-panel border border-border/40 rounded-xl space-y-4">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Command Suite</div>
                                <ScrollArea className="h-40 border border-border/10 rounded-lg">
                                    <div className="p-4 flex flex-col gap-2">
                                        {['DEPLOY (PRJ-016)', 'SCAN (ZSS-002)', 'SYNC (OLP-044)', 'RESET (SYS-001)', 'PATCH (FIX-033)'].map(cmd => (
                                            <div key={cmd} className="h-10 w-full bg-layer-surface border border-border/10 flex items-center px-4 rounded text-labelSmall font-body font-bold text-primary">
                                                {cmd}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="p-6 bg-layer-panel border border-border/40 rounded-xl space-y-4">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Identity Hub</div>
                                <ScrollArea className="h-40 border border-border/10 rounded-lg">
                                    <div className="p-4 grid grid-cols-2 gap-3">
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <div key={i} className="aspect-square bg-layer-surface border border-border/10 rounded-lg flex items-center justify-center">
                                                <Icon name="face" />
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
