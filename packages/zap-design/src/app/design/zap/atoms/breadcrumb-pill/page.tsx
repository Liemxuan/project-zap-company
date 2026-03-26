
'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { BreadcrumbPill } from '../../../../../genesis/atoms/indicators/BreadcrumbPill';

const SAMPLE_LABELS = [
    'DASHBOARD', 'ANALYTICS', 'REPORTS', 'SETTINGS',
    'ATOMS', 'MOLECULES', 'ORGANISMS', 'FOUNDATIONS'
];

export default function BreadcrumbPillSandboxPage() {
    return (
        <ComponentSandboxTemplate
            componentName="BreadcrumbPill"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/indicators/BreadcrumbPill.tsx"
            importPath="@/genesis/atoms/indicators/BreadcrumbPill"
            foundationInheritance={{
                colorTokens: ['--color-primary-container', '--color-on-primary-container'],
                typographyScales: ['--font-display']
            }}
            platformConstraints={{ web: "Full support", mobile: "Responsive sizing" }}
            foundationRules={[
                "Uses primary-container/on-primary-container color pair.",
                "Font: 8–10px bold tracking-widest display font with text-transform-primary.",
                "Fully rounded (rounded-full) pill shape.",
            ]}
        >
            <div className="w-full space-y-10 animate-in fade-in duration-500 pb-8">

                {/* Single Pills */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Individual Breadcrumb Pills</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        Each pill renders with <code>label</code> prop
                    </span>
                    <Wrapper identity={{ displayName: "BreadcrumbPill", type: "Atom", filePath: "genesis/atoms/indicators/BreadcrumbPill.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 flex flex-wrap gap-3">
                            {SAMPLE_LABELS.map((label) => (
                                <BreadcrumbPill key={label} label={label} />
                            ))}
                        </div>
                    </Wrapper>
                </div>

                {/* Breadcrumb Trail */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Breadcrumb Trail Pattern</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        Pills chained with separators to form navigation breadcrumbs
                    </span>
                    <Wrapper identity={{ displayName: "BreadcrumbPill (Trail)", type: "Atom", filePath: "genesis/atoms/indicators/BreadcrumbPill.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 flex items-center gap-1">
                            <BreadcrumbPill label="HOME" />
                            <span className="text-muted-foreground text-xs mx-1">›</span>
                            <BreadcrumbPill label="DESIGN" />
                            <span className="text-muted-foreground text-xs mx-1">›</span>
                            <BreadcrumbPill label="ATOMS" />
                        </div>
                    </Wrapper>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
