'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import { Progress } from '../../../../../genesis/atoms/interactive/progress';

export default function ProgressSandboxPage() {    const [height, setHeight] = useState([4]);
    const [radius, setRadius] = useState([9999]);

    // Fetch initial settings
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/progress" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Progress Structural Settings", type: "Docs Link", filePath: "zap/molecules/progress/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--progress-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={1} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--progress-radius</span>
                                    <span className="font-bold">{radius[0]}px</span>
                                </div>
                                <Slider value={radius} onValueChange={setRadius} min={0} max={32} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Progress"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/progress.tsx"
            importPath="@/components/ui/progress"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: [],
                typographyScales: []
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
            foundationRules={[]}
        >
            <div 
                className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl"
                style={Object.assign({}, {
                     '--progress-height': `${height[0]}px`,
                     '--progress-radius': `${radius[0]}px`,
                } as React.CSSProperties)}
            >
                <div className="w-[60%] flex gap-4 flex-col">
                    <p className="font-display text-body-small">Uploading file...</p>
                    <Progress value={60} className="w-full" />
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}