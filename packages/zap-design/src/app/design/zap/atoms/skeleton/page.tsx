'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Skeleton } from '../../../../../genesis/atoms/interactive/skeleton';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';

export default function SkeletonSandboxPage() {
    const [borderRadius, setBorderRadius] = useState(BORDER_RADIUS_TOKENS[2].value); // Default to medium rounded
    const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_TOKENS[0].value); // Default to 0
    const [opacity, setOpacity] = useState('0.1');

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
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Default Opacity</label>
                    <select 
                        className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        value={opacity}
                        onChange={(e) => setOpacity(e.target.value)}
                    >
                        {['0.05', '0.1', '0.15', '0.2', '0.3'].map(o => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--skeleton-opacity']) setOpacity(variables['--skeleton-opacity']);
        if (variables['--skeleton-border-width']) setBorderWidth(variables['--skeleton-border-width']);
        if (variables['--skeleton-border-radius']) setBorderRadius(variables['--skeleton-border-radius']);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Skeleton"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/skeleton.tsx"
            importPath="@/genesis/atoms/interactive/skeleton"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-surface-container-highest'],
                typographyScales: []
            }}
            platformConstraints={{
                web: "Accessible ARIA live regions should be used with skeleton loaders.",
                mobile: "Pulsing animations should comply with reduced motion settings."
            }}
            foundationRules={[
                "Skeletons should use surface-container-highest for background color.",
                "Pulse animation speed should be consistent across all loader types."
            ]}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="pending"
                        description="Live-configured placeholder testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-sm p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col gap-6" style={{ borderRadius: '24px' }}>
                           <div className="flex items-center gap-4" style={{ 
                               '--skeleton-opacity': opacity,
                               '--skeleton-border-width': borderWidth,
                               '--skeleton-border-radius': borderRadius
                           } as any}>
                               <Skeleton className="h-12 w-12 rounded-full" />
                               <div className="space-y-2 flex-1">
                                   <Skeleton className="h-4 w-3/4 rounded" />
                                   <Skeleton className="h-3 w-1/2 rounded" />
                               </div>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="composite-loading" 
                        number="02"
                        title="Composite Loading"
                        icon="auto_awesome_motion"
                        description="Complex structural layout placeholders for high-density dashboard modules."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8" style={{ 
                            '--skeleton-opacity': opacity,
                            '--skeleton-border-width': borderWidth,
                            '--skeleton-border-radius': borderRadius
                        } as any}>
                            <div className="p-6 bg-layer-panel border border-border/40 rounded-xl space-y-4">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Profile Card</div>
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-16 w-16" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-layer-panel border border-border/40 rounded-xl space-y-4">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2">Article Feed</div>
                                <div className="space-y-3">
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-full" />
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
