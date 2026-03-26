'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';

export default function CanvasBodyPage() {
    return (
        <ComponentSandboxTemplate
            componentName="CanvasBody"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/zap/layout/CanvasBody.tsx"
            importPath="@/zap/layout/CanvasBody"
            foundationInheritance={{
                colorTokens: [
                    'bg-layer-canvas (surface-container-low)',
                    'bg-layer-cover (surface-container)',
                    'bg-layer-panel (surface-container-high)',
                    'bg-layer-dialog (surface-container-highest)',
                ],
                typographyScales: ['font-dev', 'text-transform-tertiary'],
            }}
            platformConstraints={{
                web: 'CanvasBody sits inside the Canvas atom (L1 floor). The CoverCard is max-w-[1080px] centered. Sections stack vertically, separated by border-b dividers. Demo frames are full-width inside their section.',
                mobile: 'Padding collapses from p-10 → p-4. Rounded corners reduce. Sections remain full-width stacked.',
            }}
            foundationRules={[
                'NEVER use bg-layer-* classes directly in page files — use CanvasBody, CanvasBody.Section, and CanvasBody.Demo.',
                'Layer order is strictly L1 → L2 → L3 → L4. Do not skip layers or reverse them.',
                'CanvasBody must always live inside a Canvas atom (bg-layer-canvas = L1 floor).',
                'CanvasBody.Demo is the correct container for component previews — not a plain div with bg-layer-panel.',
                'Do not add additional background colors inside CanvasBody.Demo — L4 is the ceiling.',
            ]}
        >
            <div className="w-full flex flex-col gap-12 py-8">

                {/* ── Layer Stack Visual */}
                <Wrapper identity={{ displayName: 'Layer Stack Reference', type: 'Docs', filePath: 'zap/molecules/canvas-body/page.tsx' }}>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            M3 SPATIAL DEPTH — LAYER STACK
                        </span>
                        <div className="rounded-xl border border-outline-variant/40 overflow-hidden">
                            {/* L1 */}
                            <div className="bg-layer-canvas p-5 flex flex-col gap-3 border-b border-outline-variant/30">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold font-dev tracking-widest text-on-surface-variant">L1 — CANVAS FLOOR</span>
                                    <code className="text-[10px] font-dev text-primary bg-primary/10 px-2 py-0.5 rounded">bg-layer-canvas</code>
                                </div>
                                <span className="text-[11px] text-on-surface-variant">surface-container-low · The outermost page background. Provided by the Canvas atom.</span>
                                {/* L2 */}
                                <div className="bg-layer-cover rounded-xl border border-outline-variant/50 p-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold font-dev tracking-widest text-on-surface-variant">L2 — COVER CARD</span>
                                        <code className="text-[10px] font-dev text-primary bg-primary/10 px-2 py-0.5 rounded">bg-layer-cover</code>
                                    </div>
                                    <span className="text-[11px] text-on-surface-variant">surface-container · The main content card. CanvasBody root.</span>
                                    {/* L3 */}
                                    <div className="bg-layer-panel rounded-xl border border-outline-variant/40 p-4 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold font-dev tracking-widest text-on-surface-variant">L3 — SECTION PANEL</span>
                                            <code className="text-[10px] font-dev text-primary bg-primary/10 px-2 py-0.5 rounded">bg-layer-panel</code>
                                        </div>
                                        <span className="text-[11px] text-on-surface-variant">surface-container-high · Content sections. CanvasBody.Section.</span>
                                        {/* L4 */}
                                        <div className="bg-layer-dialog rounded-lg border border-outline-variant/30 p-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold font-dev tracking-widest text-on-surface-variant">L4 — DEMO FRAME</span>
                                                <code className="text-[10px] font-dev text-primary bg-primary/10 px-2 py-0.5 rounded">bg-layer-dialog</code>
                                            </div>
                                            <span className="text-[11px] text-on-surface-variant">surface-container-highest · Preview boxes. CanvasBody.Demo. Ceiling.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Wrapper>

                {/* ── Live Demo: Full Composition */}
                <Wrapper identity={{ displayName: 'Live Composition Demo', type: 'Demo', filePath: 'zap/molecules/canvas-body/page.tsx' }}>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            LIVE — CanvasBody + Section + Demo (nested live rendering)
                        </span>
                        <CanvasBody maxWidth="max-w-full">
                            <CanvasBody.Section label="SECTION ONE — FONT FAMILIES">
                                <div className="flex flex-col gap-4">
                                    <CanvasBody.Demo label="DISPLAY FONT — Inter" minHeight="min-h-[120px]">
                                        <p className="font-display text-3xl text-on-surface">The quick brown fox jumps</p>
                                    </CanvasBody.Demo>
                                    <CanvasBody.Demo label="BODY FONT — Inter" minHeight="min-h-[80px]">
                                        <p className="font-body text-base text-on-surface">Consistent type hierarchy starts with the right surface.</p>
                                    </CanvasBody.Demo>
                                </div>
                            </CanvasBody.Section>
                            <CanvasBody.Section label="SECTION TWO — COLOR SWATCHES">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { label: 'Primary', cls: 'bg-primary text-on-primary' },
                                        { label: 'Secondary', cls: 'bg-secondary text-on-secondary' },
                                        { label: 'Tertiary', cls: 'bg-tertiary text-on-tertiary' },
                                        { label: 'Error', cls: 'bg-error text-on-error' },
                                    ].map(({ label, cls }) => (
                                        <div key={label} className={`rounded-lg p-4 flex items-center justify-center text-[11px] font-bold font-dev tracking-widest ${cls}`}>
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </CanvasBody.Section>
                        </CanvasBody>
                    </div>
                </Wrapper>

                {/* ── Prop Map */}
                <Wrapper identity={{ displayName: 'Prop Reference', type: 'Docs', filePath: 'zap/molecules/canvas-body/page.tsx' }}>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                            PROP REFERENCE
                        </span>
                        <div className="rounded-xl border border-outline-variant/40 overflow-hidden bg-layer-dialog">
                            <div className="px-4 py-3 bg-layer-modal border-b border-outline-variant/30 flex items-center justify-between">
                                <span className="text-sm font-black tracking-tight text-on-surface uppercase font-secondary">CanvasBody + Sub-components</span>
                                <span className="text-[10px] text-on-surface-variant font-secondary opacity-70">zap/layout/CanvasBody.tsx</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="bg-layer-modal border-b border-outline-variant/30">
                                            {['Component', 'Prop', 'Type', 'Default', 'Description'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold tracking-wider text-on-surface-variant">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/20">
                                        {[
                                            ['CanvasBody', 'children', 'ReactNode', '—', 'Sections go here.'],
                                            ['CanvasBody', 'maxWidth', 'string?', 'max-w-[1080px]', 'Override the cover card max width.'],
                                            ['CanvasBody', 'className', 'string?', 'undefined', 'Extra classes on the outer padding wrapper.'],
                                            ['CanvasBody', 'coverTitle', 'string?', 'undefined', 'Title shown in the Cover card header.'],
                                            ['CanvasBody', 'coverBadge', 'string?', 'undefined', 'Architecture badge text in the Cover pill.'],
                                            ['CanvasBody.Section', 'children', 'ReactNode', '—', 'Section content (Demo frames, grids, etc.)'],
                                            ['CanvasBody.Section', 'label', 'string?', 'undefined', 'Section label shown above content.'],
                                            ['CanvasBody.Section', 'flush', 'boolean?', 'false', 'Remove padding for full-bleed content.'],
                                            ['CanvasBody.Demo', 'children', 'ReactNode', '—', 'The component/preview to display.'],
                                            ['CanvasBody.Demo', 'label', 'string?', 'undefined', 'Variant label above the frame.'],
                                            ['CanvasBody.Demo', 'minHeight', 'string?', 'min-h-[280px]', 'Tailwind min-h class.'],
                                            ['CanvasBody.Demo', 'centered', 'boolean?', 'true', 'Center content inside the frame.'],
                                        ].map(([comp, prop, type, def, desc]) => (
                                            <tr key={`${comp}-${prop}`} className="bg-layer-dialog hover:bg-on-surface/3 transition-colors">
                                                <td className="px-4 py-3 font-dev text-transform-tertiary text-secondary font-bold text-[10px]">{comp}</td>
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
                </Wrapper>

            </div>
        </ComponentSandboxTemplate>
    );
}
