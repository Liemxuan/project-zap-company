'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../../../genesis/molecules/tabs';

export default function TabsSandboxPage() {    const [padding, setPadding] = useState([4]);
    const [radius, setRadius] = useState([8]);
    const [gap, setGap] = useState([32]);

    // Fetch initial settings
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/tabs" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Tabs Structural Settings", type: "Docs Link", filePath: "zap/molecules/tabs/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--tabs-list-padding</span>
                                    <span className="font-bold">{padding[0]}px</span>
                                </div>
                                <Slider value={padding} onValueChange={setPadding} min={0} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--tabs-radius</span>
                                    <span className="font-bold">{radius[0]}px</span>
                                </div>
                                <Slider value={radius} onValueChange={setRadius} min={0} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--tabs-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Slider value={gap} onValueChange={setGap} min={0} max={64} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Tabs"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/tabs.tsx"
            importPath="@/components/ui/tabs"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: [],
                typographyScales: ["font-display", "text-transform-primary"]
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
            foundationRules={[]}
        >
            <div 
                className="w-full flex flex-col items-center justify-start py-12 gap-8"
                style={Object.assign({}, {
                    '--tabs-list-padding': `${padding[0]}px`,
                    '--tabs-radius': `${radius[0]}px`,
                    '--tabs-gap': `${gap[0]}px`,
                } as React.CSSProperties)}
            >
                
                <Wrapper identity={{ displayName: "Default Sliding Pill Tabs", type: "Demo", filePath: "zap/molecules/tabs" }}>
                    <div className="w-full flex flex-col flex-grow items-center justify-center min-h-[400px] p-12 bg-layer-canvas shadow-sm border border-outline-variant rounded-xl gap-4">
                        <span className="text-[11px] font-bold font-display tracking-widest text-on-surface-variant text-transform-secondary uppercase text-transform-tertiary">Variant: Default (Pill Container)</span>
                        <Tabs defaultValue="account" className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="account">Account</TabsTrigger>
                                <TabsTrigger value="password">Password</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account" className="p-4 border border-outline-variant rounded-md mt-2 bg-layer-cover">
                                <p className="text-sm text-on-surface-variant text-transform-secondary">Make changes to your account here.</p>
                            </TabsContent>
                            <TabsContent value="password" className="p-4 border border-outline-variant rounded-md mt-2 bg-layer-cover">
                                <p className="text-sm text-on-surface-variant text-transform-secondary">Change your password here.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </Wrapper>

                <Wrapper identity={{ displayName: "Independent Buttons Tabs", type: "Demo", filePath: "zap/molecules/tabs" }}>
                    <div className="w-full flex flex-col flex-grow items-center justify-center min-h-[400px] p-12 bg-layer-cover shadow-sm border border-outline-variant rounded-xl gap-4">
                        <span className="text-[11px] font-bold font-display tracking-widest text-on-surface-variant text-transform-secondary uppercase text-transform-tertiary">Variant: Button (Independent)</span>
                        <Tabs defaultValue="music" className="w-[400px]">
                            <TabsList variant="button" className="flex justify-center w-full">
                                <TabsTrigger value="music">Music</TabsTrigger>
                                <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                                <TabsTrigger value="live">Live</TabsTrigger>
                            </TabsList>
                            <TabsContent value="music" className="p-4 border border-outline-variant rounded-md mt-2 bg-layer-panel">
                                <p className="text-sm text-on-surface-variant text-transform-secondary">Listen to music streams.</p>
                            </TabsContent>
                            <TabsContent value="podcasts" className="p-4 border border-outline-variant rounded-md mt-2 bg-layer-panel">
                                <p className="text-sm text-on-surface-variant text-transform-secondary">Listen to podcast episodes.</p>
                            </TabsContent>
                            <TabsContent value="live" className="p-4 border border-outline-variant rounded-md mt-2 bg-layer-panel">
                                <p className="text-sm text-on-surface-variant text-transform-secondary">Live broadcasts.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </Wrapper>

                <Wrapper identity={{ displayName: "Line Focus Tabs", type: "Demo", filePath: "zap/molecules/tabs" }}>
                    <div className="w-full flex flex-col flex-grow items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl gap-4">
                        <span className="text-[11px] font-bold font-display tracking-widest text-on-surface-variant text-transform-secondary uppercase text-transform-tertiary">Variant: Line (Underline Focus)</span>
                        <Tabs defaultValue="overview" className="w-[400px]">
                            <TabsList variant="line" className="flex justify-start w-full border-b border-outline-variant">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                <TabsTrigger value="reports">Reports</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="p-4 mt-2 bg-layer-dialog rounded-md">
                                <p className="text-sm text-on-surface-variant text-transform-secondary">Overview content panel.</p>
                            </TabsContent>
                            <TabsContent value="analytics" className="p-4 mt-2 bg-layer-dialog rounded-md">
                                <p className="text-sm text-on-surface-variant text-transform-secondary">Analytics graph here.</p>
                            </TabsContent>
                            <TabsContent value="reports" className="p-4 mt-2 bg-layer-dialog rounded-md">
                                <p className="text-sm text-on-surface-variant text-transform-secondary">Downloaded reports list.</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </Wrapper>
                
            </div>
        </ComponentSandboxTemplate>
    );
}