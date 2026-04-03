'use client';

import React from 'react';
import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../components/dev/Wrapper';
import { Pill } from '../../../../genesis/atoms/status/pills';
import { Canvas } from '../../../../genesis/atoms/surfaces/canvas';
import { CanvasBody } from '../../../../zap/layout/CanvasBody';

export const StatusIndicatorsBody = () => {
    return (
        <Wrapper
            identity={{
                displayName: "StatusIndicatorsBody",
                filePath: "zap/sections/status/body.tsx",
                parentComponent: "StatusIndicatorsPage",
                type: "Organism/Page", // Root page wrapper uses Page
                architecture: "SYSTEMS // CORE"
            }}
        >
            <Canvas className="flex-1 overflow-y-auto p-12 bg-layer-canvas border-none text-brand-midnight">
                <div className="max-w-4xl mx-auto space-y-12 p-8 font-display text-transform-primary text-brand-midnight">

                    {/* Header */}
                    <Wrapper title="Status Title" className="w-auto">
                        <div className="flex flex-col items-start pl-2">
                            <h1 className="text-[64px] font-black uppercase tracking-tighter text-brand-midnight leading-[0.8] mb-3 [text-shadow:4px_4px_0px_var(--color-brand-yellow)]">
                                STATUS & INDICATORS
                            </h1>
                            <div className="bg-brand-midnight text-white px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide">
                                VISUAL FEEDBACK (LEVEL 1)
                            </div>
                        </div>
                    </Wrapper>
                    <Wrapper identity={{ displayName: "Description", type: "Wrapped Snippet", filePath: "zap/sections/status/body.tsx" }}>
                        <p className="text-lg text-theme-base/70 leading-relaxed max-w-2xl font-sans mt-6 pl-2">
                            Visual feedback mechanisms for system status and user identification. These atoms communicate state, activity, and identity across the ZAP ecosystem with high contrast and clarity.
                        </p>
                    </Wrapper>

                    {/* 01. Pill.tsx */}
                    <Wrapper identity={{ displayName: "Pill Component Spec", filePath: "zap/sections/status/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <CanvasBody.Section flush={true} className="border-[length:var(--card-border-width,0px)] border-card-border p-6 shadow-card rounded-card">
                            <div className="flex items-center justify-between mb-6 pb-4">
                                <Wrapper className="w-fit" identity={{ displayName: "Section Header: Pill.tsx", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                    <h2 className="text-xl font-black uppercase text-brand-midnight">Pill.tsx</h2>
                                </Wrapper>
                                <Wrapper className="w-fit" identity={{ displayName: "Tag: Feedback", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                    <span className="bg-theme-main px-3 py-1 text-[10px] font-black text-theme-inverted uppercase border-[length:var(--card-border-width,0px)] border-card-border rounded-btn">Feedback</span>
                                </Wrapper>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Left: Visual preview with grid pattern */}
                                <div
                                    className="h-64 border-[length:var(--card-border-width,0px)] border-card-border bg-layer-panel relative overflow-hidden flex flex-col items-center justify-center p-8 gap-6 rounded-[calc(var(--card-radius)/2)] [background-size:8px_8px] [background-image:linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)]"
                                >
                                    {/* Pill row */}
                                    <div className="relative z-10 flex gap-4 flex-wrap justify-center">
                                        <Wrapper className="w-fit" identity={{ displayName: "Pill: Active", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <Pill variant="success">Active</Pill>
                                        </Wrapper>
                                        <Wrapper className="w-fit" identity={{ displayName: "Pill: Info", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <Pill variant="info" className="flex items-center gap-1">
                                                <Icon name="info" size={10} />
                                                Info
                                            </Pill>
                                        </Wrapper>
                                        <Wrapper className="w-fit" identity={{ displayName: "Pill: Syncing", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <Pill variant="warning" className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-[var(--color-state-warning)] rounded-full animate-pulse"></span>
                                                Syncing
                                            </Pill>
                                        </Wrapper>
                                        <Wrapper className="w-fit" identity={{ displayName: "Pill: Error", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <Pill variant="error" className="flex items-center gap-1">
                                                <Icon name="warning" size={10} />
                                                Error
                                            </Pill>
                                        </Wrapper>
                                    </div>
                                    {/* Service Status mock card */}
                                    <Wrapper identity={{ displayName: "Mock Card: Service Status", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                        <div className="relative z-10 w-full max-w-xs mt-4">
                                            <div className="bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border p-3 shadow-card rounded-card">
                                                <div className="flex justify-between items-center mb-2">
                                                    <Wrapper className="w-fit" identity={{ displayName: "Card Label: Service Status", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                                        <span className="text-xs font-bold text-theme-base/70">Service Status</span>
                                                    </Wrapper>
                                                    <Wrapper className="w-fit" identity={{ displayName: "Status Pill: Online", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                                        <Pill variant="success">Online</Pill>
                                                    </Wrapper>
                                                </div>
                                                <Wrapper identity={{ displayName: "Service Status Progress Bar", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                                    <div className="h-1 w-full bg-theme-base/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[var(--color-state-success)] w-full"></div>
                                                    </div>
                                                </Wrapper>
                                            </div>
                                        </div>
                                    </Wrapper>
                                </div>

                                {/* Right: Descriptions */}
                                <div>
                                    <Wrapper identity={{ displayName: "Pill Overview Description", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-bold mb-2 text-brand-midnight">Status Pills</h3>
                                            <p className="text-sm text-theme-base/70 font-sans">
                                                Compact indicators used to display metadata states. Designed with high-contrast borders to ensure visibility on complex dashboards.
                                            </p>
                                        </div>
                                    </Wrapper>
                                    <ul className="space-y-3 text-sm font-sans text-brand-midnight">
                                        <Wrapper identity={{ displayName: "Pill Spec: Active State", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <li className="flex items-start gap-2">
                                                <Icon name="check_circle" size={16} className="text-[var(--color-state-success)] mt-0.5" />
                                                <div>
                                                    <span className="font-bold block">Active State (Success):</span>
                                                    <span className="text-theme-base/70">Semantic Success border &amp; text. Used for successful operations or online status.</span>
                                                </div>
                                            </li>
                                        </Wrapper>
                                        <Wrapper identity={{ displayName: "Pill Spec: Info", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <li className="flex items-start gap-2">
                                                <Icon name="info" size={16} className="text-[var(--color-state-info)] mt-0.5" />
                                                <div>
                                                    <span className="font-bold block">Info:</span>
                                                    <span className="text-theme-base/70">Semantic Info color mapping. Used for neutral highlights or guidance.</span>
                                                </div>
                                            </li>
                                        </Wrapper>
                                        <Wrapper identity={{ displayName: "Pill Spec: Syncing", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <li className="flex items-start gap-2">
                                                <Icon name="pending" size={16} className="text-[var(--color-state-warning)] mt-0.5" />
                                                <div>
                                                    <span className="font-bold block">Syncing/Pending (Warning):</span>
                                                    <span className="text-theme-base/70">Semantic Warning color mapping. Often accompanied by a pulse animation or spinner.</span>
                                                </div>
                                            </li>
                                        </Wrapper>
                                        <Wrapper identity={{ displayName: "Pill Spec: Error", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <li className="flex items-start gap-2">
                                                <Icon name="error" size={16} className="text-[var(--color-state-error)] mt-0.5" />
                                                <div>
                                                    <span className="font-bold block">Error/Critical:</span>
                                                    <span className="text-theme-base/70">Semantic Error color mapping. Demands immediate attention. Use with icon for accessibility.</span>
                                                </div>
                                            </li>
                                        </Wrapper>
                                    </ul>
                                </div>
                            </div>
                        </CanvasBody.Section>
                    </Wrapper>

                    {/* 02. Avatar.tsx */}
                    <Wrapper identity={{ displayName: "Avatar Component Spec", filePath: "zap/sections/status/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <CanvasBody.Section flush={true} className="border-[length:var(--card-border-width,0px)] border-card-border p-6 shadow-card rounded-card pb-24">
                            <div className="flex items-center justify-between mb-6 pb-4">
                                <Wrapper className="w-fit" identity={{ displayName: "Section Header: Avatar.tsx", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                    <h2 className="text-xl font-black uppercase text-brand-midnight">Avatar.tsx</h2>
                                </Wrapper>
                                <Wrapper className="w-fit" identity={{ displayName: "Tag: Identity", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                    <span className="bg-layer-panel px-3 py-1 text-[10px] font-black uppercase border-[length:var(--card-border-width,0px)] border-card-border text-brand-midnight rounded-btn">Identity</span>
                                </Wrapper>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left: description + fallback examples */}
                                <div className="md:col-span-1 space-y-4">
                                    <Wrapper identity={{ displayName: "Avatar Spec Description", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                        <p className="text-sm leading-relaxed text-theme-base/70 font-sans">
                                            The circular user frame component. Handles image rendering with fallback states for initials or anonymous user icons.
                                        </p>
                                    </Wrapper>
                                    <div className="bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border p-4 space-y-3 rounded-card">
                                        {/* Row 1: image avatar */}
                                        <Wrapper identity={{ displayName: "Avatar Fallback Row: ZT", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-[calc(var(--card-radius)/2)] border-[length:var(--card-border-width,0px)] border-card-border overflow-hidden bg-theme-main flex items-center justify-center text-xs font-black text-theme-inverted">
                                                    ZT
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-2 w-20 bg-theme-base/20 mb-1"></div>
                                                    <div className="h-2 w-12 bg-theme-base/10"></div>
                                                </div>
                                            </div>
                                        </Wrapper>
                                        {/* Row 2: initials avatar */}
                                        <Wrapper identity={{ displayName: "Avatar Fallback Row: JD", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-[calc(var(--card-radius)/2)] border-[length:var(--card-border-width,0px)] border-card-border bg-theme-main flex items-center justify-center text-xs font-bold text-theme-inverted">
                                                    JD
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-2 w-24 bg-theme-base/20 mb-1"></div>
                                                    <div className="h-2 w-16 bg-theme-base/10"></div>
                                                </div>
                                            </div>
                                        </Wrapper>
                                    </div>
                                </div>

                                {/* Right: size showcase with grid pattern */}
                                <div
                                    className="md:col-span-2 border-[length:var(--card-border-width,0px)] border-card-border p-6 flex flex-col justify-center items-center gap-8 relative overflow-hidden bg-layer-panel rounded-card [background-size:8px_8px] [background-image:linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)]"
                                >
                                    <div className="flex items-end gap-6 relative z-10">
                                        {/* Large 64px */}
                                        <Wrapper className="w-fit" identity={{ displayName: "Avatar: Large", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 rounded-[calc(var(--card-radius)/1.5)] border-[length:var(--card-border-width,0px)] border-card-border bg-theme-main flex items-center justify-center text-sm font-black text-theme-inverted shadow-card">
                                                    ZT
                                                </div>
                                                <span className="text-[10px] font-dev text-transform-tertiary text-theme-base/50">Large (64px)</span>
                                            </div>
                                        </Wrapper>
                                        {/* Medium 48px */}
                                        <Wrapper className="w-fit" identity={{ displayName: "Avatar: Medium", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-[calc(var(--card-radius)/1.5)] border-[length:var(--card-border-width,0px)] border-card-border bg-layer-cover flex items-center justify-center text-xs font-black text-brand-midnight shadow-card">
                                                    JD
                                                </div>
                                                <span className="text-[10px] font-dev text-transform-tertiary text-theme-base/50">Medium (48px)</span>
                                            </div>
                                        </Wrapper>
                                        {/* Small 32px — initials fallback */}
                                        <Wrapper className="w-fit" identity={{ displayName: "Avatar: Small", type: "Wrapped Snippet", filePath: "zap/sections/atoms/status/body.tsx" }}>
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 rounded-[calc(var(--card-radius)/2)] border-[length:var(--card-border-width,0px)] border-card-border bg-theme-main/10 flex items-center justify-center text-[10px] font-bold text-theme-main shadow-card">
                                                    ZK
                                                </div>
                                                <span className="text-[10px] font-dev text-transform-tertiary text-theme-base/50">Small (32px)</span>
                                            </div>
                                        </Wrapper>
                                    </div>
                                </div>
                            </div>
                        </CanvasBody.Section>
                    </Wrapper>
                </div>
            </Canvas>
        </Wrapper>
    );
};
