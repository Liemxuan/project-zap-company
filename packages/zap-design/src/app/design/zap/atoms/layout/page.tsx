'use client';

import React from 'react';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { LayoutPrimitivesBody } from '../../../../../zap/sections/atoms/layout/body';
import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function LayoutPrimitivesPage() {

    return (
        <MasterVerticalShell
            breadcrumbs={[
                { label: 'SYSTEMS' },
                { label: 'CORE' },
                { label: 'GRIDS & SPACING', active: true }
            ]}
            activeItem="Grids & Spacing"
            inspectorTitle="Grid Implementation"
            inspectorContent={
                <div className="space-y-6">
                    {/* Grid Implementation — Code Snippet */}
                    <Wrapper identity={{ displayName: "Grid Implementation", filePath: "app/debug/zap/layout/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="border border-black p-4 bg-primary/10 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary bg-black p-1 text-body-small">code</span>
                                <h3 className="text-label-small font-black uppercase tracking-tighter">Grid Implementation</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="bg-white border border-black p-3">
                                    <p className="text-label-small font-dev text-transform-tertiary text-slate-500 mb-2 border-b border-slate-200 pb-1">CSS Grid</p>
                                    <code className="text-label-small font-dev text-transform-tertiary block text-slate-800 whitespace-pre leading-relaxed">
                                        {`.grid-container {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 24px;
      max-width: 1440px;
      margin: 0 auto;
    }`}
                                    </code>
                                </div>
                                <button className="w-full text-label-small font-black uppercase bg-black text-white py-2 border border-black hover:bg-primary hover:text-black transition-colors">
                                    Copy Snippet
                                </button>
                            </div>
                        </div>
                    </Wrapper>

                    {/* Responsive Breakpoints */}
                    <Wrapper identity={{ displayName: "Responsive Breakpoints", filePath: "app/debug/zap/layout/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="border border-black p-4 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-body-small">devices</span>
                                <h3 className="text-label-small font-black uppercase tracking-tighter">Responsive Breakpoints</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { icon: 'desktop_windows', label: 'Desktop', value: '≥ 1024px' },
                                    { icon: 'tablet_mac', label: 'Tablet', value: '≥ 768px' },
                                    { icon: 'smartphone', label: 'Mobile', value: '< 768px' },
                                ].map((row) => (
                                    <Wrapper key={row.label} identity={{ displayName: `Breakpoint: ${row.label}`, filePath: "app/debug/zap/atoms/layout/page.tsx", type: "Wrapped Snippet" }}>
                                        <div className="flex items-center justify-between p-2 border border-black bg-zinc-50">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-body-small text-slate-500">{row.icon}</span>
                                                <span className="text-label-medium font-bold">{row.label}</span>
                                            </div>
                                            <span className="text-label-small font-dev text-transform-tertiary bg-white border border-black px-1">{row.value}</span>
                                        </div>
                                    </Wrapper>
                                ))}
                            </div>
                            <p className="text-label-medium text-slate-500 leading-tight mt-2">
                                Breakpoints are mobile-first. Default styles apply to all widths until a min-width override is met.
                            </p>
                        </div>
                    </Wrapper>

                    {/* Layout Specs */}
                    <Wrapper identity={{ displayName: "Layout Specs", filePath: "app/debug/zap/layout/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="border border-black p-4 space-y-3">
                            <h3 className="text-label-small font-black uppercase tracking-widest border-b border-black pb-2">Layout Specs</h3>
                            {[
                                { label: 'Container Max', value: '1440px' },
                                { label: 'Gutter Width', value: '24px (1.5rem)' },
                                { label: 'Base Unit', value: '8px' },
                            ].map((row) => (
                                <Wrapper key={row.label} identity={{ displayName: `Layout Spec: ${row.label}`, filePath: "app/debug/zap/atoms/layout/page.tsx", type: "Wrapped Snippet" }}>
                                    <div className="flex justify-between items-center text-label-medium">
                                        <span className="text-slate-500">{row.label}</span>
                                        <span className="font-bold">{row.value}</span>
                                    </div>
                                </Wrapper>
                            ))}
                        </div>
                    </Wrapper>

                    {/* CTA */}
                    <Wrapper identity={{ displayName: "Grid Extension CTA", filePath: "app/debug/zap/layout/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="bg-black text-white border border-black p-4">
                            <p className="text-label-medium font-bold italic mb-2">&quot;Need to inspect the grid in your browser?&quot;</p>
                            <a className="text-label-small font-black uppercase text-primary underline underline-offset-4" href="#">
                                Download Grid Extension
                            </a>
                        </div>
                    </Wrapper>
                </div>
            }
        >
            <Wrapper identity={{ displayName: "LayoutPrimitivesPage (L1)", filePath: "zap/atoms/layout/page.tsx", type: "Template/Page", architecture: "L1: ATOM VIEW" }}>
                <LayoutPrimitivesBody />
            </Wrapper>
        </MasterVerticalShell>
    );
}
