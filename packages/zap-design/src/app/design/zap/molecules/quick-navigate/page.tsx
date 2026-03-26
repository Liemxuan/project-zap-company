'use client';
import { parseCssToNumber } from '../../../../../lib/utils';
import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Label } from '../../../../../genesis/atoms/interactive/label';
import { QuickNavigate } from '../../../../../genesis/molecules/quick-navigate';

export default function QuickNavigateSandboxPage() {
    const [inputHeight, setInputHeight] = useState([48]);
    const [inputRadius, setInputRadius] = useState([12]);

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/quick-navigate/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Combobox Structural Settings", type: "Docs Link", filePath: "zap/molecules/quick-navigate/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                    <span>--input-height</span>
                                    <span className="font-bold">{inputHeight[0]}px</span>
                                </div>
                                <Slider value={inputHeight} onValueChange={setInputHeight} min={32} max={64} step={4} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
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

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--input-height']) setInputHeight([parseCssToNumber(variables['--input-height'])]);
        if (variables['--input-border-radius']) setInputRadius([parseCssToNumber(variables['--input-border-radius'])]);
    };
        

    return (
        <ComponentSandboxTemplate
            componentName="Quick Navigate"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="zap/molecules/quick-navigate"
            importPath="combobox pattern using Command and Popover"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-surface-container-highest', '--md-sys-color-primary'],
                typographyScales: ['--font-body (bodyMedium)']
            }}
            platformConstraints={{
                web: "Renders as an inline dropdown (Popover).",
                mobile: "Search overlay could trigger a full screen modal."
            }}
            foundationRules={[
                "Command input area maps to text-transform-primary.",
                "Hover states map to hover:bg-layer-dialog-hover.",
            ]} publishPayload={{ '--input-height': inputHeight[0] + 'px',
                        '--input-border-radius': inputRadius[0] + 'px', }} onLoadedVariables={handleLoadedVariables}
        >
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16"
                style={Object.assign({}, {
                    '--input-height': `${inputHeight[0]}px`,
                    '--input-border-radius': `${inputRadius[0]}px`
                } as React.CSSProperties)}
            >
                <section className="space-y-6">
                    <Wrapper identity={{ displayName: "Section Header", type: "Header", filePath: "zap/molecules/quick-navigate/page.tsx" }} className="w-fit inline-block">
                        <div className="flex items-center justify-start gap-2 text-on-surface-variant text-transform-secondary pb-2 px-2">
                            <Icon name="search" size={14} className="opacity-60" />
                            <h3 className="font-display text-titleSmall tracking-tight text-transform-primary uppercase">Quick Navigate Search</h3>
                        </div>
                    </Wrapper>

                    <div className="bg-layer-panel rounded-[24px] border border-outline-variant/50 p-8 md:p-12 relative overflow-visible h-[400px]">
                        <Wrapper identity={{ displayName: "States Grid Container", type: "Container", filePath: "zap/molecules/quick-navigate/page.tsx" }}>
                            <div className="max-w-xs space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] text-on-surface-variant text-transform-secondary font-bold tracking-widest uppercase mb-2 block">Quick Navigate</Label>
                                    <QuickNavigate className="w-full" />
                                </div>
                            </div>
                        </Wrapper>
                    </div>
                </section>
            </div>
        </ComponentSandboxTemplate>
    );
}
