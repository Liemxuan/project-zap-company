'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Label } from '../../../../../genesis/atoms/interactive/label';
import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function LabelSandbox() {
    // Dynamic Properties State
    const [fontSize, setFontSize] = useState([14]);
    const [fontWeight, setFontWeight] = useState([500]);
    const [lineHeight, setLineHeight] = useState([20]);
            const handleLoadedVariables = (variables: Record<string, string>) => {
                if (variables['--label-font-size']) setFontSize([parseCssToNumber(variables['--label-font-size'])]);
                            if (variables['--label-font-weight']) setFontWeight([parseCssToNumber(variables['--label-font-weight'])]);
                            if (variables['--label-line-height']) setLineHeight([parseCssToNumber(variables['--label-line-height'])]);
            };
        
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/label/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Label Structural Settings", type: "Docs Link", filePath: "zap/atoms/label/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--label-font-size</span>
                                    <span className="font-bold">{fontSize[0]}px</span>
                                </div>
                                <Slider value={fontSize} onValueChange={setFontSize} min={10} max={24} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--label-font-weight</span>
                                    <span className="font-bold">{fontWeight[0]}</span>
                                </div>
                                <Slider value={fontWeight} onValueChange={setFontWeight} min={100} max={900} step={100} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--label-line-height</span>
                                    <span className="font-bold">{lineHeight[0]}px</span>
                                </div>
                                <Slider value={lineHeight} onValueChange={setLineHeight} min={10} max={40} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Label"
            tier="L3 ATOM"
            status="Beta"
            importPath="@/components/ui/label"
            filePath="src/components/ui/label.tsx"
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
            ]} publishPayload={{ '--label-font-size': fontSize[0] + 'px',
                        '--label-font-weight': fontWeight[0].toString(),
                        '--label-line-height': lineHeight[0] + 'px' }} onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .label-preview-sandbox {
                    --label-font-size: ${fontSize[0]}px;
                    --label-font-weight: ${fontWeight[0]};
                    --label-line-height: ${lineHeight[0]}px;
                }
            ` }} />
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 label-preview-sandbox"
            >
                <div className="p-12 bg-layer-panel shadow-sm border border-outline-variant flex flex-col items-center justify-center rounded-[length:var(--card-radius,12px)] transition-all duration-200 w-full min-h-[160px]">
                    <div className="flex flex-col gap-6 w-full max-w-sm">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative"></div>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
