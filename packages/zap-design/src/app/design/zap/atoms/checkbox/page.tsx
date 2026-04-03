'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Checkbox } from '../../../../../genesis/atoms/interactive/checkbox';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function CheckboxSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[1].value); // Default to small round
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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Checkbox Density</label>
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
        if (variables['--checkbox-size']) setSize(variables['--checkbox-size']);
        if (variables['--checkbox-border-width']) setBorderWidth(variables['--checkbox-border-width']);
        if (variables['--checkbox-border-radius']) setBorderRadius(variables['--checkbox-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Checkbox"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/checkbox.tsx"
            importPath="@/genesis/atoms/interactive/checkbox"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-on-primary'],
                typographyScales: ['--font-body (labelLarge)']
            }}
            platformConstraints={{
                web: "Accessible input role with focus indicators.",
                mobile: "Touch targets for both box and label should be at least 44px."
            }}
            foundationRules={[
                "Checkbox must use M3 shape tokens.",
                "Labels must be bound via htmlFor for accessibility."
            ]}
            publishPayload={{
                '--checkbox-size': size,
                '--checkbox-border-width': borderWidth,
                '--checkbox-border-radius': borderRadius
            }}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="check_box"
                        description="Live-configured selection control testing design token restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-6" style={{ borderRadius: '24px' }}>
                           <div className="flex items-center gap-4">
                               <Checkbox 
                                   id="cb-preview" 
                                   disabled={disabled}
                                   defaultChecked
                                   style={{ 
                                       '--checkbox-size': size,
                                       '--checkbox-border-width': borderWidth,
                                       '--checkbox-border-radius': borderRadius
                                   } as any}
                               />
                               <label htmlFor="cb-preview" className="text-labelLarge font-body text-primary cursor-pointer select-none">
                                   Standard Option
                               </label>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="standard-variants" 
                        number="02"
                        title="Standard Variants"
                        icon="list_alt"
                        description="Core selection states including unchecked and disabled roles."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-3xl" style={{ 
                            '--checkbox-size': size,
                            '--checkbox-border-width': borderWidth,
                            '--checkbox-border-radius': borderRadius
                        } as any}>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Active States</div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Checkbox id="cb-v1" />
                                        <label htmlFor="cb-v1" className="text-labelMedium font-body">Unchecked Default</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Checkbox id="cb-v2" defaultChecked />
                                        <label htmlFor="cb-v2" className="text-labelMedium font-body">Checked Default</label>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Restricted States</div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 opacity-40">
                                        <Checkbox id="cb-v3" disabled />
                                        <label htmlFor="cb-v3" className="text-labelMedium font-body cursor-not-allowed">Disabled Unchecked</label>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-40">
                                        <Checkbox id="cb-v4" checked disabled />
                                        <label htmlFor="cb-v4" className="text-labelMedium font-body cursor-not-allowed">Disabled Checked</label>
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
