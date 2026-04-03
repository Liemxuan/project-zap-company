'use client';

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { SectionHeader, TokenTable } from '../../../../zap/sections/atoms/foundations/components';
import {
    ELEVATION_LEVELS,
    ZAP_LAYER_MAP,
    COMPONENT_ELEVATION_MAP,
} from '../../../../zap/sections/atoms/foundations/schema';
import { type Platform } from '../../../../zap/sections/atoms/foundations/components';
import { CanvasBody } from '../../../../zap/layout/CanvasBody';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../../genesis/atoms/data-display/table';

// ─── ELEVATION BODY ─────────────────────────────────────────────────────────
// L3 = CanvasBody.Section  (bg-layer-panel  / debug: green)
// L4 = CanvasBody.Demo     (bg-layer-dialog / debug: purple)

interface ElevationBodyProps {
    platform: Platform;
}

export const ElevationBody = ({ platform }: ElevationBodyProps) => {
    const [activeLevel, setActiveLevel] = useState<number>(1);

    return (
        <>
            {/* ── 00. STRICT ASCENSION RULE ─────────────────────── */}
            {/* L3 Section */}
            <CanvasBody.Section label="00 · ARCHITECTURE RULE">
                <CanvasBody.Demo label="STRICT ASCENSION RULE" centered={false} minHeight="min-h-0">
                    <div className="bg-layer-panel border border-primary/20 rounded-xl p-6 md:p-8 space-y-4 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center">
                                <Icon name="gavel" size={24} className="text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-foreground tracking-tight">The Strict Ascension Rule</h2>
                                <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                                    Once an <strong>L2 Cover</strong> wrapper is established (like a main body sandbox or an inspector wrap), all inner localized content (e.g., table cells, interactive demos, nested parameter settings) <strong>MUST strictly ascend</strong> to <code className="text-primary font-dev text-transform-tertiary">bg-layer-panel</code> (L3) or <code className="text-primary font-dev text-transform-tertiary">bg-layer-dialog</code> (L4).
                                </p>
                                <div className="p-4 bg-layer-dialog rounded-lg border border-error/20 text-sm font-medium text-foreground/90 mt-4 shadow-sm">
                                    <span className="font-bold text-error mr-2">Terminal Violation:</span>
                                    It is an architectural failure to nest <code className="text-error font-dev text-transform-tertiary">bg-surface</code> (L0), <code className="text-error font-dev text-transform-tertiary">bg-surface-container</code> (L1), or <code className="text-error font-dev text-transform-tertiary">bg-surface-variant</code> inside an L2 cover. Spatial depth must continuously ascend.
                                </div>
                                <div className="flex flex-wrap items-center gap-3 pt-4">
                                    <a
                                        href="vscode://file/Users/zap/Workspace/olympus/packages/zap-design/zap_foundation.md"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-layer-panel hover:bg-surface-container-highest transition-colors rounded-lg border border-border/50 text-xs font-semibold text-foreground"
                                    >
                                        <Icon name="description" size={14} className="text-primary" />
                                        ZAP Foundation Master Protocol
                                    </a>
                                    <a
                                        href="vscode://file/Users/zap/Workspace/olympus/.agent/skills/zap-l1-l2-layer-audit/SKILL.md"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-layer-panel hover:bg-surface-container-highest transition-colors rounded-lg border border-border/50 text-xs font-semibold text-foreground"
                                    >
                                        <Icon name="code" size={14} className="text-primary" />
                                        L1-L2 Layer Audit Skill
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </CanvasBody.Demo>
            </CanvasBody.Section>


            {/* ── 01. ELEVATION LEVELS ─────────────────────── */}
            {/* L3 Section */}
            <CanvasBody.Section label="01 · ELEVATION LEVELS">
                <SectionHeader
                    number="01"
                    title="Elevation Levels"
                    icon="layers"
                    description="6 levels of tint-first depth hierarchy with surface tint overlays"
                    id="elevation-levels"
                />

                {/* L4 Demo — description block */}
                <CanvasBody.Demo label="OVERVIEW" centered={false} minHeight="min-h-0">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 elevation uses <strong>surface tint</strong> instead of drop shadows to create visual hierarchy.
                        Each level applies a tint overlay at increasing opacity, plus a subtle shadow for light mode.
                        Click a card to inspect its values.
                    </p>
                </CanvasBody.Demo>

                {/* L4 Demo — interactive elevation cards */}
                <CanvasBody.Demo label="INTERACTIVE ELEVATION CARDS" centered={false} minHeight="min-h-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
                        {ELEVATION_LEVELS.map((level) => (
                            <button
                                key={level.level}
                                onClick={() => setActiveLevel(level.level)}
                                className={cn(
                                    "relative p-6 text-left transition-all duration-300 border-solid group cursor-pointer overflow-hidden",
                                    ZAP_LAYER_MAP[level.level]?.zapToken || "bg-layer-panel",
                                    activeLevel === level.level
                                        ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                                        : "border-border/30 hover:border-primary/30",
                                )}
                                style={Object.assign({}, { 
                                    boxShadow: level.shadowLight
                                })}
                            >
                                {/* Tint overlay simulation */}
                                <div
                                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                                    style={Object.assign({}, { 
                                        backgroundColor: 'var(--color-primary, rgb(0,0,0))',
                                        opacity: `calc(var(--layer-${level.level}-tint-opacity, ${level.tintOpacity / 100}) * var(--layer-tint-multiplier, 1))` 
                                    })}
                                />
                                <div className="relative z-10">
                                    <span className="text-2xl font-black text-foreground block mb-1">
                                        {level.level}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                        Level {level.level}
                                    </span>
                                    <div className="mt-3 text-[9px] text-muted-foreground font-dev text-transform-tertiary">
                                        {level.dp}dp · {level.tintOpacity}%
                                    </div>
                                </div>
                                {activeLevel === level.level && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                        <Icon name="check" size={10} className="text-on-primary" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </CanvasBody.Demo>

                {/* L4 Demo — detail panel for selected level */}
                <CanvasBody.Demo label={`LEVEL ${activeLevel} DETAILS`} centered={false} minHeight="min-h-0">
                    <div className="w-full rounded-xl border border-outline-variant overflow-hidden">
                        <div className="p-0 overflow-hidden">
                            {(() => {
                                const level = ELEVATION_LEVELS[activeLevel];
                                return (
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow className="border-b border-outline-variant hover:bg-transparent bg-layer-modal">
                                                <TableHead colSpan={2} className="h-12 align-middle px-6">
                                                    <div className="flex items-center gap-2">
                                                        <Icon name="info" size={16} className="text-primary" />
                                                        <span className="text-sm font-bold text-foreground">level {activeLevel} details</span>
                                                    </div>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow className="border-b border-outline-variant hover:bg-surface-variant/50">
                                                <TableCell className="font-medium text-muted-foreground align-middle h-12 w-1/4 pl-6">Depth Points</TableCell>
                                                <TableCell className="align-middle font-dev text-transform-tertiary font-bold text-foreground h-12 pr-6">
                                                    {level.dp}dp
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="border-b border-outline-variant hover:bg-surface-variant/50">
                                                <TableCell className="font-medium text-muted-foreground align-middle h-12 w-1/4 pl-6">Tint Opacity</TableCell>
                                                <TableCell className="align-middle font-dev text-transform-tertiary font-bold text-foreground h-12 pr-6">
                                                    {level.tintOpacity}%
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="border-b border-outline-variant hover:bg-surface-variant/50">
                                                <TableCell className="font-medium text-muted-foreground align-middle h-12 w-1/4 pl-6">Use Case</TableCell>
                                                <TableCell className="align-middle h-12 pr-6">
                                                    {level.useCase}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="border-b border-outline-variant hover:bg-surface-variant/50">
                                                <TableCell className="font-medium text-muted-foreground align-middle h-12 w-1/4 pl-6">Components</TableCell>
                                                <TableCell className="align-middle h-12 pr-6 py-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        {level.components.map(c => (
                                                            <span key={c} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full tracking-wide">
                                                                {c}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="hover:bg-surface-variant/50">
                                                <TableCell className="font-medium text-muted-foreground align-middle h-12 w-1/4 pl-6">
                                                    {platform === 'web' ? 'Box Shadow' : 'Flutter Elevation'}
                                                </TableCell>
                                                <TableCell className="align-middle h-12 pr-6 py-2">
                                                    <code className="text-[10px] font-dev text-transform-tertiary text-primary bg-primary/5 px-2 py-1 rounded block break-all w-fit">
                                                        {platform === 'web' ? level.shadowLight : `elevation: ${level.dp}`}
                                                    </code>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                );
                            })()}
                        </div>
                    </div>
                </CanvasBody.Demo>

                {/* L4 Demo — shadow comparison strip */}
                <CanvasBody.Demo label="SHADOW COMPARISON" centered={false} minHeight="min-h-0">
                    <div className="flex items-end gap-4 w-full">
                        {ELEVATION_LEVELS.map((level) => (
                            <div
                                key={level.level}
                                className="relative flex-1 rounded-lg transition-all duration-500 flex items-center justify-center text-xs font-bold text-muted-foreground border border-border/10 overflow-hidden"
                                style={Object.assign({}, {
                                    backgroundColor: `var(--layer-${level.level}-bg-token, var(--color-layer-dialog))`,
                                    boxShadow: level.shadowLight,
                                    height: `${40 + level.level * 16}px`,
                                })}
                            >
                                <div
                                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                                    style={Object.assign({}, { 
                                        backgroundColor: 'var(--color-primary, rgb(0,0,0))',
                                        opacity: `calc(var(--layer-${level.level}-tint-opacity, ${level.tintOpacity / 100}) * var(--layer-tint-multiplier, 1))` 
                                    })}
                                />
                                <span className="relative z-10">E{level.level}</span>
                            </div>
                        ))}
                    </div>
                </CanvasBody.Demo>
            </CanvasBody.Section>

            {/* ── 02. ZAP LAYER MAP ───────────────────────── */}
            {/* L3 Section */}
            <CanvasBody.Section label="02 · ZAP LAYER SYSTEM">
                <SectionHeader
                    number="02"
                    title="ZAP Layer System"
                    icon="stacks"
                    description="Maps M3 elevation to ZAP's z-index hierarchy"
                    id="zap-layers"
                />

                {/* L4 Demo — description */}
                <CanvasBody.Demo label="OVERVIEW" centered={false} minHeight="min-h-0">
                    <p className="text-sm text-foreground leading-relaxed">
                        ZAP extends M3 elevation with a <strong>named layer system</strong> that maps semantic z-index ranges
                        to specific surface types. Each layer has a corresponding token for background, elevation level, and z-index range.
                    </p>
                </CanvasBody.Demo>

                {/* L4 Demo — truly nested layer stack */}
                <CanvasBody.Demo label="LAYER STACK DIAGRAM — NESTED SPATIAL DEPTH" centered={false} minHeight="min-h-0">
                    {/* L5: MODALS */}
                    <div 
                        className="w-full bg-layer-modal p-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-foreground tracking-widest">L5: MODALS</span>
                                <span className="text-[10px] font-dev text-transform-tertiary bg-foreground/10 text-foreground px-1.5 py-0.5 rounded">z-3000</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground">M3 Level 5</span>
                                <span className="text-[10px] font-bold bg-foreground/10 text-foreground px-2 py-0.5 rounded-full">14% tint</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-foreground/80 mb-3 font-dev text-transform-tertiary">Blocking full-screen prompts · bg-layer-modal</p>

                        {/* L4: DIALOGS */}
                        <div 
                            className="w-full bg-layer-dialog p-4"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-foreground tracking-widest">L4: DIALOGS</span>
                                    <span className="text-[10px] font-dev text-transform-tertiary bg-foreground/10 text-foreground px-1.5 py-0.5 rounded">z-2000+</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground">M3 Level 4</span>
                                    <span className="text-[10px] font-bold bg-foreground/10 text-foreground px-2 py-0.5 rounded-full">12% tint</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-foreground/80 mb-3 font-dev text-transform-tertiary">Modal dialogs, popovers, confirmations · bg-layer-dialog</p>

                            {/* L3: PANELS */}
                            <div 
                                className="w-full bg-layer-panel p-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-foreground tracking-widest">L3: PANELS</span>
                                        <span className="text-[10px] font-dev text-transform-tertiary bg-foreground/10 text-foreground px-1.5 py-0.5 rounded">z-1000+</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-muted-foreground">M3 Level 3</span>
                                        <span className="text-[10px] font-bold bg-foreground/10 text-foreground px-2 py-0.5 rounded-full">11% tint</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-foreground/80 mb-3 font-dev text-transform-tertiary">UI cards, nav, inspector, headers · bg-layer-panel</p>

                                {/* L2: COVER */}
                                <div 
                                    className="w-full bg-layer-cover p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-foreground tracking-widest">L2: COVER</span>
                                            <span className="text-[10px] font-dev text-transform-tertiary bg-foreground/10 text-foreground px-1.5 py-0.5 rounded">z-100</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-muted-foreground">M3 Level 2</span>
                                            <span className="text-[10px] font-bold bg-foreground/10 text-foreground px-2 py-0.5 rounded-full">8% tint</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-foreground/80 mb-3 font-dev text-transform-tertiary">Content surfaces, sandboxes · bg-layer-cover</p>

                                    {/* L1: CANVAS */}
                                    <div 
                                        className="w-full bg-layer-canvas p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-foreground tracking-widest">L1: CANVAS</span>
                                                <span className="text-[10px] font-dev text-transform-tertiary bg-foreground/10 text-foreground px-1.5 py-0.5 rounded">z-10</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground">M3 Level 1</span>
                                                <span className="text-[10px] font-bold bg-foreground/10 text-foreground px-2 py-0.5 rounded-full">5% tint</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-foreground/80 mb-3 font-dev text-transform-tertiary">Base routing floor, page canvas · bg-layer-canvas</p>

                                        {/* L0: BASE */}
                                        <div 
                                            className="w-full bg-layer-base p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-foreground tracking-widest">L0: BASE</span>
                                                    <span className="text-[10px] font-dev text-transform-tertiary bg-foreground/10 text-foreground px-1.5 py-0.5 rounded">z-0</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-muted-foreground">M3 Level 0</span>
                                                    <span className="text-[10px] font-bold bg-foreground/10 text-foreground px-2 py-0.5 rounded-full">0% tint</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-foreground/80 mt-1 font-dev text-transform-tertiary">Absolute root document background · bg-layer-base</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CanvasBody.Demo>

                {/* L4 Demo — token table */}
                <CanvasBody.Demo label="TOKEN TABLE" centered={false} minHeight="min-h-0" className="p-0 overflow-hidden">
                    <TokenTable
                        headers={['Layer', 'Token', 'M3 Token', 'Mobile (Flutter)', 'M3 Level', 'Tint %', 'Z-Index', 'Description']}
                        rows={ZAP_LAYER_MAP.map(l => [
                            l.zapLayer, l.zapToken, l.m3Token, l.flutterToken, l.m3Elevation === -1 ? 'N/A' : l.m3Elevation, `${l.tintOpacity}%`, `z-${l.zIndex}`, l.description
                        ])}
                    />
                </CanvasBody.Demo>
            </CanvasBody.Section>

            {/* ── 03. COMPONENT ELEVATION MAP ─────────────── */}
            {/* L3 Section */}
            <CanvasBody.Section label="03 · COMPONENT ELEVATION MAP">
                <SectionHeader
                    number="03"
                    title="Component Elevation Map"
                    icon="widgets"
                    description="Default, hover, pressed, and disabled states per component"
                    id="component-elevation"
                />

                {/* L4 Demo — description */}
                <CanvasBody.Demo label="OVERVIEW" centered={false} minHeight="min-h-0">
                    <p className="text-sm text-foreground leading-relaxed">
                        Each M3 component has a defined elevation for <strong>each interaction state</strong>.
                        Hover typically raises elevation by 1 level, while pressed returns to default and disabled drops to 0.
                    </p>
                </CanvasBody.Demo>

                {/* L4 Demo — token table */}
                <CanvasBody.Demo label="ELEVATION TABLE" centered={false} minHeight="min-h-0" className="p-0 overflow-hidden">
                    <div className="rounded-xl border border-outline-variant overflow-hidden bg-layer-dialog">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="border-b border-outline-variant hover:bg-transparent">
                                    {['component', 'default', 'hovered', 'pressed', 'disabled'].map((header) => (
                                        <TableHead key={header} className="h-12 align-middle">
                                            {header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {COMPONENT_ELEVATION_MAP.map((c) => (
                                    <TableRow key={c.component} className="border-b border-outline-variant last:border-0 hover:bg-surface-variant/50">
                                        <TableCell className="align-middle h-12">
                                            {c.component.toLowerCase()}
                                        </TableCell>
                                        <TableCell className="text-primary font-bold">
                                            level {c.default}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            {c.hovered !== null ? `level ${c.hovered}` : '—'}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            {c.pressed !== null ? `level ${c.pressed}` : '—'}
                                        </TableCell>
                                        <TableCell className="align-middle">
                                            level {c.disabled}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CanvasBody.Demo>

                {/* L4 Demo — interactive state demo */}
                <CanvasBody.Demo label="INTERACTIVE STATE DEMO" centered={false} minHeight="min-h-[200px]">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                        {COMPONENT_ELEVATION_MAP.slice(0, 5).map((comp) => {
                            const defaultShadow = ELEVATION_LEVELS[comp.default]?.shadowLight || 'none';
                            const hoverShadow = comp.hovered !== null ? (ELEVATION_LEVELS[comp.hovered]?.shadowLight || 'none') : defaultShadow;
                            return (
                                <div
                                    key={comp.component}
                                    className={cn(
                                        "rounded-xl p-4 transition-all duration-300 cursor-pointer text-center group border border-border/20",
                                        "bg-layer-dialog"
                                    )}
                                    style={Object.assign({}, { boxShadow: defaultShadow })}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = hoverShadow; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = defaultShadow; }}
                                >
                                    <span className="text-xs font-bold text-foreground">{comp.component}</span>
                                    <div className="text-[9px] text-muted-foreground mt-1">
                                        Hover to see E{comp.default} → E{comp.hovered ?? comp.default}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CanvasBody.Demo>
            </CanvasBody.Section>
        </>
    );
};
