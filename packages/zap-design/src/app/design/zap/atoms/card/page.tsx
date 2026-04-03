'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { CardsSection } from '../../../../../zap/sections/molecules/containment/CardsSection';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function CardSandboxPage() {
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[1].value);
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[4].value);
    const [padding, setPadding] = useState('24px');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Internal Padding</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={padding}
                        onChange={(e) => setPadding(e.target.value)}
                    >
                        {['12px', '16px', '24px', '32px', '48px'].map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="p-3 text-[10px] font-bold text-muted-foreground bg-layer-panel border border-border/50 rounded uppercase tracking-tighter leading-tight">
                <p><strong>L1</strong> → Universal Tokens</p>
                <p><strong>L3</strong> → Component Overrides</p>
                <p className="pt-2 opacity-60">Controls above seed primary L3 variables with M3 token fallbacks.</p>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--card-border-width']) setBorderWidth(variables['--card-border-width']);
        if (variables['--card-border-radius']) setBorderRadius(variables['--card-border-radius']);
        if (variables['--spacing-card-pad']) setPadding(variables['--spacing-card-pad']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Cards & Containers"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/zap/sections/molecules/containment/CardsSection.tsx"
            importPath="@/zap/sections/molecules/containment/CardsSection"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['bg-layer-panel', 'bg-layer-dialog', 'bg-card'],
                typographyScales: ['text-foreground', 'text-muted-foreground'],
            }}
            platformConstraints={{
                web: 'Grid is 3-col on desktop, 1-col on mobile.',
                mobile: 'Cards stack vertically with reduced padding.',
            }}
            foundationRules={[
                'Section containers use bg-layer-panel (L3 surface).',
                'Inner cards use bg-layer-dialog (L4 surface).',
                'Outlined cards use bg-card.',
            ]}
            publishPayload={{
                '--card-border-width': borderWidth,
                '--card-border-radius': borderRadius,
                '--spacing-card-pad': padding,
            }}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="containment-showcase" 
                        number="01"
                        title="Containment Showcase"
                        icon="dashboard"
                        description="M3 containment roles applying L2 spatial restoration to L3/L4 surfaces."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full flex flex-col gap-8 py-8" style={{
                            '--card-border-width': borderWidth,
                            '--card-border-radius': borderRadius,
                            '--spacing-card-pad': padding,
                        } as any}>
                            <CardsSection />
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
