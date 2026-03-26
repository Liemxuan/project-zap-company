'use client';

import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../components/dev/Wrapper';
import { Canvas } from '../../../../genesis/atoms/surfaces/canvas';

const SPACING_SCALE = [
    { token: 'XS', px: '4px', rem: '0.25rem', twClass: 'w-1' },
    { token: 'S', px: '8px', rem: '0.5rem', twClass: 'w-2' },
    { token: 'M', px: '16px', rem: '1rem', twClass: 'w-4' },
    { token: 'L', px: '24px', rem: '1.5rem', twClass: 'w-6' },
    { token: 'XL', px: '32px', rem: '2rem', twClass: 'w-8' },
    { token: '2XL', px: '48px', rem: '3rem', twClass: 'w-12' },
    { token: '3XL', px: '64px', rem: '4rem', twClass: 'w-16' },
];


export const LayoutPrimitivesBody = () => {

    return (
        <Wrapper
            identity={{
                displayName: "LayoutPrimitivesBody",
                filePath: "zap/sections/atoms/layout/body.tsx",
                parentComponent: "LayoutPage",
                type: "Organism/Page",
                architecture: "SYSTEMS // CORE"
            }}
        >
            <Canvas className="flex-1 overflow-y-auto w-full bg-layer-canvas border-none text-brand-midnight p-12">
                <div className="max-w-4xl mx-auto space-y-12 p-8 font-display text-transform-primary text-brand-midnight">
                    {/* Header */}
                    <Wrapper title="Layout Title" className="w-auto">
                        <div className="flex flex-col items-start pl-2">
                            <h1 className="text-[64px] font-black uppercase tracking-tighter text-brand-midnight leading-[0.8] mb-3 [text-shadow:4px_4px_0px_var(--color-brand-yellow)]">
                                GRIDS & SPACING
                            </h1>
                            <div className="bg-brand-midnight text-white px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide">
                                SPATIAL RHYTHM (LEVEL 1)
                            </div>
                        </div>
                    </Wrapper>
                    <Wrapper identity={{ displayName: "Description", type: "Wrapped Snippet", filePath: "zap/sections/layout/body.tsx" }}>
                        <p className="text-lg text-theme-base/70 leading-relaxed max-w-2xl mt-6 pl-2">
                            The spatial rhythm of the ZAP Design System. Built on an 8pt baseline grid to ensure consistent alignment, vertical rhythm, and harmonious spacing across all viewports.
                        </p>
                    </Wrapper>

                    {/* 01. The 8pt Grid System */}
                    <Wrapper identity={{ displayName: "8pt Grid System Block", filePath: "zap/sections/atoms/layout/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <section className="bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border p-6 shadow-card rounded-card">
                            <Wrapper identity={{ displayName: "Section Header: The 8pt Grid System", filePath: "zap/sections/atoms/layout/body.tsx", type: "Wrapped Snippet" }}>
                                <div className="flex items-center justify-between mb-6 pb-4">
                                    <h2 className="text-xl font-black uppercase">The 8pt Grid System</h2>
                                    <span className="bg-theme-main/10 text-theme-main px-3 py-1 text-[10px] font-black uppercase border-[length:var(--card-border-width,0px)] border-theme-main/30 rounded-btn">Baseline</span>
                                </div>
                            </Wrapper>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                {/* Visual: grid-pattern preview */}
                                <Wrapper identity={{ displayName: "Grid Visualizer", filePath: "zap/sections/atoms/layout/body.tsx", type: "Wrapped Snippet" }}>
                                    <div
                                        className="h-64 border-[length:var(--card-border-width,0px)] border-card-border bg-layer-cover relative overflow-hidden p-4 flex flex-col justify-between rounded-[calc(var(--card-radius)/2)] [background-size:8px_8px] [background-image:linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)]"
                                    >
                                        {/* 8pt baseline overlay */}
                                        <div
                                            className="absolute inset-0 pointer-events-none [background-size:100%_8px] [background-image:linear-gradient(to_bottom,transparent_7px,rgba(249,229,78,0.5)_8px)]"
                                        />
                                        <div className="bg-theme-main/20 border border-theme-main w-2/3 h-12 flex items-center justify-center text-xs font-bold z-10 rounded-btn">
                                            48px (6×8)
                                        </div>
                                        <div className="flex gap-4 z-10">
                                            <div className="bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border/50 w-1/2 h-24 flex items-center justify-center text-xs font-bold rounded-btn">96px</div>
                                            <div className="bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border/50 w-1/2 h-24 flex items-center justify-center text-xs font-bold rounded-btn">96px</div>
                                        </div>
                                        <div className="bg-brand-midnight text-layer-base w-full h-8 flex items-center justify-center text-[10px] font-dev text-transform-tertiary z-10 rounded-btn">
                                            32px Component
                                        </div>
                                    </div>
                                </Wrapper>

                                {/* Description */}
                                <Wrapper identity={{ displayName: "Grid Rules Description", filePath: "zap/sections/atoms/layout/body.tsx", type: "Wrapped Snippet" }}>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2 text-brand-midnight">Hard Grid</h3>
                                        <p className="text-sm text-theme-base/50 mb-4">
                                            All UI elements snap to an 8px grid. Icons, type, and components must align to this hard grid to maintain vertical rhythm.
                                        </p>
                                        <ul className="space-y-2 text-sm text-theme-base/70">
                                            <li className="flex items-center gap-2">
                                                <Icon name="check_circle" size={16} className=" text-green-600" />
                                                <span><span className="font-bold text-brand-midnight">8px Increments:</span> Use for sizing, margin, and padding.</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Icon name="check_circle" size={16} className=" text-green-600" />
                                                <span><span className="font-bold text-brand-midnight">4px Half-step:</span> Permitted for tight spacing within icons.</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Icon name="cancel" size={16} className=" text-red-500" />
                                                <span><span className="font-bold text-theme-base/50">Odd Numbers:</span> Avoid 3px, 5px, 7px unless necessary for optical centering.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </Wrapper>
                            </div>
                        </section>
                    </Wrapper>

                    {/* 02. Layout Grids */}
                    <Wrapper identity={{ displayName: "Layout Grids Block", filePath: "zap/sections/atoms/layout/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <section className="bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border p-6 shadow-card rounded-card">
                            <Wrapper identity={{ displayName: "Section Header: Layout Grids", filePath: "zap/sections/atoms/layout/body.tsx", type: "Wrapped Snippet" }}>
                                <div className="flex items-center justify-between mb-6 pb-4">
                                    <h2 className="text-xl font-black uppercase">Layout Grids</h2>
                                    <span className="bg-layer-panel text-brand-midnight px-3 py-1 text-[10px] font-black uppercase border-[length:var(--card-border-width,0px)] border-card-border rounded-btn">12 Column</span>
                                </div>
                            </Wrapper>
                            <div className="space-y-6">
                                <p className="text-sm leading-relaxed text-theme-base/70">
                                    Our standard desktop layout uses a fluid 12-column grid with fixed 24px gutters. The max-width is constrained to 1440px for large screens.
                                </p>
                                {/* Column visualiser */}
                                <Wrapper identity={{ displayName: "Column Visualizer", filePath: "zap/sections/atoms/layout/body.tsx", type: "Wrapped Snippet" }}>
                                    <div className="w-full bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border h-48 relative p-4 flex gap-4 rounded-[calc(var(--card-radius)/2)]">
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <div key={i} className="flex-1 bg-theme-main/10 border-x border-theme-main/20 h-full flex flex-col justify-start items-center pt-2">
                                                <span className="text-[10px] font-dev text-transform-tertiary text-theme-main">{i + 1}</span>
                                            </div>
                                        ))}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border px-2 py-1 shadow-sm rounded-btn">
                                            <span className="text-xs font-bold text-theme-main">24px Gutter</span>
                                        </div>
                                    </div>
                                </Wrapper>
                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    {[
                                        { label: 'Columns', value: '12' },
                                        { label: 'Gutter', value: '24px' },
                                        { label: 'Margin', value: 'Auto' },
                                    ].map((s) => (
                                        <Wrapper key={s.label} identity={{ displayName: `Stat Item: ${s.label}`, filePath: "zap/sections/atoms/layout/body.tsx", type: "Wrapped Snippet" }}>
                                            <div className="border-[length:var(--card-border-width,0px)] border-card-border p-2 bg-layer-panel rounded-card">
                                                <span className="text-xs font-bold uppercase block text-theme-base/50">{s.label}</span>
                                                <span className="text-xl font-black">{s.value}</span>
                                            </div>
                                        </Wrapper>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </Wrapper>

                    {/* 03. Spacing Scale */}
                    <Wrapper identity={{ displayName: "Spacing Scale Block", filePath: "zap/sections/atoms/layout/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <section className="bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border p-6 shadow-card rounded-card pb-24">
                            <Wrapper identity={{ displayName: "Section Header: Spacing Scale", filePath: "zap/sections/atoms/layout/body.tsx", type: "Wrapped Snippet" }}>
                                <div className="flex items-center justify-between mb-6 pb-4">
                                    <h2 className="text-xl font-black uppercase">Spacing Scale</h2>
                                </div>
                            </Wrapper>
                            <Wrapper identity={{ displayName: "Spacing Scale Table", filePath: "zap/sections/atoms/layout/body.tsx", type: "Wrapped Snippet" }}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="">
                                            <tr className="text-[10px] font-black uppercase tracking-widest text-theme-base/50">
                                                <th className="pb-3 pr-4 w-24">Token</th>
                                                <th className="pb-3 pr-4 w-24">Value (px)</th>
                                                <th className="pb-3 pr-4 w-24">Value (rem)</th>
                                                <th className="pb-3">Visualization</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-card-border/20">
                                            {SPACING_SCALE.map((row) => (
                                                <tr key={row.token} className="hover:bg-layer-panel transition-colors text-theme-base/70">
                                                    <td className="py-4 pr-4"><span className="font-black text-sm text-brand-midnight">{row.token}</span></td>
                                                    <td className="py-4 pr-4 text-xs font-dev text-transform-tertiary">{row.px}</td>
                                                    <td className="py-4 pr-4 text-xs font-dev text-transform-tertiary">{row.rem}</td>
                                                    <td className="py-4">
                                                        <div
                                                            className={`h-4 bg-theme-main border-[length:var(--card-border-width,0px)] border-card-border/50 rounded-btn ${row.twClass}`}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Wrapper>
                        </section>
                    </Wrapper>
                </div>
            </Canvas>
        </Wrapper>
    );
};
