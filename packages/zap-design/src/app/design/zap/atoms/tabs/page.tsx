
'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Tabs, type TabItem } from '../../../../../genesis/atoms/interactive/Tabs';

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
                colorTokens: ['--color-primary', '--color-on-surface-variant', '--color-surface-container'],
                typographyScales: ['--font-display']
            }}
            platformConstraints={{ web: "Full support", mobile: "Horizontal scroll" }}
            foundationRules={[
                "Tabs use animated underline via Framer Motion LayoutGroup scoped by useId().",
                "Active tab text uses --color-primary.",
                "Active state features an explicit 2-pixel primary-color Neo-Brutal line."
            ]}
        >
            <div className="w-full space-y-10 animate-in fade-in duration-500 pb-8">

                {/* Standard Tabs */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Standard Navigation Tabs</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        4-tab layout with spring-animated underline · Active: <code>{activeTab}</code>
                    </span>
                    <Wrapper identity={{ displayName: "Tabs", type: "Atom", filePath: "genesis/atoms/interactive/Tabs.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 w-full">
                            <Tabs tabs={DEMO_TABS} activeTab={activeTab} onChange={setActiveTab} />
                            <div className="mt-6 p-4 bg-layer-surface rounded-md border border-border/30">
                                <p className="text-body-small text-muted-foreground font-dev">
                                    Content for <strong className="text-primary">{activeTab}</strong> tab
                                </p>
                            </div>
                        </div>
                    </Wrapper>
                </div>

                {/* Compact Tabs */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Compact Time-Range Tabs</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        3-tab compact layout · Active: <code>{compactTab}</code>
                    </span>
                    <Wrapper identity={{ displayName: "Tabs (Compact)", type: "Atom", filePath: "genesis/atoms/interactive/Tabs.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 w-full max-w-sm">
                            <Tabs tabs={COMPACT_TABS} activeTab={compactTab} onChange={setCompactTab} />
                        </div>
                    </Wrapper>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
