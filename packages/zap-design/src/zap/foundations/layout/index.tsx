'use client';

import React, { useState } from 'react';
import { Canvas } from '../../../genesis/atoms/surfaces/canvas';
import { AppShell } from '../../../zap/layout/AppShell';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { LayoutBody } from '../../../zap/sections/atoms/layout-grid/body';
import { type Platform } from '../../../zap/sections/atoms/foundations/components';
import { CanvasBody } from '../../../zap/layout/CanvasBody';

export default function LayoutPage() {
    const [platform, setPlatform] = useState<Platform>('web');

    return (
        <AppShell>
            <Canvas className="transition-all duration-300 origin-center flex flex-col pt-0 min-h-full">
                <div className="w-full flex-none">
                    <ThemeHeader
                        title="Layout Grid"
                        breadcrumb="foundations / layout"
                        badge="Primitives (Level 2)"
                        platform={platform}
                        setPlatform={setPlatform}
                    />
                </div>
                
                <CanvasBody coverTitle="Component Sandbox" coverBadge="[ L2 Cover // Main Content Canvas ]">
                    <LayoutBody platform={platform} />
                </CanvasBody>
            </Canvas>
        </AppShell>
    );
}
