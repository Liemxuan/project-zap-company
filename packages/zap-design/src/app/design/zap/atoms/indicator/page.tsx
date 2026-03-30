
'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { StatusDot as Indicator } from '../../../../../genesis/atoms/status/indicators';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function IndicatorSandboxPage() {
    const [height, setHeight] = useState([40]);
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([8]);
    
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/indicator/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "StatusDot Structural Settings", type: "Docs Link", filePath: "zap/atoms/indicator/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--indicator-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={16} max={128} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--indicator-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--indicator-border-radius</span>
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

            const handleLoadedVariables = (variables: Record<string, string>) => {
                if (variables['--indicator-height']) setHeight([parseCssToNumber(variables['--indicator-height'])]);
                            if (variables['--indicator-border-width']) setBorderWidth([parseCssToNumber(variables['--indicator-border-width'])]);
                            if (variables['--indicator-border-radius']) setBorderRadius([parseCssToNumber(variables['--indicator-border-radius'])]);
            };
        
    return (
        <ComponentSandboxTemplate
            componentName="StatusDot"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/genesis/atoms/status/indicators.tsx"
            importPath="@/genesis/atoms/status/indicators"
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
            ]} publishPayload={{ '--indicator-height': height[0] + 'px',
                        '--indicator-border-width': borderWidth[0] + 'px',
                        '--indicator-border-radius': borderRadius[0] + 'px' }} onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .indicator-preview-sandbox {
                    --card-border-width: 1px;
                    --card-radius: 12px;
                    --indicator-height: ${height[0]}px;
                    --indicator-border-width: ${borderWidth[0]}px;
                    --indicator-border-radius: ${borderRadius[0]}px;
                }
            ` }} />
            <div 
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 indicator-preview-sandbox"
            >
                <div className="p-12 bg-layer-panel shadow-sm border-[length:var(--card-border-width)] border-outline-variant rounded-[length:var(--card-radius)] flex flex-wrap gap-4 items-center justify-center text-on-surface w-full min-h-[160px]">
                   <div className="flex gap-4 justify-center">
                       <Indicator intent="online" />
                       <Indicator intent="offline" />
                       <Indicator intent="warning" />
                       <Indicator intent="idle" />
                       <Indicator intent="processing" />
                   </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}

