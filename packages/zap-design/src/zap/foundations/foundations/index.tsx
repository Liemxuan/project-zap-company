'use client';

import React, { useState } from 'react';
import { Inspector } from '../../../zap/layout/Inspector';
import { Canvas } from '../../../genesis/atoms/surfaces/canvas';
import { Wrapper } from '../../../components/dev/Wrapper';
import { AppShell } from '../../../zap/layout/AppShell';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { FoundationsBody } from '../../../zap/sections/atoms/foundations/body';
import { FoundationsInspector } from '../../../zap/sections/atoms/foundations/inspector';
import { type Platform } from '../../../zap/sections/atoms/foundations/components';
import { useTheme } from '../../../components/ThemeContext';

export default function FoundationsPage() {
    const { theme } = useTheme();
    const [platform, setPlatform] = useState<Platform>('web');

    return (
        <AppShell
            inspector={
                <Inspector title="Foundations" width={320}>
                    <FoundationsInspector />
                </Inspector>
            }
        >
            <Wrapper
                identity={{
                    displayName: "FoundationsPage (L1)",
                    filePath: "app/debug/metro/foundations/page.tsx",
                    type: "Template/Canvas",
                    architecture: "L1: PHYSICS"
                }}
            >
                <Canvas className="transition-all duration-300 origin-center flex flex-col pt-0">
                    <ThemeHeader
                        title="Design Foundations"
                        breadcrumb={`Zap Design Engine / ${theme} / Foundations`}
                        badge="Unified Token System (L1)"
                        platform={platform}
                        setPlatform={setPlatform}
                    />

                    {/* Body Content — scrolls with header */}
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
                        <FoundationsBody />
                    </div>
                        </div>
                    </div>
                </Canvas>
            </Wrapper>
        </AppShell>
    );
}
