import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../components/dev/Wrapper';
import { Canvas } from '../../../../genesis/atoms/surfaces/canvas';
import { Heading } from '../../../../genesis/atoms/typography/headings';
import { Text } from '../../../../genesis/atoms/typography/text';
import { Card } from '../../../../genesis/atoms/surfaces/card';

export const LayoutLayersBody = () => {

    return (
        <Wrapper
            identity={{
                displayName: "LayoutLayersBody",
                filePath: "zap/sections/layout-layers/body.tsx",
                parentComponent: "LayoutLayersPage",
                type: "Organism/Page",
                architecture: "SYSTEMS // CORE"
            }}
        >
            <Canvas className="flex-1 overflow-y-auto p-12 bg-layer-canvas border-none text-brand-midnight">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Header */}
                    <Wrapper title="Layout Layers Title" className="w-auto">
                        <div className="flex flex-col items-start pl-2">
                            <h1 className="text-[64px] font-black uppercase tracking-tighter text-brand-midnight leading-[0.8] mb-3 [text-shadow:4px_4px_0px_var(--color-brand-yellow)]">
                                LAYOUT LAYERS
                            </h1>
                            <div className="bg-brand-midnight text-white px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide">
                                STRUCTURAL BOUNDARIES (LEVEL 1)
                            </div>
                        </div>
                    </Wrapper>
                    <Wrapper identity={{ displayName: "Description", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                        <p className="text-lg text-theme-base/70 leading-relaxed max-w-2xl mt-6 pl-2 font-display text-transform-primary">
                            The spatial architecture for ZAP applications. A systematic 3-layer stack (Canvas, Cover, Panels) that ensures depth, hierarchy, and consistent interactive physics.
                        </p>
                    </Wrapper>

                    {/* THE 3-LAYER ARCHITECTURE */}
                    <Wrapper identity={{ displayName: "3-Layer Architecture", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                        <Card className="p-8 shadow-card rounded-[calc(var(--card-radius)/2)] gap-6 flex flex-col">
                            <div className="flex items-center justify-between border-[length:var(--card-border-width,0px)] border-card-border px-6 py-4 bg-layer-cover">
                                <Wrapper identity={{ displayName: "Section Header: THE 3-LAYER ARCHITECTURE", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                    <Heading level={2}>THE 3-LAYER ARCHITECTURE</Heading>
                                </Wrapper>
                                <Wrapper className="w-fit" identity={{ displayName: "Section Badge: Spatial Logic", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                    <div className="bg-theme-main px-4 py-1.5 border-[length:var(--card-border-width,0px)] border-card-border">
                                        <Text size="iso-100" weight="black" className="uppercase text-brand-midnight">Spatial Logic</Text>
                                    </div>
                                </Wrapper>
                            </div>
                            <div className="h-[480px] w-full flex items-center justify-center bg-layer-canvas relative overflow-hidden border-[length:var(--card-border-width,0px)] border-card-border"
                                style={{
                                    backgroundSize: '32px 32px',
                                    backgroundImage:
                                        'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
                                }}>
                                {/* 3D Isometry Container */}
                                <div className="w-full flex justify-center items-center h-full [perspective:1200px]">
                                    <div className="w-[380px] h-[280px] relative mt-12 md:mt-0 [transform:rotateX(60deg)_rotateZ(-45deg)] [transform-style:preserve-3d]">

                                        {/* Layer 1: Canvas / Foundation */}
                                        <div className="absolute inset-0 transition-transform [transform:translateZ(0px)]">
                                            <Wrapper className="h-full" identity={{ displayName: "Canvas Layer Setup", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                                                <div className="w-full h-full bg-layer-canvas border-[length:var(--card-border-width,0px)] border-card-border shadow-sm flex items-end justify-start p-4">
                                                    <Text size="iso-100" weight="black" className="uppercase text-brand-midnight">L1: Foundation (Canvas)</Text>
                                                </div>
                                            </Wrapper>
                                        </div>

                                        {/* Layer 2: Cover / Surface */}
                                        <div className="absolute left-[30px] bottom-[30px] w-[260px] h-[180px] transition-transform [transform:translateZ(40px)]">
                                            <Wrapper className="h-full" identity={{ displayName: "Cover Layer Setup", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                                                <div className="w-full h-full bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border shadow-[-16px_16px_32px_rgba(0,0,0,0.06)] flex items-end justify-start p-4">
                                                    <Text size="iso-100" weight="black" className="uppercase text-brand-midnight">L2: Surface (Cover)</Text>
                                                </div>
                                            </Wrapper>
                                        </div>

                                        {/* Layer 3: Panels */}
                                        <div className="absolute right-[30px] top-[30px] w-[140px] h-[120px] transition-transform [transform:translateZ(80px)]">
                                            <Wrapper className="h-full" identity={{ displayName: "Panel Layer Setup", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                                                <div className="w-full h-full bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border shadow-[-20px_20px_40px_rgba(0,0,0,0.08)] flex items-end justify-start p-4">
                                                    <Text size="iso-100" weight="black" className="uppercase text-brand-midnight">L3: Panels</Text>
                                                </div>
                                            </Wrapper>
                                        </div>

                                    </div>
                                </div>
                                <div className="absolute bottom-6 left-6 space-y-2 !bg-transparent opacity-100">
                                    <Wrapper className="w-fit" identity={{ displayName: "Legend: Canvas", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                        <div className="flex items-center gap-3"><div className="w-3.5 h-3.5 bg-layer-canvas border-[length:var(--card-border-width,0px)] border-card-border"></div><Text size="iso-100" weight="black" className="text-brand-midnight">L1: FOUNDATION (CANVAS)</Text></div>
                                    </Wrapper>
                                    <Wrapper className="w-fit" identity={{ displayName: "Legend: Cover", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                        <div className="flex items-center gap-3"><div className="w-3.5 h-3.5 bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border"></div><Text size="iso-100" weight="black" className="text-brand-midnight">L2: SURFACE (COVER)</Text></div>
                                    </Wrapper>
                                    <Wrapper className="w-fit" identity={{ displayName: "Legend: Panels", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                        <div className="flex items-center gap-3"><div className="w-3.5 h-3.5 bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border"></div><Text size="iso-100" weight="black" className="text-brand-midnight">L3: PANELS (UTILITY)</Text></div>
                                    </Wrapper>
                                </div>
                            </div>
                        </Card>
                    </Wrapper>

                    {/* 01. LAYER 1: THE CANVAS */}
                    <section className="space-y-6">
                        <Heading level={3} className="flex items-center">
                            <span className="w-1.5 h-6 bg-brand-midnight mr-4"></span>
                            <Wrapper identity={{ displayName: "Section Header: LAYER 1: THE CANVAS", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                LAYER 1: THE CANVAS
                            </Wrapper>
                        </Heading>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Wrapper identity={{ displayName: "Layer 1 Diagram", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                                <Card className="p-8 h-full flex flex-col justify-center">
                                    <Wrapper identity={{ displayName: "Layer 1 Description", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                        <Text size="iso-300" className="mb-6 text-brand-midnight block">
                                            The Canvas is the base foundation of the entire system. It uses <Text weight="bold" className="text-brand-midnight">LAYER-CANVAS</Text> (bridged dynamically to M3 Surface Container Lowest) to provide structural depth and stark contrast thresholds.
                                        </Text>
                                    </Wrapper>
                                    <ul className="space-y-3">
                                        <Wrapper identity={{ displayName: "Layer 1 Point 1", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                            <li className="flex gap-3 items-center"><Icon name="check_circle" size={14} className="text-theme-base/50" /><Text size="iso-200" weight="bold" className="text-theme-base/70">Hosts global navigation & sidebars</Text></li>
                                        </Wrapper>
                                        <Wrapper identity={{ displayName: "Layer 1 Point 2", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                            <li className="flex gap-3 items-center"><Icon name="check_circle" size={14} className="text-theme-base/50" /><Text size="iso-200" weight="bold" className="text-theme-base/70">Defines the 8pt baseline grid bounds</Text></li>
                                        </Wrapper>
                                        <Wrapper identity={{ displayName: "Layer 1 Point 3", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                            <li className="flex gap-3 items-center"><Icon name="check_circle" size={14} className="text-theme-base/50" /><Text size="iso-200" weight="bold" className="text-theme-base/70">Non-scrolling stationary foundation</Text></li>
                                        </Wrapper>
                                    </ul>
                                </Card>
                            </Wrapper>
                            <Wrapper identity={{ displayName: "Layer 1 Syntax", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                                <div className="bg-layer-canvas border-[length:var(--card-border-width,0px)] border-card-border p-8 flex items-center justify-center font-dev text-transform-tertiary text-xs font-bold h-full text-brand-midnight">
                                    @canvas-bg: var(--color-layer-canvas);
                                </div>
                            </Wrapper>
                        </div>
                    </section>

                    {/* 02. LAYER 2: THE COVER */}
                    <section className="space-y-6">
                        <Heading level={3} className="flex items-center">
                            <span className="w-1.5 h-6 bg-brand-midnight mr-4"></span>
                            <Wrapper identity={{ displayName: "Section Header: LAYER 2: THE COVER", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                LAYER 2: THE COVER
                            </Wrapper>
                        </Heading>
                        <Wrapper identity={{ displayName: "Layer 2 Diagram", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                            <Card className="p-8">
                                <div className="flex flex-col md:flex-row gap-8 items-center lg:items-stretch">
                                    <div className="flex-1 space-y-6">
                                        <Wrapper identity={{ displayName: "Layer 2 Description", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                            <Text size="iso-300" className="text-brand-midnight block">
                                                The Cover is the primary surface where main content resides. It is almost exclusively <Text weight="bold" className="text-brand-midnight">LAYER-COVER</Text> (bridged dynamically to M3 Surface) to ensure maximum legibility for data, text, and media.
                                            </Text>
                                        </Wrapper>
                                        <Wrapper identity={{ displayName: "Layer 2 Code String", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                            <div className="p-4 bg-transparent border-[length:var(--card-border-width,0px)] border-dashed border-card-border font-dev text-transform-tertiary text-[11px] leading-relaxed whitespace-pre text-theme-base/70">
                                                {`.surface-cover {\n  background: var(--color-layer-cover);\n  margin: var(--spacing-6);\n  border: 1px solid var(--color-card-border);\n}`}
                                            </div>
                                        </Wrapper>
                                    </div>
                                    <Wrapper className="flex-1 min-h-[160px]" identity={{ displayName: "Layer 2 Mockup", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                                        <div className="w-full h-full min-h-[160px] bg-layer-cover border-[length:var(--card-border-width,0px)] border-card-border flex items-center justify-center text-center p-4">
                                            <Text size="iso-100" weight="black" className="text-theme-base/50 uppercase">MAIN WORKSPACE AREA</Text>
                                        </div>
                                    </Wrapper>
                                </div>
                            </Card>
                        </Wrapper>
                    </section>

                    {/* 03. LAYER 3: PANELS */}
                    <section className="space-y-6 pb-24">
                        <Heading level={3} className="flex items-center">
                            <span className="w-1.5 h-6 bg-brand-midnight mr-4"></span>
                            <Wrapper identity={{ displayName: "Section Header: LAYER 3: PANELS", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                LAYER 3: PANELS
                            </Wrapper>
                        </Heading>
                        <Wrapper identity={{ displayName: "Layer 3 Diagram", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                            <Card className="p-8">
                                <Wrapper identity={{ displayName: "Layer 3 Description", type: "Wrapped Snippet", filePath: "zap/sections/layout-layers/body.tsx" }}>
                                    <Text size="iso-300" className="mb-8 block text-brand-midnight border-l-[length:var(--card-border-width,0px)] border-brand-primary pl-4">
                                        Panels represent contextual utility layers. They appear as sidebars, drawers, or floating modules built with <Text weight="bold" className="text-brand-midnight">LAYER-PANEL</Text> (bridged dynamically to M3 Surface Container High). Key characteristic: <Text weight="bold" className="text-brand-midnight underline">rounded-none</Text> (90-degree corners).
                                    </Text>
                                </Wrapper>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <Wrapper identity={{ displayName: "3. Panel Example 1", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                                        <div className="border-[length:var(--card-border-width,0px)] border-card-border p-5 h-24 bg-layer-panel flex flex-col justify-between">
                                            <div className="flex justify-between pb-2">
                                                <div className="w-[6px] h-[6px] bg-brand-midnight"></div>
                                                <div className="w-[6px] h-[6px] bg-brand-midnight"></div>
                                            </div>
                                            <Text size="iso-100" weight="black" className="uppercase text-brand-midnight">INSPECTOR</Text>
                                        </div>
                                    </Wrapper>
                                    <Wrapper identity={{ displayName: "3. Panel Example 2", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                                        <div className="border-[length:var(--card-border-width,0px)] border-card-border p-5 h-24 bg-layer-panel flex flex-col justify-between relative overflow-hidden">
                                            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-brand-midnight"></div>
                                            <Text size="iso-100" weight="black" className="uppercase text-brand-midnight">COLLAPSIBLE</Text>
                                        </div>
                                    </Wrapper>
                                    <Wrapper identity={{ displayName: "3. Panel Example 3", filePath: "zap/sections/layout-layers/body.tsx", type: "Atom/View", architecture: "SYSTEMS // CORE" }}>
                                        <div className="border-[length:var(--card-border-width,0px)] border-card-border p-5 h-24 bg-layer-panel flex flex-col justify-between">
                                            <Icon name="open_in_full" size={14} className="text-brand-midnight" />
                                            <Text size="iso-100" weight="black" className="uppercase text-brand-midnight">RESIZABLE</Text>
                                        </div>
                                    </Wrapper>
                                </div>
                            </Card>
                        </Wrapper>
                    </section>
                </div>
            </Canvas>
        </Wrapper>
    );
};
