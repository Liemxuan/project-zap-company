'use client';

import React from 'react';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { ColorPaletteBody } from '../../../../../zap/sections/atoms/color/body';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { HorizontalNavigation } from '../../../../../genesis/molecules/navigation/HorizontalNavigation';

export default function ColorPalettePage() {

    return (
        <MasterVerticalShell
            breadcrumbs={[
                { label: 'SYSTEMS' },
                { label: 'CORE' },
                { label: 'COLORS', active: true }
            ]}
            activeItem="Color Palette"
            inspectorTitle="Usage Rules"
            inspectorContent={
                <div className="flex flex-col gap-6">
                    {/* Contrast Ratios Card */}
                    <Wrapper identity={{ displayName: "Contrast Ratios", filePath: "app/debug/zap/colors/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="border border-card-border bg-layer-panel p-4 shadow-card">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold uppercase text-label-small">Contrast Ratios</h4>
                                <Icon name="check_circle" size={16} className="text-theme-success" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-label-small font-medium">Text on Primary</span>
                                    <span className="text-label-small font-black px-2 py-0.5 border border-card-border bg-theme-success/10 text-theme-success">4.5:1</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-label-small font-medium">Primary on Bg</span>
                                    <span className="text-label-small font-black px-2 py-0.5 border border-card-border bg-theme-success/10 text-theme-success">3.1:1</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-label-small font-medium">Text on Interaction</span>
                                    <span className="text-label-small font-black px-2 py-0.5 border border-card-border bg-theme-success/10 text-theme-success">12.5:1</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-card-border">
                                <p className="text-label-small font-medium text-theme-muted italic">All color combinations exceed WCAG 2.1 AA requirements for accessibility.</p>
                            </div>
                        </div>
                    </Wrapper>

                    {/* Color Pairing Card */}
                    <Wrapper identity={{ displayName: "Color Pairing", filePath: "app/debug/zap/colors/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="border-[length:var(--card-border-width,0px)] border-card-border p-4 shadow-card bg-layer-panel text-theme-base">
                            <h4 className="font-bold uppercase text-label-small mb-4">Semantic Pairing</h4>
                            <div className="space-y-2">
                                <div className="bg-theme-main p-2 border-[length:var(--card-border-width,0px)] border-card-border rounded-input">
                                    <p className="text-theme-inverted text-label-small font-black uppercase tracking-tighter text-center">Inverted Text on Brand Main</p>
                                </div>
                                <div className="bg-layer-canvas p-2 border-[length:var(--card-border-width,0px)] border-card-border rounded-input">
                                    <p className="text-theme-base text-label-small font-black uppercase tracking-tighter text-center">Base Text on Canvas (L1)</p>
                                </div>
                                <div className="bg-layer-cover p-2 border-[length:var(--card-border-width,0px)] border-card-border rounded-input">
                                    <p className="text-theme-base text-label-small font-black uppercase tracking-tighter text-center">Base Text on Cover (L2)</p>
                                </div>
                                <div className="bg-layer-panel p-2 border-[length:var(--card-border-width,0px)] border-card-border rounded-input">
                                    <p className="text-theme-muted text-label-small font-black uppercase tracking-tighter text-center">Muted Text on Panel (L3)</p>
                                </div>
                            </div>
                            <p className="text-label-small mt-4 font-bold text-theme-muted uppercase leading-tight">These semantic pairings dynamically swap contrast rules when themes change.</p>
                        </div>
                    </Wrapper>

                    {/* Guidelines */}
                    <Wrapper identity={{ displayName: "Usage Guidelines", filePath: "app/debug/zap/colors/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Icon name="warning" size={20} className=" text-primary shrink-0" />
                                <p className="text-label-medium font-medium leading-relaxed">Avoid using Functional Colors for decorative purposes. Reserve them for system feedback.</p>
                            </div>
                            <div className="flex gap-3">
                                <Icon name="edit_square" size={20} className=" text-primary shrink-0" />
                                <p className="text-label-medium font-medium leading-relaxed">Always use the defined HEX codes. Do not manually adjust opacity levels below 50% for core branding.</p>
                            </div>
                        </div>
                    </Wrapper>
                </div>
            }
        >
            <div className="flex flex-col gap-6 w-full">
                <HorizontalNavigation />
                <ColorPaletteBody />
            </div>
        </MasterVerticalShell>
    );
}
