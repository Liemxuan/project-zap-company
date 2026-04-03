'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { InspectorAccordion } from '../../../../../zap/organisms/laboratory/InspectorAccordion';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function InspectorAccordionPage() {
    return (
        <ComponentSandboxTemplate
            componentName="InspectorAccordion"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/zap/organisms/laboratory/InspectorAccordion.tsx"
            importPath="@/zap/organisms/laboratory/InspectorAccordion"
            foundationInheritance={{
                colorTokens: ['bg-primary/10', 'ring-primary/20', 'bg-on-surface/5', 'text-on-surface-variant text-transform-secondary'],
                typographyScales: ['font-display', 'text-titleSmall', 'text-transform-primary'],
            }}
            platformConstraints={{
                web: 'Renders as a collapsible accordion row inside the Inspector sidebar. Always vertically stacked — never grid or inline. The trigger button spans full width.',
                mobile: 'Same stacking behavior. Icon size stays at 20px; title truncates with ellipsis at narrow widths.',
            }}
            foundationRules={[
                'icon prop MUST be a Google Material Icon name string (e.g. "settings", "palette"). Lucide is forbidden.',
                'defaultOpen=true should be used for the first accordion in a panel and for Dynamic Properties.',
                'The accordion is a molecule — it must live INSIDE an Inspector shell, never rendered standalone at page level.',
                'AnimatePresence handles open/close animation — do not add additional transition wrappers.',
                'Title always uses font-display + text-titleSmall + text-transform-primary — never override font family inline.',
            ]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="inspector-accordion" title="InspectorAccordion Sandbox" description="Interactive components for InspectorAccordion" icon="widgets" />
                    <CanvasBody.Demo className="w-full flex flex-col gap-10 py-8">

                {/* ── VARIANT 1: Default Open — with Google Icon */}
                
                    <div className="flex flex-col gap-2">
                        <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            VARIANT — DEFAULT OPEN (icon + content)
                        </span>
                        <div className="w-[280px] rounded-xl border border-outline-variant/50 overflow-hidden bg-layer-panel p-4 space-y-2">
                            <InspectorAccordion title="Dynamic Properties" icon="tune" defaultOpen={true}>
                                <div className="space-y-3 pt-1">
                                    <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                        <span>--border-radius</span>
                                        <span className="font-bold text-on-surface">8px</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-on-surface/10 rounded-full overflow-hidden">
                                        <div className="h-full w-1/2 bg-primary rounded-full" />
                                    </div>
                                    <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                        <span>--padding</span>
                                        <span className="font-bold text-on-surface">16px</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-on-surface/10 rounded-full overflow-hidden">
                                        <div className="h-full w-1/3 bg-primary rounded-full" />
                                    </div>
                                </div>
                            </InspectorAccordion>
                        </div>
                    </div>
                

                {/* ── VARIANT 2: Default Closed */}
                
                    <div className="flex flex-col gap-2">
                        <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            VARIANT — DEFAULT CLOSED
                        </span>
                        <div className="w-[280px] rounded-xl border border-outline-variant/50 overflow-hidden bg-layer-panel p-4 space-y-2">
                            <InspectorAccordion title="Foundation Rules" icon="security" defaultOpen={false}>
                                <ul className="space-y-2 pt-1">
                                    <li className="text-label-medium text-on-surface-variant pl-2 border-l-2 border-primary/20">Never use inline styles.</li>
                                    <li className="text-label-medium text-on-surface-variant pl-2 border-l-2 border-primary/20">Always use M3 color tokens.</li>
                                </ul>
                            </InspectorAccordion>
                        </div>
                    </div>
                

                {/* ── VARIANT 3: Stacked (realistic inspector panel) */}
                
                    <div className="flex flex-col gap-2">
                        <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            VARIANT — STACKED (realistic inspector panel)
                        </span>
                        <div className="w-[280px] rounded-xl border border-outline-variant/50 overflow-hidden bg-layer-panel">
                            {/* Inspector header */}
                            <div className="h-12 px-4 flex items-center gap-2 border-b border-outline-variant/50 shrink-0">
                                <span className="text-label-medium font-black font-display tracking-widest text-on-surface text-transform-primary">INSPECTOR</span>
                            </div>
                            <div className="p-4 space-y-2">
                                <InspectorAccordion title="Data Terminal" icon="database" defaultOpen={true}>
                                    <div className="space-y-2 pt-1">
                                        <div className="flex justify-between text-label-small font-dev text-transform-tertiary">
                                            <span className="text-on-surface-variant text-transform-secondary">Status</span>
                                            <span className="text-green-500 font-bold">Verified</span>
                                        </div>
                                        <div className="flex justify-between text-label-small font-dev text-transform-tertiary">
                                            <span className="text-on-surface-variant text-transform-secondary">Tier</span>
                                            <span className="text-on-surface font-bold">L4 Molecule</span>
                                        </div>
                                    </div>
                                </InspectorAccordion>
                                <InspectorAccordion title="Dynamic Properties" icon="tune" defaultOpen={true}>
                                    <div className="pt-1 text-label-medium text-on-surface-variant">No controls defined.</div>
                                </InspectorAccordion>
                                <InspectorAccordion title="Inheritance Map" icon="account_tree" defaultOpen={false}>
                                    <div className="flex flex-wrap gap-1 pt-1">
                                        <span className="px-1.5 py-0.5 bg-primary-container text-on-primary-container rounded text-label-small font-dev text-transform-tertiary">bg-primary/10</span>
                                        <span className="px-1.5 py-0.5 bg-secondary-container text-on-secondary-container rounded text-label-small font-dev text-transform-tertiary">font-display text-transform-primary</span>
                                    </div>
                                </InspectorAccordion>
                                <InspectorAccordion title="Platform Context" icon="devices" defaultOpen={false}>
                                    <p className="pt-1 text-label-medium text-on-surface-variant leading-relaxed">Full-width, vertically stacked inside Inspector sidebar.</p>
                                </InspectorAccordion>
                            </div>
                        </div>
                    </div>
                

                {/* ── PROP MAP */}
                
                    <div className="flex flex-col gap-2">
                        <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            PROP REFERENCE
                        </span>
                        <div className="rounded-xl border border-outline-variant/40 overflow-hidden bg-surface">
                            <div className="px-4 py-3 bg-surface-container-high border-b border-outline-variant/30 flex items-center justify-between">
                                <span className="text-body-small font-black tracking-tight text-on-surface uppercase font-secondary">InspectorAccordionProps</span>
                                <span className="text-label-small text-on-surface-variant font-secondary opacity-70">
                                    zap/organisms/laboratory/InspectorAccordion.tsx
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
                                            ['title', 'string', '—', 'Accordion label. Required.'],
                                            ['icon', 'string?', 'undefined', 'Google Material Icon name (e.g. "tune", "database"). No Lucide.'],
                                            ['defaultOpen', 'boolean?', 'true', 'Initial open state. Set false to start collapsed.'],
                                            ['children', 'React.ReactNode', '—', 'Content revealed when expanded. Required.'],
                                            ['className', 'string?', 'undefined', 'Extra classes on the root wrapper div.'],
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
