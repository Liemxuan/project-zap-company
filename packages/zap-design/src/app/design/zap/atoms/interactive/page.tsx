'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Button } from '../../../../../genesis/atoms/interactive/button';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function InteractiveSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[0].value); // Default to sharp
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value); // Default to 1px
    const [switchState, setSwitchState] = useState(true);

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Button Radius</label>
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
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Stroke Weight</label>
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

    return (
        <ComponentSandboxTemplate
            componentName="Interactive"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/Button.tsx"
            importPath="@/genesis/atoms/interactive/Button"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-on-primary'],
                typographyScales: ['--font-label-medium']
            }}
            platformConstraints={{
                web: "Accessible touch targets with minimum 44px hit-box area.",
                mobile: "Supports haptic feedback and active state visual confirmation."
            }}
            foundationRules={[
                "Buttons must use --font-label-medium for high-density action signaling.",
                "Active states must provide a minimum 2px vertical displacement."
            ]}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="button-facets" 
                        number="01"
                        title="Button Facets"
                        icon="smart_button"
                        description="Tactile action foundations testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-2xl p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col md:flex-row items-center justify-center gap-12" style={{ borderRadius: '24px' }}>
                           <div className="flex flex-col items-center gap-4">
                                <Button 
                                    className="px-8 py-4 h-auto text-lg font-black uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all duration-200"
                                    style={{ 
                                        borderRadius: borderRadius,
                                        borderWidth: borderWidth,
                                        borderColor: 'var(--md-sys-color-outline-variant)'
                                    } as any}
                                >
                                    <Icon name="bolt" size="md" />
                                    Launch Protocol
                                </Button>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Primary Action</span>
                           </div>
                           <div className="flex flex-col items-center gap-4">
                                <Button 
                                    variant="outline"
                                    className="px-8 py-4 h-auto text-lg font-black uppercase tracking-widest shadow-sm flex items-center gap-3 transition-all duration-200"
                                    style={{ 
                                        borderRadius: borderRadius,
                                        borderWidth: borderWidth,
                                        borderColor: 'var(--md-sys-color-outline)'
                                    } as any}
                                >
                                    <Icon name="terminal" size="md" />
                                    Debug Logs
                                </Button>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Secondary View</span>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="binary-controls" 
                        number="02"
                        title="Binary Controls"
                        icon="toggle_on"
                        description="Structural testing for stateful switches and toggles."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-4xl p-8 bg-layer-panel border border-border/40 rounded-xl flex items-center justify-around">
                            <div className="flex flex-col items-center gap-4">
                                <Switch checked={switchState} onCheckedChange={setSwitchState} />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">System Status</span>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <Button variant="secondary" size="icon" className="h-12 w-12 rounded-xl">
                                    <Icon name="power_settings_new" size="md" />
                                </Button>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Hard Power</span>
                            </div>
                            <div className="flex flex-col items-center gap-4 opacity-50 grayscale">
                                <Switch checked={false} disabled />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Locked Area</span>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
