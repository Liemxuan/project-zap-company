'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function SliderSandbox() {
    // Dynamic Properties State
    const [thickness, setThickness] = useState([8]);
    const [thumbSize, setThumbSize] = useState([20]);
    const [sliderValue, setSliderValue] = useState([50]);

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--slider-track-thickness']) setThickness([parseCssToNumber(variables['--slider-track-thickness'])]);
        if (variables['--slider-thumb-size']) setThumbSize([parseCssToNumber(variables['--slider-thumb-size'])]);
    };

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/slider/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Slider Structural Settings", type: "Docs Link", filePath: "zap/atoms/slider/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--slider-track-thickness</span>
                                    <span className="font-bold">{thickness[0]}px</span>
                                </div>
                                <Slider value={thickness} onValueChange={setThickness} min={2} max={20} step={2} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--slider-thumb-size</span>
                                    <span className="font-bold">{thumbSize[0]}px</span>
                                </div>
                                <Slider value={thumbSize} onValueChange={setThumbSize} min={10} max={40} step={2} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    return (
        <ComponentSandboxTemplate
            componentName="Slider"
            tier="L3 ATOM"
            status="Verified"
            importPath="@/genesis/atoms/interactive/slider"
            filePath="src/genesis/atoms/interactive/slider.tsx"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', 'bg-secondary-container', 'text-on-secondary-container'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Supported",
                mobile: "Touch Supported (Radix Primitive)"
            }}
            foundationRules={[
                "CSS var driven: --slider-track-thickness, --slider-thumb-size",
                "Optional label, showValue badge, showSteps dots, info callout",
                "Built on radix-ui Slider for accessibility"
            ]}
            publishPayload={{
                '--slider-track-thickness': thickness[0] + 'px',
                '--slider-thumb-size': thumbSize[0] + 'px'
            }}
            onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .slider-preview-sandbox {
                    --slider-track-thickness: ${thickness[0]}px;
                    --slider-thumb-size: ${thumbSize[0]}px;
                }
            ` }} />
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 slider-preview-sandbox"
            >
                <div className="w-full flex flex-col items-center justify-center p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-[length:var(--card-border-radius,12px)] min-h-[400px]">
                    <div className="w-full max-w-md bg-layer-dialog border border-outline-variant rounded-[length:var(--card-border-radius,12px)] shadow-xl overflow-hidden flex flex-col">
                        
                        <div className="p-6 border-b border-border/40">
                            <h2 className="text-title-small font-semibold text-transform-primary mb-1">Audio & Display</h2>
                            <p className="text-body-small text-muted-foreground font-body leading-relaxed">
                                Adjust your system preferences using dynamic atomic sliders.
                            </p>
                        </div>

                        <div className="p-6 flex flex-col gap-10">
                            {/* ── Basic Slider ───────────────────────────────── */}
                            <div className="space-y-4">
                                <h3 className="text-label-small font-display font-bold text-muted-foreground uppercase tracking-widest">Brightness</h3>
                                <Slider
                                    value={sliderValue}
                                    onValueChange={setSliderValue}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            {/* ── Labeled Slider with Value Badge ─────────────── */}
                            <div className="space-y-4">
                                <h3 className="text-label-small font-display font-bold text-muted-foreground uppercase tracking-widest">Volume Output</h3>
                                <Slider
                                    label="VOLUME"
                                    showValue
                                    value={sliderValue}
                                    onValueChange={setSliderValue}
                                    max={100}
                                    step={1}
                                />
                            </div>

                            {/* ── Labeled Slider with Steps + Info ────────────── */}
                            <div className="space-y-4">
                                <h3 className="text-label-small font-display font-bold text-muted-foreground uppercase tracking-widest">System Opacity</h3>
                                <Slider
                                    label="OPACITY"
                                    showValue
                                    showSteps
                                    defaultValue={[75]}
                                    max={100}
                                    step={25}
                                    info="Discrete steps: 0, 25, 50, 75, 100."
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
