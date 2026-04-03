'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../../../../genesis/atoms/interactive/tooltip';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function TooltipSandboxPage() {    const [paddingX, setPaddingX] = useState([12]);
    const [paddingY, setPaddingY] = useState([6]);
    const [radius, setRadius] = useState([4]);

    // Fetch initial settings
    const inspectorControls = (
        
            <div className="space-y-4">
                
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--tooltip-padding-x</span>
                                    <span className="font-bold">{paddingX[0]}px</span>
                                </div>
                                <Slider value={paddingX} onValueChange={setPaddingX} min={0} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--tooltip-padding-y</span>
                                    <span className="font-bold">{paddingY[0]}px</span>
                                </div>
                                <Slider value={paddingY} onValueChange={setPaddingY} min={0} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--tooltip-radius</span>
                                    <span className="font-bold">{radius[0]}px</span>
                                </div>
                                <Slider value={radius} onValueChange={setRadius} min={0} max={32} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                
            </div>
        
    );
    return (
        <ComponentSandboxTemplate
            componentName="Tooltip"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/tooltip.tsx"
            importPath="@/components/ui/tooltip"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: [],
                typographyScales: ["font-body", "text-transform-secondary"]
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
            foundationRules={[]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="tooltip" title="Tooltip Sandbox" description="Interactive components for Tooltip" icon="widgets" />
                    <CanvasBody.Demo className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl">
                <TooltipProvider delayDuration={0}>
                    <Tooltip open={true}>
                        <TooltipTrigger asChild>
                            <Button variant="flat" className="cursor-default">Hover</Button>
                        </TooltipTrigger>
                        <TooltipContent
                            style={Object.assign({}, {
                                '--tooltip-padding-x': `${paddingX[0]}px`,
                                '--tooltip-padding-y': `${paddingY[0]}px`,
                                '--tooltip-radius': `${radius[0]}px`,
                            } as React.CSSProperties)}
                        >
                            <p>Add to library</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}