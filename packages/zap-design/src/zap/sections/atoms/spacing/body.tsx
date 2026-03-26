'use client';

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { SectionHeader, TokenTable } from '../../../../zap/sections/atoms/foundations/components';
import {
    SPACING_SCALE,
    SIZE_TOKENS,
} from '../../../../zap/sections/atoms/foundations/schema';
import { type Platform } from '../../../../zap/sections/atoms/foundations/components';

interface SpacingBodyProps {
    platform: Platform;
}

export const SpacingBody = ({ platform }: SpacingBodyProps) => {
    const [activeSpacing, setActiveSpacing] = useState(4);

    return (
        <div className="max-w-5xl mx-auto space-y-20 pb-24">

            {/* ── 01. SPACING SCALE ───────────────────────── */}
            <section className="space-y-8">
                <SectionHeader
                    number="01"
                    title="Spacing Scale"
                    icon="space_bar"
                    description="4dp base grid with 13-value scale for consistent rhythm"
                    id="spacing-scale"
                />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 spacing is built on a <strong>4dp base grid</strong>. All spacing values are multiples of 4,
                        ensuring consistent visual rhythm across all components and layouts.
                    </p>
                </div>

                {/* Visual spacing ruler */}
                <div className="space-y-2 p-6 bg-layer-panel rounded-xl border border-border/30">
                    {SPACING_SCALE.filter(s => s.value > 0).map((token) => (
                        <button
                            key={token.name}
                            onClick={() => setActiveSpacing(token.value)}
                            className={cn(
                                "flex items-center gap-3 w-full group transition-all duration-200 rounded-md p-2 text-left",
                                activeSpacing === token.value ? "bg-primary/5" : "hover:bg-on-surface/5"
                            )}
                        >
                            <span className="text-[10px] font-dev text-transform-tertiary font-bold text-muted-foreground w-20 shrink-0">
                                {token.name}
                            </span>
                            <div className="flex-1 relative h-5 flex items-center">
                                <div
                                    className={cn(
                                        "h-3 rounded-sm transition-all duration-300",
                                        activeSpacing === token.value ? "bg-primary" : "bg-primary/30 group-hover:bg-primary/50"
                                    )}
                                    style={Object.assign({}, { width: `${Math.min(token.value * 2, 100)}%` })}
                                />
                            </div>
                            <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground w-12 text-right shrink-0">
                                {token.value}px
                            </span>
                            <span className="text-[10px] font-dev text-transform-tertiary text-primary/60 w-16 text-right shrink-0">
                                {token.rem}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Live preview box */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Live Padding Preview — {activeSpacing}px
                    </h3>
                    <div className="flex justify-center p-8 bg-layer-panel rounded-xl border border-border/30">
                        <div
                            className="bg-layer-dialog border-2 border-dashed border-primary/30 rounded-lg transition-all duration-300 inline-flex"
                            style={Object.assign({}, { padding: activeSpacing })}
                        >
                            <div className="bg-primary text-on-primary rounded-md px-4 py-2 text-xs font-bold whitespace-nowrap">
                                Content ({activeSpacing}px padding)
                            </div>
                        </div>
                    </div>
                </div>

                <TokenTable
                    headers={['Token', 'Value (px)', 'REM', platform === 'web' ? 'Tailwind' : 'Flutter', 'Usage']}
                    rows={SPACING_SCALE.map(s => [
                        s.name, s.value, s.rem, platform === 'web' ? s.tailwind : s.flutter, s.usage
                    ])}
                />
            </section>

            {/* ── 02. SIZE TOKENS ─────────────────────────── */}
            <section className="space-y-8">
                <SectionHeader
                    number="02"
                    title="Size Tokens"
                    icon="straighten"
                    description="Touch targets, component heights, and density control"
                    id="size-tokens"
                />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        Size tokens define <strong>minimum dimensions</strong> for touch targets (WCAG 48dp minimum),
                        component heights by density, and standard icon sizes. These ensure accessibility and visual consistency.
                    </p>
                </div>

                {/* Interactive size comparison */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Visual Size Comparison
                    </h3>
                    <div className="flex items-end gap-4 p-8 bg-layer-panel rounded-xl border border-border/30 flex-wrap">
                        {SIZE_TOKENS.map((token) => (
                            <div key={token.name} className="flex flex-col items-center gap-2 group">
                                <div
                                    className="bg-layer-dialog border-2 border-primary/40 rounded-lg transition-all duration-300 group-hover:bg-primary/30 group-hover:border-primary flex items-center justify-center"
                                    style={Object.assign({}, { width: token.value, height: token.value, minWidth: 20, minHeight: 20 })}
                                >
                                    <span className="text-[8px] font-dev text-transform-tertiary text-primary font-bold">{token.value}</span>
                                </div>
                                <span className="text-[8px] text-muted-foreground text-center max-w-[60px] leading-tight">{token.name.replace('size-', '')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <TokenTable
                    headers={['Token', 'Value (px)', platform === 'web' ? 'Tailwind' : 'Flutter', 'Usage']}
                    rows={SIZE_TOKENS.map(s => [
                        s.name, s.value, platform === 'web' ? s.tailwind : s.flutter, s.usage
                    ])}
                />
            </section>
        </div>
    );
};
