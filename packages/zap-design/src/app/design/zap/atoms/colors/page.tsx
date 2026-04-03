'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { InteractiveColorBox } from '../../../../../zap/sections/atoms/color/InteractiveColorBox';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function ColorPaletteSandboxPage() {
    const [selectedPalette, setSelectedPalette] = useState('sys');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Palette Filter</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={selectedPalette}
                            onChange={(e) => setSelectedPalette(e.target.value)}
                        >
                            <option value="sys">System (M3)</option>
                            <option value="brand">Brand (ZAP)</option>
                            <option value="state">Status (Feedback)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ComponentSandboxTemplate
            componentName="Colors"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/zap/sections/color/body.tsx"
            importPath="@/zap/sections/color/body"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-surface'],
                typographyScales: []
            }}
            platformConstraints={{
                web: "Accessible color roles mapping to M3 semantic tokens.",
                mobile: "Ensures contrast ratios meet WCAG 2.1 AA standards for outdoor visibility."
            }}
            foundationRules={[
                "All colors must map to the --md-sys-color-* token namespace.",
                "Primary actions must use the --md-sys-color-primary role."
            ]}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="system-palette" 
                        number="01"
                        title="System Palette"
                        icon="palette"
                        description="M3 semantic token roles testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
                            {[
                                { token: '--md-sys-color-primary', label: 'Primary', on: '--md-sys-color-on-primary' },
                                { token: '--md-sys-color-secondary', label: 'Secondary', on: '--md-sys-color-on-secondary' },
                                { token: '--md-sys-color-tertiary', label: 'Tertiary', on: '--md-sys-color-on-tertiary' },
                                { token: '--md-sys-color-surface', label: 'Surface', on: '--md-sys-color-on-surface' },
                                { token: '--md-sys-color-surface-container', label: 'Surface Cont.', on: '--md-sys-color-on-surface' },
                                { token: '--md-sys-color-outline', label: 'Outline', on: '--md-sys-color-surface' },
                                { token: '--md-sys-color-error', label: 'Error', on: '--md-sys-color-on-error' },
                                { token: '--md-sys-color-success', label: 'Success', on: '--md-sys-color-on-success' },
                            ].map((c) => (
                                <div key={c.token} className="space-y-3 group">
                                    <InteractiveColorBox cssVars={[c.token]} fallbackHex="#000000" className="h-32 w-full rounded-2xl border border-border/40 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:shadow-md"
                                    >
                                        <div className="text-[10px] font-bold uppercase tracking-widest">
                                            Aa
                                        </div>
                                    </InteractiveColorBox>
                                    <div className="flex flex-col">
                                        <span className="text-labelSmall font-body font-bold text-primary uppercase tracking-widest">{c.label}</span>
                                        <span className="text-[10px] font-mono text-muted-foreground opacity-40">{c.token}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="contrast-matrix" 
                        number="02"
                        title="Contrast Matrix"
                        icon="contrast"
                        description="Structural accessibility testing across dynamic theme elevations."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                            <div className="p-8 bg-layer-panel border border-border/40 rounded-2xl flex flex-col gap-6">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">High Contrast Pairing</div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-primary text-primary-foreground flex items-center justify-between">
                                        <span className="text-bodySmall font-bold">Text on Primary</span>
                                        <span className="text-[10px] bg-black/20 px-2 py-1 rounded font-mono uppercase">PASS AAA</span>
                                    </div>
                                    <div className="p-4 rounded-xl bg-layer-surface text-foreground border border-border/10 flex items-center justify-between">
                                        <span className="text-bodySmall font-bold">Text on Surface</span>
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-mono uppercase">PASS AAA</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-layer-panel border border-border/40 rounded-2xl flex flex-col justify-center">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2 mb-4">Color Governance</div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-bodySmall font-body text-muted-foreground">Always use <code>var(--md-sys-color-*)</code> for production code.</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-bodySmall font-body text-muted-foreground">Avoid hardcoded HEX values in components.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
