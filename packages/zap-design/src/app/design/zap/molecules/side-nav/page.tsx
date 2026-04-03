'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { SideNav } from '../../../../../genesis/molecules/navigation/SideNav';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../../genesis/atoms/interactive/select';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { parseCssToNumber } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function SideNavSandboxPage() {
    const [showContent, setShowContent] = useState(true);
    const [borderWidth, setBorderWidth] = useState([0]);
    const [borderRadius, setBorderRadius] = useState([8]);

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--navlink-border-width']) setBorderWidth([parseCssToNumber(variables['--navlink-border-width'])]);
        if (variables['--navlink-border-radius']) setBorderRadius([parseCssToNumber(variables['--navlink-border-radius'])]);
    };    const inspectorControls = (
        
            <div className="space-y-4">
                
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Controls</h4>
                        
                        <div className="space-y-4 pb-4 border-b border-border/50">
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={showContent ? 'text-primary font-bold' : ''}>Show Mock Content</span>
                                <Switch aria-label="Switch component" checked={showContent} onCheckedChange={setShowContent} />
                            </div>
                        </div>

                        {/* Structural Settings from NavLink */}
                        
                            <div className="space-y-6">
                                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Structural Config</h4>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-label-small font-secondary text-transform-secondary text-muted-foreground">
                                        <span>NavLink Border Width</span>
                                        <span className="font-bold">{borderWidth[0]}px</span>
                                    </div>
                                    <Select value={String(borderWidth[0])} onValueChange={(v) => setBorderWidth([parseInt(v, 10) || 0])}>
                                <SelectTrigger aria-label="Select token" className="w-full">
                                    <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BORDER_WIDTH_TOKENS.map(t => <SelectItem key={t.token} value={t.value.replace(/[^0-9.]/g, '')}>{t.name} ({t.value})</SelectItem>)}
                                </SelectContent>
                            </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-label-small font-secondary text-transform-secondary text-muted-foreground">
                                        <span>NavLink Corner Radius</span>
                                        <span className="font-bold">{borderRadius[0]}px</span>
                                    </div>
                                    <Select value={String(borderRadius[0])} onValueChange={(v) => setBorderRadius([parseInt(v, 10) || 0])}>
                                <SelectTrigger aria-label="Select token" className="w-full">
                                    <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BORDER_RADIUS_TOKENS.map(t => <SelectItem key={t.token} value={t.value.replace(/[^0-9.]/g, '')}>{t.name} ({t.value})</SelectItem>)}
                                </SelectContent>
                            </Select>
                                </div>
                            </div>
                        

                    </div>
                
            </div>
        
    );

    return (
        <div className="contents" style={Object.assign({
            '--navlink-border-width': `${borderWidth[0]}px`,
            '--navlink-border-radius': `${borderRadius[0]}px`,
        })}>
            <ComponentSandboxTemplate
                componentName="Side Navigation"
                tier="L6 ORGANISM"
                status="Verified"
                filePath="src/genesis/molecules/navigation/SideNav.tsx"
                importPath="@/genesis/molecules/navigation/SideNav"
                inspectorControls={inspectorControls}
                publishPayload={{
                    '--navlink-border-width': `${borderWidth[0]}px`,
                    '--navlink-border-radius': `${borderRadius[0]}px`,
                }}
                onLoadedVariables={handleLoadedVariables}
                foundationInheritance={{
                    colorTokens: ['bg-layer-panel', 'border-black'],
                    typographyScales: ['font-body text-transform-secondary', 'font-mono text-transform-tertiary']
                }}
                platformConstraints={{ web: "Core layout constraint", mobile: "Collapses to drawer/burger menu" }}
            foundationRules={[
                "Width perfectly aligns to CSS variable --sys-sidebar-width.",
                "Left border matches standard ZAP surface token separation.",
                "Collapses beautifully keeping icon hierarchy.",
                "Requires <AppShell> flex-container for proper placement."
            ]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="side-nav" title="Side Navigation Sandbox" description="Interactive components for Side Navigation" icon="widgets" />
                    <CanvasBody.Demo className="w-full h-full flex items-start justify-center p-0 md:p-12 relative overflow-visible rounded-xl">
                
                    <div className="w-full max-w-[1240px] h-[750px] bg-background border border-outline-variant rounded-xl overflow-hidden shadow-xl flex relative">
                        {/* THE SIDENAV IN ACTION */}
                        <SideNav showDevWrapper={true} />

                        {/* MOCK PAGE CONTENT */}
                        {showContent && (
                            <main className="flex-1 overflow-y-auto p-12 bg-layer-base flex flex-col items-center">
                                <div className="max-w-3xl w-full">
                                    <h2 className="text-3xl font-bold font-display text-transform-primary mb-4 text-on-surface">Layout Simulator</h2>
                                    <p className="text-muted-foreground font-body text-transform-secondary leading-relaxed max-w-xl">
                                        The <code>SideNav</code> component acts as the foundational structural wall for the standard ZAP Design Engine App Shell. 
                                        You are currently viewing it functionally integrated into a fake App Shell mock dimension.
                                    </p>
                                    
                                    <div className="mt-12 border border-outline-variant rounded-[var(--card-radius,16px)] bg-layer-cover p-8 shadow-sm">
                                        <div className="h-4 bg-outline-variant/30 rounded w-1/3 animate-pulse mb-6"></div>
                                        <div className="space-y-3">
                                            <div className="h-3 bg-outline-variant/20 rounded w-full animate-pulse"></div>
                                            <div className="h-3 bg-outline-variant/20 rounded w-full animate-pulse"></div>
                                            <div className="h-3 bg-outline-variant/20 rounded w-3/4 animate-pulse"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mt-6">
                                        <div className="h-32 border border-outline-variant rounded-[var(--card-radius,16px)] bg-layer-cover animate-pulse p-4"></div>
                                        <div className="h-32 border border-outline-variant rounded-[var(--card-radius,16px)] bg-layer-cover animate-pulse p-4"></div>
                                    </div>
                                </div>
                            </main>
                        )}
                        {!showContent && (
                            <main className="flex-1 bg-layer-base flex items-center justify-center">
                                <span className="text-muted-foreground text-body-small font-dev text-transform-tertiary tracking-widest text-transform-secondary opacity-50">Content Layer Disabled</span>
                            </main>
                        )}
                    </div>
                
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
        </div>
    );
}
