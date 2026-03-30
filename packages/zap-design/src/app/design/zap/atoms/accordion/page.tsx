
'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../../genesis/molecules/accordion';
import { Database, Shield } from 'lucide-react';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function AccordionItemSandboxPage() {
    const [height, setHeight] = useState([40]);
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([8]);
    const [openId, setOpenId] = useState<string | null>(null);

    // Fetch initial settings
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/accordion/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "AccordionItem Structural Settings", type: "Docs Link", filePath: "zap/atoms/accordion/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                                    <span>--accordion-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={16} max={128} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                                    <span>--accordion-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                                    <span>--accordion-border-radius</span>
                                    <span className="font-bold">{borderRadius[0]}px</span>
                                </div>
                                <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={64} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="AccordionItem"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/components/ui/accordion.tsx"
            importPath="@/components/ui/accordion"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "N/A",
                mobile: "N/A"
            }}
            foundationRules={[
                "Arbitrary Token Syntax Only."
            ]}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                .accordion-preview-sandbox {
                    --accordion-border-width: ${borderWidth[0]}px;
                    --accordion-radius: ${borderRadius[0]}px;
                    --accordion-height: ${height[0]}px;
                }
            ` }} />
            <div 
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 pt-16 accordion-preview-sandbox"
            >
                <div className="w-full min-w-[320px] md:min-w-[480px] max-w-lg mx-auto flex flex-col p-12 bg-layer-panel shadow-sm border-[length:var(--accordion-border-width)] border-outline-variant rounded-[length:var(--accordion-radius)]">
                    <Accordion type="single" collapsible value={openId || ''} onValueChange={setOpenId} className="w-full">
                        <AccordionItem value="1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <Database className="w-4 h-4 text-muted-foreground" />
                                    <span>Data Terminal</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-muted-foreground text-body-small">Status, tier and implementation details for this component.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                    <span>Foundation Rules</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-muted-foreground text-body-small">Strict guidelines from M3 standard and ZAP rules.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}

