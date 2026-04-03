'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Input } from '../../../../../genesis/atoms/interactive/inputs';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const sandboxSchema = z.object({
  sandboxError: z.string().min(5, { message: "Simulated Error: Must be 5+ characters." }),
  validInput: z.string()
});

export default function InputSandboxPage() {
    const [disabled, setDisabled] = useState(false);
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[4].value);
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [height, setHeight] = useState('48px');

    const methods = useForm({
        resolver: zodResolver(sandboxSchema),
        defaultValues: { sandboxError: "Bad", validInput: "" },
        mode: "onChange"
    });

    React.useEffect(() => {
        methods.trigger("sandboxError");
    }, [methods]);

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Structural Tokens</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Border Radius</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(e.target.value)}
                        >
                            {BORDER_RADIUS_TOKENS.map(t => (
                                <option key={t.name} value={t.value}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Border Width</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={borderWidth}
                            onChange={(e) => setBorderWidth(e.target.value)}
                        >
                            {BORDER_WIDTH_TOKENS.map(t => (
                                <option key={t.name} value={t.value}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Height Offset</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    >
                        {['32px', '40px', '48px', '56px', '64px'].map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-label-medium font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Disabled State</span>
                <Switch size="sm" checked={disabled} onCheckedChange={setDisabled} />
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--input-height']) setHeight(variables['--input-height']);
        if (variables['--input-border-width']) setBorderWidth(variables['--input-border-width']);
        if (variables['--input-border-radius']) setBorderRadius(variables['--input-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Input"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/inputs.tsx"
            importPath="@/genesis/atoms/interactive/inputs"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-surface-container', '--md-sys-color-on-surface', '--md-sys-color-outline'],
                typographyScales: ['--font-body (bodyLarge)']
            }}
            platformConstraints={{
                web: "Inputs maintain a readable height (default 48px) with clear focus indicators.",
                mobile: "Touch targets require a minimum 48px height. Fonts must be at least 16px for iOS."
            }}
            foundationRules={[
                "Inputs must clearly indicate focus state.",
                "Disabled states use 38% opacity.",
                "Placeholder text must have sufficient contrast."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="visibility"
                        description="Live-configured input field testing L2 surface restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm space-y-4 p-8 bg-layer-panel border border-border/40 shadow-xl rounded-2xl" style={{ borderRadius }}>
                            <div className="space-y-2">
                                <label className="text-labelSmall font-body text-primary uppercase tracking-widest pl-1">Configuration Test</label>
                                <Input
                                    disabled={disabled}
                                    placeholder="Enter your text here..."
                                    style={{ borderRadius, borderWidth, height } as any}
                                />
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section>
                    <SectionHeader id="standard-variants" 
                        number="02"
                        title="Standard Variants"
                        icon="info"
                        description="Core structural variations including filled and icon states."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-3xl">
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Base Structural</div>
                                <div className="space-y-4">
                                    <Input disabled={disabled} placeholder="Outlined (Default)" />
                                    <Input variant="filled" disabled={disabled} placeholder="Filled Variant" />
                                    <Input disabled={true} placeholder="Disabled State" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Enhanced Decoration</div>
                                <div className="space-y-4">
                                    <Input disabled={disabled} placeholder="Search here..." leadingIcon="search" />
                                    <Input disabled={disabled} placeholder="Enter password..." type="password" trailingIcon="visibility" />
                                    <FormProvider {...methods}>
                                        <Input
                                            disabled={disabled}
                                            placeholder="Validation context..."
                                            {...methods.register("sandboxError")}
                                        />
                                    </FormProvider>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <div className="pb-16 flex justify-center opacity-40">
                    <div className="flex items-center gap-2 bg-warning-container text-on-warning-container px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        <Icon name="cloud_download" size={14} className="text-current" />
                        Sync to Layer 3 ZAP Global Template
                    </div>
                </div>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
