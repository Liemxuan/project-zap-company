'use client';

import React from 'react';
import { Wrapper } from '../../../../components/dev/Wrapper';
import { InteractiveColorBox } from './InteractiveColorBox';
import { Canvas } from '../../../../genesis/atoms/surfaces/canvas';

export const ColorPaletteBody = () => {
    return (
        <Wrapper
            identity={{
                displayName: "ColorPaletteBody",
                filePath: "zap/sections/color/body.tsx",
                parentComponent: "ColorPage",
                type: "Organism/Page",
                architecture: "SYSTEMS // CORE"
            }}
        >
            <Canvas className="flex-1 overflow-y-auto p-12 bg-layer-canvas border-none text-brand-midnight">
                <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
                    <div className="py-8 font-display text-transform-primary space-y-16">
                        {/* Header */}
                        <Wrapper identity={{ displayName: "Color Title", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }} className="w-auto">
                            <div className="flex flex-col items-start pl-2">
                                <h1 className="text-[64px] font-black uppercase tracking-tighter text-brand-midnight leading-[0.8] mb-3 [text-shadow:4px_4px_0px_var(--color-brand-yellow)]">
                                    COLOR PALETTE
                                </h1>
                                <div className="bg-brand-midnight text-white px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide">
                                    FOUNDATIONAL COLOR SYSTEM (LEVEL 1)
                                </div>
                            </div>
                        </Wrapper>

                        <Wrapper identity={{ displayName: "Description", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                            <p className="text-lg font-medium text-theme-base/70 max-w-2xl mt-6 pl-2">
                                The foundational color palette for the ZAP Universal Brand Guide. Defined for maximum accessibility and visual impact across digital and print surfaces.
                            </p>
                        </Wrapper>

                        {/* SECTION 1: THE 3-LAYER SYSTEM */}
                        <Wrapper identity={{ displayName: "Color Layers", filePath: "zap/sections/color/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4">
                                    <Wrapper identity={{ displayName: "Section Header: The 3-Layer System", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <h2 className="text-xl font-black uppercase">The 3-Layer System</h2>
                                    </Wrapper>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-display text-transform-primary">
                                    <Wrapper identity={{ displayName: "Color: Foundation", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <div className="flex flex-col gap-4">
                                            <InteractiveColorBox cssVars={['--color-brand-midnight', '--color-layer-canvas']} fallbackHex="0B132B" className="h-48 w-full border-[length:var(--card-border-width,0px)] border-card-border flex items-end p-4 shadow-card rounded-card">
                                                <span className="text-sm font-black uppercase text-theme-inverted bg-layer-canvas px-2 border-[length:var(--btn-border-width,0px)] border-layer-base/20 pointer-events-none rounded-[calc(var(--btn-radius)/2)] -ml-[1px]">Layer 01 (100% Solid)</span>
                                            </InteractiveColorBox>
                                            <div>
                                                <h4 className="font-bold uppercase text-sm">Foundation</h4>
                                                <p className="text-xs font-medium text-theme-base/50">Global canvas foundation (Midnight {'#'}0B132B)</p>
                                            </div>
                                        </div>
                                    </Wrapper>
                                    <Wrapper identity={{ displayName: "Color: Surface", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <div className="flex flex-col gap-4">
                                            <InteractiveColorBox cssVars={['--color-cream-white', '--color-layer-cover']} fallbackHex="FDFDFD" className="h-48 w-full border-[length:var(--card-border-width,0px)] border-card-border flex items-end p-4 shadow-card rounded-card">
                                                <span className="text-sm font-black uppercase text-brand-midnight bg-layer-cover px-2 border-[length:var(--btn-border-width,0px)] border-card-border pointer-events-none rounded-[calc(var(--btn-radius)/2)]">Layer 02</span>
                                            </InteractiveColorBox>
                                            <div>
                                                <h4 className="font-bold uppercase text-sm">Surface</h4>
                                                <p className="text-xs font-medium text-theme-base/50">Elevated content containers (Cream {'#'}FDFDFD)</p>
                                            </div>
                                        </div>
                                    </Wrapper>
                                    <Wrapper identity={{ displayName: "Color: Panels", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <div className="flex flex-col gap-4">
                                            <InteractiveColorBox cssVars={['--color-brand-yellow', '--color-layer-panel']} fallbackHex="E9FF70" className="h-48 w-full border-[length:var(--card-border-width,0px)] border-card-border flex items-end p-4 shadow-card rounded-card">
                                                <span className="text-sm font-black uppercase text-brand-midnight bg-layer-panel px-2 border-[length:var(--btn-border-width,0px)] border-card-border pointer-events-none rounded-[calc(var(--btn-radius)/2)] -ml-[1px]">Layer 03 (100% Solid)</span>
                                            </InteractiveColorBox>
                                            <div>
                                                <h4 className="font-bold uppercase text-sm">Panels</h4>
                                                <p className="text-xs font-medium text-theme-base/50">Navigation & dynamic panels (Yellow {'#'}E9FF70)</p>
                                            </div>
                                        </div>
                                    </Wrapper>
                                </div>
                            </div>
                        </Wrapper>

                        {/* SECTION 2: BRAND PALETTE */}
                        <Wrapper identity={{ displayName: "Brand Palette", filePath: "zap/sections/color/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4">
                                    <Wrapper identity={{ displayName: "Section Header: Brand Palette", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <h2 className="text-xl font-black uppercase">Brand Palette</h2>
                                    </Wrapper>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    {/* Primary */}
                                    <Wrapper identity={{ displayName: "Brand Primary", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <div className="flex flex-col md:flex-row gap-6 border-[length:var(--card-border-width,0px)] border-card-border p-6 bg-layer-panel shadow-dialog rounded-card">
                                            <div className="w-full md:w-1/3 aspect-video flex">
                                                <InteractiveColorBox cssVars={['--color-brand-primary']} fallbackHex="F1F5F9" className="w-full h-full border-[length:var(--card-border-width,0px)] border-card-border shadow-btn rounded-card" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h3 className="text-xl font-black uppercase mb-1">Primary: Slate 100</h3>
                                                <p className="text-sm text-theme-muted mb-6 font-medium">The universal baseline primary identifier.</p>
                                                <div className="grid grid-cols-2 gap-4 font-dev text-transform-tertiary">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase text-theme-base/50 block">HEX</span>
                                                        <span className="font-bold text-sm">{'#'}F1F5F9</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase text-theme-base/50 block">RGB</span>
                                                        <span className="font-bold text-sm">241, 245, 249</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Wrapper>

                                    {/* Secondary / Third */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Wrapper identity={{ displayName: "Brand Secondary", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                            <div className="flex flex-col border-[length:var(--card-border-width,0px)] border-card-border p-6 bg-layer-panel shadow-dialog rounded-card">
                                                <div className="h-24 w-full mb-4 flex">
                                                    <InteractiveColorBox cssVars={['--color-brand-secondary']} fallbackHex="94A3B8" className="w-full h-full rounded-card border-[length:var(--card-border-width,0px)] border-card-border" />
                                                </div>
                                                <h3 className="text-lg font-black uppercase mb-1">Secondary: Slate 400</h3>
                                                <div className="grid grid-cols-2 gap-2 mt-4">
                                                    <div className="bg-layer-canvas p-2 border-[length:var(--input-border-width,0px)] border-input-border rounded-input">
                                                        <span className="text-[10px] font-black text-theme-base/50 block">HEX</span>
                                                        <span className="font-bold text-xs uppercase">{'#'}94A3B8</span>
                                                    </div>
                                                    <div className="bg-layer-canvas p-2 border-[length:var(--input-border-width,0px)] border-input-border rounded-input">
                                                        <span className="text-[10px] font-black text-theme-base/50 block">RGB</span>
                                                        <span className="font-bold text-xs">148, 163, 184</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Wrapper>
                                        <Wrapper identity={{ displayName: "Brand Third", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                            <div className="flex flex-col border-[length:var(--card-border-width,0px)] border-card-border p-6 bg-layer-panel shadow-dialog rounded-card">
                                                <div className="h-24 w-full mb-4 flex">
                                                    <InteractiveColorBox cssVars={['--color-brand-tertiary']} fallbackHex="CBD5E1" className="w-full h-full rounded-card border-[length:var(--card-border-width,0px)] border-card-border" />
                                                </div>
                                                <h3 className="text-lg font-black uppercase mb-1">Third: Slate 300</h3>
                                                <div className="grid grid-cols-2 gap-2 mt-4">
                                                    <div className="bg-layer-canvas p-2 border-[length:var(--input-border-width,0px)] border-input-border rounded-input">
                                                        <span className="text-[10px] font-black text-theme-base/50 block">HEX</span>
                                                        <span className="font-bold text-xs uppercase">{'#'}CBD5E1</span>
                                                    </div>
                                                    <div className="bg-layer-canvas p-2 border-[length:var(--input-border-width,0px)] border-input-border rounded-input">
                                                        <span className="text-[10px] font-black text-theme-base/50 block">RGB</span>
                                                        <span className="font-bold text-xs">203, 213, 225</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Wrapper>
                                    </div>
                                </div>
                            </div>
                        </Wrapper>

                        {/* SECTION 3: FUNCTIONAL COLORS */}
                        <Wrapper identity={{ displayName: "Functional Colors", filePath: "zap/sections/color/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 mb-6">
                                    <Wrapper identity={{ displayName: "Section Header: Functional Colors", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <h2 className="text-xl font-black uppercase">Functional Colors</h2>
                                    </Wrapper>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Success', name: 'M3 Green', colorHex: '#' + '2E7D32', rgb: '46, 125, 50' },
                                        { label: 'Warning', name: 'M3 Amber', colorHex: '#' + 'FF8F00', rgb: '255, 143, 0' },
                                        { label: 'Error', name: 'M3 Red', colorHex: '#' + 'B3261E', rgb: '179, 38, 30' },
                                        { label: 'Info', name: 'M3 Blue', colorHex: '#' + '0288D1', rgb: '2, 136, 209' }
                                    ].map((c) => (
                                        <Wrapper key={c.label} identity={{ displayName: `Functional Color: ${c.label}`, type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                            <div className="flex flex-col border-[length:var(--card-border-width,0px)] border-card-border p-6 bg-layer-panel shadow-dialog rounded-card">
                                                <div className="h-24 w-full mb-4 flex">
                                                    <InteractiveColorBox cssVars={[`--color-state-${c.label.toLowerCase()}`]} fallbackHex={c.colorHex || ''} className="w-full h-full rounded-card border-[length:var(--card-border-width,0px)] border-card-border" />
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-theme-base/50 uppercase tracking-widest leading-none">{c.label}</span>
                                                    <span className="text-[9px] font-medium text-theme-base/40 uppercase leading-none">{c.colorHex}</span>
                                                </div>
                                                <h3 className="text-lg font-black uppercase leading-none">{c.name}</h3>
                                                <div className="grid grid-cols-1 gap-2 mt-4">
                                                    <div className="bg-layer-canvas p-2 border-[length:var(--input-border-width,0px)] border-input-border rounded-input">
                                                        <span className="text-[10px] font-black text-theme-base/50 block">RGB</span>
                                                        <span className="font-bold text-xs">{c.rgb}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Wrapper>
                                    ))}
                                </div>
                            </div>
                        </Wrapper>

                        {/* SECTION 4: NEUTRAL SCALE */}
                        <Wrapper identity={{ displayName: "Neutral Scale", filePath: "zap/sections/color/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 mb-6">
                                    <Wrapper identity={{ displayName: "Section Header: Neutral Scale", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <h2 className="text-xl font-black uppercase">Neutral Scale</h2>
                                    </Wrapper>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { label: 'Gray 900', hex: '#' + '1A1A14', cssVar: '--color-iso-gray-900' },
                                        { label: 'Gray 600', hex: '#' + '475569', cssVar: '--color-iso-gray-600' },
                                        { label: 'Gray 400', hex: '#' + '94A3B8', cssVar: '--color-iso-gray-400' },
                                        { label: 'Gray 100', hex: '#' + 'F1F5F9', cssVar: '--color-iso-gray-100' },
                                        { label: 'White', hex: '#' + 'FFFFFF', cssVar: '--color-iso-white' }
                                    ].map((n) => (
                                        <Wrapper key={n.label} identity={{ displayName: `Neutral: ${n.label}`, type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                            <div className="flex flex-col gap-2">
                                                <InteractiveColorBox cssVars={[n.cssVar]} fallbackHex={n.hex} className="h-20 w-full border-[length:var(--card-border-width,0px)] border-card-border rounded-card" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase">{n.label}</span>
 <span className="text-[10px] font-dev text-transform-tertiary opacity-50 ">{n.hex}</span>
                                                </div>
                                            </div>
                                        </Wrapper>
                                    ))}
                                </div>
                            </div>
                        </Wrapper>

                        {/* SECTION 5: ACCESSIBILITY & CONTRAST */}
                        <Wrapper identity={{ displayName: "Accessibility Section", filePath: "zap/sections/color/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between pb-4 mb-6">
                                    <Wrapper identity={{ displayName: "Section Header: Accessibility & Contrast", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <h2 className="text-xl font-black uppercase">Accessibility & Contrast</h2>
                                    </Wrapper>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Wrapper identity={{ displayName: "WCAG Compliance Card", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <div className="p-6 bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border rounded-card">
                                            <h3 className="text-lg font-black mb-4 uppercase">WCAG 2.1 Compliance</h3>
                                            <p className="text-sm text-theme-base/70 mb-6">
                                                All text pairings must meet a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-brand-midnight text-white flex items-center justify-center font-bold rounded-btn">Aa</div>
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase block">Midnight / White</span>
                                                        <span className="text-xs font-bold text-theme-success">Ratio: 16.2:1 (PASS AAA)</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-brand-yellow text-brand-midnight flex items-center justify-center font-bold rounded-btn">Aa</div>
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase block">Yellow / Midnight</span>
                                                        <span className="text-xs font-bold text-theme-success">Ratio: 12.4:1 (PASS AAA)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Wrapper>
                                    <Wrapper identity={{ displayName: "Print Standards Card", type: "Wrapped Snippet", filePath: "zap/sections/color/body.tsx" }}>
                                        <div className="p-6 bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border rounded-card">
                                            <h3 className="text-lg font-black mb-4 uppercase">Print Standards</h3>
                                            <p className="text-sm text-theme-base/70 mb-6">
                                                Conversion targets for physical media and collateral.
                                            </p>
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="flex justify-between items-center pb-2">
                                                    <span className="text-xs font-bold uppercase">Midnight</span>
                                                    <span className="text-xs font-dev text-transform-tertiary text-theme-base/50">C:90 M:80 Y:40 K:100</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-2">
                                                    <span className="text-xs font-bold uppercase">Yellow</span>
                                                    <span className="text-xs font-dev text-transform-tertiary text-theme-base/50">C:5 M:0 Y:85 K:0</span>
                                                </div>
                                                <div className="flex justify-between items-center pb-2">
                                                    <span className="text-xs font-bold uppercase">Teal (Secondary)</span>
                                                    <span className="text-xs font-dev text-transform-tertiary text-theme-base/50">C:40 M:15 Y:15 K:20</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Wrapper>
                                </div>
                            </div>
                        </Wrapper>
                        <div className="pb-24"></div>
                    </div>
                </div>
            </Canvas>
        </Wrapper>
    );
};
