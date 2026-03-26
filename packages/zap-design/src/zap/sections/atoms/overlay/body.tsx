'use client';

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { SectionHeader, TokenTable } from '../../../../zap/sections/atoms/foundations/components';
import { STATE_LAYERS, SCRIM_VALUES } from '../../../../zap/sections/atoms/foundations/schema';
import { type Platform } from '../../../../zap/sections/atoms/foundations/components';

interface OverlayBodyProps {
    platform: Platform;
}

export const OverlayBody = ({ platform }: OverlayBodyProps) => {
    const [scrimActive, setScrimActive] = useState(false);
    const [activeState, setActiveState] = useState<string>('Hover');

    return (
        <div className="max-w-5xl mx-auto space-y-20 pb-24">

            {/* ── 01. STATE LAYERS ────────────────────────── */}
            <section className="space-y-8">
                <SectionHeader
                    number="01"
                    title="State Layers"
                    icon="touch_app"
                    description="Opacity overlays applied on interaction for visual feedback"
                    id="state-layers"
                />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 state layers are <strong>semi-transparent overlays</strong> of the element&apos;s content color
                        applied during interaction states. They provide visual feedback without changing the element&apos;s base color.
                    </p>
                </div>

                {/* Interactive state demo */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATE_LAYERS.map((layer) => (
                        <button
                            key={layer.state}
                            onClick={() => setActiveState(layer.state)}
                            className={cn(
                                "relative rounded-xl p-6 text-center transition-all duration-200 border-2 overflow-hidden",
                                "bg-primary",
                                activeState === layer.state
                                    ? "border-foreground ring-2 ring-primary/20 scale-105"
                                    : "border-transparent"
                            )}
                        >
                            {/* State layer overlay */}
                            <div
                                className="absolute inset-0 bg-on-primary pointer-events-none transition-opacity duration-200"
                                style={Object.assign({}, { opacity: layer.opacity / 100 })}
                            />
                            <div className="relative z-10">
                                <span className="text-sm font-black text-on-primary block">{layer.state}</span>
                                <span className="text-[10px] text-on-primary/80 font-dev text-transform-tertiary block mt-1">
                                    {layer.opacity}% opacity
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detail for selected state */}
                <div className="bg-layer-panel rounded-xl border border-border/30 p-6">
                    {(() => {
                        const layer = STATE_LAYERS.find(l => l.state === activeState) || STATE_LAYERS[0];
                        return (
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center relative overflow-hidden shrink-0">
                                    <div
                                        className="absolute inset-0 bg-on-primary pointer-events-none"
                                        style={Object.assign({}, { opacity: layer.opacity / 100 })}
                                    />
                                    <Icon name="touch_app" size={24} className="text-on-primary relative z-10" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-foreground">{layer.state} State</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{layer.description}</p>
                                    <div className="flex gap-4 mt-3 text-[10px] font-dev text-transform-tertiary">
                                        <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">
                                            opacity: {layer.opacity / 100}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {platform === 'web'
                                                ? `background: color-mix(in srgb, var(--on-primary) ${layer.opacity}%, transparent)`
                                                : `color.withOpacity(${layer.opacity / 100})`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <TokenTable
                    headers={['State', 'Opacity %', 'CSS Value', 'Description']}
                    rows={STATE_LAYERS.map(l => [
                        l.state,
                        `${l.opacity}%`,
                        platform === 'web' ? `opacity: 0.${l.opacity.toString().padStart(2, '0')}` : `withOpacity(${l.opacity / 100})`,
                        l.description,
                    ])}
                />
            </section>

            {/* ── 02. SCRIMS ─────────────────────────────── */}
            <section className="space-y-8">
                <SectionHeader
                    number="02"
                    title="Scrims & Backdrops"
                    icon="filter_drama"
                    description="Modal overlays for focus management and dimming"
                    id="scrims"
                />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        Scrims are <strong>full-screen overlays</strong> that dim the background when modals, dialogs, or drawers are active.
                        M3 specifies different opacities for light ({SCRIM_VALUES.light * 100}%) and dark ({SCRIM_VALUES.dark * 100}%) modes,
                        plus an optional backdrop blur of {SCRIM_VALUES.blur}px.
                    </p>
                </div>

                {/* Live scrim demo */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Live Scrim Demo
                    </h3>
                    <div className="relative rounded-xl overflow-hidden border border-border/30 bg-layer-panel h-[300px]">
                        {/* Background content simulation */}
                        <div className="absolute inset-0 p-6 space-y-3">
                            <div className="h-5 w-3/4 bg-layer-dialog rounded" />
                            <div className="h-4 w-1/2 bg-layer-dialog rounded" />
                            <div className="h-4 w-2/3 bg-layer-dialog rounded" />
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-16 bg-layer-dialog rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Scrim overlay */}
                        {scrimActive && (
                            <div
                                className="absolute inset-0 z-10 flex items-center justify-center transition-all duration-300"
                                style={Object.assign({}, {
                                    backgroundColor: `rgba(0,0,0,${SCRIM_VALUES.light})`,
                                    backdropFilter: `blur(${SCRIM_VALUES.blur}px)`,
                                })}
                            >
                                <div className="bg-layer-dialog rounded-2xl p-6 shadow-xl max-w-xs text-center">
                                    <Icon name="check_circle" size={32} className="text-primary mx-auto mb-3" />
                                    <h3 className="text-sm font-bold text-foreground">Dialog Title</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Scrim opacity: {SCRIM_VALUES.light * 100}%</p>
                                    <p className="text-xs text-muted-foreground">Blur: {SCRIM_VALUES.blur}px</p>
                                </div>
                            </div>
                        )}

                        {/* Toggle button */}
                        <button
                            onClick={() => setScrimActive(!scrimActive)}
                            className={cn(
                                "absolute bottom-4 right-4 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all z-20",
                                scrimActive
                                    ? "bg-error text-on-error"
                                    : "bg-primary text-on-primary"
                            )}
                        >
                            {scrimActive ? 'Dismiss Scrim' : 'Show Scrim'}
                        </button>
                    </div>
                </div>

                {/* Scrim values */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Light Mode', value: `${SCRIM_VALUES.light * 100}%`, sublabel: 'opacity' },
                        { label: 'Dark Mode', value: `${SCRIM_VALUES.dark * 100}%`, sublabel: 'opacity' },
                        { label: 'Backdrop Blur', value: `${SCRIM_VALUES.blur}px`, sublabel: 'filter' },
                    ].map(item => (
                        <div key={item.label} className="bg-layer-panel rounded-xl border border-border/30 p-4 text-center">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">{item.label}</span>
                            <span className="text-2xl font-black text-foreground block mt-1">{item.value}</span>
                            <span className="text-[9px] text-primary font-dev text-transform-tertiary">{item.sublabel}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
