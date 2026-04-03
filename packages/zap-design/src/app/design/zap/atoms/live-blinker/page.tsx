'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { LiveBlinker } from '../../../../../genesis/atoms/indicators/LiveBlinker';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/atoms/foundations/components';

export default function LiveBlinkerSandboxPage() {
    return (
        <ComponentSandboxTemplate
            componentName="LiveBlinker"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/indicators/LiveBlinker.tsx"
            importPath="@/genesis/atoms/indicators/LiveBlinker"
            foundationInheritance={{
                colorTokens: ['--color-foreground'],
                typographyScales: ['--font-display']
            }}
            platformConstraints={{ web: "Full support", mobile: "Responsive sizing" }}
            foundationRules={[
                "Red blinking dot with Framer Motion pulse animation.",
                "1.5s infinite ease-in-out opacity cycle (1 → 0.4 → 1).",
                "Font: 9–12px bold tracking-widest display font.",
                "Dot is bordered with foreground color.",
            ]}
        >
            <CanvasBody flush={false} coverTitle="Live Blinker Atoms" coverBadge="L2 // ATOMS">
                <CanvasBody.Section flush={false} className="w-full animate-in fade-in duration-500">
                    <SectionHeader
                        number="01"
                        title="Primary Indicator"
                        icon="sensors"
                        description="Animated pulse indicator used to signify active real-time data streams or status."
                        id="primary-indicator"
                    />
                    <CanvasBody.Demo minHeight="min-h-[160px]" centered={true}>
                        <div className="flex items-center gap-10 p-8 bg-layer-panel border border-outline-variant/20 rounded-xl">
                            <div className="flex flex-col items-center gap-4">
                                <LiveBlinker />
                                <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground">Default state</span>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <LiveBlinker iconOnly color="green" />
                                <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground">Icon only (green)</span>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section flush={false} className="w-full mt-10">
                    <SectionHeader
                        number="02"
                        title="Contextual Integration"
                        icon="view_compact"
                        description="LiveBlinker embedded within a structural organism (e.g., Dashboard Header)."
                        id="contextual"
                    />
                    <CanvasBody.Demo minHeight="min-h-[160px]" centered={true}>
                        <div className="w-full max-w-md bg-layer-panel border border-outline-variant/20 rounded-xl p-6 flex items-center justify-between">
                            <h3 className="text-body-small font-display text-transform-primary font-bold text-foreground tracking-wide">Real-time dashboard</h3>
                            <LiveBlinker />
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
