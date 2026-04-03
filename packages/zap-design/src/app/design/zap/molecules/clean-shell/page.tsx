'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { CleanShell } from '../../../../../genesis/molecules/clean-shell/CleanShell';
import { CleanShellCover } from '../../../../../genesis/molecules/clean-shell/CleanShellCover';
import { CleanShellInspector } from '../../../../../genesis/molecules/clean-shell/CleanShellInspector';
import { ThemeHeader } from '../../../../../genesis/molecules/layout/ThemeHeader';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function CleanShellSandboxPage() {
    const inspectorControls = (
        
            <div className="space-y-4">
                
                    <div className="space-y-6">
 <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider ">Extracted Figma Properties</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
 <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground ">
                                    <span>--shell-width</span>
                                    <span className="font-bold">1440px</span>
                                </div>
 <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground ">
                                    <span>--shell-height</span>
                                    <span className="font-bold">1024px</span>
                                </div>
 <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground ">
                                    <span>--sidebar-width</span>
                                    <span className="font-bold">280px (L2)</span>
                                </div>
 <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground ">
                                    <span>--header-height</span>
                                    <span className="font-bold">56px (h-14)</span>
                                </div>
 <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground ">
                                    <span>--shell-bg</span>
                                    <span className="font-bold">bg-layer-1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>
        
    );

    return (
        <ComponentSandboxTemplate
            componentName="Clean Shell"
            tier="L6 ORGANISM"
            status="Verified"
            filePath="src/genesis/molecules/clean-shell/CleanShell.tsx"
            importPath="@/genesis/molecules/clean-shell/CleanShell"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-surface', '--md-sys-color-on-surface'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "1440x1024 Fixed Layout Constraint",
                mobile: "N/A"
            }}
            foundationRules={[
                "M3 Layer Semantic Injection",
                "Strict OpenPencil Dimension Extraction"
            ]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="clean-shell" title="Clean Shell Sandbox" description="Interactive components for Clean Shell" icon="widgets" />
                    <CanvasBody.Demo className="w-full space-y-12 animate-in fade-in duration-500 pb-16">
                <div className="p-12 flex flex-col items-center justify-center gap-4 text-on-surface w-full bg-layer-panel/50 rounded-xl">
                    <div className="transform scale-50 origin-top border border-outline shadow-2xl overflow-hidden rounded-xl">
                        <CleanShell>
                            <CleanShellCover 
                                spacing="8"
                                header={<ThemeHeader title="Workspace" breadcrumb="ZAP Design Engine / Clean Shell" />}
                            >
                                <div className="text-center space-y-4 max-w-lg mb-12">
                                    <h2 className="text-displaySmall font-display text-transform-primary font-bold text-foreground">OpenPencil Grid Pipeline</h2>
                                    <p className="text-bodyLarge text-muted-foreground">
                                        Mock children injected natively using the strict <code>CleanShellCover</code> wrapper component.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="h-48 border border-border border-dashed rounded flex justify-center items-center text-muted-foreground/50">Data Widget</div>
                                    <div className="h-48 border border-border border-dashed rounded flex justify-center items-center text-muted-foreground/50">List Widget</div>
                                </div>
                            </CleanShellCover>

                            <CleanShellInspector 
                                width="w-[280px]"
                                title="inspector lab"
                                showDevToggle={true}
                                footer={
                                    <button className="w-full h-10 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
                                        publish to metro
                                    </button>
                                }
                            >
                                <div className="p-4 space-y-6 flex-1">
                                    <div className="space-y-4">
                                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>
                                            Metadata
                                        </div>
                                        <div className="h-10 w-full bg-muted/10 rounded border border-border"></div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                            Controls
                                        </div>
                                        <div className="h-10 w-full bg-muted/10 rounded border border-border"></div>
                                        <div className="h-10 w-full bg-muted/10 rounded border border-border"></div>
                                        <div className="h-10 w-full bg-muted/10 rounded border border-border"></div>
                                        <div className="h-10 w-full bg-muted/10 rounded border border-border"></div>
                                        <div className="h-10 w-full bg-muted/10 rounded border border-border"></div>
                                        <div className="h-10 w-full bg-muted/10 rounded border border-border"></div>
                                    </div>
                                </div>
                            </CleanShellInspector>
                        </CleanShell>
                    </div>
                </div>
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}
