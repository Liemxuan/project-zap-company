'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';

import { Breadcrumbs } from '../../../../../genesis/molecules/navigation/Breadcrumbs';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function BreadcrumbsSandboxPage() {    const [gap, setGap] = useState([6]);
    const [iconSize, setIconSize] = useState([12]);
    const [padding, setPadding] = useState([8]);

    // Fetch initial settings
    const inspectorControls = (
        
            <div className="space-y-4">
                
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--breadcrumb-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Slider value={gap} onValueChange={setGap} min={0} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--breadcrumb-icon-size</span>
                                    <span className="font-bold">{iconSize[0]}px</span>
                                </div>
                                <Slider value={iconSize} onValueChange={setIconSize} min={8} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--breadcrumb-padding</span>
                                    <span className="font-bold">{padding[0]}px</span>
                                </div>
                                <Slider value={padding} onValueChange={setPadding} min={0} max={32} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                
            </div>
        
    );
    return (
        <ComponentSandboxTemplate
            componentName="Breadcrumbs"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/genesis/molecules/navigation/Breadcrumbs.tsx"
            importPath="@/genesis/molecules/navigation/Breadcrumbs"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: [],
                typographyScales: ["text-transform-secondary"]
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
            foundationRules={[]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="breadcrumb" title="Breadcrumbs Sandbox" description="Interactive components for Breadcrumbs" icon="widgets" />
                    <CanvasBody.Demo className="w-full p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl flex items-center justify-center min-h-[200px] animate-in fade-in duration-500 pb-16">
                <Breadcrumbs 
                    items={[
                        { label: 'Home' },
                        { label: 'Design System' },
                        { label: 'Components' },
                        { label: 'Breadcrumbs', active: true }
                    ]} 
                />
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}