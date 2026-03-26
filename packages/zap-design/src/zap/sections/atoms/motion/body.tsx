'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { SectionHeader, TokenTable } from '../../../../zap/sections/atoms/foundations/components';
import { MOTION_CURVES, MOTION_DURATIONS } from '../../../../zap/sections/atoms/foundations/schema';
import { type Platform } from '../../../../zap/sections/atoms/foundations/components';

interface MotionBodyProps {
    platform: Platform;
}

export const MotionBody = ({ platform }: MotionBodyProps) => {
    const [activeCurve, setActiveCurve] = useState(0);
    const [activeDuration, setActiveDuration] = useState(5); // Medium 2 (300ms)
    const [isPlaying, setIsPlaying] = useState(false);
    const [playKey, setPlayKey] = useState(0);

    const triggerPlay = useCallback(() => {
        setIsPlaying(true);
        setPlayKey(k => k + 1);
        const ms = MOTION_DURATIONS[activeDuration]?.ms || 300;
        setTimeout(() => setIsPlaying(false), ms + 100);
    }, [activeDuration]);

    return (
        <div className="max-w-5xl mx-auto space-y-20 pb-24">

            {/* ── 01. EASING CURVES ──────────────────────── */}
            <section className="space-y-8">
                <SectionHeader
                    number="01"
                    title="Easing Curves"
                    icon="timeline"
                    description="6 cubic-bezier curves for natural motion"
                    id="easing-curves"
                />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 defines <strong>6 easing curves</strong> organized into Standard (most UI) and Emphasized (expressive, large elements).
                        Each has a base, decelerate (enter), and accelerate (exit) variant.
                    </p>
                </div>

                {/* Curve selector */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {MOTION_CURVES.map((curve, i) => (
                        <button
                            key={curve.name}
                            onClick={() => setActiveCurve(i)}
                            className={cn(
                                "p-4 rounded-xl text-left transition-all duration-200 border-2",
                                activeCurve === i
                                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                    : "border-border/30 bg-layer-panel hover:border-primary/30"
                            )}
                        >
                            <span className="text-xs font-bold text-foreground block">{curve.name}</span>
                            <span className="text-[9px] text-muted-foreground block mt-1">{curve.usage}</span>
                            <code className="text-[9px] font-dev text-transform-tertiary text-primary block mt-2">{curve.value}</code>
                        </button>
                    ))}
                </div>

                {/* Animated demo for selected curve */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {MOTION_CURVES[activeCurve].name} — Live Preview
                        </h3>
                        <button
                            onClick={triggerPlay}
                            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
                        >
                            <Icon name="play_arrow" size={14} className="inline mr-1" />
                            Play
                        </button>
                    </div>
                    <div className="p-6 bg-layer-panel rounded-xl border border-border/30 space-y-4">
                        {/* Translation demo */}
                        <div className="relative h-12 bg-layer-dialog rounded-lg overflow-hidden">
                            <div
                                key={`translate-${playKey}`}
                                className={cn(
                                    "absolute top-1 left-1 w-10 h-10 bg-primary rounded-lg flex items-center justify-center",
                                    isPlaying ? "animate-motion-slide" : ""
                                )}
                                style={Object.assign({}, {
                                    transition: `transform ${MOTION_DURATIONS[activeDuration]?.ms || 300}ms ${MOTION_CURVES[activeCurve].value}`,
                                    transform: isPlaying ? 'translateX(calc(100% + 600%))' : 'translateX(0)',
                                })}
                            >
                                <Icon name="arrow_forward" size={16} className="text-on-primary" />
                            </div>
                        </div>

                        {/* Scale demo */}
                        <div className="flex items-center justify-center h-20 bg-layer-dialog rounded-lg">
                            <div
                                key={`scale-${playKey}`}
                                className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center"
                                style={Object.assign({}, {
                                    transition: `transform ${MOTION_DURATIONS[activeDuration]?.ms || 300}ms ${MOTION_CURVES[activeCurve].value}`,
                                    transform: isPlaying ? 'scale(1.5)' : 'scale(1)',
                                })}
                            >
                                <Icon name="fullscreen" size={20} className="text-on-secondary" />
                            </div>
                        </div>

                        {/* Opacity demo */}
                        <div className="flex items-center justify-center h-12 bg-layer-dialog rounded-lg">
                            <div
                                key={`opacity-${playKey}`}
                                className="w-full h-full bg-tertiary rounded-lg flex items-center justify-center"
                                style={Object.assign({}, {
                                    transition: `opacity ${MOTION_DURATIONS[activeDuration]?.ms || 300}ms ${MOTION_CURVES[activeCurve].value}`,
                                    opacity: isPlaying ? 0.2 : 1,
                                })}
                            >
                                <span className="text-xs font-bold text-on-tertiary">Opacity Fade</span>
                            </div>
                        </div>
                    </div>
                </div>

                <TokenTable
                    headers={['Name', 'CSS Value', platform === 'web' ? 'CSS' : 'Flutter', 'Usage']}
                    rows={MOTION_CURVES.map(c => [
                        c.name,
                        c.value,
                        platform === 'web' ? `transition-timing-function: ${c.value}` : c.flutter,
                        c.usage,
                    ])}
                />
            </section>

            {/* ── 02. DURATION TOKENS ────────────────────── */}
            <section className="space-y-8">
                <SectionHeader
                    number="02"
                    title="Duration Tokens"
                    icon="timer"
                    description="16 duration tokens from 50ms micro-interactions to 1000ms max"
                    id="duration-tokens"
                />

                <div className="bg-layer-panel rounded-xl p-6 border border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                        M3 durations are organized into 4 tiers: <strong>Short</strong> (50-200ms) for micro-interactions,
                        <strong> Medium</strong> (250-400ms) for standard transitions, <strong>Long</strong> (450-600ms) for complex transitions,
                        and <strong>Extra Long</strong> (700-1000ms) for orchestrated animations.
                    </p>
                </div>

                {/* Duration timeline */}
                <div className="space-y-2 p-6 bg-layer-panel rounded-xl border border-border/30">
                    {MOTION_DURATIONS.map((dur, i) => {
                        const tierColors: Record<string, string> = {
                            Short: 'bg-primary',
                            Medium: 'bg-secondary',
                            Long: 'bg-tertiary',
                            Extra: 'bg-error',
                        };
                        const barColor = tierColors[dur.name.split(' ')[0]] || 'bg-primary';

                        return (
                            <button
                                key={dur.name}
                                onClick={() => setActiveDuration(i)}
                                className={cn(
                                    "flex items-center gap-3 w-full rounded-md p-2 text-left transition-all duration-200",
                                    activeDuration === i ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-layer-dialog"
                                )}
                            >
                                <span className="text-[10px] font-dev text-transform-tertiary font-bold text-muted-foreground w-20 shrink-0">
                                    {dur.name}
                                </span>
                                <div className="flex-1 relative h-4 flex items-center">
                                    <div
                                        className={cn("h-2.5 rounded-sm transition-all duration-300", barColor, activeDuration === i ? "opacity-100" : "opacity-40")}
                                        style={Object.assign({}, { width: `${(dur.ms / 1000) * 100}%`, minWidth: 8 })}
                                    />
                                </div>
                                <span className="text-[10px] font-dev text-transform-tertiary text-foreground w-14 text-right shrink-0 font-bold">
                                    {dur.ms}ms
                                </span>
                            </button>
                        );
                    })}
                </div>

                <TokenTable
                    headers={['Token', 'Duration (ms)', 'Usage']}
                    rows={MOTION_DURATIONS.map(d => [d.name, `${d.ms}ms`, d.usage])}
                />
            </section>
        </div>
    );
};
