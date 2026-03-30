'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Label } from '../../../../../genesis/atoms/interactive/label';
import { NumberStepper } from '../../../../../genesis/atoms/interactive/number-stepper';

export default function SteppersSandboxPage() {
    const [inputHeight, setInputHeight] = useState([40]);
    const [inputRadius, setInputRadius] = useState([8]);
    const [guests, setGuests] = useState(2);
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/steppers/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Number Stepper Structural Settings", type: "Docs Link", filePath: "zap/molecules/steppers/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                    <span>--input-height</span>
                                    <span className="font-bold">{inputHeight[0]}px</span>
                                </div>
                                <Slider value={inputHeight} onValueChange={setInputHeight} min={32} max={64} step={4} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                    <span>--input-border-radius</span>
                                    <span className="font-bold">{inputRadius[0]}px</span>
                                </div>
                                <Slider value={inputRadius} onValueChange={setInputRadius} min={0} max={24} step={2} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Quantity Stepper"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/number-stepper.tsx"
            importPath="@/components/ui/number-stepper"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-surface-container-highest', '--md-sys-color-primary'],
                typographyScales: ['--font-body (bodyMedium)']
            }}
            platformConstraints={{
                web: "Renders horizontally, with increment and decrement boundaries.",
                mobile: "Same mapping, with touch-responsive targets above 44px."
            }}
            foundationRules={[
                "Increment/Decrement controls disabled when boundaries reached.",
                "Background maps to layer-dialog for text inputs.",
            ]}
        >
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16"
                style={Object.assign({}, {
                    '--input-height': `${inputHeight[0]}px`,
                    '--input-border-radius': `${inputRadius[0]}px`
                } as React.CSSProperties)}
            >
                <section className="space-y-6">
                    <Wrapper identity={{ displayName: "Section Header", type: "Header", filePath: "zap/molecules/steppers/page.tsx" }} className="w-fit inline-block">
                        <div className="flex items-center justify-start gap-2 text-on-surface-variant text-transform-secondary pb-2 px-2">
                            <Icon name="add_circle" size={14} className="opacity-60" />
                            <h3 className="font-display text-titleSmall tracking-tight text-transform-primary uppercase">Quantity Selection</h3>
                        </div>
                    </Wrapper>

                    <div className="bg-layer-panel rounded-[24px] border border-outline-variant/50 p-8 md:p-12 relative overflow-visible">
                        <Wrapper identity={{ displayName: "States Grid Container", type: "Container", filePath: "zap/molecules/steppers/page.tsx" }}>
                            <div className="max-w-sm mx-auto space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-transform-primary font-bold">Number of Guests</Label>
                                    <NumberStepper
                                        value={guests}
                                        onChange={setGuests}
                                        min={1}
                                        max={10}
                                        step={1}
                                    />
                                </div>
                            </div>
                        </Wrapper>
                    </div>
                </section>
            </div>
        </ComponentSandboxTemplate>
    );
}
