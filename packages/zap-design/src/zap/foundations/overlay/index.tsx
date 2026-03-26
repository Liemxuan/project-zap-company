'use client';

import React, { useState } from 'react';
import { AppShell } from '../../../zap/layout/AppShell';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { Canvas } from '../../../genesis/atoms/surfaces/canvas';
import { Wrapper } from '../../../components/dev/Wrapper';
import { OverlayBody } from '../../../zap/sections/atoms/overlay/body';
import { type Platform } from '../../../zap/sections/atoms/foundations/components';

export default function OverlayPage() {
    const [platform, setPlatform] = useState<Platform>('web');

    return (
        <AppShell>
            <Wrapper
                identity={{
                    displayName: "OverlayPage (L2)",
                    filePath: "app/debug/metro/overlay/page.tsx",
                    type: "Template/Canvas",
                    architecture: "L2: Primitives"
                }}
            >
                <Canvas className="transition-all duration-300 origin-center flex flex-col pt-0">
                    <ThemeHeader
                        title="Overlays & Scrims"
                        breadcrumb="foundations / overlay"
                        badge="Primitives (Level 2)"
                        platform={platform}
                        setPlatform={setPlatform}
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
                        <OverlayBody platform={platform} />
                    </div>
                        </div>
                    </div>
                </Canvas>
            </Wrapper>
        </AppShell>
    );
}
