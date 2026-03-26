'use client';

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { SectionHeader, TokenTable } from '../../../../zap/sections/atoms/foundations/components';
import { BREAKPOINTS } from '../../../../zap/sections/atoms/foundations/schema';
import { type Platform } from '../../../../zap/sections/atoms/foundations/components';

interface LayoutBodyProps {
    platform: Platform;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const LayoutBody = ({ platform: _platform }: LayoutBodyProps) => {
    const [activeBreakpoint, setActiveBreakpoint] = useState(2); // Expanded default

    return (
        <div className="max-w-5xl mx-auto space-y-20 pb-24">

            {/* ── 01. RESPONSIVE BREAKPOINTS ──────────────── */}
            <section className="space-y-8">
                
                    <SectionHeader
                        number="01"
                        title="Responsive Breakpoints"
                        icon="devices"
                        description="5 M3 window classes with adaptive column grids"
                        id="breakpoints"
                    />
                

                
                    <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                        <p className="text-sm text-foreground leading-relaxed">
                            M3 defines <strong>5 window size classes</strong> that determine column count, gutter width,
                            and navigation patterns. Each class optimizes layout for its target device category.
                        </p>
                    </div>
                

                {/* Breakpoint selector */}
                
                    <div className="flex gap-2 flex-wrap">
                        {BREAKPOINTS.map((bp, i) => (
                            <button
                                key={bp.name}
                                onClick={() => setActiveBreakpoint(i)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                                    activeBreakpoint === i
                                        ? "bg-primary text-on-primary shadow-sm"
                                        : "bg-layer-panel text-muted-foreground hover:bg-layer-panel/80"
                                )}
                            >
                                <Icon name={i < 2 ? (i === 0 ? 'smartphone' : 'tablet') : 'desktop_windows'} size={14} className="inline mr-2" />
                                {bp.name}
                            </button>
                        ))}
                    </div>
                

                {/* Column grid visualizer */}
                
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {BREAKPOINTS[activeBreakpoint].name} — {BREAKPOINTS[activeBreakpoint].columns} Columns
                        </h3>
                        <div className="p-6 bg-layer-panel rounded-xl border border-border/30">
                            <div
                                className="mx-auto border-2 border-dashed border-primary/20 rounded-lg overflow-hidden"
                                style={Object.assign({}, {
                                    maxWidth: BREAKPOINTS[activeBreakpoint].maxWidth
                                        ? Math.min(BREAKPOINTS[activeBreakpoint].maxWidth!, 900)
                                        : 900,
                                })}
                            >
                                {/* Margins */}
                                <div
                                    className="flex"
                                    style={Object.assign({}, {
                                        paddingLeft: BREAKPOINTS[activeBreakpoint].margins,
                                        paddingRight: BREAKPOINTS[activeBreakpoint].margins,
                                    })}
                                >
                                    <div
                                        className="flex-1 flex py-6"
                                        style={Object.assign({}, { gap: BREAKPOINTS[activeBreakpoint].gutters })}
                                    >
                                        {Array.from({ length: BREAKPOINTS[activeBreakpoint].columns }).map((_, col) => (
                                            <div
                                                key={col}
                                                className="flex-1 bg-primary/10 rounded-md h-20 flex items-center justify-center transition-all duration-300 hover:bg-primary/20"
                                            >
                                                <span className="text-[9px] font-dev text-transform-tertiary font-bold text-primary/50">{col + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex justify-center gap-6 mt-4 text-[10px] text-muted-foreground">
                                <span>Margins: <strong>{BREAKPOINTS[activeBreakpoint].margins}px</strong></span>
                                <span>Gutters: <strong>{BREAKPOINTS[activeBreakpoint].gutters}px</strong></span>
                                <span>Nav: <strong>{BREAKPOINTS[activeBreakpoint].navPattern}</strong></span>
                            </div>
                        </div>
                    </div>
                

                {/* Details panel */}
                
                    <div className="bg-layer-panel rounded-xl border border-border/30 p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Window Class', value: BREAKPOINTS[activeBreakpoint].windowClass },
                                { label: 'Min Width', value: `${BREAKPOINTS[activeBreakpoint].minWidth}px` },
                                { label: 'Max Width', value: BREAKPOINTS[activeBreakpoint].maxWidth ? `${BREAKPOINTS[activeBreakpoint].maxWidth}px` : '∞' },
                                { label: 'Tailwind', value: BREAKPOINTS[activeBreakpoint].tailwindBreakpoint },
                            ].map(item => (
                                <div key={item.label} className="text-center">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">{item.label}</span>
                                    <span className="text-sm font-bold text-foreground">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                

                
                    <TokenTable
                        headers={['Name', 'Window Class', 'Min Width', 'Max Width', 'Columns', 'Margins', 'Gutters', 'Nav Pattern']}
                        rows={BREAKPOINTS.map(bp => [
                            bp.name, bp.windowClass, `${bp.minWidth}px`, bp.maxWidth ? `${bp.maxWidth}px` : '∞',
                            bp.columns, `${bp.margins}px`, `${bp.gutters}px`, bp.navPattern
                        ])}
                    />
                
            </section>
        </div>
    );
};
