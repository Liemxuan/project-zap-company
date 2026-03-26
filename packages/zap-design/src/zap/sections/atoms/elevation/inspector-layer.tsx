'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InspectorAccordion } from '../../../../zap/organisms/laboratory/InspectorAccordion';
import { Slider } from '../../../../genesis/atoms/interactive/slider';
import { Select } from '../../../../genesis/atoms/interactive/option-select';
import {
    type LayerProps,
    LAYER_NAMES,
    BG_TOKEN_OPTIONS,
    DEFAULT_LAYER_PROPS,
} from './use-layer-properties';

// ─── PROPERTY ROW (with override indicator) ─────────────────────────────────

interface PropertyRowProps {
    label: string;
    value: number | string;
    unit?: string;
    isOverride?: boolean;
    onClear?: () => void;
    children: React.ReactNode;
}

const PropertyRow: React.FC<PropertyRowProps> = ({ label, value, unit = '', isOverride, onClear, children }) => (
    <div className="space-y-1.5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
                {isOverride && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-tertiary"
                    />
                )}
                <span className="text-[9px] font-bold font-dev text-transform-tertiary text-muted-foreground tracking-wide">
                    {label}
                </span>
            </div>
            <div className="flex items-center gap-1">
                <motion.span
                    key={String(value)}
                    initial={{ scale: 1.2, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="text-[9px] font-dev font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full min-w-[28px] text-center"
                >
                    {value}{unit}
                </motion.span>
                {isOverride && onClear && (
                    <button
                        onClick={onClear}
                        className="text-[8px] text-muted-foreground hover:text-error transition-colors"
                        title="Clear override"
                    >
                        <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                )}
            </div>
        </div>
        {children}
    </div>
);

// ─── PER-LAYER CONTROLS ─────────────────────────────────────────────────────

interface InspectorLayerProps {
    layerId: number;
    layerProps: LayerProps;
    hasOverrides: boolean;
    onOverride: (key: keyof LayerProps, value: LayerProps[keyof LayerProps]) => void;
    onClear: (key: keyof LayerProps) => void;
}

export const InspectorLayer: React.FC<InspectorLayerProps> = ({
    layerId,
    layerProps,
    hasOverrides,
    onOverride,
    onClear,
}) => {
    const layer = LAYER_NAMES[layerId];
    if (!layer) return null;

    const titleContent = (
        <span className="flex items-center gap-2">
            {layer.name}
            {hasOverrides && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="w-2 h-2 rounded-full bg-tertiary inline-block"
                />
            )}
        </span>
    );

    return (
        <InspectorAccordion
            title={typeof titleContent === 'string' ? titleContent : layer.name}
            icon={layer.icon}
            defaultOpen={false}
        >
            <div className="space-y-4 pt-1">
                {/* Layer identity badge */}
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/5 border border-primary/10">
                    <span className="text-[9px] font-dev font-bold text-primary">{layer.token}</span>
                </div>

                {/* ── Background ── */}
                <div className="space-y-3">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px] text-muted-foreground">format_paint</span>
                        <span className="text-[8px] font-black text-transform-primary tracking-widest text-muted-foreground">BG</span>
                    </div>

                    <div className="space-y-1.5">
                        <span className="text-[9px] font-bold font-dev text-transform-tertiary text-muted-foreground tracking-wide">
                            Token
                        </span>
                        <Select
                            options={BG_TOKEN_OPTIONS}
                            value={layerProps.bgToken || ''}
                            onChange={(v) => v ? onOverride('bgToken', v) : onClear('bgToken')}
                            className="w-full"
                        />
                    </div>

                    <PropertyRow
                        label="Opacity"
                        value={layerProps.bgOpacity}
                        unit="%"
                        isOverride={layerProps.bgOpacity !== DEFAULT_LAYER_PROPS.bgOpacity}
                        onClear={() => onClear('bgOpacity')}
                    >
                        <Slider
                            value={[layerProps.bgOpacity]}
                            onValueChange={([v]: number[]) => onOverride('bgOpacity', v)}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </PropertyRow>

                    <PropertyRow
                        label="Tint"
                        value={layerProps.tintOpacity}
                        unit="%"
                        isOverride={layerProps.tintOpacity !== DEFAULT_LAYER_PROPS.tintOpacity}
                        onClear={() => onClear('tintOpacity')}
                    >
                        <Slider
                            value={[layerProps.tintOpacity]}
                            onValueChange={([v]: number[]) => onOverride('tintOpacity', v)}
                            min={0}
                            max={20}
                            step={1}
                        />
                    </PropertyRow>
                </div>

            </div>
        </InspectorAccordion>
    );
};
