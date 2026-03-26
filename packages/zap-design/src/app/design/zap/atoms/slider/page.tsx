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
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--slider-track-thickness</span>
                                    <span className="font-bold">{thickness[0]}px</span>
                                </div>
                                <Slider value={thickness} onValueChange={setThickness} min={2} max={20} step={2} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
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
                {/* ── Basic Slider ───────────────────────────────── */}
                <div className="w-full flex flex-col items-center justify-center p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-[length:var(--card-border-radius,12px)] min-h-[200px]">
                    <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-widest mb-8">Basic</h3>
                    <div className="w-full max-w-sm flex items-center justify-center">
                        <Slider
                            value={sliderValue}
                            onValueChange={setSliderValue}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* ── Labeled Slider with Value Badge ─────────────── */}
                <div className="w-full flex flex-col items-center justify-center p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-[length:var(--card-border-radius,12px)] min-h-[200px]">
                    <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-widest mb-8">Labeled + Value</h3>
                    <div className="w-full max-w-sm">
                        <Slider
                            label="VOLUME"
                            showValue
                            value={sliderValue}
                            onValueChange={setSliderValue}
                            max={100}
                            step={1}
                        />
                    </div>
                </div>

                {/* ── Labeled Slider with Steps + Info ────────────── */}
                <div className="w-full flex flex-col items-center justify-center p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-[length:var(--card-border-radius,12px)] min-h-[200px]">
                    <h3 className="text-xs font-display font-bold text-muted-foreground uppercase tracking-widest mb-8">Steps + Info</h3>
                    <div className="w-full max-w-sm">
                        <Slider
                            label="OPACITY"
                            showValue
                            showSteps
                            defaultValue={[75]}
                            max={100}
                            step={25}
                            info="Discrete steps: 0, 25, 50, 75, 100. Useful for selecting fixed tiers."
                        />
                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
