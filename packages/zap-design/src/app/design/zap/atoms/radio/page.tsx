'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { RadioGroup, RadioGroupItem } from '../../../../../genesis/atoms/interactive/radio-group';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function RadioSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[8].value); // Default to circular
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [size, setSize] = useState('24px');
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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Radio Density</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                    >
                        {['16px', '20px', '24px', '28px', '32px'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-label-medium font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Disabled State</span>
                <Switch size="sm" checked={disabled} onCheckedChange={setDisabled} />
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--radio-size']) setSize(variables['--radio-size']);
        if (variables['--radio-border-width']) setBorderWidth(variables['--radio-border-width']);
        if (variables['--radio-border-radius']) setBorderRadius(variables['--radio-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Radio"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/radio-group.tsx"
            importPath="@/genesis/atoms/interactive/radio-group"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-on-primary'],
                typographyScales: ['--font-body (labelLarge)']
            }}
            platformConstraints={{
                web: "Accessible radio group following WAI-ARIA patterns.",
                mobile: "Touch targets should be at least 44px for high-density mobile UIs."
            }}
            foundationRules={[
                "Radios default to rounded-full (M3 extra-large shape).",
                "Selected state must use the primary role for the inner dot."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="radio_button_checked"
                        description="Live-configured selection group testing L2 surface depth restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-6" style={{ borderRadius: '24px' }}>
                           <RadioGroup defaultValue="preview" disabled={disabled} style={{ 
                               '--radio-size': size,
                               '--radio-border-width': borderWidth,
                               '--radio-border-radius': borderRadius
                           } as any}>
                               <div className="flex items-center gap-4">
                                   <RadioGroupItem value="preview" id="rb-preview" />
                                   <label htmlFor="rb-preview" className="text-labelLarge font-body text-primary cursor-pointer select-none">
                                       Selected Option
                                   </label>
                               </div>
                               <div className="flex items-center gap-4">
                                   <RadioGroupItem value="other" id="rb-other" />
                                   <label htmlFor="rb-other" className="text-labelLarge font-body text-muted-foreground cursor-pointer select-none">
                                       Default Option
                                   </label>
                               </div>
                           </RadioGroup>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="group-variations" 
                        number="02"
                        title="Group Variations"
                        icon="format_list_bulleted"
                        description="Core selection states including vertical groups and disabled roles."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-3xl" style={{ 
                            '--radio-size': size,
                            '--radio-border-width': borderWidth,
                            '--radio-border-radius': borderRadius
                        } as any}>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Vertical Layout</div>
                                <RadioGroup defaultValue="1" className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="1" id="v1" />
                                        <label htmlFor="v1" className="text-labelMedium font-body">Option ONE</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="2" id="v2" />
                                        <label htmlFor="v2" className="text-labelMedium font-body">Option TWO</label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Status Roles</div>
                                <RadioGroup defaultValue="d1" className="space-y-4">
                                    <div className="flex items-center gap-3 opacity-40">
                                        <RadioGroupItem value="d1" id="d1" disabled />
                                        <label htmlFor="d1" className="text-labelMedium font-body cursor-not-allowed">Selected Disabled</label>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-40">
                                        <RadioGroupItem value="d2" id="d2" disabled />
                                        <label htmlFor="d2" className="text-labelMedium font-body cursor-not-allowed">Unselected Disabled</label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
