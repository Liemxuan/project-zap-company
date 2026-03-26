'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Separator } from '../../../../../genesis/atoms/interactive/separator';
import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function SeparatorSandbox() {
    // Dynamic Properties State
    const [thickness, setThickness] = useState([1]);
    const [width, setWidth] = useState([100]);
            const handleLoadedVariables = (variables: Record<string, string>) => {
                if (variables['--separator-thickness']) setThickness([parseCssToNumber(variables['--separator-thickness'])]);
                            if (variables['--separator-width']) setWidth([parseCssToNumber(variables['--separator-width'])]);
            };
        
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/separator/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Separator Structural Settings", type: "Docs Link", filePath: "zap/atoms/separator/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--separator-thickness</span>
                                    <span className="font-bold">{thickness[0]}px</span>
                                </div>
                                <Slider value={thickness} onValueChange={setThickness} min={1} max={10} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--separator-width</span>
                                    <span className="font-bold">{width[0]}%</span>
                                </div>
                                <Slider value={width} onValueChange={setWidth} min={10} max={100} step={5} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Separator"
            tier="L3 ATOM"
            status="Beta"
            importPath="@/components/ui/separator"
            filePath="src/components/ui/separator.tsx"
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
            ]} publishPayload={{ '--separator-thickness': thickness[0] + 'px',
                        '--separator-width': width[0] + '%' }} onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .separator-preview-sandbox {
                    --separator-thickness: ${thickness[0]}px;
                    --separator-width: ${width[0]}%;
                }
            ` }} />
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 separator-preview-sandbox"
            >
                <div className="w-full flex flex-col items-center justify-center p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-[length:var(--card-border-radius,12px)] min-h-[400px]">
                    <div className="w-full max-w-sm flex items-center justify-center">
                       <div className="flex flex-col gap-8 w-full items-center">
                            <div className="text-sm">Content Above</div>
                            
                            <Separator 
                                orientation="horizontal"
                                style={Object.assign({}, {
                                    height: 'var(--separator-thickness)',
                                    width: 'var(--separator-width)'
                                })}
                            />
                            
                            <div className="text-sm text-muted-foreground">Content Below</div>
                       </div>
                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
