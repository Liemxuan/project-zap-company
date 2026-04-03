'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Label } from '../../../../../genesis/atoms/interactive/label';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { TYPE_STYLES, type TypeStyle } from '../../../../../zap/sections/atoms/foundations/schema';

export default function LabelSandboxPage() {
    const [typeStyle, setTypeStyle] = useState('text-label-sm');

    const activeStyle = TYPE_STYLES.find(t => t.cssClass === typeStyle) || TYPE_STYLES.find(t => t.cssClass === 'text-label-sm');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Typography Role</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={typeStyle}
                        onChange={(e) => setTypeStyle(e.target.value)}
                    >
                        {TYPE_STYLES.filter(t => t.role === 'label' || t.role === 'body').map((style: TypeStyle) => (
                            <option key={style.cssClass} value={style.cssClass}>
                                {style.name} ({style.fontSize}px)
                            </option>
                        ))}
                    </select>
                </div>

                {activeStyle && (
                    <div className="bg-layer-panel p-3 rounded border border-border/50 divide-y divide-border/30">
                        <div className="flex justify-between py-1.5 text-[10px] font-dev">
                            <span className="text-muted-foreground">Size / Height</span>
                            <span className="text-primary font-bold">{activeStyle.fontSize} / {activeStyle.lineHeight}px</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--label-type-style']) setTypeStyle(variables['--label-type-style']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Label"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/label.tsx"
            importPath="@/genesis/atoms/interactive/label"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Accessible label implementation with associated input bindings.",
                mobile: "Large hit areas for associated input focus on mobile devices."
            }}
            foundationRules={[
                "Labels should use text-transform-primary for semantic clarity.",
                "Disabled inputs must trigger an opacity change in the associated label."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="text_fields"
                        description="Live-configured label testing typography roles and spatial restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-8" style={{ borderRadius: '24px' }}>
                           <div className="w-full space-y-4">
                               <Label 
                                   htmlFor="preview-input" 
                                   className={cn("transition-all duration-200 text-primary uppercase tracking-widest font-bold", typeStyle)}
                               >
                                   Email Address
                               </Label>
                               <div id="preview-input" className="h-12 w-full rounded-lg border border-border/30 bg-layer-surface px-4 py-2 text-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                                   <span className="text-muted-foreground/40 italic">zap-os@genesis.ai</span>
                               </div>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="state-variations" 
                        number="02"
                        title="State Variations"
                        icon="exposure"
                        description="Comparative testing across M3 semantic roles and layout weights."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Compact Metadata</div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-label-xs uppercase text-muted-foreground">Created At:</Label>
                                    <span className="text-bodySmall font-body font-bold">2026-04-01</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Error Binding</div>
                                <div className="space-y-2">
                                    <Label className="text-label-sm font-bold text-destructive">Protocol Key</Label>
                                    <div className="h-10 w-full rounded border border-destructive/50 bg-destructive/5" />
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
