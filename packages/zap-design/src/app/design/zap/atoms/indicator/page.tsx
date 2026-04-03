'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { StatusDot as Indicator } from '../../../../../genesis/atoms/status/indicators';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function IndicatorSandboxPage() {
    const [borderRadius, setBorderRadius] = useState('9999px'); // Default to full rounded for indicators
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [size, setSize] = useState('12px');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Indicator Shape</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(e.target.value)}
                        >
                            <option value="9999px">Circle (9999px)</option>
                            {BORDER_RADIUS_TOKENS.map(t => (
                                <option key={t.name} value={t.value}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Stroke Width</label>
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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Indicator Scale</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                    >
                        {['8px', '10px', '12px', '14px', '16px', '24px'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--indicator-height']) setSize(variables['--indicator-height']);
        if (variables['--indicator-border-width']) setBorderWidth(variables['--indicator-border-width']);
        if (variables['--indicator-border-radius']) setBorderRadius(variables['--indicator-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Indicator"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/status/indicators.tsx"
            importPath="@/genesis/atoms/status/indicators"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-secondary-container'],
                typographyScales: []
            }}
            platformConstraints={{
                web: "Accessible status signaling through color intent and pulsing animation.",
                mobile: "Ensure minimum contrast for small status indicators (Dots)."
            }}
            foundationRules={[
                "Indicators should use standard semantic intents (online, offline, warning, idle, processing).",
                "Processing intent must include a pulsing animation by default."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="lens"
                        description="Live-configured status matrix testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-8" style={{ borderRadius: '24px' }}>
                           <div className="flex flex-wrap gap-6 justify-center" style={{ 
                               '--indicator-height': size,
                               '--indicator-width': size,
                               '--indicator-border-width': borderWidth,
                               '--indicator-border-radius': borderRadius
                           } as any}>
                               <div className="flex flex-col items-center gap-2">
                                   <Indicator intent="online" />
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Online</span>
                               </div>
                               <div className="flex flex-col items-center gap-2">
                                   <Indicator intent="warning" />
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Warning</span>
                               </div>
                               <div className="flex flex-col items-center gap-2">
                                   <Indicator intent="offline" />
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Offline</span>
                               </div>
                               <div className="flex flex-col items-center gap-2">
                                   <Indicator intent="processing" />
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Active</span>
                               </div>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="system-integration" 
                        number="02"
                        title="System Integration"
                        icon="nest_multi_room"
                        description="Comparative layout testing within agent identity and fleet telemetry roles."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl" style={{ 
                            '--indicator-height': size,
                            '--indicator-width': size,
                            '--indicator-border-width': borderWidth,
                            '--indicator-border-radius': borderRadius
                        } as any}>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Swarm Telemetry</div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between p-3 bg-layer-surface/50 border border-border/10 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="text-bodySmall font-body font-bold">ALPHA_CENTAURI</span>
                                        </div>
                                        <Indicator intent="online" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-layer-surface/50 border border-border/10 rounded-lg">
                                        <div className="flex items-center gap-2 opacity-50">
                                            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                                            <span className="text-bodySmall font-body font-bold">BETA_CRUCIS</span>
                                        </div>
                                        <Indicator intent="offline" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Active Tasking</div>
                                <div className="flex items-center gap-4 p-4 bg-layer-surface/50 border border-border/10 rounded-xl">
                                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center relative">
                                        <Icon name="terminal" className="text-primary w-5 h-5" />
                                        <div className="absolute -top-1 -right-1">
                                            <Indicator intent="processing" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-labelMedium font-body font-bold text-primary">SCAN_PHASE_07</span>
                                        <span className="text-[10px] text-muted-foreground font-body">Executing security audit...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
