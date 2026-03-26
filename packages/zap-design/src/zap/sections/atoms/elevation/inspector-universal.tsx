'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InspectorAccordion } from '../../../../zap/organisms/laboratory/InspectorAccordion';
import { Slider } from '../../../../genesis/atoms/interactive/slider';
import { type LayerProps } from './use-layer-properties';

export interface UniversalLayerProps extends LayerProps {
    tintMultiplier: number;
}

// ─── INSPECTOR PROPERTY ROW ─────────────────────────────────────────────────

interface PropertyRowProps {
    label: string;
    value: number | string;
    unit?: string;
    children: React.ReactNode;
}

const PropertyRow: React.FC<PropertyRowProps> = ({ label, value, unit = '', children }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-body text-transform-secondary text-muted-foreground tracking-wide">
                {label}
            </span>
            <motion.span
                key={String(value)}
                initial={{ scale: 1.3, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="text-[10px] font-dev font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full min-w-[36px] text-center"
            >
                {value}{unit}
            </motion.span>
        </div>
        {children}
    </div>
);

// ─── UNIVERSAL CONTROLS ─────────────────────────────────────────────────────

interface UniversalControlsProps {
    universal: UniversalLayerProps;
    onUpdate: <K extends keyof UniversalLayerProps>(key: K, value: UniversalLayerProps[K]) => void;
}

export const InspectorUniversal: React.FC<UniversalControlsProps> = ({
    universal,
    onUpdate,
}) => {
    return (
        <InspectorAccordion title="Universal Controls" icon="tune" defaultOpen={true}>
            <div className="space-y-5 pt-1">
                {/* ── Background ── */}
                <div className="space-y-1 pb-2">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-[14px] text-primary">format_paint</span>
                        <span className="text-[9px] font-black text-transform-primary tracking-widest text-muted-foreground">BACKGROUND</span>
                    </div>

                    <PropertyRow label="BG Opacity" value={universal.bgOpacity} unit="%">
                        <Slider
                            value={[universal.bgOpacity]}
                            onValueChange={([v]: number[]) => onUpdate('bgOpacity', v)}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </PropertyRow>

                    <PropertyRow label="Tint Multiplier" value={universal.tintMultiplier} unit="%">
                        <Slider
                            value={[universal.tintMultiplier]}
                            onValueChange={([v]: number[]) => onUpdate('tintMultiplier', v)}
                            min={0}
                            max={200}
                            step={5}
                        />
                    </PropertyRow>
                </div>


            </div>
        </InspectorAccordion>
    );
};
