'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../../genesis/molecules/accordion';
import { Database, Shield, Lock, Cpu } from 'lucide-react';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function AccordionSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[2].value); // Default to medium rounded
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [openId, setOpenId] = useState<string | undefined>('1');

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
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--accordion-border-width']) setBorderWidth(variables['--accordion-border-width']);
        if (variables['--accordion-border-radius']) setBorderRadius(variables['--accordion-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Accordion"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/molecules/accordion.tsx"
            importPath="@/genesis/molecules/accordion"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container-high'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Accessible disclosure pattern with smooth height transitions.",
                mobile: "Ensure tap targets for triggers are at least 44px."
            }}
            foundationRules={[
                "Accordion items must be separated by border-b except the last item.",
                "Triggers should use text-transform-primary for semantic weight."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="unfold_more"
                        description="Live-configured disclosure matrix testing L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-md p-8 bg-layer-panel border border-border/40 shadow-xl rounded-2xl" style={{ borderRadius: '24px' }}>
                           <Accordion type="single" collapsible value={openId} onValueChange={setOpenId} className="w-full" style={{ 
                               '--accordion-border-radius': borderRadius,
                               '--accordion-border-width': borderWidth
                           } as any}>
                               <AccordionItem value="1" className="border-b border-border/20">
                                   <AccordionTrigger className="text-labelLarge font-body text-primary hover:no-underline px-4">
                                       <div className="flex items-center gap-3">
                                           <Database className="h-4 w-4 opacity-70" />
                                           <span>Data Terminal</span>
                                       </div>
                                   </AccordionTrigger>
                                   <AccordionContent className="px-4 pb-6 mt-2">
                                       <p className="text-bodyMedium font-body text-muted-foreground leading-relaxed">
                                           Status, tier and implementation details for this component. Standardizing architectural parity across Olympus.
                                       </p>
                                   </AccordionContent>
                               </AccordionItem>
                               <AccordionItem value="2" className="border-b-0">
                                   <AccordionTrigger className="text-labelLarge font-body text-primary hover:no-underline px-4">
                                       <div className="flex items-center gap-3">
                                           <Lock className="h-4 w-4 opacity-70" />
                                           <span>Foundation Rules</span>
                                       </div>
                                   </AccordionTrigger>
                                   <AccordionContent className="px-4 pb-6 mt-2">
                                       <p className="text-bodyMedium font-body text-muted-foreground leading-relaxed">
                                           Strict guidelines from M3 standard and ZAP rules. Enforcing token compliance.
                                       </p>
                                   </AccordionContent>
                               </AccordionItem>
                           </Accordion>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="role-variations" 
                        number="02"
                        title="Role Variations"
                        icon="layers"
                        description="Core architectural scaling across ZAP-standard size roles."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-2xl bg-layer-panel border border-border/40 rounded-xl overflow-hidden shadow-md" style={{ 
                            '--accordion-border-radius': borderRadius,
                            '--accordion-border-width': borderWidth
                        } as any}>
                            <Accordion type="multiple" defaultValue={["v1"]} className="w-full">
                                <AccordionItem value="v1" className="border-b border-border/20">
                                    <AccordionTrigger className="text-labelMedium font-body px-6 h-14">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-primary" />
                                            <span>Security Protocol</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4">
                                        <div className="p-4 bg-layer-surface/50 rounded-lg border border-border/10 text-bodySmall font-body">
                                            Enforce TLS 1.3 encryption on all agent communications.
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="v2" className="border-b-0">
                                    <AccordionTrigger className="text-labelMedium font-body px-6 h-14">
                                        <div className="flex items-center gap-2">
                                            <Cpu className="h-4 w-4 text-primary" />
                                            <span>Cortex Settings</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4">
                                         <div className="p-4 bg-layer-surface/50 rounded-lg border border-border/10 text-bodySmall font-body">
                                            Configuring neural weights for Phase 3 deployment.
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
