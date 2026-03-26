'use client';

import React, { useState } from 'react';
import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { useTheme } from '../../../../components/ThemeContext';
import { Wrapper } from '../../../../components/dev/Wrapper';
import { Toggle } from '../../../../genesis/atoms/interactive/custom-toggle';
import { Canvas } from '../../../../genesis/atoms/surfaces/canvas';

export const InteractiveElementsBody = () => {
    const { } = useTheme();
    const [toggleOn, setToggleOn] = useState(true);
    return (
        <Wrapper
            identity={{
                displayName: "InteractiveElementsBody",
                filePath: "zap/sections/interactive/body.tsx",
                parentComponent: "InteractivePage",
                type: "Organism/Page",
                architecture: "SYSTEMS // CORE"
            }}
        >
            <Canvas className="flex-1 overflow-y-auto p-12 bg-layer-canvas border-none text-brand-midnight">
                <div className="max-w-4xl mx-auto space-y-12 p-8 font-display text-transform-primary text-brand-midnight">
                    {/* Header */}
                    <Wrapper title="Interactive Title" className="w-auto">
                        <div className="flex flex-col items-start pl-2">
                            <h1 className="text-[64px] font-black uppercase tracking-tighter text-brand-midnight leading-[0.8] mb-3 [text-shadow:4px_4px_0px_var(--color-brand-yellow)]">
                                INTERACTIVE ELEMENTS
                            </h1>
                            <div className="bg-brand-midnight text-white px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide">
                                BUTTONS AND CONTROLS (LEVEL 1)
                            </div>
                        </div>
                    </Wrapper>
                    <Wrapper identity={{ displayName: "Description", type: "Wrapped Snippet", filePath: "zap/sections/interactive/body.tsx" }}>
                        <p className="text-lg text-theme-base/70 leading-relaxed max-w-2xl mt-6 pl-2">
                            Foundational interactive components for the ZAP Design System. These atomic units — buttons and inputs — serve as the primary touchpoints for user interaction.
                        </p>
                    </Wrapper>

                    {/* 01. BUTTON.TSX */}
                    <Wrapper identity={{ displayName: "Button Variant Spec", filePath: "zap/sections/interactive/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <section className="bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border p-6 shadow-card rounded-card">
                            <div className="flex items-center justify-between mb-2 pb-4">
                                <Wrapper className="w-fit" identity={{ displayName: "Section Header: BUTTON.TSX", type: "Wrapped Snippet", filePath: "zap/sections/interactive/body.tsx" }}>
                                    <h2 className="text-xl font-black uppercase tracking-tight text-brand-midnight">BUTTON.TSX</h2>
                                </Wrapper>
                                <Wrapper className="w-fit" identity={{ displayName: "Tag: Component", type: "Wrapped Snippet", filePath: "zap/sections/atoms/interactive/body.tsx" }}>
                                    <span className="bg-theme-main text-theme-inverted px-3 py-1 text-[10px] font-black uppercase border-[length:var(--card-border-width,0px)] border-card-border rounded-btn">Component</span>
                                </Wrapper>
                            </div>
                            <p className="text-sm text-theme-base/70 mt-4 mb-8 font-medium">
                                The unstyled button foundation used throughout the application. Features strict 90-degree corners and specific typographic settings.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Variant 1: Solid Black */}
                                <Wrapper identity={{ displayName: "Variant 1: Primary", type: "Wrapped Snippet", filePath: "zap/sections/atoms/interactive/body.tsx" }}>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-center p-8 border-[length:var(--card-border-width,0px)] border-card-border bg-layer-panel rounded-[calc(var(--card-radius)/2)]">
                                            <button className="bg-theme-main text-theme-inverted text-sm font-black uppercase tracking-wider px-6 py-3 border-[length:var(--btn-border-width,0px)] border-btn-border shadow-btn hover:-translate-y-0.5 hover:shadow-btn transition-all rounded-btn">
                                                UPGRADE
                                            </button>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-tight text-brand-midnight">Variant 1: Primary</p>
                                            <p className="text-[10px] text-theme-base/70 font-medium mt-1">Primary CTA. High contrast using the primary theme color.</p>
                                        </div>
                                    </div>
                                </Wrapper>

                                {/* Variant 2: Bordered White */}
                                <Wrapper identity={{ displayName: "Variant 2: Bordered White", type: "Wrapped Snippet", filePath: "zap/sections/atoms/interactive/body.tsx" }}>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-center p-8 border-[length:var(--card-border-width,0px)] border-card-border bg-layer-panel rounded-[calc(var(--card-radius)/2)]">
                                            <button className="bg-layer-cover text-brand-midnight text-sm font-black uppercase tracking-wider px-6 py-3 border-[length:var(--btn-border-width,0px)] border-btn-border shadow-btn hover:-translate-y-0.5 hover:shadow-btn transition-all rounded-btn">
                                                EDIT SITE
                                            </button>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-tight text-brand-midnight">Variant 2: Bordered White</p>
                                            <p className="text-[10px] text-theme-base/70 font-medium mt-1">Secondary action. Standard border.</p>
                                        </div>
                                    </div>
                                </Wrapper>

                                {/* Variant 3: Ghost */}
                                <Wrapper identity={{ displayName: "Variant 3: Ghost", type: "Wrapped Snippet", filePath: "zap/sections/atoms/interactive/body.tsx" }}>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-center p-8 border-[length:var(--card-border-width,0px)] border-card-border bg-layer-panel rounded-[calc(var(--card-radius)/2)]">
                                            <button className="bg-transparent text-brand-midnight text-sm font-black uppercase tracking-wider w-12 h-12 border border-card-border/30 flex items-center justify-center hover:border-card-border hover:bg-theme-main/10 transition-all rounded-btn">
                                                <Icon name="settings" size={20} />
                                            </button>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-tight text-brand-midnight">Variant 3: Ghost</p>
                                            <p className="text-[10px] text-theme-base/70 font-medium mt-1">Utility actions. Icon-only or text-string with no container.</p>
                                        </div>
                                    </div>
                                </Wrapper>
                            </div>
                        </section>
                    </Wrapper>



                    {/* 02. Toggle.tsx */}
                    <Wrapper identity={{ displayName: "Toggle Variant Spec", filePath: "zap/sections/interactive/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <section className="bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border p-6 shadow-card rounded-card pb-24">
                            <div className="flex items-center justify-between mb-2 pb-4">
                                <Wrapper className="w-fit" identity={{ displayName: "Section Header: Toggle.tsx", type: "Wrapped Snippet", filePath: "zap/sections/interactive/body.tsx" }}>
                                    <h2 className="text-xl font-black uppercase tracking-tight text-brand-midnight">Toggle.tsx</h2>
                                </Wrapper>
                                <Wrapper className="w-fit" identity={{ displayName: "Tag: Foundation", type: "Wrapped Snippet", filePath: "zap/sections/atoms/interactive/body.tsx" }}>
                                    <span className="bg-layer-panel text-brand-midnight px-3 py-1 text-[10px] font-black uppercase border-[length:var(--card-border-width,0px)] border-card-border rounded-btn">Foundation</span>
                                </Wrapper>
                            </div>
                            <p className="text-sm text-theme-base/70 mt-4 mb-8 font-medium">
                                Binary state control used for settings and feature flags. Renders as a stark rectangular toggle with instant feedback on state change.
                            </p>

                            <div className="flex flex-wrap gap-6 items-center">
                                {/* Toggle OFF */}
                                <Wrapper className="w-fit" identity={{ displayName: "Toggle State: Off", type: "Wrapped Snippet", filePath: "zap/sections/atoms/interactive/body.tsx" }}>
                                    <div className="flex flex-col items-center gap-3">
                                        <Toggle checked={false} onChange={() => { }} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-theme-base/50">Off</span>
                                    </div>
                                </Wrapper>
                                {/* Toggle ON */}
                                <Wrapper className="w-fit" identity={{ displayName: "Toggle State: On", type: "Wrapped Snippet", filePath: "zap/sections/atoms/interactive/body.tsx" }}>
                                    <div className="flex flex-col items-center gap-3">
                                        <Toggle checked={toggleOn} onChange={setToggleOn} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">On / Active</span>
                                    </div>
                                </Wrapper>
                                {/* Toggle DISABLED */}
                                <Wrapper className="w-fit" identity={{ displayName: "Toggle State: Disabled", type: "Wrapped Snippet", filePath: "zap/sections/atoms/interactive/body.tsx" }}>
                                    <div className="flex flex-col items-center gap-3">
                                        <Toggle checked={false} onChange={() => { }} disabled={true} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-theme-base/30">Disabled</span>
                                    </div>
                                </Wrapper>
                            </div>
                        </section>
                    </Wrapper>
                </div>
            </Canvas>
        </Wrapper>
    );
};
