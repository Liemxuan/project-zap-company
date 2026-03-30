
'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Panel } from '../../../../../genesis/atoms/surfaces/panel';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function PanelSandboxPage() {
    const [height, setHeight] = useState([40]);
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([8]);

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/panel/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Panel Structural Settings", type: "Docs Link", filePath: "zap/atoms/panel/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--panel-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={16} max={128} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--panel-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--panel-border-radius</span>
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
                if (variables['--panel-height']) setHeight([parseCssToNumber(variables['--panel-height'])]);
                            if (variables['--panel-border-width']) setBorderWidth([parseCssToNumber(variables['--panel-border-width'])]);
                            if (variables['--panel-border-radius']) setBorderRadius([parseCssToNumber(variables['--panel-border-radius'])]);
            };
        
    return (
        <ComponentSandboxTemplate
            componentName="Panel"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/genesis/atoms/surfaces/panel.tsx"
            importPath="@/genesis/atoms/surfaces/panel"
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
            ]} publishPayload={{ '--panel-height': height[0] + 'px',
                        '--panel-border-width': borderWidth[0] + 'px',
                        '--panel-border-radius': borderRadius[0] + 'px' }} onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .panel-preview-sandbox {
                    --panel-height: ${height[0]}px;
                    --panel-border-width: ${borderWidth[0]}px;
                    --panel-border-radius: ${borderRadius[0]}px;
                }
            ` }} />
            <div 
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 panel-preview-sandbox"
            >
                   <div className="flex gap-8">
                       <Panel className="p-6 w-64 gap-4 text-center min-h-[length:var(--panel-height,auto)]">
                           <span className="font-display font-medium text-brand-midnight">Standard Panel</span>
                           <span className="text-label-small font-mono text-muted-foreground">Shadow active</span>
                       </Panel>
                       <Panel className="p-6 w-64 gap-4 text-center min-h-[length:var(--panel-height,auto)]" noShadow>
                           <span className="font-display font-medium text-brand-midnight">No Shadow Panel</span>
                           <span className="text-label-small font-mono text-muted-foreground">Radius: {borderRadius[0]}px</span>
                       </Panel>
                   </div>
            </div>
        </ComponentSandboxTemplate>
    );
}

