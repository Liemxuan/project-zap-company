'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../../genesis/atoms/interactive/select';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function SelectSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[4].value);
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [height, setHeight] = useState('48px');

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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Height Offset</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    >
                        {['32px', '40px', '48px', '56px', '64px'].map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--select-height']) setHeight(variables['--select-height']);
        if (variables['--select-border-width']) setBorderWidth(variables['--select-border-width']);
        if (variables['--select-border-radius']) setBorderRadius(variables['--select-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Select"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/select.tsx"
            importPath="@/genesis/atoms/interactive/select"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container'],
                typographyScales: ['--font-body (bodyLarge)']
            }}
            platformConstraints={{
                web: "Accessible dropdown with keyboard navigation support.",
                mobile: "Touch targets require adequate height. Standard 48px recommended."
            }}
            foundationRules={[
                "Select must use M3 shape tokens.",
                "Ensure clear distinction between focus and default states."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="visibility"
                        description="Live-configured dropdown testing design token inheritance."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center" style={{ borderRadius }}>
                           <div className="flex justify-center w-full">
                               <Select defaultValue="1">
                                   <SelectTrigger className="w-full" style={{ borderRadius, borderWidth, height } as any}>
                                       <SelectValue placeholder="Select an option" />
                                   </SelectTrigger>
                                   <SelectContent>
                                       <SelectItem value="1">Primary Option</SelectItem>
                                       <SelectItem value="2">Secondary Option</SelectItem>
                                       <SelectItem value="3">Tertiary Option</SelectItem>
                                   </SelectContent>
                               </Select>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
