'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { ScrollArea } from '../../../../../genesis/molecules/scroll-area';
import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function ScrollAreaSandbox() {
    // Dynamic Properties State
    const [height, setHeight] = useState([200]);
    const [width, setWidth] = useState([350]);
    const [borderRadius, setBorderRadius] = useState([8]);
    

            const handleLoadedVariables = (variables: Record<string, string>) => {
                if (variables['--scroll-area-height']) setHeight([parseCssToNumber(variables['--scroll-area-height'])]);
                            if (variables['--scroll-area-width']) setWidth([parseCssToNumber(variables['--scroll-area-width'])]);
                            if (variables['--scroll-area-border-radius']) setBorderRadius([parseCssToNumber(variables['--scroll-area-border-radius'])]);
            };
        
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/scroll-area/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Scroll Area Structural Settings", type: "Docs Link", filePath: "zap/atoms/scroll-area/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--scroll-area-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={100} max={600} step={10} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--scroll-area-width</span>
                                    <span className="font-bold">{width[0]}px</span>
                                </div>
                                <Slider value={width} onValueChange={setWidth} min={200} max={800} step={10} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--scroll-area-border-radius</span>
                                    <span className="font-bold">{borderRadius[0]}px</span>
                                </div>
                                <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={32} step={2} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Scroll Area"
            tier="L3 ATOM"
            status="Beta"
            importPath="@/components/ui/scroll-area"
            filePath="src/components/ui/scroll-area.tsx"
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
            ]} publishPayload={{ '--scroll-area-height': height[0] + 'px',
                        '--scroll-area-width': width[0] + 'px',
                        '--scroll-area-border-radius': borderRadius[0] + 'px' }} onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .scroll-area-preview-sandbox {
                    --scroll-area-height: ${height[0]}px;
                    --scroll-area-width: ${width[0]}px;
                    --scroll-area-border-radius: ${borderRadius[0]}px;
                }
            ` }} />
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 scroll-area-preview-sandbox"
            >
                <div className="w-full flex flex-col items-center justify-center p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-[length:var(--card-border-radius,12px)] min-h-[400px]">
                    <div className="w-full max-w-md bg-layer-dialog border border-outline-variant rounded-[length:var(--card-border-radius,12px)] shadow-xl overflow-hidden flex flex-col">
                        
                        <div className="p-6 border-b border-border/40">
                            <h2 className="text-title-small font-semibold text-transform-primary mb-1">Available Tags</h2>
                            <p className="text-body-small text-muted-foreground font-body leading-relaxed">
                                Scroll through the list of internal system tags.
                            </p>
                        </div>

                        <div className="p-6 bg-layer-surface/30 flex justify-center">
                            <ScrollArea className="border border-border bg-layer-dialog shadow-sm">
                                <div className="p-4">
                                    <h4 className="mb-4 text-labelLarge font-display font-medium leading-none text-transform-primary">System Tags</h4>
                                    {Array.from({ length: 50 }).map((_, i) => (
                                        <React.Fragment key={i}>
                                            <div className="text-body-small font-body text-transform-secondary">
                                                Tag {i + 1}
                                            </div>
                                            <div className="my-2 border-b border-border/50" />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-body-small text-muted-foreground/50">
                        M3 dynamic variable protocol correctly scaling container dimensions and clipping via `overflow: hidden`.
                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
