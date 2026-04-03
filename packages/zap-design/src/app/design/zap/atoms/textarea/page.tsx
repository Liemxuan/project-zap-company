'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Textarea } from '../../../../../genesis/atoms/interactive/textarea';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function TextareaSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[1].value); // Default to small round
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [minHeight, setMinHeight] = useState('120px');
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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vertical Scale</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={minHeight}
                        onChange={(e) => setMinHeight(e.target.value)}
                    >
                        {['80px', '120px', '160px', '200px', '240px'].map(h => (
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
        if (variables['--textarea-min-height']) setMinHeight(variables['--textarea-min-height']);
        if (variables['--textarea-border-width']) setBorderWidth(variables['--textarea-border-width']);
        if (variables['--textarea-border-radius']) setBorderRadius(variables['--textarea-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Textarea"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/textarea.tsx"
            importPath="@/genesis/atoms/interactive/textarea"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container-highest', '--md-sys-color-outline-variant'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Accessible form field with focus Ring and error state support.",
                mobile: "Ensure vertical height is sufficient for comfortable thumb scrolling."
            }}
            foundationRules={[
                "Textareas should use surface-container-highest for background color.",
                "Border color should transition to primary on focus."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="text_snippet"
                        description="Live-configured multi-line input testing L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-lg p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col gap-6" style={{ borderRadius: '24px' }}>
                           <div className="space-y-4">
                               <div className="flex justify-between items-end">
                                   <span className="text-labelSmall font-body text-primary uppercase tracking-widest font-bold">System Prompt</span>
                                   <span className="text-[10px] text-muted-foreground font-body">Height: {minHeight}</span>
                               </div>
                               <Textarea 
                                   disabled={disabled}
                                   placeholder="You are a powerful agentic AI coding assistant..."
                                   style={{ 
                                       '--textarea-min-height': minHeight,
                                       '--textarea-border-width': borderWidth,
                                       '--textarea-border-radius': borderRadius
                                   } as any}
                               />
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="form-mockups" 
                        number="02"
                        title="Form Mockups"
                        icon="assignment_ind"
                        description="Structural layout testing for data-intensive administrative modules."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12" style={{ 
                            '--textarea-border-width': borderWidth,
                            '--textarea-border-radius': borderRadius
                        } as any}>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Feedback Loop</div>
                                <div className="space-y-4">
                                    <h4 className="text-bodyMedium font-bold text-primary">User Comments</h4>
                                    <Textarea placeholder="Tell us what you think about the ZAP Design Engine..." className="min-h-[100px]" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Validation States</div>
                                <div className="space-y-4">
                                    <h4 className="text-bodyMedium font-bold text-destructive">Error Report</h4>
                                    <Textarea placeholder="Explain the glitch..." className="border-destructive/50 focus:ring-destructive min-h-[100px]" />
                                    <p className="text-[10px] text-destructive font-body italic">This field is mandatory for system recovery.</p>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
