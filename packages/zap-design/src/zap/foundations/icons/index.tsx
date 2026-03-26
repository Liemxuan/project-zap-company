'use client';

import React from 'react';
import { Inspector } from '../../../zap/layout/Inspector';
import { IconographyBody } from '../../../zap/sections/atoms/icons/body';

import { Wrapper } from '../../../components/dev/Wrapper';
import { Canvas } from '../../../genesis/atoms/surfaces/canvas';
import { AppShell } from '../../../zap/layout/AppShell';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';

import { InspectorAccordion } from '../../../zap/organisms/laboratory/InspectorAccordion';

export default function IconographyPage() {

    return (
        <AppShell
            inspector={
                <Inspector title="Icon Implementation" width={340}>
                    <div className="font-sans select-none pb-20">
                        {/* Icon Implementation - Local Font Card */}
                        <Wrapper identity={{ displayName: "Inspector: Font Implementation", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/icons/page.tsx" }}>
                            <InspectorAccordion title="Icon Implementation" icon="code" defaultOpen={true}>
                                <div className="space-y-2 p-4 pt-2">
                                    <div className="bg-layer-panel border border-border/50 p-2 rounded-md">
                                        <p className="text-[10px] font-dev text-transform-tertiary text-muted-foreground mb-1">LOCAL VARIABLE FONT</p>
                                        <code className="text-[10px] break-all block text-foreground">
                                            /public/icons/material-symbols-outlined-variable.woff2
                                        </code>
                                    </div>
                                    <div className="bg-layer-panel border border-border/50 p-2 rounded-md">
                                        <p className="text-[10px] font-dev text-transform-tertiary text-muted-foreground mb-1">CSS DEFINITION</p>
                                        <code className="text-[9px] leading-tight block text-foreground whitespace-pre">
                                            {`@font-face {
  font-family: "Material Symbols Outlined";
  src: url("/icons/material-symbols-outlined-variable.woff2");
}`}
                                        </code>
                                    </div>
                                </div>
                            </InspectorAccordion>
                        </Wrapper>

                        {/* Styling Rules Card */}
                        <Wrapper identity={{ displayName: "Inspector: Styling Rules", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/icons/page.tsx" }}>
                            <InspectorAccordion title="Styling Rules" icon="palette" defaultOpen={true}>
                                <div className="space-y-4 p-4 pt-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 border border-border/50 bg-layer-panel/50 text-center rounded-md">
                                            <span className="block text-[10px] font-dev text-transform-tertiary text-muted-foreground ">Weight</span>
                                            <span className="block text-lg font-black text-foreground">400</span>
                                        </div>
                                        <div className="p-2 border border-border/50 bg-layer-panel/50 text-center rounded-md">
                                            <span className="block text-[10px] font-dev text-transform-tertiary text-muted-foreground ">Optical</span>
                                            <span className="block text-lg font-black text-foreground">24px</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold uppercase mb-1 text-muted-foreground">Color Tokens</p>
                                        <div className="flex items-center justify-between text-xs border-b border-dashed border-border/50 pb-1">
                                            <span className="text-muted-foreground">Default</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-foreground border border-border/50 rounded-sm"></div>
                                                <span className="text-foreground">text-foreground</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs border-b border-dashed border-border/50 pb-1">
                                            <span className="text-muted-foreground">Interactive</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-primary border border-primary/20 rounded-sm"></div>
                                                <span className="text-primary">text-primary</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Disabled</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-muted border border-border/50 rounded-sm"></div>
                                                <span className="text-muted-foreground">text-muted</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </InspectorAccordion>
                        </Wrapper>

                        {/* Technical Specs */}
                        <Wrapper identity={{ displayName: "Inspector: Technical Specs", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/icons/page.tsx" }}>
                            <InspectorAccordion title="Technical Specs" icon="info" defaultOpen={true}>
                                <div className="space-y-3 p-4 pt-2">
                                    {[
                                        { label: 'Library', value: 'Material Symbols' },
                                        { label: 'Style', value: 'Outlined' },
                                        { label: 'Fill', value: '0 (None)' },
                                        { label: 'Format', value: 'SVG / WOFF2' },
                                    ].map((row) => (
                                        <div key={row.label} className="flex justify-between items-center text-[11px] pb-1 border-b border-dashed border-border/30 last:border-0">
                                            <span className="text-muted-foreground">{row.label}</span>
                                            <span className="font-bold text-foreground">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </InspectorAccordion>
                        </Wrapper>

                        {/* Custom Request CTA */}
                        <Wrapper identity={{ displayName: "Inspector: Action CTA", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/icons/page.tsx" }}>
                            <InspectorAccordion title="Action" icon="flash_on" defaultOpen={true}>
                                <div className="p-4 pt-2">
                                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center">
                                        <p className="text-[11px] font-bold mb-2 text-foreground">&quot;Need a custom icon that isn&apos;t in the library?&quot;</p>
                                        <a className="text-[10px] font-black uppercase text-primary underline underline-offset-4 hover:text-primary/80 transition-colors" href="#">Submit Request</a>
                                    </div>
                                </div>
                            </InspectorAccordion>
                        </Wrapper>
                    </div>
                </Inspector>
            }
        >
            <Wrapper
                identity={{
                    displayName: "IconographyPage (L2)",
                    filePath: "zap/atoms/icons/page.tsx",
                    type: "Template/Canvas",
                    architecture: "L2: Primitives"
                }}
            >
                <Canvas className="transition-all duration-300 origin-center min-h-full flex flex-col pt-0">
                    <ThemeHeader
                        title="Iconography"
                        breadcrumb="foundations / icons"
                        badge="Primitives (Level 2)"
                    />

                    {/* Canvas Main Content */}
                    <div className="flex-1 w-full p-6 md:p-12 flex flex-col items-center">
                        <div className="w-full max-w-[1080px] flex-1 rounded-[32px] border bg-layer-cover border-outline-variant overflow-hidden flex flex-col">
                            <div className="flex-1 p-8 md:p-12">
                                {/* Page Level Title */}
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Component Sandbox</h2>
                                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-layer-panel rounded-full border border-border shadow-sm">
 <span className="text-xs font-dev text-transform-tertiary font-medium text-surface-foreground tracking-wider">
                                            [ L2 Cover // Main Content Canvas ]
                                        </span>
                                    </div>
                                </div>
                                
                                <hr className="border-border mb-8" />
                        <IconographyBody />
                    </div>
                        </div>
                    </div>
                </Canvas>
            </Wrapper>
        </AppShell>
    );
}
