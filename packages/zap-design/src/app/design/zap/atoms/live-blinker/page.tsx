
'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { LiveBlinker } from '../../../../../genesis/atoms/indicators/LiveBlinker';

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
            <div className="w-full space-y-10 animate-in fade-in duration-500 pb-8">

                {/* Default */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Default Live Blinker</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        Animated red dot with &quot;LIVE&quot; label
                    </span>
                    <Wrapper identity={{ displayName: "LiveBlinker", type: "Atom", filePath: "genesis/atoms/indicators/LiveBlinker.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 flex items-center gap-6">
                            <LiveBlinker />
                        </div>
                    </Wrapper>
                </div>

                {/* In Context */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">In Header Context</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        LiveBlinker alongside a title, mimicking a streaming header
                    </span>
                    <Wrapper identity={{ displayName: "LiveBlinker (Header)", type: "Atom", filePath: "genesis/atoms/indicators/LiveBlinker.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 flex items-center justify-between w-full">
                            <h3 className="text-sm font-display font-bold text-foreground tracking-wide uppercase">Real-time Dashboard</h3>
                            <LiveBlinker />
                        </div>
                    </Wrapper>
                </div>

                {/* Icon Only */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Icon Only</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        Color variations for the Live Blinker without text
                    </span>
                    <Wrapper identity={{ displayName: "LiveBlinker (Icon Only)", type: "Atom", filePath: "genesis/atoms/indicators/LiveBlinker.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 flex items-center gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <LiveBlinker iconOnly color="red" />
                                <span className="text-[10px] font-dev text-muted-foreground">Red</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <LiveBlinker iconOnly color="green" />
                                <span className="text-[10px] font-dev text-muted-foreground">Green</span>
                            </div>
                        </div>
                    </Wrapper>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
