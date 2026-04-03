'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function SliderSandboxPage() {
    const [thickness, setThickness] = useState('8px');
    const [thumbSize, setThumbSize] = useState('20px');
    const [sliderValue, setSliderValue] = useState([50]);
    const [disabled, setDisabled] = useState(false);

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Track Thickness</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={thickness}
                            onChange={(e) => setThickness(e.target.value)}
                        >
                            {['2px', '4px', '6px', '8px', '10px', '12px', '16px'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Thumb Scale</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={thumbSize}
                            onChange={(e) => setThumbSize(e.target.value)}
                        >
                            {['12px', '16px', '20px', '24px', '28px', '32px'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-label-medium font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Disabled State</span>
                <input 
                    type="checkbox" 
                    checked={disabled} 
                    onChange={(e) => setDisabled(e.target.checked)} 
                    className="accent-primary"
                />
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--slider-track-thickness']) setThickness(variables['--slider-track-thickness']);
        if (variables['--slider-thumb-size']) setThumbSize(variables['--slider-thumb-size']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Slider"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/slider.tsx"
            importPath="@/genesis/atoms/interactive/slider"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container-highest'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "Accessible slider based on Radix UI primitives.",
                mobile: "Large hit areas for thumb tracking on mobile devices."
            }}
            foundationRules={[
                "Sliders must use --color-primary for the track range.",
                "Thumb must be centered on the track stroke."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="linear_scale"
                        description="Live-configured slider testing track thickness and spatial restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center gap-8" style={{ borderRadius: '24px' }}>
                           <div className="w-full space-y-4" style={{ 
                               '--slider-track-thickness': thickness,
                               '--slider-thumb-size': thumbSize
                           } as any}>
                               <div className="flex justify-between items-end">
                                   <span className="text-labelSmall font-body text-primary uppercase tracking-widest font-bold">System Volume</span>
                                   <span className="text-titleLarge font-display font-black text-primary">{sliderValue[0]}%</span>
                               </div>
                               <Slider 
                                   disabled={disabled}
                                   value={sliderValue}
                                   onValueChange={setSliderValue}
                                   max={100}
                                   step={1}
                               />
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="scale-variants" 
                        number="02"
                        title="Scale Variants"
                        icon="straighten"
                        description="Core architectural scaling across ZAP-standard size roles."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl" style={{ 
                            '--slider-track-thickness': thickness,
                            '--slider-thumb-size': thumbSize
                        } as any}>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Labeled Display</div>
                                <Slider label="BRIGHTNESS" showValue defaultValue={[75]} />
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Discrete Steps</div>
                                <Slider showSteps label="OPACITY" defaultValue={[50]} step={25} />
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
