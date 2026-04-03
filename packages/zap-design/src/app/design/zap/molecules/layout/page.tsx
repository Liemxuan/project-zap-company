'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { ThemeHeader } from '../../../../../genesis/molecules/layout/ThemeHeader';
import { type TabItem } from '../../../../../genesis/atoms/interactive/Tabs';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

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
                typographyScales: ['font-display', 'text-transform-primary', 'font-body text-transform-secondary'],
            }}
            platformConstraints={{
                web: 'Full-width sticky header at top of Canvas. Breadcrumb → Display Title → Badge → Tabs. The live indicator pulses when real-time data is active.',
                mobile: 'Collapses to breadcrumb + title only. Tabs shift to a horizontal scroll row below.',
            }}
            foundationRules={[
                'Must always sit inside the DebugAuditor → Canvas shell — never rendered standalone outside a page.',
                'breadcrumb prop follows the pattern: "layer / noun" (e.g. "molecule / typography").',
                'badge defaults to "Experimental Component Preview" — always override for production pages.',
                'liveIndicator should only be true when the page consumes a live data stream.',
                'Title must use the ThemeHeader — never repeat a raw h1 inside the page content area.',
            ]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="layout" title="ThemeHeader Sandbox" description="Interactive components for ThemeHeader" icon="widgets" />
                    <CanvasBody.Demo className="w-full flex flex-col gap-10 py-8">

                {/* ── VARIANT 1: Minimal (title + breadcrumb only) */}
                
                    <div className="flex flex-col gap-2">
                        <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
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
                

                {/* ── VARIANT 2: With Tabs */}
                
                    <div className="flex flex-col gap-2">
                        <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            VARIANT — WITH TABS
                        </span>
                        <div className="rounded-xl border border-outline-variant/50 overflow-hidden">
                            <ThemeHeader
                                title="Page Cover Header"
                                breadcrumb="molecule / layout"
                                badge="Experimental Component Preview"
                                tabs={DEMO_TABS}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                liveIndicator={false}
                            />
                        </div>
                    </div>
                

                {/* ── VARIANT 3: With Live Indicator */}
                
                    <div className="flex flex-col gap-2">
                        <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
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
                

                {/* ── PROP MAP */}
                
                    <div className="flex flex-col gap-2">
                        <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            PROP REFERENCE
                        </span>
                        <div className="rounded-xl border border-outline-variant/40 overflow-hidden bg-surface">
                            <div className="px-4 py-3 bg-surface-container-high border-b border-outline-variant/30 flex items-center justify-between">
                                <span className="text-body-small font-black tracking-tight text-on-surface uppercase font-secondary">
                                    ThemeHeaderProps
                                </span>
                                <span className="text-label-small text-on-surface-variant font-secondary opacity-70">
                                    genesis/molecules/layout/ThemeHeader.tsx
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-label-small">
                                    <thead>
                                        <tr className="bg-surface-container border-b border-outline-variant/30">
                                            {['Prop', 'Type', 'Default', 'Description'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-label-small font-bold tracking-wider text-on-surface-variant">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/20">
                                        {[
                                            ['title', 'React.ReactNode', '—', 'Large display title. Required.'],
                                            ['breadcrumb', 'string?', 'undefined', '"layer / noun" pattern pill above title.'],
                                            ['badge', 'string?', '"Experimental Component Preview"', 'Tag below title.'],
                                            ['tabs', 'TabItem[]?', 'undefined', 'Tab bar rendered below the header.'],
                                            ['activeTab', 'string?', 'undefined', 'Controlled active tab id.'],
                                            ['onTabChange', '(id: string) => void?', 'undefined', 'Tab change handler.'],
                                            ['liveIndicator', 'boolean?', 'false', 'Pulsing red dot + LIVE label.'],
                                            ['rightSlot', 'React.ReactNode?', 'undefined', 'Custom content in the right slot.'],
                                            ['showBackground', 'boolean?', 'true', 'Toggle the bg-layer-cover background.'],
                                        ].map(([prop, type, def, desc]) => (
                                            <tr key={prop} className="hover:bg-on-surface/3 transition-colors">
                                                <td className="px-4 py-3 font-dev text-transform-tertiary text-primary font-bold">{prop}</td>
                                                <td className="px-4 py-3 font-dev text-transform-tertiary text-on-surface-variant">{type}</td>
                                                <td className="px-4 py-3 font-dev text-transform-tertiary text-on-surface-variant opacity-60">{def}</td>
                                                <td className="px-4 py-3 text-on-surface">{desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                

                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}
