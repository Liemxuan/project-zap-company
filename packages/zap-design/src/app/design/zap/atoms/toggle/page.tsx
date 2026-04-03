'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Toggle } from '../../../../../genesis/atoms/interactive/toggle';
import { ToggleGroup, ToggleGroupItem } from '../../../../../genesis/atoms/interactive/toggle-group';
import { Toggle as CustomToggle } from '../../../../../genesis/atoms/interactive/custom-toggle';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, LayoutGrid, List } from 'lucide-react';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function ToggleSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[2].value); // Default to medium rounded
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
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
        if (variables['--toggle-border-width']) setBorderWidth(variables['--toggle-border-width']);
        if (variables['--toggle-border-radius']) setBorderRadius(variables['--toggle-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Toggle"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/toggle.tsx"
            importPath="@/genesis/atoms/interactive/toggle"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container-high'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Accessible toggle states with aria-pressed support.",
                mobile: "Ensure high-contrast active states for outdoor visibility."
            }}
            foundationRules={[
                "Toggles should use standard button border radius tokens.",
                "Active state must use surface-container-highest or primary roles."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="toggle_off"
                        description="Live-configured toggle and group testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-8" style={{ borderRadius: '24px' }}>
                           <div className="space-y-6 w-full" style={{ 
                               '--toggle-border-radius': borderRadius,
                               '--toggle-border-width': borderWidth
                           } as any}>
                               <div className="flex flex-col gap-2">
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Single Toggle</span>
                                   <div className="flex justify-center">
                                       <Toggle disabled={disabled} aria-label="Toggle bold">
                                           <Bold className="h-4 w-4" />
                                       </Toggle>
                                   </div>
                               </div>
                               <div className="flex flex-col gap-2">
                                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Segmented Group</span>
                                   <ToggleGroup type="single" defaultValue="left" disabled={disabled} className="justify-center">
                                       <ToggleGroupItem value="left" aria-label="Align left">
                                           <AlignLeft className="h-4 w-4" />
                                       </ToggleGroupItem>
                                       <ToggleGroupItem value="center" aria-label="Align center">
                                           <AlignCenter className="h-4 w-4" />
                                       </ToggleGroupItem>
                                       <ToggleGroupItem value="right" aria-label="Align right">
                                           <AlignRight className="h-4 w-4" />
                                       </ToggleGroupItem>
                                   </ToggleGroup>
                               </div>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="custom-variants" 
                        number="02"
                        title="Custom Variants"
                        icon="dashboard_customize"
                        description="Genesis-specific custom toggle implementations and state matrices."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl" style={{ 
                            '--toggle-border-radius': borderRadius,
                            '--toggle-border-width': borderWidth
                        } as any}>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">State Matrix</div>
                                <div className="flex flex-wrap gap-4">
                                    <Toggle defaultPressed><Italic className="h-4 w-4" /></Toggle>
                                    <Toggle><Underline className="h-4 w-4" /></Toggle>
                                    <Toggle disabled><Bold className="h-4 w-4" /></Toggle>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Genesis Custom</div>
                                <div className="flex flex-wrap gap-4">
                                    <CustomToggle checked={true} onChange={() => {}} ariaLabel="Custom On" />
                                    <CustomToggle checked={false} onChange={() => {}} ariaLabel="Custom Off" />
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
