'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Tabs, type TabItem } from '../../../../../genesis/atoms/interactive/Tabs';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

const DEMO_TABS: TabItem[] = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'analytics', label: 'ANALYTICS' },
    { id: 'reports', label: 'REPORTS' },
    { id: 'settings', label: 'SETTINGS' },
];

const COMPACT_TABS: TabItem[] = [
    { id: 'day', label: 'DAY' },
    { id: 'week', label: 'WEEK' },
    { id: 'month', label: 'MONTH' },
];

export default function TabsSandboxPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [compactTab, setCompactTab] = useState('week');

    return (
        <ComponentSandboxTemplate
            componentName="Tabs"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/Tabs.tsx"
            importPath="@/genesis/atoms/interactive/Tabs"
            foundationInheritance={{
                colorTokens: ['--color-primary', '--color-on-surface-variant'],
                typographyScales: ['--font-display']
            }}
            platformConstraints={{ web: "Full support", mobile: "Horizontal scroll" }}
            foundationRules={[
                "Tabs use animated underline via Framer Motion.",
                "Active tab text uses --color-primary.",
                "Active state features an explicit 2-pixel primary Neo-Brutal line."
            ]}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="standard-navigation" 
                        number="01"
                        title="Standard Navigation"
                        icon="tabs"
                        description="Core 4-tab layout with spring-animated layout transitions."
                    />
                    <CanvasBody.Demo>
                        <div className="bg-layer-panel border border-border/40 rounded-xl p-8 w-full max-w-2xl shadow-xl">
                            <Tabs tabs={DEMO_TABS} activeTab={activeTab} onChange={setActiveTab} />
                            <div className="mt-8 p-6 bg-layer-surface/50 border border-border/30 rounded-lg">
                                <p className="text-bodySmall text-muted-foreground font-body">
                                    Displaying active content for <span className="text-primary font-bold">{activeTab}</span> pane.
                                </p>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="compact-controls" 
                        number="02"
                        title="Compact Controls"
                        icon="view_week"
                        description="Reduced footprint tabs ideal for filtering and scope switching."
                    />
                    <CanvasBody.Demo>
                        <div className="bg-layer-panel border border-border/40 rounded-xl p-6 w-full max-w-sm shadow-lg">
                            <Tabs tabs={COMPACT_TABS} activeTab={compactTab} onChange={setCompactTab} />
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
