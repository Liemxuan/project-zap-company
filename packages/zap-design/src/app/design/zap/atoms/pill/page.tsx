'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Pill } from '../../../../../genesis/atoms/status/pills';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function PillSandboxPage() {
    const [borderRadius, setBorderRadius] = useState('9999px'); // Default to full rounded for pills
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [height, setHeight] = useState('24px');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Border Radius</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(e.target.value)}
                        >
                            <option value="9999px">Full (9999px)</option>
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

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vertical Scale</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    >
                        {['16px', '20px', '24px', '28px', '32px'].map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--pill-height']) setHeight(variables['--pill-height']);
        if (variables['--pill-border-width']) setBorderWidth(variables['--pill-border-width']);
        if (variables['--pill-border-radius']) setBorderRadius(variables['--pill-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Pill"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/status/pills.tsx"
            importPath="@/genesis/atoms/status/pills"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-secondary-container'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Semantic status indicator with high-contrast color roles.",
                mobile: "Ensure minimum visual depth for glanceable status recognition."
            }}
            foundationRules={[
                "Pills should typically use 9999px border radius for 'capsule' aesthetic.",
                "Primary status must use --color-primary role for system visibility."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="capsule"
                        description="Live-configured capsule testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-8" style={{ borderRadius: '24px' }}>
                           <div className="flex flex-wrap gap-3 justify-center" style={{ 
                               '--pill-height': height,
                               '--pill-border-width': borderWidth,
                               '--pill-border-radius': borderRadius
                           } as any}>
                               <Pill variant="neutral">NEUTRAL</Pill>
                               <Pill variant="primary">PRIMARY</Pill>
                               <Pill variant="success">SUCCESS</Pill>
                               <Pill variant="error">ERROR</Pill>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="system-states" 
                        number="02"
                        title="System States"
                        icon="monitor_heart"
                        description="Comparative layout testing across M3 semantic roles and layout weights."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl" style={{ 
                            '--pill-height': height,
                            '--pill-border-width': borderWidth,
                            '--pill-border-radius': borderRadius
                        } as any}>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Fleet Telemetry</div>
                                <div className="flex items-center gap-3">
                                    <span className="text-bodySmall font-body font-bold">Node 0x3F:</span>
                                    <Pill variant="info">ACTIVE</Pill>
                                    <Pill variant="warning">LATENCY</Pill>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Cortex Integrity</div>
                                <div className="flex items-center gap-3">
                                    <Pill variant="success">VERIFIED</Pill>
                                    <Pill variant="error">FAILED</Pill>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
