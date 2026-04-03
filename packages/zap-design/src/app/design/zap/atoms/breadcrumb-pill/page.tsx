'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { BreadcrumbPill } from '../../../../../genesis/atoms/indicators/BreadcrumbPill';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/atoms/foundations/components';

const SAMPLE_LABELS = [
    'Dashboard', 'Analytics', 'Reports', 'Settings',
    'Atoms', 'Molecules', 'Organisms', 'Foundations'
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
            <CanvasBody flush={false} coverTitle="Breadcrumb Pill Atoms" coverBadge="L2 // ATOMS">
                <CanvasBody.Section flush={false} className="w-full animate-in fade-in duration-500">
                    <SectionHeader
                        number="01"
                        title="Individual Pill Instances"
                        icon="widgets"
                        description="Isolated BreadcrumbPill atoms rendering with a single label prop."
                        id="individual-pills"
                    />
                    <CanvasBody.Demo minHeight="min-h-[160px]" centered={true}>
                        <div className="flex flex-wrap gap-4 items-center justify-center p-8 bg-layer-panel border border-outline-variant/20 rounded-xl">
                            {SAMPLE_LABELS.map((label) => (
                                <BreadcrumbPill key={label} label={label} />
                            ))}
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section flush={false} className="w-full mt-10">
                    <SectionHeader
                        number="02"
                        title="Breadcrumb Trail Pattern"
                        icon="navigation"
                        description="Standard navigation pattern with chained pills using directional separators."
                        id="trail-pattern"
                    />
                    <CanvasBody.Demo minHeight="min-h-[160px]" centered={true}>
                        <div className="flex items-center gap-2 p-8 bg-layer-panel border border-outline-variant/20 rounded-xl">
                            <BreadcrumbPill label="Home" />
                            <span className="text-muted-foreground font-body text-xs mx-1">›</span>
                            <BreadcrumbPill label="Design" />
                            <span className="text-muted-foreground font-body text-xs mx-1">›</span>
                            <BreadcrumbPill label="Atoms" />
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
