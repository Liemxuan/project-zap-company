'use client';

import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import React, { useState } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function ThemePublisherSandboxPage() {
    const { theme } = useTheme();
    const [borderRadius, setBorderRadius] = useState([8]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [hideWrapper, setHideWrapper] = useState(false);

    return (
        <ComponentSandboxTemplate
            componentName="Theme Publisher"
            tier="Dev Tooling (L1)"
            status="Verified"
            importPath="@/components/dev/ThemePublisher"
            filePath="src/components/dev/ThemePublisher.tsx"
            inspectorControls={
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-body-small font-medium font-secondary text-transform-secondary text-brand-on-surface">Border Radius</label>
                            <span className="text-label-small text-brand-on-surface/50 font-secondary">{borderRadius[0]}px</span>
                        </div>
                        <Slider
                            value={borderRadius}
                            onValueChange={setBorderRadius}
                            max={48}
                            step={1}
                        />
                        <p className="text-label-medium text-brand-on-surface/50 font-secondary mt-1">
                            Controls `--button-border-radius` which dynamically curves the inspector bounds.
                        </p>
                    </div>

                    <div className="space-y-4 mt-6">
 <h4 className="text-label-small font-bold text-transform-primary font-display tracking-wider">State Controls</h4>
                        <div className="flex items-center justify-between">
                            <label className="text-body-small font-medium font-secondary text-transform-secondary text-brand-on-surface">Loading State</label>
                            <Switch aria-label="Switch component" checked={isLoading} onCheckedChange={setIsLoading} />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-body-small font-medium font-secondary text-transform-secondary text-brand-on-surface">Disabled</label>
                            <Switch aria-label="Switch component" checked={isDisabled} onCheckedChange={setIsDisabled} />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-body-small font-medium font-secondary text-transform-secondary text-brand-on-surface">Hide Dev Wrapper</label>
                            <Switch aria-label="Switch component" checked={hideWrapper} onCheckedChange={setHideWrapper} />
                        </div>
                    </div>
                </div>
            }
            inspectorFooter={
                <ThemePublisher 
                    theme={theme}
                    filePath="src/components/dev/ThemePublisher.tsx"
                    onPublish={() => alert("Simulated Publish Action Broadcasted")}
                    isLoading={isLoading}
                    hideWrapper={hideWrapper}
                    buttonProps={{ disabled: isDisabled }}
                />
            }
            foundationInheritance={{
                colorTokens: ['bg-layer-panel', 'border-outline-variant'],
                typographyScales: ['font-secondary', 'text-transform-secondary']
            }}
            platformConstraints={{
                web: "Renders at the bottom of Component Sandboxes.",
                mobile: "Same layout."
            }}
            foundationRules={[
                "Bypasses standard UI surface rendering to avoid Dev-Mode 'LOUD GREEN' paint overrides via <section>.",
                "Must intercept `--button-border-radius` to explicitly round its own Dashed Inspector Bounds."
            ]}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .dynamic-radius-wrapper {
                    --button-border-radius: ${borderRadius[0]}px;
                }
           `}} />
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="theme-publisher" title="Theme Publisher Sandbox" description="Interactive components for Theme Publisher" icon="widgets" />
                    <CanvasBody.Demo className="w-full">
                        <div
                            className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-outline-variant rounded-xl dynamic-radius-wrapper"
                        >
                <div className="max-w-md w-full relative">
                    <div className="text-center mb-8 px-4 font-secondary text-brand-on-surface">
                        <p className="text-body-small opacity-60 mb-2">Adjust the radius in the left sidebar to watch the dashed Inspector outline dynamically wrap the internal Genesis Button pill geometries.</p>
                    </div>
                    
                    <ThemePublisher 
                        theme={theme}
                        filePath="src/components/dev/ThemePublisher.tsx"
                        onPublish={() => alert("Simulated Publish Action Broadcasted")}
                        isLoading={isLoading}
                        hideWrapper={hideWrapper}
                        buttonProps={{ disabled: isDisabled }}
                    />
                        </div>
                    </div>
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
