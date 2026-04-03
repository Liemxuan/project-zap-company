'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Separator } from '../../../../../genesis/atoms/interactive/separator';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function SeparatorSandboxPage() {
    const [thickness, setThickness] = useState('1px');
    const [width, setWidth] = useState('100%');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Stroke Thickness</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={thickness}
                            onChange={(e) => setThickness(e.target.value)}
                        >
                            {['1px', '2px', '4px', '6px', '8px'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Spanning Width</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                        >
                            {['25%', '50%', '75%', '100%'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--separator-thickness']) setThickness(variables['--separator-thickness']);
        if (variables['--separator-width']) setWidth(variables['--separator-width']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Separator"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/separator.tsx"
            importPath="@/genesis/atoms/interactive/separator"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-outline-variant', '--md-sys-color-surface-container'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Accessible divider role with orientation support.",
                mobile: "Ensure visual weight is sufficient for low-light mobile viewing."
            }}
            foundationRules={[
                "Separators should use --color-outline-variant by default.",
                "Vertical separators must have an explicit height or fill container."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="horizontal_rule"
                        description="Live-configured divider testing orientation and L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-10" style={{ borderRadius: '24px' }}>
                           <div className="w-full space-y-6 text-center">
                               <div className="space-y-1">
                                   <h3 className="text-titleSmall font-display font-bold text-primary">Content Block A</h3>
                                   <p className="text-bodySmall font-body text-muted-foreground">Standardized structural divider positioning.</p>
                               </div>
                               <div className="flex justify-center w-full">
                                   <Separator 
                                       orientation="horizontal" 
                                       style={{ 
                                           height: thickness,
                                           width: width,
                                           backgroundColor: 'var(--md-sys-color-outline-variant)'
                                       } as any}
                                   />
                               </div>
                               <div className="space-y-1">
                                   <h3 className="text-titleSmall font-display font-bold text-primary">Content Block B</h3>
                                   <p className="text-bodySmall font-body text-muted-foreground">Visual containment strategy enabled.</p>
                               </div>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="directional-matrix" 
                        number="02"
                        title="Directional Matrix"
                        icon="splitscreen"
                        description="Comparative orientation testing including vertical spanning."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-2xl bg-layer-panel border border-border/40 rounded-xl p-8 flex flex-col gap-8 shadow-md">
                            <div className="flex items-center justify-center gap-8 h-12 bg-layer-surface/50 rounded-lg border border-border/10">
                                <span className="text-labelSmall font-body text-primary uppercase tracking-widest">Metadata</span>
                                <Separator orientation="vertical" className="h-6" style={{ width: thickness, backgroundColor: 'var(--md-sys-color-outline-variant)' } as any} />
                                <span className="text-labelSmall font-body text-primary uppercase tracking-widest">Analytics</span>
                                <Separator orientation="vertical" className="h-6" style={{ width: thickness, backgroundColor: 'var(--md-sys-color-outline-variant)' } as any} />
                                <span className="text-labelSmall font-body text-primary uppercase tracking-widest">Settings</span>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
