'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { Label } from '../../../../../genesis/atoms/interactive/label';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function SwitchSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[8].value); // Default to full pill
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [trackHeight, setTrackHeight] = useState('24px');
    const [disabled, setDisabled] = useState(false);

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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Track Scale</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={trackHeight}
                        onChange={(e) => setTrackHeight(e.target.value)}
                    >
                        {['16px', '20px', '24px', '28px', '32px'].map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-label-medium font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Disabled State</span>
                <input 
                    type="checkbox" 
                    checked={disabled} 
                    onChange={(e) => setDisabled(e.target.checked)} 
                    className="accent-primary"
                />
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--switch-track-height']) setTrackHeight(variables['--switch-track-height']);
        if (variables['--switch-border-width']) setBorderWidth(variables['--switch-border-width']);
        if (variables['--switch-border-radius']) setBorderRadius(variables['--switch-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Switch"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/switch.tsx"
            importPath="@/genesis/atoms/interactive/switch"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container-highest'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Accessible toggle switch with smooth Framer Motion transitions.",
                mobile: "Minimum 48px touch target area for usability."
            }}
            foundationRules={[
                "Switch tracks must use --color-surface-container-highest in unchecked mode.",
                "Checked state must transition to --color-primary track."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="toggle_on"
                        description="Live-configured toggle testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-6" style={{ borderRadius: '24px' }}>
                           <div className="flex items-center justify-between w-full p-4 bg-layer-surface/50 rounded-lg border border-border/20 shadow-sm">
                               <Label htmlFor="preview-switch" className="text-labelLarge font-body text-primary cursor-pointer select-none">System Active</Label>
                               <Switch 
                                   id="preview-switch" 
                                   disabled={disabled}
                                   style={{ 
                                       '--switch-track-height': trackHeight,
                                       '--switch-track-width': `calc(${trackHeight} * 1.83)`,
                                       '--switch-thumb-size': `calc(${trackHeight} * 0.83)`,
                                       '--switch-border-width': borderWidth,
                                       '--switch-border-radius': borderRadius
                                   } as any}
                               />
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="contextual-states" 
                        number="02"
                        title="Contextual States"
                        icon="settings"
                        description="Core behavioral states including disabled and restricted roles."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-xl space-y-4" style={{ 
                            '--switch-track-height': trackHeight,
                            '--switch-track-width': `calc(${trackHeight} * 1.83)`,
                            '--switch-thumb-size': `calc(${trackHeight} * 0.83)`,
                            '--switch-border-width': borderWidth,
                            '--switch-border-radius': borderRadius
                        } as any}>
                            <div className="flex items-center justify-between p-4 bg-layer-panel border border-border/40 rounded-xl shadow-md">
                                <span className="text-labelMedium font-body">Background Sync</span>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-layer-panel border border-border/40 rounded-xl opacity-40">
                                <span className="text-labelMedium font-body">Legacy Mode (Disabled)</span>
                                <Switch disabled />
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
