'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { ThemeHeader } from '../../../../../genesis/molecules/layout/ThemeHeader';
import { type TabItem } from '../../../../../genesis/atoms/interactive/Tabs';

const DEMO_TABS: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'tokens', label: 'Token Map' },
    { id: 'usage', label: 'Usage' },
];

export default function ThemeHeaderPage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <ComponentSandboxTemplate
            componentName="ThemeHeader"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/genesis/molecules/layout/ThemeHeader.tsx"
            importPath="@/genesis/molecules/layout/ThemeHeader"
            foundationInheritance={{
                colorTokens: ['bg-layer-cover', 'border-outline-variant/50', 'text-on-surface text-transform-primary'],
                typographyScales: ['font-display', 'text-transform-primary', 'font-body'],
            }}
            platformConstraints={{
                web: 'Full-width sticky header at top of Canvas. Automatically renders MetroHeader for M3 themes and ExperimentalHeader for Shadcn themes.',
                mobile: 'Collapses to breadcrumb + title only. Tabs shift to a horizontal scroll row below.',
            }}
            foundationRules={[
                'Must always sit inside the DebugAuditor → Canvas shell — never rendered standalone outside a page.',
                'breadcrumb prop follows the pattern: "layer / noun" (e.g. "molecule / typography").',
                'badge defaults to "Experimental Component Preview" — always override for production pages.',
                'liveIndicator should only be true when the page consumes a live data stream.',
                'The unified ThemeHeader reads useTheme() internally so callers do not need to manually swap components.',
            ]}
        >
            <div className="w-full flex flex-col gap-10 py-8">

                {/* ── VARIANT 1: Minimal (title + breadcrumb only) */}
                <Wrapper identity={{ displayName: 'Minimal Variant', type: 'Demo', filePath: 'zap/molecules/theme-header/page.tsx' }}>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            VARIANT — MINIMAL (breadcrumb + title + badge)
                        </span>
                        <div className="rounded-xl border border-outline-variant/50 overflow-hidden">
                            <ThemeHeader
                                title="Page Title"
                                breadcrumb="molecule / layout"
                                badge="L4 Molecule"
                                liveIndicator={false}
                            />
                        </div>
                    </div>
                </Wrapper>

                {/* ── VARIANT 2: With Tabs */}
                <Wrapper identity={{ displayName: 'With Tabs Variant', type: 'Demo', filePath: 'zap/molecules/theme-header/page.tsx' }}>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            VARIANT — WITH TABS
                        </span>
                        <div className="rounded-xl border border-outline-variant/50 overflow-hidden">
                            <ThemeHeader
                                title="Page Cover Header"
                                breadcrumb="molecule / layout"
                                badge="Theme-Aware Component Preview"
                                tabs={DEMO_TABS}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                liveIndicator={false}
                            />
                        </div>
                    </div>
                </Wrapper>

                {/* ── VARIANT 3: With Live Indicator */}
                <Wrapper identity={{ displayName: 'Live Indicator Variant', type: 'Demo', filePath: 'zap/molecules/theme-header/page.tsx' }}>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            VARIANT — LIVE INDICATOR (real-time data stream)
                        </span>
                        <div className="rounded-xl border border-outline-variant/50 overflow-hidden">
                            <ThemeHeader
                                title="Typography Architecture"
                                breadcrumb="molecule / typography"
                                badge="L1-L7 System Font Governance"
                                tabs={DEMO_TABS}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                liveIndicator={true}
                            />
                        </div>
                    </div>
                </Wrapper>
            </div>
        </ComponentSandboxTemplate>
    );
}
