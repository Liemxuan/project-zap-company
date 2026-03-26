'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';

import { Breadcrumbs } from '../../../../../genesis/molecules/navigation/Breadcrumbs';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function BreadcrumbsSandboxPage() {    const [gap, setGap] = useState([6]);
    const [iconSize, setIconSize] = useState([12]);
    const [padding, setPadding] = useState([8]);

    // Fetch initial settings
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/breadcrumb" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Breadcrumbs Structural Settings", type: "Docs Link", filePath: "zap/molecules/breadcrumb/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--breadcrumb-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Slider value={gap} onValueChange={setGap} min={0} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--breadcrumb-icon-size</span>
                                    <span className="font-bold">{iconSize[0]}px</span>
                                </div>
                                <Slider value={iconSize} onValueChange={setIconSize} min={8} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--breadcrumb-padding</span>
                                    <span className="font-bold">{padding[0]}px</span>
                                </div>
                                <Slider value={padding} onValueChange={setPadding} min={0} max={32} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
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
            <div 
                className="w-full p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl flex items-center justify-center min-h-[200px] animate-in fade-in duration-500 pb-16"
                style={Object.assign({}, {
                    '--breadcrumb-gap': `${gap[0]}px`,
                    '--breadcrumb-icon-size': `${iconSize[0]}px`,
                    '--breadcrumb-padding': `${padding[0]}px`
                } as React.CSSProperties)}
            >
                <Breadcrumbs 
                    items={[
                        { label: 'Home' },
                        { label: 'Design System' },
                        { label: 'Components' },
                        { label: 'Breadcrumbs', active: true }
                    ]} 
                />
            </div>
        </ComponentSandboxTemplate>
    );
}