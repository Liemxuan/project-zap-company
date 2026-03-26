'use client';

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { SectionHeader, TokenTable } from '../../../../zap/sections/atoms/foundations/components';
import { type Platform } from '../../../../zap/sections/atoms/foundations/components';
import { CORE_BREAKPOINTS } from '../../../../zap/sections/atoms/foundations/schema';

interface CoreLayoutBodyProps {
    platform: Platform;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoreLayoutBody({ platform: _platform }: CoreLayoutBodyProps) {
    const [activeBreakpoint, setActiveBreakpoint] = useState(2); // Expanded default

    return (
        <div className="max-w-5xl mx-auto space-y-20 pb-24">
            <section className="space-y-8">
                <SectionHeader
                    number="01"
                    title="Static Grid System"
                    icon="grid_4x4"
                    description="Traditional 12-column grid with fixed margins and gutters"
                    id="core-grid"
                />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30 shadow-subtle">
                    <p className="text-sm text-foreground leading-relaxed">
                        The Core theme utilizes a traditional <strong>12-column static grid system</strong> (similar to Bootstrap or standard Tailwind structures). 
                        Unlike M3&apos;s fluid scaling, Core&apos;s grid employs fixed gutters and margins at strict breakpoints to guarantee predictable responsive behavior and a 1440px maximum container width.
                    </p>
                </div>

                {/* Breakpoint selector */}
                <div className="flex gap-2 flex-wrap">
                    {CORE_BREAKPOINTS.map((bp, i) => (
                        <button
                            key={bp.name}
                            onClick={() => setActiveBreakpoint(i)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                                activeBreakpoint === i
                                    ? "bg-primary text-on-primary shadow-sm"
                                    : "bg-layer-panel text-muted-foreground hover:bg-layer-panel/80 hover:text-foreground border border-outline-variant"
                            )}
                        >
                            <Icon name={bp.icon ?? 'devices'} size={14} className="inline mr-2" />
                            {bp.name}
                        </button>
                    ))}
                </div>

                {/* Column grid visualizer */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {CORE_BREAKPOINTS[activeBreakpoint].name} — {CORE_BREAKPOINTS[activeBreakpoint].columns} Columns
                    </h3>
                    <div className="p-6 bg-layer-panel rounded-xl border border-border/30">
                        <div
                            className="mx-auto border-2 border-dashed border-primary/20 rounded-lg overflow-hidden bg-layer-dialog"
                            style={Object.assign({}, {
                                maxWidth: CORE_BREAKPOINTS[activeBreakpoint].maxWidth
                                    ? Math.min(CORE_BREAKPOINTS[activeBreakpoint].maxWidth!, 900)
                                    : 900,
                            })}
                        >
                            {/* Margins */}
                            <div
                                className="flex bg-layer-modal/5"
                                style={Object.assign({}, {
                                    paddingLeft: CORE_BREAKPOINTS[activeBreakpoint].margins,
                                    paddingRight: CORE_BREAKPOINTS[activeBreakpoint].margins,
                                })}
                            >
                                <div
                                    className="flex-1 flex py-6"
                                    style={Object.assign({}, { gap: CORE_BREAKPOINTS[activeBreakpoint].gutters })}
                                >
                                    {Array.from({ length: CORE_BREAKPOINTS[activeBreakpoint].columns }).map((_, col) => (
                                        <div
                                            key={col}
                                            className="flex-1 bg-primary/10 rounded-md h-20 flex items-center justify-center transition-all duration-300 hover:bg-primary/20 border border-primary/20"
                                        >
                                            <span className="text-[9px] font-dev text-transform-tertiary font-bold text-primary/50">{col + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center flex-wrap gap-6 mt-6 text-[10px] text-muted-foreground">
                            <span>Max Content Width: <strong>1440px</strong></span>
                            <span>Margins: <strong>{CORE_BREAKPOINTS[activeBreakpoint].margins}px</strong></span>
                            <span>Gutters: <strong>{CORE_BREAKPOINTS[activeBreakpoint].gutters}px</strong></span>
                            <span>Nav: <strong>{CORE_BREAKPOINTS[activeBreakpoint].navPattern}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Details panel */}
                <div className="bg-layer-panel rounded-xl border border-border/30 p-6 shadow-subtle">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Window Class', value: CORE_BREAKPOINTS[activeBreakpoint].windowClass },
                            { label: 'Min Width', value: `${CORE_BREAKPOINTS[activeBreakpoint].minWidth}px` },
                            { label: 'Max Width', value: CORE_BREAKPOINTS[activeBreakpoint].maxWidth ? `${CORE_BREAKPOINTS[activeBreakpoint].maxWidth}px` : '∞' },
                            { label: 'Tailwind Constraint', value: CORE_BREAKPOINTS[activeBreakpoint].tailwindBreakpoint },
                        ].map(item => (
                            <div key={item.label} className="text-center p-4 bg-layer-dialog rounded-lg border border-outline-variant/50">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">{item.label}</span>
                                <span className="text-sm font-bold text-foreground">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <TokenTable
                    headers={['Name', 'Window Class', 'Min Width', 'Max Width', 'Columns', 'Margins', 'Gutters', 'Nav Pattern']}
                    rows={CORE_BREAKPOINTS.map(bp => [
                        bp.name, bp.windowClass, `${bp.minWidth}px`, bp.maxWidth ? `${bp.maxWidth}px` : '∞',
                        bp.columns.toString(), `${bp.margins}px`, `${bp.gutters}px`, bp.navPattern
                    ])}
                />

                <div className="mt-12">
                    <SectionHeader
                        number="02"
                        title="Grid Implementation Details"
                        icon="code"
                        description="CSS Grid constraints for the Core structure"
                        id="grid-implementation"
                    />
                    <div className="bg-layer-panel rounded-xl border border-border/30 overflow-hidden shadow-subtle mt-8">
                        <div className="flex items-center gap-2 p-4 border-b border-outline-variant/50 bg-layer-dialog/50">
                            <Icon name="code" size={16} className="text-primary" />
                            <h3 className="text-xs font-black uppercase tracking-widest">CSS Implementation</h3>
                        </div>
                        <div className="p-6 bg-[#0E1117] overflow-x-auto text-left" style={Object.assign({}, { backgroundColor: '#0E1117' })}>
                            <code className="text-[12px] font-mono leading-loose text-slate-300 whitespace-pre">
<span className="text-tertiary">.grid-container</span> {`{`}
    <span className="text-secondary">display</span>: grid;
    <span className="text-secondary">grid-template-columns</span>: <span className="text-primary">repeat</span>(12, 1fr);
    <span className="text-secondary">gap</span>: <span className="text-primary">24px</span>;
    <span className="text-secondary">max-width</span>: <span className="text-primary">1440px</span>;
    <span className="text-secondary">margin</span>: 0 auto;
{`}`}
                            </code>
                        </div>
                        <div className="p-4 bg-layer-dialog border-t border-outline-variant/50 flex justify-between items-center text-sm">
                            <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Standardized Grid Wrap</span>
                            <span className="text-xs font-mono text-primary font-bold">grid-cols-12 max-w-[1440px] gap-6 mx-auto</span>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}
