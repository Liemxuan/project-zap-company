'use client';

import React from 'react';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { LayoutLayersBody } from '../../../../../zap/sections/atoms/layout-layers/body';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function LayoutLayersPage() {
    return (
        <MasterVerticalShell
            breadcrumbs={[
                { label: 'SYSTEMS' },
                { label: 'CORE' },
                { label: 'LAYOUT LAYERS', active: true }
            ]}
            activeItem="Canvas, Cover & Panels"
            inspectorTitle="" // Mockup doesn't show top title
            inspectorContent={
                <div className="space-y-6">
                    {/* Z-Index Stack */}
                    <Wrapper identity={{ displayName: "Z-Index Stack", filePath: "app/debug/zap/layout-layers/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="border border-black bg-white p-4 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-black text-white p-1 flex items-center justify-center">
                                    <Icon name="swap_vert" size={14} />
                                </span>
                                <h3 className="text-label-small font-black uppercase tracking-tighter">Z-Index Stack</h3>
                            </div>
                            <div className="space-y-2">
                                <Wrapper identity={{ displayName: "Inspector String L3", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/layout-layers/page.tsx" }}>
                                    <div className="flex justify-between items-center p-3 border border-black bg-white">
                                        <span className="text-label-small font-bold">L3: Panels/Modals</span>
                                        <span className="text-label-small font-dev text-transform-tertiary bg-black text-white px-2 py-0.5">1000+</span>
                                    </div>
                                </Wrapper>
                                <Wrapper identity={{ displayName: "Inspector String L2", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/layout-layers/page.tsx" }}>
                                    <div className="flex justify-between items-center p-3 border border-black bg-white">
                                        <span className="text-label-small font-bold">L2: Cover Surface</span>
                                        <span className="text-label-small font-dev text-transform-tertiary bg-black text-white px-2 py-0.5">100</span>
                                    </div>
                                </Wrapper>
                                <Wrapper identity={{ displayName: "Inspector String L1", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/layout-layers/page.tsx" }}>
                                    <div className="flex justify-between items-center p-3 border border-black bg-white">
                                        <span className="text-label-small font-bold">L1: Canvas Base</span>
                                        <span className="text-label-small font-dev text-transform-tertiary bg-black text-white px-2 py-0.5">0</span>
                                    </div>
                                </Wrapper>
                            </div>
                        </div>
                    </Wrapper>

                    {/* Border & Radius */}
                    <Wrapper identity={{ displayName: "Border & Radius", filePath: "app/debug/zap/layout-layers/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="border border-black bg-white p-4 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-black text-white p-1 flex items-center justify-center">
                                    <Icon name="square" size={14} />
                                </span>
                                <h3 className="text-label-small font-black uppercase tracking-tighter">Border & Radius</h3>
                            </div>
                            <div className="space-y-4">
                                <Wrapper identity={{ displayName: "Inspector Radius Info", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/layout-layers/page.tsx" }}>
                                    <div className="p-4 bg-white border border-black text-center">
                                        <div className="w-10 h-10 border border-black mx-auto mb-3"></div>
                                        <p className="text-label-small font-black uppercase">Standard: rounded-none</p>
                                        <p className="text-[9px] text-theme-muted mt-1 tracking-wide">90-degree strict corners</p>
                                    </div>
                                </Wrapper>
                                <Wrapper identity={{ displayName: "Inspector Border Info", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/layout-layers/page.tsx" }}>
                                    <div className="bg-white border border-black">
                                        <div className="flex justify-between items-center text-label-small font-bold border-b border-black py-2 px-3">
                                            <span className="text-theme-muted">Weight</span>
                                            <span>1px Fixed</span>
                                        </div>
                                        <div className="flex justify-between items-center text-label-small font-bold py-2 px-3">
                                            <span className="text-theme-muted">Color</span>
                                            <span>var(--color-border)</span>
                                        </div>
                                    </div>
                                </Wrapper>
                            </div>
                        </div>
                    </Wrapper>

                    {/* Zap Core Principle */}
                    <Wrapper identity={{ displayName: "Core Principle", filePath: "app/debug/zap/layout-layers/page.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <div className="bg-black p-5 border border-black">
                            <Wrapper identity={{ displayName: "Inspector Core Principle Quote", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/layout-layers/page.tsx" }}>
                                <p className="text-label-medium font-bold leading-relaxed mb-6 text-white tracking-wide">
                                    &quot;Layers never use shadows to indicate depth. Elevation is communicated solely through border overlap and background contrast.&quot;
                                </p>
                            </Wrapper>
                            <Wrapper className="w-fit" identity={{ displayName: "Inspector Core Principle Label", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/layout-layers/page.tsx" }}>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-[var(--color-brand-yellow)]"></span>
                                    <span className="text-label-small font-black uppercase tracking-widest text-white">Zap Core Principle</span>
                                </div>
                            </Wrapper>
                        </div>
                    </Wrapper>
                </div>
            }
        >
            <LayoutLayersBody />
        </MasterVerticalShell>
    );
}
