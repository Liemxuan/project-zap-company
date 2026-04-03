'use client';

import React from 'react';
import { InspectorAccordion } from '../../../../zap/organisms/laboratory/InspectorAccordion';
import { ELEVATION_LEVELS } from '../../../../zap/sections/atoms/foundations/schema';

import { InspectorLayer } from './inspector-layer';
import {
    type LayerPropertiesState,
    type LayerProps,
    LAYER_NAMES,
} from './use-layer-properties';

// ─── RE-EXPORT THE HOOK FOR PAGE-LEVEL USAGE ────────────────────────────────
export { useLayerProperties } from './use-layer-properties';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const FOUNDATION_RULES = [
    'Surface tint replaces shadow as primary depth cue in M3',
    'Hover raises elevation by +1 level; press maintains current',
    'Disabled state always drops to Level 0 (no tint, no shadow)',
    'Max 6 levels (0–5) — rarely use Level 5 in production',
    'NO STATIC HEX: all layer backgrounds MUST use semantic tokens (e.g. bg-layer-canvas)',
    'Border colors must reference outline-variant tokens, never raw colors',
];

const INHERITED_SURFACE_TOKENS = [
    '--md-sys-color-surface',
    '--md-sys-color-surface-container-lowest',
    '--md-sys-color-surface-container-low',
    '--md-sys-color-surface-container',
    '--md-sys-color-surface-container-high',
    '--md-sys-color-surface-container-highest',
];

const INHERITED_LAYER_TOKENS = [
    '--layer-border-width',
    '--layer-border-style',
    '--layer-border-opacity',
    '--layer-border-radius',
    '--layer-bg-opacity',
    '--layer-tint-multiplier',
];

// ─── ELEVATION INSPECTOR ────────────────────────────────────────────────────

interface ElevationInspectorProps {
    /** Injected from useLayerProperties at page level */
    state: LayerPropertiesState;
    setLayerOverride: (layerId: number, key: keyof LayerProps, value: LayerProps[keyof LayerProps]) => void;
    hasOverrides: (layerId: number) => boolean;
}

export const ElevationInspector = ({
    state,
    setLayerOverride,
    hasOverrides,
}: ElevationInspectorProps) => {
    return (
        <div className="font-body text-transform-secondary select-none pb-4 flex flex-col gap-1">

            {/* ── Data Terminal (CST parity) ── */}
            <InspectorAccordion title="Data Terminal" icon="database" defaultOpen={false}>
                <div className="space-y-4 p-4 bg-layer-dialog rounded-lg border border-border/50">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground opacity-60">Status</p>
                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-transform-secondary bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Beta
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground opacity-60">Tier</p>
                        <p className="text-xs font-dev text-transform-tertiary font-medium text-on-surface">L1 TOKEN</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground opacity-60">Source</p>
                        <code className="text-[10px] leading-tight block p-2 bg-on-surface/5 rounded-md border border-border/50 font-dev text-transform-tertiary break-all text-on-surface-variant">
                            zap/sections/atoms/elevation/
                        </code>
                    </div>
                </div>
            </InspectorAccordion>



            {/* ── Per-Layer Advanced Controls ── */}
            <InspectorAccordion title="Layer Settings" icon="stack" defaultOpen={true}>
                <div className="space-y-1 pt-1">
                    <p className="text-[9px] text-muted-foreground mb-3 leading-relaxed">
                        Configure surface token, opacity, and tint for each elevation layer. Modified layers are indicated by a{''}
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary align-middle mx-0.5" /> dot.
                    </p>
                    {[0, 1, 2, 3, 4, 5].map(id => (
                        <InspectorLayer
                            key={id}
                            layerId={id}
                            layerProps={state.layers[id] || {}}
                            hasOverrides={hasOverrides(id)}
                            onOverride={(key, value) => setLayerOverride(id, key, value)}
                            onClear={() => {}} // Removed in use-layer-properties
                        />
                    ))}
                </div>
            </InspectorAccordion>

            {/* ── Foundation Rules (CST parity) ── */}
            <InspectorAccordion title="Foundation Rules" icon="security" defaultOpen={false}>
                <ul className="space-y-2 mt-2">
                    {FOUNDATION_RULES.map((rule, idx) => (
                        <li key={idx} className="text-[11px] font-body text-transform-secondary text-on-surface-variant leading-relaxed pl-2 border-l-2 border-primary/20">
                            {rule}
                        </li>
                    ))}
                </ul>
            </InspectorAccordion>

            {/* ── Quick Reference ── */}
            <InspectorAccordion title="Elevation Quick Ref" icon="layers" defaultOpen={false}>
                <div className="space-y-1.5 pt-1">
                    {ELEVATION_LEVELS.map(level => (
                        <div key={level.level} className="flex items-center gap-2 p-2 rounded-md bg-layer-dialog border border-outline-variant/20 group hover:border-primary/30 transition-colors">
                            <div
                                className="w-6 h-6 rounded bg-layer-dialog border border-outline-variant/20 flex items-center justify-center text-[9px] font-black text-foreground"
                                style={Object.assign({}, { boxShadow: level.shadowLight })}
                            >
                                {level.level}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold text-foreground block">{LAYER_NAMES[level.level]?.name || `Level ${level.level}`}</span>
                                <span className="text-[9px] text-muted-foreground truncate block font-dev text-transform-tertiary">{level.dp}dp · {level.tintOpacity}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </InspectorAccordion>

            {/* ── Inheritance Map (CST parity) ── */}
            <InspectorAccordion title="Inheritance Map" icon="account_tree" defaultOpen={false}>
                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-transform-secondary text-on-surface-variant">Surface Colors (L1):</span>
                        <div className="flex flex-wrap gap-1.5">
                            {INHERITED_SURFACE_TOKENS.map(t => (
                                <span key={t} className="px-1.5 py-0.5 bg-primary-container text-on-primary-container border border-primary/20 rounded-[4px] text-[10px] font-dev text-transform-tertiary">{t}</span>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-transform-secondary text-on-surface-variant">Layer Properties (L2):</span>
                        <div className="flex flex-wrap gap-1.5">
                            {INHERITED_LAYER_TOKENS.map(t => (
                                <span key={t} className="px-1.5 py-0.5 bg-secondary-container text-on-secondary-container border border-secondary/20 rounded-[4px] text-[10px] font-dev text-transform-tertiary">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </InspectorAccordion>
        </div>
    );
};

