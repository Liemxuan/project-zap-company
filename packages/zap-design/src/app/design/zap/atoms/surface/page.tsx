
'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Surface } from '../../../../../genesis/atoms/surfaces/surface';

export default function SurfaceSandboxPage() {
    return (
        <ComponentSandboxTemplate
            componentName="Surface"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/surfaces/surface.tsx"
            importPath="@/genesis/atoms/surfaces/surface"
            foundationInheritance={{
                colorTokens: ['--card-border-width', '--color-card-border'],
                typographyScales: []
            }}
            platformConstraints={{ web: "Full support", mobile: "Full support" }}
            foundationRules={[
                "Surface is the base abstraction — Canvas, Card, Panel all inherit from this pattern.",
                "Uses --card-border-width for dynamic border sizing.",
                "Transition-all for smooth property changes.",
            ]}
        >
            <div className="w-full space-y-10 animate-in fade-in duration-500 pb-8">

                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Default Surface</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        Base container with <code>--card-border-width</code> border
                    </span>
                    <Wrapper identity={{ displayName: "Surface", type: "Atom", filePath: "genesis/atoms/surfaces/surface.tsx" }}>
                        <Surface className="bg-layer-panel rounded-lg">
                            <p className="text-sm text-muted-foreground">Default Surface — base container with dynamic border width.</p>
                        </Surface>
                    </Wrapper>
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Nested Surfaces</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        Surfaces can nest to create depth hierarchy
                    </span>
                    <Wrapper identity={{ displayName: "Surface (Nested)", type: "Atom", filePath: "genesis/atoms/surfaces/surface.tsx" }}>
                        <Surface className="bg-layer-canvas rounded-lg">
                            <p className="text-xs text-muted-foreground mb-3">L1 · Canvas Surface</p>
                            <Surface className="bg-layer-cover rounded-md">
                                <p className="text-xs text-muted-foreground mb-3">L2 · Cover Surface</p>
                                <Surface className="bg-layer-panel rounded-sm">
                                    <p className="text-xs text-muted-foreground">L3 · Panel Surface</p>
                                </Surface>
                            </Surface>
                        </Surface>
                    </Wrapper>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
