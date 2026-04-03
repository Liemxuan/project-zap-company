'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { CreditCardInput } from '../../../../../genesis/atoms/formatters/credit-card';
import { CurrencyInput } from '../../../../../genesis/atoms/formatters/currency';
import { PhoneNumberInput } from '../../../../../genesis/atoms/formatters/phone';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function FormattersSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[1].value);

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Input Radius</label>
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
                </div>
            </div>
        </div>
    );

    return (
        <ComponentSandboxTemplate
            componentName="Formatters"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/formatters/"
            importPath="@/genesis/atoms/formatters/*"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface-container-highest'],
                typographyScales: ['--font-body-medium']
            }}
            platformConstraints={{
                web: "Supports react-number-format for complex mask management.",
                mobile: "Triggers appropriate numeric/tel keypads for data entry."
            }}
            foundationRules={[
                "Formatters must extend the base Input component architecture.",
                "Validation cues should use --md-sys-color-error for failure signaling."
            ]}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="masked-inputs" 
                        number="01"
                        title="Masked Inputs"
                        icon="input"
                        description="Pattern-based data entry testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-lg p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col gap-8" style={{ borderRadius: '24px' }}>
                           <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Financial: Credit Card</label>
                                    <CreditCardInput 
                                        placeholder="0000 0000 0000 0000" 
                                        className="h-12 text-lg font-mono font-bold"
                                        style={{ borderRadius: borderRadius } as any}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Economic: USD Currency</label>
                                    <CurrencyInput 
                                        placeholder="$0.00" 
                                        className="h-12 text-lg font-mono font-bold"
                                        style={{ borderRadius: borderRadius } as any}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Global: Telecom Node</label>
                                    <PhoneNumberInput 
                                        placeholder="(555) 555-5555" 
                                        className="h-12 text-lg font-mono font-bold"
                                        style={{ borderRadius: borderRadius } as any}
                                    />
                                </div>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="structural-validation" 
                        number="02"
                        title="Structural Validation"
                        icon="check_circle"
                        description="Technical audit of input mask precision and layout constraints."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                            <div className="p-8 bg-layer-panel border border-border/40 rounded-2xl flex flex-col justify-center">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2 mb-4">Input Metadata</div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-bodySmall font-body text-muted-foreground">Currency: Fixed 2 decimal places.</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-bodySmall font-body text-muted-foreground">Phone: NXX-XXXX pattern enforcement.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-layer-panel border border-border/40 rounded-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-[32px] font-display font-black text-primary mb-2">$1,299.00</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Live Formatter Result</div>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
