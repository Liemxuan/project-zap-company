'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Panel } from '../../../../../genesis/atoms/surfaces/panel';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function PanelSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[2].value); // Default to medium rounded
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[0].value); // Default to 0
    const [elevation, setElevation] = useState('shadow-md');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Corner Shaping</label>
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
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Surface Stroke</label>
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

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Elevation Role</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={elevation}
                        onChange={(e) => setElevation(e.target.value)}
                    >
                        <option value="shadow-none">Level 0 (None)</option>
                        <option value="shadow-sm">Level 1 (Low)</option>
                        <option value="shadow-md">Level 2 (Med)</option>
                        <option value="shadow-lg">Level 3 (High)</option>
                        <option value="shadow-xl">Level 4 (Overlay)</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--panel-border-width']) setBorderWidth(variables['--panel-border-width']);
        if (variables['--panel-border-radius']) setBorderRadius(variables['--panel-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Panel"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/surfaces/panel.tsx"
            importPath="@/genesis/atoms/surfaces/panel"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-surface-container', '--md-sys-color-outline-variant'],
                typographyScales: []
            }}
            platformConstraints={{
                web: "Generic surface container with configurable elevation and rounding.",
                mobile: "Ensures visual separation through shadow or stroke on mobile retina displays."
            }}
            foundationRules={[
                "Panels should use --color-surface-container by default for L3 tiering.",
                "Shadows must use --md-sys-color-shadow with varying opacity weights."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="layers"
                        description="Live-configured surface testing elevation and spatial L2 restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-8" style={{ borderRadius: '24px' }}>
                           <Panel 
                               className={cn("w-48 h-48 flex items-center justify-center transition-all duration-300", elevation)}
                               style={{ 
                                   '--panel-border-width': borderWidth,
                                   '--panel-border-radius': borderRadius,
                                   backgroundColor: 'var(--md-sys-color-surface-container)',
                                   borderRadius: borderRadius,
                                   borderWidth: borderWidth,
                                   borderColor: 'var(--md-sys-color-outline-variant)'
                               } as any}
                           >
                               <div className="text-center font-display font-bold text-primary uppercase tracking-widest text-[10px]">
                                   Surface L3
                               </div>
                           </Panel>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="architectural-matrix" 
                        number="02"
                        title="Architectural Matrix"
                        icon="grid_view"
                        description="Core structural scaling across ZAP-standard surface roles."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Overlay Role</div>
                                <Panel 
                                    className="p-6 shadow-xl border border-border/10 bg-layer-surface"
                                    style={{ borderRadius: borderRadius }}
                                >
                                    <div className="space-y-2">
                                        <div className="h-4 w-1/2 bg-primary/10 rounded" />
                                        <div className="h-2 w-full bg-muted/20 rounded" />
                                        <div className="h-2 w-3/4 bg-muted/20 rounded" />
                                    </div>
                                </Panel>
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Ghost Role</div>
                                <Panel 
                                    className="p-6 border border-border/40 bg-transparent flex items-center justify-center italic text-bodySmall text-muted-foreground"
                                    style={{ borderRadius: borderRadius }}
                                    noShadow
                                >
                                    Placeholder Surface (No Shadow)
                                </Panel>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
