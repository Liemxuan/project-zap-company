'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { SectionHeader } from '../../../zap/sections/atoms/foundations/components';
import { CanvasBody } from '../../../zap/layout/CanvasBody';
import { LaboratoryTemplate } from '../../../zap/templates/LaboratoryTemplate';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { type Platform } from '../../../zap/sections/atoms/foundations/components';

export const CanvasGuideOrganism = () => {
    const params = useParams();
    const themeId = (params?.theme as string) || 'metro'; // Safe fallback
    const [platform, setPlatform] = useState<Platform>('web');

    return (
        <LaboratoryTemplate
            componentName="Canvas Construction Guide"
            tier="L4 TEMPLATE" 
            filePath={`app/design/${themeId}/organisms/canvas-guide/page.tsx`}
            
            // The Header layer
            headerMode={
                <ThemeHeader
                    title="Canvas Area Standard"
                    badge="L4/L5 Blueprint"
                    breadcrumb={`Zap Design Engine / ${themeId} / Organisms`}
                    platform={platform}
                    setPlatform={setPlatform}
                />
            }
            // The Inspector layer (Right panel)
            inspectorConfig={{
                title: 'L1-L5 Depth Settings',
                width: 340,
                content: (
                    <div className="p-6 text-sm flex flex-col gap-4 bg-layer-panel h-full border-r border-border">
                        <div className="p-4 bg-layer-dialog border-0 rounded-3xl">
                            <h4 className="font-bold text-foreground mb-1 font-display text-transform-primary">Simulated Inspector</h4>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                This right-side panel is part of the LaboratoryTemplate rendering logic.
                            </p>
                        </div>
                    </div>
                ),
            }}
        >
            {/* The Main Stage Area containing the L4 Organism */}
            <div className="w-full flex-1">
                {/* ── 00. L1 & L2 SPATIAL CONTEXT ─────────────────────── */}
                <div className="mb-8 p-6 bg-primary/10 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Icon name="layers" size={120} />
                    </div>
                    <h3 className="text-xl font-display text-transform-primary font-medium text-foreground tracking-tight mb-2">
                        You can now explicitly see L1 and L2
                    </h3>
                    <p className="font-body text-transform-secondary text-sm text-foreground/80 leading-relaxed max-w-3xl mb-4">
                        We have refactored this component to act as an <strong>L5 Page Type</strong> instead of a generic showcase.
                        This means it now mounts its own <code>LaboratoryTemplate</code> and <code>CanvasBody</code>, 
                        giving you explicit boundaries.
                    </p>
                    <div className="p-3 mb-4 bg-primary/20 rounded-lg max-w-3xl flex items-start gap-3">
                        <Icon name="library_books" size={20} className="text-primary mt-0.5" />
                        <div>
 <h4 className="font-dev text-transform-tertiary text-xs text-primary font-black tracking-widest mb-1">Standard Operating Procedure</h4>
                            <p className="font-body text-transform-secondary text-sm text-foreground/90 leading-relaxed">
                                Use <code className="font-dev text-transform-tertiary text-primary text-xs">docs/sops/sop-037-canvas-architecture.md</code> as the canonical reference when building or auditing Canvas components. It contains the exact layer hierarchies and nested typography patterns demonstrated on this page.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2 mt-6 font-dev text-transform-tertiary text-xs">
                        <div className="p-4 bg-layer-canvas text-muted-foreground rounded-[48px] border-0 shadow-inner">
                            <div className="px-6 pb-2">
                                <strong>L1: <code>&lt;Canvas&gt;</code></strong> — The global grey floor spanning behind everything. (Radius artificially expanded for concentric mockup rendering).
                            </div>
                            <div className="p-4 bg-layer-cover border-0 text-foreground shadow-[0_0_20px_rgba(0,0,0,0.02)] rounded-[32px]">
                                <div className="px-4 pb-2">
                                    <strong>L2: <code>&lt;CanvasBody&gt;</code></strong> — The massive white card wrapper you are currently inside.
                                </div>
                                <div className="p-4 bg-layer-panel border-0 text-primary shadow-sm rounded-2xl">
                                    <strong>L3: <code>&lt;CanvasGuideOrganism&gt;</code></strong> — The file content structure.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 01. INTRO / THEORY SECTION ─────────────────────── */}
                <CanvasBody.Section label="01 · ARCHITECTURE CONTEXT">
                    <SectionHeader
                        number="01"
                        title="Component Architecture"
                        icon="architecture"
                        description="The foundational logic and rules for this module."
                        id="sample-architecture"
                    />
                    <CanvasBody.Demo label="OVERVIEW" centered={false} minHeight="min-h-0">
                        <p className="text-sm text-foreground leading-relaxed">
                            This is the narrative explanation layer. It lives inside a <strong>Demo Frame (L4)</strong> 
                            so it sits visibly elevated above the L3 Section Panel.
                        </p>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                {/* ── 02. INTERACTIVE COMPONENT DEMO ─────────────────────── */}
                <CanvasBody.Section label="02 · COMPONENT PREVIEWS">
                    <SectionHeader
                        number="02"
                        title="Live Render Variants"
                        icon="preview"
                        description="Interactive instances of the component mutating based on inspector state."
                        id="sample-preview"
                    />
                    <CanvasBody.Demo label="PRIMARY VARIANT" centered={true} minHeight="min-h-[300px]">
                        <div className="p-8 bg-layer-panel border-0 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-center w-full max-w-sm">
                            <Icon name="widgets" size={48} className="text-primary mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2 text-foreground">Rendered Component</h3>
                            <p className="text-sm text-muted-foreground font-dev text-transform-tertiary">Active Platform: {platform}</p>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                {/* ── 03. TYPOGRAPHY GUIDANCE & NESTING ─────────────────────── */}
                <CanvasBody.Section label="03 · TYPOGRAPHY HIERARCHY">
                    <SectionHeader
                        number="03"
                        title="Text Rendering Rules"
                        icon="title"
                        description="How typography cascades from the L1 root to the L4 component."
                        id="sample-typography"
                    />

                    {/* L4 Demo layer forces bg-layer-dialog automatically */}
                    <CanvasBody.Demo label="TYPOGRAPHY CASCADING" centered={false} minHeight="min-h-0">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-display text-transform-primary font-medium text-foreground tracking-tight mb-2">Display Header (L3/L4 Headings)</h3>
                                <p className="font-body text-transform-secondary text-sm text-foreground/80 leading-relaxed max-w-3xl">
                                    Use <code className="font-dev text-transform-tertiary text-primary px-1 py-0.5 bg-primary/10 rounded">font-display text-transform-primary font-medium text-foreground text-xl</code> for primary module headings inside a Canvas. 
                                    This ensures the visual hierarchy aligns with the Typography standard without competing with the main LaboratoryTemplate Page Title.
                                </p>
                            </div>

                            <hr className="border-border/50" />

                            <div>
                                <h4 className="text-base font-body text-transform-secondary font-bold text-foreground mb-2">Body Content (L4/L5 Paragraphs)</h4>
                                <p className="font-body text-transform-secondary text-sm text-foreground/80 leading-relaxed max-w-3xl">
                                    Standard text must use <code className="font-dev text-transform-tertiary text-primary px-1 py-0.5 bg-primary/10 rounded">font-body text-transform-secondary text-sm text-foreground/80 leading-[1.6]</code>. 
                                    Never use raw <code>&lt;p&gt;</code> tags without these classes, or you risk breaking the active M3 theme. Line height must always be explicitly relaxed to maintain ZAP density standards.
                                </p>
                            </div>

                            <hr className="border-border/50" />

                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Microcopy / Labels (Any Layer)</h4>
                                <p className="font-dev text-transform-tertiary text-xs text-muted-foreground leading-relaxed max-w-2xl">
                                    For developer tags, system paths, and small data tables, use <code className="font-dev text-transform-tertiary text-primary px-1 py-0.5 bg-primary/10 rounded">font-dev text-transform-tertiary text-xs text-muted-foreground</code>. 
 Overlines use <code className="font-dev text-transform-tertiary text-primary px-1 py-0.5 bg-primary/10 rounded">text-[10px] font-black tracking-widest</code> for maximum scanability.
                                </p>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </div>
        </LaboratoryTemplate>
    );
};
