'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { argbFromHex, hexFromArgb, TonalPalette, Hct, SchemeTonalSpot, SchemeNeutral, SchemeVibrant, SchemeExpressive, SchemeRainbow, SchemeFruitSalad, SchemeMonochrome, SchemeFidelity, SchemeContent, sourceColorFromImage } from "@material/material-color-utilities";
import { Check, Sparkles, Sun, Leaf, Droplet, ArrowLeft, MoreVertical } from 'lucide-react';
import { useParams } from 'next/navigation';
import { LaboratoryTemplate } from '../../../zap/templates/LaboratoryTemplate';
import { InspectorAccordion } from '../../../zap/organisms/laboratory/InspectorAccordion';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { useTheme } from '../../../components/ThemeContext';
import { type Platform } from '../../../zap/sections/atoms/foundations/components';

import type { TabItem } from '../../../genesis/atoms/interactive/Tabs';
import { Badge } from '../../../genesis/atoms/status/badges';
import { Button } from '../../../genesis/atoms/interactive/buttons';
import { ThemePublisher } from '../../../components/dev/ThemePublisher';
const SCHEME_VARIANTS = [
    { id: 'TonalSpot', label: 'Tonal Spot', hasSparkle: true, description: "A calm theme, sedated colors that aren't particularly chromatic." },
    { id: 'Neutral', label: 'Neutral', hasSparkle: true, description: "A theme that's slightly more chromatic than monochrome." },
    { id: 'Vibrant', label: 'Vibrant', hasSparkle: true, description: "A theme with loud, highly chromatic colors." },
    { id: 'Expressive', label: 'Expressive', hasSparkle: true, description: "A theme with distinctly vibrant and unexpected colors." },
    { id: 'Rainbow', label: 'Rainbow', hasSparkle: false, description: "A playful theme using multiple hues." },
    { id: 'FruitSalad', label: 'Fruit Salad', hasSparkle: false, description: "A highly colorful and distinct theme." },
    { id: 'Monochrome', label: 'Monochrome', hasSparkle: false, description: "A theme using no chroma, resulting in grayscale colors." },
    { id: 'Fidelity', label: 'Fidelity', hasSparkle: false, description: "A theme intended to accurately represent the seed color." },
    { id: 'Content', label: 'Content', hasSparkle: false, description: "A theme suitable for content-centric applications." },
];

// Contrast levels are available for future UI controls
// const CONTRAST_LEVELS = [
//     { value: '0.0', label: 'Standard' },
//     { value: '0.5', label: 'Medium' },
//     { value: '1.0', label: 'High' },
// ];

// Core Color Selection Row
const CoreColorRow = ({ label, description, color, defaultColor, onChange, isPrimary = false }: { label: string, description: string, color: string, defaultColor?: string, onChange: (val: string) => void, isPrimary?: boolean }) => {
    const displayColor = color || defaultColor || '#cccccc';
    return (
        <div className="flex items-center gap-4 p-3 rounded-[16px] bg-surface-container hover:bg-surface-container-high transition-colors relative">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm flex-shrink-0 border border-black/5" style={{ backgroundColor: displayColor }}>
                <input type="color" value={displayColor.slice(0, 7)} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0" title={`Pick ${label} color`} />
            </div>
            <div className="flex flex-col pr-8">
                <span className="text-[15px] font-medium font-body text-transform-secondary text-on-surface">{label}</span>
                {description && <span className="text-[11px] font-dev text-transform-tertiary text-on-surface-variant leading-tight mt-0.5">{description}</span>}
            </div>
            {!isPrimary && color && (
                <button onClick={(e) => { e.stopPropagation(); onChange(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1" aria-label={`Clear ${label} color`} title={`Clear ${label} color`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            )}
        </div>
    );
};

const CopyIcon = ({ className }: { className?: string }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const TailwindIcon = ({ className }: { className?: string }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
);

// Main Swatch Block
const getRgbString = (argb: number) => {
    const r = (argb >> 16) & 255;
    const g = (argb >> 8) & 255;
    const b = argb & 255;
    return `rgb(${r}, ${g}, ${b})`;
};

const getHslString = (argb: number) => {
    const r = ((argb >> 16) & 255) / 255;
    const g = ((argb >> 8) & 255) / 255;
    const b = (argb & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

const Swatch = ({ label, bg, text, toneLabel, twClass, cssVar, heightClass = "h-[100px]", widthClass = "w-full" }: { label: string, bg: number, text: number, toneLabel: string, twClass?: string, cssVar?: string, heightClass?: string, widthClass?: string }) => {
    const [copied, setCopied] = useState<string | null>(null);
    const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
    const hexBg = hexFromArgb(bg);

    const displayValue = format === 'hex' ? hexBg : format === 'rgb' ? getRgbString(bg) : getHslString(bg);

    const cycleFormat = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormat(f => f === 'hex' ? 'rgb' : f === 'rgb' ? 'hsl' : 'hex');
    };

    const onCopy = async (copyText: string) => {
        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(copyText);
            setTimeout(() => setCopied(null), 1500);
        } catch { }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", zIndex: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`group p-3 flex flex-col justify-between relative ${heightClass} ${widthClass} border transition-colors z-0 hover:z-20`}
            style={{ backgroundColor: hexBg, color: hexFromArgb(text), borderColor: hexFromArgb(text) + '1A' }}
        >
            <div className="flex flex-col gap-[2px] pr-12">
                <span className="text-[13px] font-bold leading-tight">{label}</span>
            </div>

            <div
                className="absolute bottom-3 left-3 text-[10.5px] font-dev text-transform-tertiary opacity-100 cursor-pointer"
                onClick={cycleFormat}
                title="Click to toggle format (Hex/RGB/HSL)"
            >
                {displayValue}
            </div>

            <span className="text-[11px] font-dev text-transform-tertiary absolute bottom-3 right-3 opacity-90">{toneLabel}</span>
            <div className="absolute top-3 right-3 flex gap-1 opacity-100">
                <button onClick={() => onCopy(displayValue)} className="p-1 rounded-md hover:bg-black/10 active:bg-black/20 flex items-center justify-center min-w-[24px] min-h-[24px]" title={`Copy ${displayValue}`}>
                    {copied === displayValue ? <span className="text-[9px] font-bold px-1 whitespace-nowrap">Copied!</span> : <CopyIcon />}
                </button>
                {twClass && (() => {
                    const twCopyContent = cssVar ? `${twClass}\n${cssVar}` : twClass;
                    return (
                        <button onClick={() => onCopy(twCopyContent)} className="p-1 rounded-md hover:bg-black/10 active:bg-black/20 flex items-center justify-center min-w-[24px] min-h-[24px]" title={twCopyContent}>
                            {copied === twCopyContent ? <span className="text-[9px] font-bold px-1 whitespace-nowrap">Copied!</span> : <TailwindIcon />}
                        </button>
                    );
                })()}
            </div>
        </motion.div>
    );
};

// Flat Swatch for "On X" colors
const ThinSwatch = ({ label, bg, text, toneLabel, twClass, cssVar, widthClass = "w-full", heightClass = "h-[42px]" }: { label: string, bg: number, text: number, toneLabel: string, twClass?: string, cssVar?: string, widthClass?: string, heightClass?: string }) => {
    const [copied, setCopied] = useState<string | null>(null);
    const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
    const hexBg = hexFromArgb(bg);

    const displayValue = format === 'hex' ? hexBg : format === 'rgb' ? getRgbString(bg) : getHslString(bg);

    const cycleFormat = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormat(f => f === 'hex' ? 'rgb' : f === 'rgb' ? 'hsl' : 'hex');
    };

    const onCopy = async (copyText: string) => {
        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(copyText);
            setTimeout(() => setCopied(null), 1500);
        } catch { }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)", zIndex: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`group px-3 py-2 flex items-center relative ${widthClass} ${heightClass} border transition-colors z-0 hover:z-20`}
            style={{ backgroundColor: hexBg, color: hexFromArgb(text), borderColor: hexFromArgb(text) + '1A' }}
        >
            <div className="flex flex-col items-start justify-center pr-2 max-w-[65%]">
                <span className="text-[11px] font-bold leading-none truncate w-full flex items-center gap-2">
                    {label}
                    <span
                        className="text-[9px] font-dev text-transform-tertiary opacity-100 cursor-pointer font-normal"
                        onClick={cycleFormat}
                        title="Click to toggle format"
                    >
                        {displayValue}
                    </span>
                </span>
            </div>
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-dev text-transform-tertiary leading-none opacity-90">{toneLabel}</span>
                <div className="flex gap-1 opacity-100">
                    <button onClick={() => onCopy(displayValue)} className="p-1 rounded-sm hover:bg-black/10 active:bg-black/20 flex items-center justify-center min-w-[20px] min-h-[20px]" title={`Copy ${displayValue}`}>
                        {copied === displayValue ? <span className="text-[9px] font-bold px-1 whitespace-nowrap">Copied!</span> : <CopyIcon className="w-3 h-3" />}
                    </button>
                    {twClass && (() => {
                        const twCopyContent = cssVar ? `${twClass}\n${cssVar}` : twClass;
                        return (
                            <button onClick={() => onCopy(twCopyContent)} className="p-1 rounded-sm hover:bg-black/10 active:bg-black/20 flex items-center justify-center min-w-[20px] min-h-[20px]" title={twCopyContent}>
                                {copied === twCopyContent ? <span className="text-[9px] font-bold px-1 whitespace-nowrap">Copied!</span> : <TailwindIcon className="w-3 h-3" />}
                            </button>
                        );
                    })()}
                </div>
            </div>
        </motion.div>
    );
};

// The pixel-perfect Theme Layout Component — Cover Card Design
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemeGrid = ({ scheme, isDark, title }: { scheme: any, isDark: boolean, title: string }) => {
    const outlineColor = hexFromArgb(scheme.outlineVariant);
    const headerText = hexFromArgb(scheme.onSurface);
    const badgeBg = hexFromArgb(isDark ? scheme.inverseSurface : scheme.primary);
    const badgeText = hexFromArgb(isDark ? scheme.inverseOnSurface : scheme.onPrimary);

    const getTone = (prefix: string, argb: number) => {
        return `${prefix}-${Math.round(Hct.fromInt(argb).tone)}`;
    };

    return (
        <section className="w-full rounded-2xl overflow-hidden border shadow-sm bg-layer-panel debug-l3" style={{ borderColor: outlineColor }}>
            {/* ── Cover Card Header ─────────────────────────────────────── */}
            <div
                className="flex items-center justify-between px-6 py-4 border-b bg-layer-dialog debug-l4"
                style={{ borderColor: outlineColor }}
            >
                <div className="flex items-center gap-3">
                    <span
                        className="text-[10px] font-dev text-transform-tertiary tracking-widest px-2.5 py-1 rounded-full font-bold"
                        style={{ backgroundColor: badgeBg, color: badgeText }}
                    >
                        {isDark ? 'DARK' : 'LIGHT'}
                    </span>
                    <h3
                        className="font-body text-titleSmall font-bold tracking-wider text-transform-secondary"
                        style={{ color: headerText }}
                    >
                        {title}
                    </h3>
                </div>
                <span className="text-[10px] font-dev text-transform-tertiary tracking-widest opacity-50" style={{ color: headerText }}>
                    M3 · 29 color roles
                </span>
            </div>

            {/* ── Color Grid Body ────────────────────────────────────────── */}
            <div className="p-6">
                <div className="flex flex-col gap-[3px]">
                {/* Row 1 & 2 (Primary, Secondary, Tertiary, Error) */}
                <div className="flex gap-[3px] w-full">
                    {/* Primary Col */}
                    <div className="flex-1 min-w-0 flex flex-col gap-[1px]">
                        <Swatch label="Primary" bg={scheme.primary} text={scheme.onPrimary} toneLabel={getTone("P", scheme.primary)} twClass="bg-primary" cssVar="--md-sys-color-primary" />
                        <ThinSwatch label="On Primary" bg={scheme.onPrimary} text={scheme.primary} toneLabel={getTone("P", scheme.onPrimary)} twClass="text-on-primary bg-on-primary" cssVar="--md-sys-color-on-primary" />
                        <Swatch label="Primary Container" bg={scheme.primaryContainer} text={scheme.onPrimaryContainer} toneLabel={getTone("P", scheme.primaryContainer)} twClass="bg-primary-container" cssVar="--md-sys-color-primary-container" />
                        <ThinSwatch label="On Primary Container" bg={scheme.onPrimaryContainer} text={scheme.primaryContainer} toneLabel={getTone("P", scheme.onPrimaryContainer)} twClass="text-on-primary-container" cssVar="--md-sys-color-on-primary-container" />
                    </div>
                    {/* Secondary Col */}
                    <div className="flex-1 min-w-0 flex flex-col gap-[1px]">
                        <Swatch label="Secondary" bg={scheme.secondary} text={scheme.onSecondary} toneLabel={getTone("S", scheme.secondary)} twClass="bg-secondary" cssVar="--md-sys-color-secondary" />
                        <ThinSwatch label="On Secondary" bg={scheme.onSecondary} text={scheme.secondary} toneLabel={getTone("S", scheme.onSecondary)} twClass="text-on-secondary bg-on-secondary" cssVar="--md-sys-color-on-secondary" />
                        <Swatch label="Secondary Container" bg={scheme.secondaryContainer} text={scheme.onSecondaryContainer} toneLabel={getTone("S", scheme.secondaryContainer)} twClass="bg-secondary-container" cssVar="--md-sys-color-secondary-container" />
                        <ThinSwatch label="On Secondary Container" bg={scheme.onSecondaryContainer} text={scheme.secondaryContainer} toneLabel={getTone("S", scheme.onSecondaryContainer)} twClass="text-on-secondary-container" cssVar="--md-sys-color-on-secondary-container" />
                    </div>
                    {/* Tertiary Col */}
                    <div className="flex-1 min-w-0 flex flex-col gap-[1px]">
                        <Swatch label="Tertiary" bg={scheme.tertiary} text={scheme.onTertiary} toneLabel={getTone("T", scheme.tertiary)} twClass="bg-tertiary" cssVar="--md-sys-color-tertiary" />
                        <ThinSwatch label="On Tertiary" bg={scheme.onTertiary} text={scheme.tertiary} toneLabel={getTone("T", scheme.onTertiary)} twClass="text-on-tertiary bg-on-tertiary" cssVar="--md-sys-color-on-tertiary" />
                        <Swatch label="Tertiary Container" bg={scheme.tertiaryContainer} text={scheme.onTertiaryContainer} toneLabel={getTone("T", scheme.tertiaryContainer)} twClass="bg-tertiary-container" cssVar="--md-sys-color-tertiary-container" />
                        <ThinSwatch label="On Tertiary Container" bg={scheme.onTertiaryContainer} text={scheme.tertiaryContainer} toneLabel={getTone("T", scheme.onTertiaryContainer)} twClass="text-on-tertiary-container" cssVar="--md-sys-color-on-tertiary-container" />
                    </div>
                    {/* Error Col */}
                    <div className="flex-1 min-w-0 flex flex-col gap-[1px]">
                        <Swatch label="Error" bg={scheme.error} text={scheme.onError} toneLabel={getTone("E", scheme.error)} twClass="bg-error" cssVar="--md-sys-color-error" />
                        <ThinSwatch label="On Error" bg={scheme.onError} text={scheme.error} toneLabel={getTone("E", scheme.onError)} twClass="text-on-error bg-on-error" cssVar="--md-sys-color-on-error" />
                        <Swatch label="Error Container" bg={scheme.errorContainer} text={scheme.onErrorContainer} toneLabel={getTone("E", scheme.errorContainer)} twClass="bg-error-container" cssVar="--md-sys-color-error-container" />
                        <ThinSwatch label="On Error Container" bg={scheme.onErrorContainer} text={scheme.errorContainer} toneLabel={getTone("E", scheme.onErrorContainer)} twClass="text-on-error-container" cssVar="--md-sys-color-on-error-container" />
                    </div>
                </div>

                {/* Row 3 & 4 — 4-column grid matching top block width */}
                <div className="grid grid-cols-4 gap-[3px] w-full mt-[12px]">

                    {/* Col 1: Surface Dim + Surface Bright */}
                    <div className="flex flex-col gap-[1px]">
                        <Swatch label="Surface Dim" bg={scheme.surfaceDim} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceDim)} heightClass="h-[160px]" widthClass="w-full" twClass="bg-surface-dim" cssVar="--md-sys-color-surface-dim" />
                        <Swatch label="Surface Bright" bg={scheme.surfaceBright} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceBright)} heightClass="h-[160px]" widthClass="w-full" twClass="bg-surface-bright" cssVar="--md-sys-color-surface-bright" />
                    </div>

                    {/* Col 2: Surface + On Surface */}
                    <div className="flex flex-col gap-[1px]">
                        <Swatch label="Surface" bg={scheme.surface} text={scheme.onSurface} toneLabel={getTone("N", scheme.surface)} heightClass="h-[160px]" widthClass="w-full" twClass="bg-surface" cssVar="--md-sys-color-surface" />
                        <Swatch label="On Surface" bg={scheme.onSurface} text={scheme.surface} toneLabel={getTone("N", scheme.onSurface)} heightClass="h-[160px]" widthClass="w-full" twClass="text-on-surface" cssVar="--md-sys-color-on-surface" />
                    </div>

                    {/* Col 3: On Surface Variant + Outline + Outline Variant */}
                    <div className="flex flex-col gap-[1px]">
                        <Swatch label="On Surface Variant" bg={scheme.onSurfaceVariant} text={scheme.surfaceVariant} toneLabel={getTone("NV", scheme.onSurfaceVariant)} heightClass="h-[107px]" widthClass="w-full" twClass="text-on-surface-variant" cssVar="--md-sys-color-on-surface-variant" />
                        <Swatch label="Outline" bg={scheme.outline} text={scheme.surface} toneLabel={getTone("NV", scheme.outline)} heightClass="h-[107px]" widthClass="w-full" twClass="border-outline" cssVar="--md-sys-color-outline" />
                        <Swatch label="Outline Variant" bg={scheme.outlineVariant} text={scheme.onSurface} toneLabel={getTone("NV", scheme.outlineVariant)} heightClass="h-[107px]" widthClass="w-full" twClass="border-outline-variant" cssVar="--md-sys-color-outline-variant" />
                    </div>

                    {/* Col 4: Inverses + Scrim */}
                    <div className="flex flex-col gap-[1px]">
                        <Swatch label="Inverse Surface" bg={scheme.inverseSurface} text={scheme.inverseOnSurface} toneLabel={getTone("N", scheme.inverseSurface)} heightClass="h-[80px]" widthClass="w-full" twClass="bg-inverse-surface" cssVar="--md-sys-color-inverse-surface" />
                        <Swatch label="Inverse On Surface" bg={scheme.inverseOnSurface} text={scheme.inverseSurface} toneLabel={getTone("N", scheme.inverseOnSurface)} heightClass="h-[80px]" widthClass="w-full" twClass="text-inverse-on-surface" cssVar="--md-sys-color-inverse-on-surface" />
                        <Swatch label="Inverse Primary" bg={scheme.inversePrimary} text={scheme.primary} toneLabel={getTone("P", scheme.inversePrimary)} heightClass="h-[80px]" widthClass="w-full" twClass="bg-inverse-primary" cssVar="--md-sys-color-inverse-primary" />
                        <Swatch label="Scrim" bg={scheme.scrim} text={isDark ? argbFromHex("#FFFFFF") : scheme.surface} toneLabel={getTone("N", scheme.scrim)} heightClass="h-[80px]" widthClass="w-full" twClass="bg-scrim" cssVar="--md-sys-color-scrim" />
                    </div>
                </div>

                {/* Surface Containers — full width sub-row, 5 chips */}
                <div className="flex gap-[3px] w-full mt-[3px]">
                    <Swatch label="Surface Container Lowest" bg={scheme.surfaceContainerLowest} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainerLowest)} heightClass="h-[90px]" widthClass="flex-1" twClass="bg-surface-lowest" cssVar="--md-sys-color-surface-container-lowest" />
                    <Swatch label="Surface Container Low" bg={scheme.surfaceContainerLow} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainerLow)} heightClass="h-[90px]" widthClass="flex-1" twClass="bg-surface-low" cssVar="--md-sys-color-surface-container-low" />
                    <Swatch label="Surface Container" bg={scheme.surfaceContainer} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainer)} heightClass="h-[90px]" widthClass="flex-1" twClass="bg-surface-container" cssVar="--md-sys-color-surface-container" />
                    <Swatch label="Surface Container High" bg={scheme.surfaceContainerHigh} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainerHigh)} heightClass="h-[90px]" widthClass="flex-1" twClass="bg-surface-high" cssVar="--md-sys-color-surface-container-high" />
                    <Swatch label="Surface Container Highest" bg={scheme.surfaceContainerHighest} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainerHighest)} heightClass="h-[90px]" widthClass="flex-1" twClass="bg-surface-highest" cssVar="--md-sys-color-surface-container-highest" />
                </div>
                </div>
            </div>
        </section>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FixedGrid = ({ palettes, scheme }: { palettes: Record<string, any>, scheme: any }) => {
    const outline = hexFromArgb(scheme.outlineVariant);


    return (
        <section>
            <h3 className="font-body text-titleMedium font-bold text-foreground text-transform-secondary tracking-wider mb-4">Fixed Colors (independent of theme)</h3>
            <div className="rounded-xl p-8 border shadow-sm transition-colors w-full bg-layer-panel debug-l3" style={{ borderColor: outline }}>
                <div className="flex w-full gap-[3px]">
                {/* Primary Fixed */}
                <div className="flex-1 flex flex-col gap-[1px]">
                    <Swatch label="Primary Fixed" bg={palettes.primary.tone(90)} text={palettes.primary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-primary-fixed" cssVar="--md-sys-color-primary-fixed" />
                    <Swatch label="Primary Fixed Dim" bg={palettes.primary.tone(80)} text={palettes.primary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-primary-fixed-dim" cssVar="--md-sys-color-primary-fixed-dim" />
                    <ThinSwatch label="On Primary Fixed" bg={palettes.primary.tone(10)} text={palettes.primary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-primary-fixed" cssVar="--md-sys-color-on-primary-fixed" />
                    <ThinSwatch label="On Primary Fixed Variant" bg={palettes.primary.tone(30)} text={palettes.primary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-primary-fixed-variant" cssVar="--md-sys-color-on-primary-fixed-variant" />
                </div>
                {/* Secondary Fixed */}
                <div className="flex-1 flex flex-col gap-[1px]">
                    <Swatch label="Secondary Fixed" bg={palettes.secondary.tone(90)} text={palettes.secondary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-secondary-fixed" cssVar="--md-sys-color-secondary-fixed" />
                    <Swatch label="Secondary Fixed Dim" bg={palettes.secondary.tone(80)} text={palettes.secondary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-secondary-fixed-dim" cssVar="--md-sys-color-secondary-fixed-dim" />
                    <ThinSwatch label="On Secondary Fixed" bg={palettes.secondary.tone(10)} text={palettes.secondary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-secondary-fixed" cssVar="--md-sys-color-on-secondary-fixed" />
                    <ThinSwatch label="On Secondary Fixed Variant" bg={palettes.secondary.tone(30)} text={palettes.secondary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-secondary-fixed-variant" cssVar="--md-sys-color-on-secondary-fixed-variant" />
                </div>
                {/* Tertiary Fixed */}
                <div className="flex-1 flex flex-col gap-[1px]">
                    <Swatch label="Tertiary Fixed" bg={palettes.tertiary.tone(90)} text={palettes.tertiary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-tertiary-fixed" cssVar="--md-sys-color-tertiary-fixed" />
                    <Swatch label="Tertiary Fixed Dim" bg={palettes.tertiary.tone(80)} text={palettes.tertiary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-tertiary-fixed-dim" cssVar="--md-sys-color-tertiary-fixed-dim" />
                    <ThinSwatch label="On Tertiary Fixed" bg={palettes.tertiary.tone(10)} text={palettes.tertiary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-tertiary-fixed" cssVar="--md-sys-color-on-tertiary-fixed" />
                    <ThinSwatch label="On Tertiary Fixed Variant" bg={palettes.tertiary.tone(30)} text={palettes.tertiary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-tertiary-fixed-variant" cssVar="--md-sys-color-on-tertiary-fixed-variant" />
                </div>
                </div>
            </div>
        </section>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TonalMatrixGrid = ({ palettes, scheme }: { palettes: Record<string, any>, scheme: any }) => {
    const tones = [100, 99, 98, 96, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
    const names = ['primary', 'secondary', 'tertiary', 'error', 'neutral', 'neutralVariant'];

    const outline = hexFromArgb(scheme.outlineVariant);
    const textColor = hexFromArgb(scheme.onSurface);


    return (
        <section>
            <h3 className="font-body text-titleMedium font-bold text-foreground text-transform-secondary tracking-wider mb-4">Absolute 0-100 Tonal Matrices</h3>
            <div className="rounded-xl p-8 border shadow-sm transition-colors w-full bg-layer-panel debug-l3" style={{ borderColor: outline }}>
                <div className="flex flex-col gap-6">
                {names.map(name => (
                    <div key={name} className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-transform-secondary tracking-wide opacity-80" style={{ color: textColor }}>{name.replace('Variant', ' Variant')}</h3>
                        <div className="flex w-full h-[60px] rounded-lg overflow-hidden border border-black/5 shadow-inner">
                            {tones.map(tone => {
                                const bgValue = palettes[name] ? palettes[name].tone(tone) : 0xffffff;
                                const bgColor = hexFromArgb(bgValue);
                                const itemTextColor = tone > 50 ? '#000' : '#fff';
                                return (
                                    <div
                                        key={tone}
                                        className="flex-1 flex items-center justify-center text-[10px] font-medium transition-all hover:flex-[1.5]"
                                        style={{ backgroundColor: bgColor, color: itemTextColor }}
                                        title={`${name} ${tone}: ${bgColor}`}
                                    >
                                        {tone}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
};

// =============================================================================
// M3 Window Classes & Device Specs
// =============================================================================
type WindowClass = 'compact' | 'medium' | 'expanded';

const WINDOW_CLASSES: { id: WindowClass; label: string; desc: string; cols: number; margins: number; gutters: number }[] = [
    { id: 'compact', label: 'Compact', desc: 'Phone · 4 col · 16dp margins', cols: 4, margins: 16, gutters: 8 },
    { id: 'medium', label: 'Medium', desc: 'Tablet · 8 col · 24dp margins', cols: 8, margins: 24, gutters: 16 },
    { id: 'expanded', label: 'Expanded', desc: 'Desktop · 12 col · 24dp margins', cols: 12, margins: 24, gutters: 24 },
];

// Device specs — Flutter logical pixel reference (0.916x scale)
const DEVICE_SPECS = {
    ios: {
        label: 'iOS',
        name: 'iPhone 16',
        spec: '393 × 852pt · @3x',
        width: 360,
        height: 780,
        radius: 50,
        borderWidth: 10,
        statusBarHeight: 54,
        safeBottom: 28,
    },
    android: {
        label: 'Android',
        name: 'Pixel 9',
        spec: '406 × 913dp · @2.625x',
        width: 372,
        height: 836,
        radius: 27,
        borderWidth: 8,
        statusBarHeight: 28,
        safeBottom: 16,
    },
} as const;

type DevicePlatform = keyof typeof DEVICE_SPECS | 'both';

// iOS Dynamic Island status bar — accurate 115×34px island pill
const IOSStatusBar = ({ color }: { color: string }) => (
    <div className="w-full relative flex-shrink-0" style={{ height: 54, color }}>
        {/* Dynamic Island pill */}
        <div
            className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-20"
            style={{ top: 10, width: 115, height: 34 }}
        />
        {/* Time — bottom-left of status bar */}
        <span
            className="absolute left-6 text-[12px] font-semibold tabular-nums"
            style={{ bottom: 6 }}
        >22:50</span>
        {/* Status icons — bottom-right */}
        <div className="absolute right-5 flex gap-1.5 items-center" style={{ bottom: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22H22V2L2 22Z" /></svg>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L1 3C5 1 19 1 23 3L12 21Z" /></svg>
            <div className="w-[18px] h-[10px] rounded-[3px] border-[1.5px] border-current relative">
                <div className="w-[1px] h-[4px] bg-current absolute -right-[3px] top-[1.5px] rounded-r-sm" />
                <div className="w-[11px] h-[5px] bg-current absolute top-[1px] left-[1px] rounded-[1px]" />
            </div>
        </div>
    </div>
);

// Android punch-hole status bar — 10px centred camera hole
const AndroidStatusBar = ({ color }: { color: string }) => (
    <div className="w-full flex items-center justify-between flex-shrink-0 relative" style={{ height: 28, paddingInline: 16, color }}>
        <span className="text-[10px] font-medium tabular-nums">22:50</span>
        {/* Punch-hole camera */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[9px] w-[10px] h-[10px] bg-black rounded-full" />
        <div className="flex gap-1.5 items-center opacity-85">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L1 3C5 1 19 1 23 3L12 21Z" /></svg>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22H22V2L2 22Z" /></svg>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22H15.67C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z" /></svg>
        </div>
    </div>
);

// Shared phone frame wrapper — accepts explicit device key
const PhoneFrame = ({
    deviceKey,
    s,
}: {
    deviceKey: keyof typeof DEVICE_SPECS;
    s: Record<string, string>;
}) => {
    const spec = DEVICE_SPECS[deviceKey];
    const isIOS = deviceKey === 'ios';
    return (
        <div
            className="relative flex flex-col overflow-hidden shadow-2xl shrink-0"
            style={{
                width: spec.width,
                height: spec.height,
                borderRadius: spec.radius,
                borderWidth: spec.borderWidth,
                borderStyle: 'solid',
                borderColor: s.outlineVariant,
                backgroundColor: s.surfaceContainerLowest,
                color: s.onBg,
            }}
        >
            {isIOS ? <IOSStatusBar color={s.onBg} /> : <AndroidStatusBar color={s.onBg} />}
            {isIOS ? <IOSScreenContent s={s} /> : <AndroidScreenContent s={s} />}
        </div>
    );
};

// ---------------------------------------------------------------------------
// iOS Screen Content
// ---------------------------------------------------------------------------
 
const IOSScreenContent = ({ s }: { s: Record<string, string> }) => (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col px-6 pt-2">
        {/* Nav row */}
        <div className="flex justify-between items-center mb-5">
            <button className="p-1 rounded-full hover:opacity-70" style={{ color: s.onBg }} aria-label="Go back" title="Go back">
                <ArrowLeft size={18} />
            </button>
            <button className="p-1 rounded-full hover:opacity-70" style={{ color: s.onBg }} aria-label="More options" title="More options">
                <MoreVertical size={18} />
            </button>
        </div>

        <h2 className="text-[30px] leading-tight text-center mb-5 font-display text-transform-primary" style={{ color: s.primary }}>
            Monstera<br />Siltepecana
        </h2>

        {/* Hero image */}
        <div
            className="w-[200px] h-[200px] mx-auto rounded-[70px] shadow-inner mb-5 flex items-center justify-center text-[90px] overflow-hidden relative"
            style={{ backgroundColor: s.surfaceVariant }}
        >
            <div className="absolute inset-0 opacity-10" style={{ backgroundColor: s.shadow }} />
            🌿
        </div>

        {/* Attribute chips */}
        <div className="flex gap-2 mb-6">
            {[
                { title: 'Most Popular', desc: 'A popular plant in the community', icon: '🌟' },
                { title: 'Faux Ready', desc: 'No maintenance required', icon: '🌲' },
                { title: 'Easy Care', desc: 'Perfect for beginners', icon: '✨' },
            ].map((c, i) => (
                <div
                    key={i}
                    className="flex-1 rounded-2xl p-2 pb-2.5 flex flex-col gap-1 shadow-sm"
                    style={{ backgroundColor: s.tertiaryContainer, color: s.onTertiaryContainer }}
                >
                    <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] mb-0.5"
                        style={{ backgroundColor: s.onTertiaryContainer + '1A' }}
                    >{c.icon}</div>
                    <span className="text-[9px] font-bold leading-tight">{c.title}</span>
                    <span className="text-[7px] leading-tight opacity-75 line-clamp-2">{c.desc}</span>
                </div>
            ))}
        </div>

        {/* Care rows */}
        <h3 className="text-[14px] mb-3 font-display text-transform-primary" style={{ color: s.onBg }}>Care</h3>
        <div className="flex flex-col gap-3 text-[11px] font-medium" style={{ color: s.onSurfaceVariant }}>
            {[
                { icon: <Droplet size={16} />, label: 'Water every 1–2 weeks' },
                { icon: <Leaf size={16} />, label: 'Feed once monthly' },
                { icon: <Sun size={16} />, label: 'Moderate indirect light' },
            ].map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span style={{ color: s.onSurfaceVariant }}>{row.icon}</span>
                    <span>{row.label}</span>
                </div>
            ))}
        </div>

        {/* iOS Home indicator */}
        <div className="mt-auto pt-4 flex justify-center">
            <div className="w-28 h-1 rounded-full" style={{ backgroundColor: s.onBg + '30' }} />
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Android Screen Content
// ---------------------------------------------------------------------------
 
const AndroidScreenContent = ({ s }: { s: Record<string, string> }) => (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col px-5 pt-3 gap-3">
        {/* M3 Top App Bar */}
        <div className="flex justify-between items-center mb-1">
            <h2 className="text-[26px] font-display text-transform-primary font-normal tracking-tight">Today</h2>
            <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: s.secondaryContainer, color: s.onSecondaryContainer }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 400" }}>person</span>
            </div>
        </div>

        {/* M3 Banner card */}
        <div
            className="rounded-[16px] p-4 flex gap-3"
            style={{ backgroundColor: s.tertiaryContainer, color: s.onTertiaryContainer }}
        >
            <Leaf size={14} className="mt-0.5 shrink-0" />
            <p className="text-[11px] leading-snug font-medium">During winter, your plants slow down and need less water</p>
        </div>

        {/* Room cards */}
        {[
            { title: 'Living Room', icon: '🪴', tasks: [['Water', 'hoya australis'], ['Feed', 'monstera siltepecana']] },
            { title: 'Kitchen', icon: '🌿', tasks: [['Water', 'clinacanthus nutans'], ['Water', 'hoya australis']] },
            { title: 'Bedroom', icon: '🌵', tasks: [['Feed', 'monstera siltepecana'], ['Water', 'opuntia basilaris']] },
        ].map((room, i) => (
            <div
                key={i}
                className="rounded-[16px] p-4 relative overflow-hidden flex flex-col gap-3"
                style={{ backgroundColor: s.primaryContainer, color: s.onPrimaryContainer }}
            >
                <h3 className="text-[13px] font-semibold" style={{ color: s.primary }}>{room.title}</h3>
                <div className="flex flex-col gap-2 relative z-10 w-[65%]">
                    {room.tasks.map((task, j) => (
                        <div key={j} className="flex items-start gap-2">
                            {/* M3 checkbox shape */}
                            <div
                                className="w-[14px] h-[14px] rounded-[3px] flex items-center justify-center mt-[1px] shrink-0"
                                style={{ backgroundColor: s.primary, color: s.onPrimary }}
                            >
                                <Check size={9} strokeWidth={3.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-medium leading-none mb-0.5">{task[0]}</span>
                                <span className="text-[9px] italic opacity-60 leading-none">{task[1]}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute -bottom-3 -right-2 text-[70px] opacity-90 z-0">
                    {room.icon}
                </div>
            </div>
        ))}

        {/* Android nav gesture bar */}
        <div className="mt-auto pt-3 flex justify-center">
            <div className="w-24 h-1 rounded-full" style={{ backgroundColor: s.onBg + '30' }} />
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Tablet Screen Content — Medium (600dp+, 8-col, nav rail)
// ---------------------------------------------------------------------------
const TabletScreenContent = ({ s }: { s: Record<string, string> }) => (
    <div className="flex flex-1 overflow-hidden">
        {/* M3 Navigation Rail — 80dp wide */}
        <div
            className="flex flex-col items-center py-4 gap-6 shrink-0"
            style={{ width: 72, backgroundColor: s.surfaceContainerHigh, color: s.onSurfaceVariant }}
        >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: s.primaryContainer, color: s.onPrimaryContainer }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1, 'wght' 400" }}>eco</span>
            </div>
            {['home', 'search', 'notifications', 'person'].map((icon) => (
                <div key={icon} className="flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 0, 'wght' 400" }}>{icon}</span>
                    <span className="text-[8px] text-transform-secondary">{icon}</span>
                </div>
            ))}
        </div>

        {/* Main content — 2 column card grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-5" style={{ backgroundColor: s.surfaceContainerLow }}>
            <h2 className="text-[22px] tracking-tight font-display text-transform-primary" style={{ color: s.onBg }}>My Garden</h2>

            {/* Banner */}
            <div className="rounded-[16px] p-4 flex gap-3" style={{ backgroundColor: s.tertiaryContainer, color: s.onTertiaryContainer }}>
                <Leaf size={16} className="mt-0.5 shrink-0" />
                <p className="text-[12px] leading-snug font-medium">Winter care: reduce watering frequency for all indoor plants.</p>
            </div>

            {/* 2-col card grid */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { title: 'Living Room', icon: '🪴', count: 4 },
                    { title: 'Kitchen', icon: '🌿', count: 3 },
                    { title: 'Bedroom', icon: '🌵', count: 5 },
                    { title: 'Bathroom', icon: '🌺', count: 2 },
                ].map((room, i) => (
                    <div key={i} className="rounded-[16px] p-4 relative overflow-hidden" style={{ backgroundColor: s.primaryContainer, color: s.onPrimaryContainer }}>
                        <h3 className="text-[14px] font-semibold mb-1 font-display text-transform-primary" style={{ color: s.primary }}>{room.title}</h3>
                        <p className="text-[11px] opacity-70">{room.count} plants</p>
                        <div className="absolute -bottom-2 -right-1 text-[50px] opacity-80">{room.icon}</div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="flex gap-3">
                {['Water All', 'Schedule', 'Add Plant'].map((label, i) => (
                    <button
                        key={i}
                        className="flex-1 rounded-full py-2.5 text-[11px] font-bold text-transform-secondary tracking-wider transition-colors"
                        style={{
                            backgroundColor: i === 0 ? s.primary : 'transparent',
                            color: i === 0 ? s.onPrimary : s.primary,
                            border: i === 0 ? 'none' : `1px solid ${s.outlineVariant}`,
                        }}
                    >{label}</button>
                ))}
            </div>
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Desktop Screen Content — Expanded (840dp+, 12-col, nav drawer + detail)
// ---------------------------------------------------------------------------
const DesktopScreenContent = ({ s }: { s: Record<string, string> }) => (
    <div className="flex flex-1 overflow-hidden">
        {/* M3 Navigation Drawer — persistent, 256dp wide */}
        <div
            className="flex flex-col py-2 px-1 gap-1 shrink-0 overflow-y-auto no-scrollbar"
            style={{ width: 200, backgroundColor: s.surfaceContainerHigh, color: s.onSurfaceVariant }}
        >
            <div className="flex items-center gap-2 px-3 py-2 mb-4">
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.primary, fontVariationSettings: "'FILL' 1, 'wght' 400" }}>eco</span>
                <span className="text-[14px] font-bold font-display text-transform-primary" style={{ color: s.onBg }}>Plantify</span>
            </div>
            {[
                { icon: 'home', label: 'Home', active: true },
                { icon: 'search', label: 'Explore', active: false },
                { icon: 'calendar_month', label: 'Schedule', active: false },
                { icon: 'notifications', label: 'Alerts', active: false },
                { icon: 'settings', label: 'Settings', active: false },
            ].map((item) => (
                <div
                    key={item.icon}
                    className="flex items-center gap-3 px-3 py-2 rounded-full text-[12px] font-medium cursor-pointer transition-colors"
                    style={{
                        backgroundColor: item.active ? s.secondaryContainer : 'transparent',
                        color: item.active ? s.onSecondaryContainer : s.onSurfaceVariant,
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: `'FILL' ${item.active ? 1 : 0}, 'wght' 400` }}>{item.icon}</span>
                    {item.label}
                </div>
            ))}
        </div>

        {/* Main content — 3 column card grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 flex flex-col gap-6" style={{ backgroundColor: s.surfaceContainerLow }}>
            <div className="flex items-center justify-between">
                <h2 className="text-[24px] tracking-tight font-display text-transform-primary" style={{ color: s.onBg }}>My Garden</h2>
                <div className="flex gap-2">
                    <button className="rounded-full px-4 py-2 text-[11px] font-bold text-transform-secondary tracking-wider" style={{ backgroundColor: s.primary, color: s.onPrimary }}>Add Plant</button>
                </div>
            </div>

            {/* Banner */}
            <div className="rounded-[16px] p-4 flex gap-3" style={{ backgroundColor: s.tertiaryContainer, color: s.onTertiaryContainer }}>
                <Leaf size={16} className="mt-0.5 shrink-0" />
                <p className="text-[12px] leading-snug font-medium">Winter care tip: Most houseplants need 30-50% less water during the cold months.</p>
            </div>

            {/* 3-col card grid */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { title: 'Living Room', icon: '🪴', count: 4, tasks: 2 },
                    { title: 'Kitchen', icon: '🌿', count: 3, tasks: 1 },
                    { title: 'Bedroom', icon: '🌵', count: 5, tasks: 3 },
                    { title: 'Bathroom', icon: '🌺', count: 2, tasks: 0 },
                    { title: 'Office', icon: '🌱', count: 6, tasks: 2 },
                    { title: 'Balcony', icon: '🌻', count: 3, tasks: 1 },
                ].map((room, i) => (
                    <div key={i} className="rounded-[16px] p-4 relative overflow-hidden" style={{ backgroundColor: s.primaryContainer, color: s.onPrimaryContainer }}>
                        <h3 className="text-[13px] font-semibold mb-1 font-display text-transform-primary" style={{ color: s.primary }}>{room.title}</h3>
                        <p className="text-[11px] opacity-70 mb-1">{room.count} plants</p>
                        {room.tasks > 0 && (
                            <span className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: s.primary, color: s.onPrimary }}>
                                {room.tasks} tasks
                            </span>
                        )}
                        <div className="absolute -bottom-2 -right-1 text-[44px] opacity-80">{room.icon}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* Detail side panel — surfaceContainerLow */}
        <div
            className="shrink-0 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 border-l"
            style={{ width: 220, backgroundColor: s.surfaceContainerHigh, borderColor: s.outlineVariant, color: s.onSurfaceVariant }}
        >
            <h3 className="text-[14px] font-semibold font-display text-transform-primary" style={{ color: s.onBg }}>Today&apos;s Tasks</h3>
            {[
                { action: 'Water', plant: 'Monstera', room: 'Living Room' },
                { action: 'Feed', plant: 'Hoya', room: 'Kitchen' },
                { action: 'Prune', plant: 'Ficus', room: 'Bedroom' },
                { action: 'Repot', plant: 'Cactus', room: 'Bedroom' },
            ].map((task, i) => (
                <div key={i} className="flex items-start gap-2">
                    <div className="w-[14px] h-[14px] rounded-[3px] flex items-center justify-center mt-0.5 shrink-0" style={{ backgroundColor: s.primary, color: s.onPrimary }}>
                        <Check size={9} strokeWidth={3.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium leading-tight">{task.action} {task.plant}</span>
                        <span className="text-[9px] opacity-60">{task.room}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Preview Selector — Window Class (primary) + Platform sub-toggle (compact)
// ---------------------------------------------------------------------------
const PreviewSelector = ({
    windowClass,
    onWindowClassChange,
    platform,
    onPlatformChange,
    scheme,
}: {
    windowClass: WindowClass;
    onWindowClassChange: (wc: WindowClass) => void;
    platform: DevicePlatform;
    onPlatformChange: (p: DevicePlatform) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scheme: any;
}) => {
    const activeBg = hexFromArgb(scheme.primary);
    const activeText = hexFromArgb(scheme.onPrimary);
    const inactiveText = hexFromArgb(scheme.onSurface);
    const trackBg = hexFromArgb(scheme.surfaceContainerHigh);
    const border = hexFromArgb(scheme.outlineVariant);

    const wcInfo = WINDOW_CLASSES.find(w => w.id === windowClass)!;

    return (
        <div className="flex flex-col items-center gap-3 mb-4">
            {/* Window Class tier */}
            <div
                className="flex rounded-full p-[3px] gap-[3px]"
                style={{ backgroundColor: trackBg, border: `1px solid ${border}` }}
            >
                {WINDOW_CLASSES.map(({ id, label }) => {
                    const isActive = windowClass === id;
                    return (
                        <button
                            key={id}
                            onClick={() => onWindowClassChange(id)}
                            className="px-5 py-2 rounded-full text-[12px] font-bold text-transform-secondary tracking-widest transition-all duration-200"
                            style={{
                                backgroundColor: isActive ? activeBg : 'transparent',
                                color: isActive ? activeText : inactiveText,
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Platform sub-toggle — only visible in Compact */}
            {windowClass === 'compact' && (
                <div
                    className="flex rounded-full p-[2px] gap-[2px]"
                    style={{ backgroundColor: hexFromArgb(scheme.surfaceContainer), border: `1px solid ${border}` }}
                >
                    {([
                        { id: 'ios' as DevicePlatform, emoji: '🍎', label: 'iOS' },
                        { id: 'android' as DevicePlatform, emoji: '🤖', label: 'Android' },
                        { id: 'both' as DevicePlatform, emoji: '⚡', label: 'Compare' },
                    ]).map(({ id, emoji, label }) => {
                        const isActive = platform === id;
                        return (
                            <button
                                key={id}
                                onClick={() => onPlatformChange(id)}
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold text-transform-secondary tracking-widest transition-all duration-200"
                                style={{
                                    backgroundColor: isActive ? hexFromArgb(scheme.secondaryContainer) : 'transparent',
                                    color: isActive ? hexFromArgb(scheme.onSecondaryContainer) : inactiveText,
                                }}
                            >
                                <span className="text-[12px] leading-none">{emoji}</span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Spec badge */}
            <div
                className="flex items-center gap-2 text-[10px] font-dev text-transform-tertiary px-3 py-1 rounded-sm"
                style={{ color: hexFromArgb(scheme.onSurfaceVariant), backgroundColor: hexFromArgb(scheme.surfaceContainerLow) }}
            >
                <span>{wcInfo.desc}</span>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// PreviewTabMockup — main export
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PreviewTabMockup = ({ scheme }: { scheme: any }) => {
    const [windowClass, setWindowClass] = useState<WindowClass>('compact');
    const [platform, setPlatform] = useState<DevicePlatform>('ios');

    const s: Record<string, string> = {
        bg: hexFromArgb(scheme.surface),
        onBg: hexFromArgb(scheme.onSurface),
        primary: hexFromArgb(scheme.primary),
        onPrimary: hexFromArgb(scheme.onPrimary),
        primaryContainer: hexFromArgb(scheme.primaryContainer),
        onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),
        secondaryContainer: hexFromArgb(scheme.secondaryContainer),
        onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),
        tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
        onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),
        outlineVariant: hexFromArgb(scheme.outlineVariant),
        surfaceVariant: hexFromArgb(scheme.surfaceVariant),
        onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),
        surfaceContainerLowest: hexFromArgb(scheme.surfaceContainerLowest),
        surfaceContainerLow: hexFromArgb(scheme.surfaceContainerLow),
        surfaceContainer: hexFromArgb(scheme.surfaceContainer),
        surfaceContainerHigh: hexFromArgb(scheme.surfaceContainerHigh),
        surfaceContainerHighest: hexFromArgb(scheme.surfaceContainerHighest),
        shadow: hexFromArgb(scheme.shadow),
    };

    const isBoth = platform === 'both';

    return (
        <div className="w-full flex flex-col items-center">
            {/* ── Selector ────────────────────────────────── */}
            <PreviewSelector
                windowClass={windowClass}
                onWindowClassChange={setWindowClass}
                platform={platform}
                onPlatformChange={setPlatform}
                scheme={scheme}
            />

            {/* ── Preview Frame ───────────────────────────── */}
            <motion.div
                key={`${windowClass}-${platform}`}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="flex items-start gap-8"
            >
                {windowClass === 'compact' ? (
                    /* ── Compact: phone frames ─────────────── */
                    isBoth ? (
                        <>
                            <div className="flex flex-col items-center gap-3">
                                <PhoneFrame deviceKey="android" s={s} />
 <p className="text-[9px] font-dev text-transform-tertiary opacity-50 tracking-widest" style={{ color: s.onBg }}>
                                    {DEVICE_SPECS.android.name} · {DEVICE_SPECS.android.spec}
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <PhoneFrame deviceKey="ios" s={s} />
 <p className="text-[9px] font-dev text-transform-tertiary opacity-50 tracking-widest" style={{ color: s.onBg }}>
                                    {DEVICE_SPECS.ios.name} · {DEVICE_SPECS.ios.spec}
                                </p>
                            </div>
                        </>
                    ) : (
                        <PhoneFrame deviceKey={platform as keyof typeof DEVICE_SPECS} s={s} />
                    )
                ) : windowClass === 'medium' ? (
                    /* ── Medium: tablet frame ──────────────── */
                    <div
                        className="relative flex flex-col overflow-hidden shadow-2xl rounded-[20px]"
                        style={{
                            width: 600,
                            height: 820,
                            border: `6px solid ${s.outlineVariant}`,
                            backgroundColor: s.surfaceContainerLowest,
                            color: s.onBg,
                        }}
                    >
                        {/* Simple tablet status bar */}
                        <div className="h-7 w-full flex items-center justify-between px-5 shrink-0 text-[10px] font-medium" style={{ color: s.onBg }}>
                            <span className="tabular-nums">22:50</span>
                            <div className="flex gap-1.5 items-center opacity-80">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21L1 3C5 1 19 1 23 3L12 21Z" /></svg>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22H22V2L2 22Z" /></svg>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22H15.67C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z" /></svg>
                            </div>
                        </div>
                        <TabletScreenContent s={s} />
                    </div>
                ) : (
                    /* ── Expanded: desktop frame ───────────── */
                    <div
                        className="relative flex flex-col overflow-hidden shadow-2xl rounded-[12px]"
                        style={{
                            width: 1040,
                            height: 680,
                            border: `4px solid ${s.outlineVariant}`,
                            backgroundColor: s.surfaceContainerLowest,
                            color: s.onBg,
                        }}
                    >
                        {/* Desktop title bar */}
                        <div className="h-8 w-full flex items-center px-4 gap-2 shrink-0 border-b" style={{ backgroundColor: s.surfaceContainerHighest, borderColor: s.outlineVariant }}>
                            <div className="flex gap-1.5">
                                <div className="w-[10px] h-[10px] rounded-full bg-red-400" />
                                <div className="w-[10px] h-[10px] rounded-full bg-yellow-400" />
                                <div className="w-[10px] h-[10px] rounded-full bg-green-400" />
                            </div>
                            <span className="text-[10px] font-medium opacity-50 ml-2 flex-1 text-center" style={{ color: s.onSurfaceVariant }}>Plantify — Material 3 Desktop</span>
                        </div>
                        <DesktopScreenContent s={s} />
                    </div>
                )}
            </motion.div>

            {/* ── Scale legend ─────────────────────────────── */}
            {windowClass === 'compact' && !isBoth && (
                <p
                    className="mt-5 text-[10px] font-dev text-transform-tertiary opacity-40"
                    style={{ color: hexFromArgb(scheme.onSurface) }}
                >
                    1px ≈ 1.09{platform === 'ios' ? 'pt' : 'dp'} at this preview scale
                </p>
            )}
        </div>
    );
};


export default function ColorsFoundationPage() {
    const params = useParams();
    const themeId = (params?.theme as string) || 'metro';
    const [platform, setPlatform] = useState<Platform>('web');
    useTheme(); // ThemeContext provider required for Inspector
    const [seedColor, setSeedColor] = useState('#576500');
    const [seedImage, setSeedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTabState] = useState('preview');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab');
            if (tab) setActiveTabState(tab);
        }
    }, []);

    const setActiveTab = (tab: string) => {
        setActiveTabState(tab);
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            params.set('tab', tab);
            window.history.replaceState(null, '', `?${params.toString()}`);
        }
    };
    // const [isMobileView, setIsMobileView] = useState(false);
    const [schemeVariant, setSchemeVariant] = useState('TonalSpot');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [contrastLevel, _setContrastLevel] = useState('0.0');

    // TYPOGRAPHY OVERRIDE LOGIC (Note: these were previously loaded but not used in the Colors foundation)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeFont, setActiveFont] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeTransform, setActiveTransform] = useState<'uppercase' | 'lowercase' | 'capitalize' | 'none'>('uppercase');
    const [isLoaded, setIsLoaded] = useState(false);

    React.useEffect(() => {
        const loadInitialSettings = async () => {
            try {
                // Load saved colors
                const colorRes = await fetch(`/api/colors/publish?theme=${themeId}`);
                if (colorRes.ok) {
                    const colorResult = await colorRes.json();
                    if (colorResult.success && colorResult.data && colorResult.data.colors) {
                        const savedColors = colorResult.data.colors;
                        if (savedColors.seedColor) setSeedColor(savedColors.seedColor);
                        if (savedColors.schemeVariant) setSchemeVariant(savedColors.schemeVariant);
                        if (savedColors.customOverrides) setCustomOverrides(savedColors.customOverrides);
                    }
                }

                // Load saved typography
                const res = await fetch(`/api/typography/publish?theme=${themeId}`);
                if (res.ok) {
                    const result = await res.json();
                    if (result.success && result.data) {
                        if (result.data.primaryFont) setActiveFont(result.data.primaryFont);
                        if (result.data.primaryTransform) setActiveTransform(result.data.primaryTransform as 'uppercase' | 'lowercase' | 'capitalize' | 'none');
                    }
                }
            } catch (err) {
                console.error("Failed to load existing settings:", err);
            } finally {
                setIsLoaded(true);
            }
        };
        if (!isLoaded) loadInitialSettings();
    }, [isLoaded, themeId]);

    const handleImageClick = async (src: string) => {
        setSeedImage(src);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;
        img.onload = async () => {
            const color = await sourceColorFromImage(img);
            setSeedColor(hexFromArgb(color));
        };
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event: ProgressEvent<FileReader>) => {
                const src = event.target?.result as string;
                setSeedImage(src);
                const img = new Image();
                img.src = src;
                img.onload = async () => {
                    const color = await sourceColorFromImage(img);
                    setSeedColor(hexFromArgb(color));
                };
            };
            reader.readAsDataURL(file);
        }
    };

    // Custom overrides
    const [customOverrides, setCustomOverrides] = useState<Record<string, string>>({
        secondary: '',
        tertiary: '',
        error: '',
        neutral: '',
        neutralVariant: ''
    });

    const handleOverride = (key: string, value: string) => {
        setCustomOverrides(prev => ({ ...prev, [key]: value }));
    };

    // Generate the M3 Theme
    const { lightScheme, darkScheme, palettes } = useMemo(() => {
        let argb;
        try { argb = argbFromHex(seedColor); } catch { argb = argbFromHex('#FF68A5'); }

        const hct = Hct.fromInt(argb);

        const schemeMap: Record<string, typeof SchemeTonalSpot> = {
            'TonalSpot': SchemeTonalSpot,
            'Neutral': SchemeNeutral,
            'Vibrant': SchemeVibrant,
            'Expressive': SchemeExpressive,
            'Rainbow': SchemeRainbow,
            'FruitSalad': SchemeFruitSalad,
            'Monochrome': SchemeMonochrome,
            'Fidelity': SchemeFidelity,
            'Content': SchemeContent,
        };

        const SchemeClass = schemeMap[schemeVariant] || SchemeTonalSpot;
        const contrast = parseFloat(contrastLevel);

        const schemeLight = new SchemeClass(hct, false, contrast);
        const schemeDark = new SchemeClass(hct, true, contrast);

        const palettes: Record<string, TonalPalette> = {
            primary: schemeLight.primaryPalette,
            secondary: schemeLight.secondaryPalette,
            tertiary: schemeLight.tertiaryPalette,
            error: schemeLight.errorPalette,
            neutral: schemeLight.neutralPalette,
            neutralVariant: schemeLight.neutralVariantPalette
        };

        // Process custom overrides
        if (customOverrides) {
            Object.keys(customOverrides).forEach((paletteKey) => {
                const hex = customOverrides[paletteKey];
                if (hex && /^#[0-9A-F]{6}$/i.test(hex)) {
                    try {
                        const customPalette = TonalPalette.fromInt(argbFromHex(hex));
                        palettes[paletteKey] = customPalette;

                        // We must inject the custom palette into both light and dark schemes
                        // This causes all DynamicColor getters (e.g. schemeLight.primary) to recalculate seamlessly
                        (schemeLight as unknown as Record<string, unknown>)[`${paletteKey}Palette`] = customPalette;
                        (schemeDark as unknown as Record<string, unknown>)[`${paletteKey}Palette`] = customPalette;
                    } catch (e) {
                        console.error(`Invalid custom override hex for ${paletteKey}:`, hex, e);
                    }
                }
            });
        }

        return {
            lightScheme: schemeLight,
            darkScheme: schemeDark,
            palettes
        };
    }, [seedColor, schemeVariant, contrastLevel, customOverrides]);

    // Inject M3 CSS Variables dynamically to power the Tailwind previews
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const generateCssVars = (scheme: any) => {
            const m3Colors = {
                primary: hexFromArgb(scheme.primary),
                "on-primary": hexFromArgb(scheme.onPrimary),
                "primary-container": hexFromArgb(scheme.primaryContainer),
                "on-primary-container": hexFromArgb(scheme.onPrimaryContainer),

                secondary: hexFromArgb(scheme.secondary),
                "on-secondary": hexFromArgb(scheme.onSecondary),
                "secondary-container": hexFromArgb(scheme.secondaryContainer),
                "on-secondary-container": hexFromArgb(scheme.onSecondaryContainer),

                tertiary: hexFromArgb(scheme.tertiary),
                "on-tertiary": hexFromArgb(scheme.onTertiary),
                "tertiary-container": hexFromArgb(scheme.tertiaryContainer),
                "on-tertiary-container": hexFromArgb(scheme.onTertiaryContainer),

                error: hexFromArgb(scheme.error),
                "on-error": hexFromArgb(scheme.onError),
                "error-container": hexFromArgb(scheme.errorContainer),
                "on-error-container": hexFromArgb(scheme.onErrorContainer),

                background: hexFromArgb(scheme.background),
                "on-background": hexFromArgb(scheme.onBackground),

                surface: hexFromArgb(scheme.surface),
                "surface-dim": hexFromArgb(scheme.surfaceDim),
                "surface-bright": hexFromArgb(scheme.surfaceBright),
                "surface-container-lowest": hexFromArgb(scheme.surfaceContainerLowest),
                "surface-container-low": hexFromArgb(scheme.surfaceContainerLow),
                "surface-container": hexFromArgb(scheme.surfaceContainer),
                "surface-container-high": hexFromArgb(scheme.surfaceContainerHigh),
                "surface-container-highest": hexFromArgb(scheme.surfaceContainerHighest),
                "on-surface": hexFromArgb(scheme.onSurface),
                "surface-variant": hexFromArgb(scheme.surfaceVariant),
                "on-surface-variant": hexFromArgb(scheme.onSurfaceVariant),

                "inverse-surface": hexFromArgb(scheme.inverseSurface),
                "inverse-on-surface": hexFromArgb(scheme.inverseOnSurface),
                "inverse-primary": hexFromArgb(scheme.inversePrimary),

                outline: hexFromArgb(scheme.outline),
                "outline-variant": hexFromArgb(scheme.outlineVariant),

                shadow: hexFromArgb(scheme.shadow),
                scrim: hexFromArgb(scheme.scrim),
            };

            let css = '';
            for (const [key, val] of Object.entries(m3Colors)) {
                css += `    --md-sys-color-${key}: ${val};\n`;
            }
            return css;
        };

        const cssOutput = `
            :root, [data-zap-theme="metro"] {
${generateCssVars(lightScheme)}
            }
            .dark, [data-theme="dark"] {
${generateCssVars(darkScheme)}
            }
        `;

        let styleTag = document.getElementById('m3-dynamic-theme');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'm3-dynamic-theme';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = cssOutput;

        return () => {
            // Optional: clean up when unmounting if this becomes a problem
        };
    }, [lightScheme, darkScheme, palettes]);

    const handlePublish = async () => {
        setIsSubmitting(true);
        const styleTag = document.getElementById('m3-dynamic-theme');
        const cssOutput = styleTag ? styleTag.innerHTML : '';
        
        try {
            const res = await fetch('/api/colors/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme: themeId,
                    cssOutput: cssOutput,
                    colors: {
                        seedColor,
                        schemeVariant,
                        customOverrides
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Colors saved! Seed: ${seedColor} (${schemeVariant})`);
            } else {
                alert("Failed to save color settings: " + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error("Error saving colors:", err);
            alert("Network error saving colors.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const COLOR_TABS: TabItem[] = [
        { id: 'preview', label: 'PREVIEW' },
        { id: 'colors', label: 'COLORS' },
    ];

    return (
        <LaboratoryTemplate
            componentName="Color"
            tier="L1 TOKEN"
            filePath="src/zap/foundations/colors/index.tsx"
            headerMode={
                <ThemeHeader
                    title={activeTab === 'preview' ? 'Preview Mockup' : 'Color Matrices'}
                    breadcrumb={`Zap Design Engine / ${themeId} / Foundations`}
                    badge={activeTab === 'preview' ? 'Experimental Component Preview' : 'L1: Core Color Map'}
                    tabs={COLOR_TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    liveIndicator={activeTab === 'preview'}
                    platform={platform}
                    setPlatform={setPlatform}
                />
            }
            inspectorConfig={{
                title: "Color Architect",
                width: 380,
                content: (
                    <div className="pt-2 pb-8 flex flex-col w-full">
                        {/* 1. Seed Color Image Chooser Section */}
                    <InspectorAccordion title="Seed Color" icon="palette" defaultOpen={true}>
                        <div className="space-y-4 pt-1 pb-2">
                            <p className="text-[11px] font-dev text-transform-tertiary text-on-surface-variant leading-relaxed">Extract from image or hex.</p>

                            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
                                {[1, 2, 3, 4, 5, 6].map((num) => {
                                    const src = `/m3-seeds/content_based_color_scheme_${num}.png`;
                                    const isSelected = seedImage === src;
                                    return (
                                        <button
                                            key={num}
                                            onClick={() => handleImageClick(src)}
                                            className={`relative w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border-2 transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-black/10'}`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={src} alt={`Seed image ${num}`} className="w-full h-full object-cover" />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Upload seed image"
                                    className="w-16 h-16 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-layer-hover transition-colors flex-shrink-0 shadow-sm"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" title="Upload image file" />
                            </div>

                            <div className="mt-2 p-3.5 rounded-[16px] flex items-center justify-between shadow-sm transition-colors bg-secondary-container">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full shadow-inner flex-shrink-0" style={{ backgroundColor: seedColor }}>
                                        <input type="color" value={seedColor} onChange={(e) => { setSeedColor(e.target.value); setSeedImage(null); }} title="Select custom seed color" className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-medium font-body text-transform-secondary" style={{ color: hexFromArgb(lightScheme.onSecondaryContainer) }}>Seed color</span>
                                        <span className="text-[10px] font-dev text-transform-tertiary leading-tight opacity-80" style={{ color: hexFromArgb(lightScheme.onSecondaryContainer) }}>Material 3 seed generator.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </InspectorAccordion>

                    {/* 2. Core Colors Overrides */}
                    <InspectorAccordion title="Core Overrides" icon="layers">
                        <div className="space-y-4 pt-1 pb-2">
                            <p className="text-[11px] font-dev text-transform-tertiary text-on-surface-variant">Override scheme keys.</p>

                            <div className="flex flex-col gap-2">
                                <CoreColorRow label="Primary" description="New seed color" color={seedColor} onChange={(v) => { setSeedColor(v); setSeedImage(null); }} isPrimary={true} />
                                <CoreColorRow label="Secondary" description="" color={customOverrides.secondary} defaultColor={hexFromArgb(palettes.secondary.tone(40))} onChange={(v) => handleOverride('secondary', v)} />
                                <CoreColorRow label="Tertiary" description="" color={customOverrides.tertiary} defaultColor={hexFromArgb(palettes.tertiary.tone(40))} onChange={(v) => handleOverride('tertiary', v)} />
                                <CoreColorRow label="Error" description="" color={customOverrides.error} defaultColor={hexFromArgb(palettes.error.tone(40))} onChange={(v) => handleOverride('error', v)} />
                                <CoreColorRow label="Neutral" description="BG/Surfaces" color={customOverrides.neutral} defaultColor={hexFromArgb(palettes.neutral.tone(40))} onChange={(v) => handleOverride('neutral', v)} />
                                <CoreColorRow label="Neutral Variant" description="Medium emphasis" color={customOverrides.neutralVariant} defaultColor={hexFromArgb(palettes.neutralVariant.tone(40))} onChange={(v) => handleOverride('neutralVariant', v)} />
                            </div>
                        </div>
                    </InspectorAccordion>

                    {/* 3. Style */}
                    <InspectorAccordion title="Theme Style" icon={Sparkles}>
                        <div className="space-y-4 pt-1 pb-2">
                            <div className="flex flex-wrap gap-2">
                                    {SCHEME_VARIANTS.map((variant) => {
                                        const isSelected = schemeVariant === variant.id;
                                        return (
                                            <Button
                                                key={variant.id}
                                                onClick={() => setSchemeVariant(variant.id)}
                                                visualStyle={isSelected ? 'tonal' : 'outline'}
                                                color="primary"
                                                size="compact"
                                                className="gap-1.5"
                                            >
                                                {variant.label}
                                                {variant.hasSparkle && <Sparkles className="opacity-80 ml-0.5 size-4" />}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </InspectorAccordion>
                </div>
                ),
                footer: (
                    <ThemePublisher 
                        theme={themeId}
                        onPublish={handlePublish}
                        isLoading={isSubmitting}
                        filePath="src/zap/foundations/colors/index.tsx"
                    />
                )
            }}
        >
            <div className="flex-1 w-full flex flex-col">


                {activeTab === 'preview' && (
                    <div className="w-full pb-20">
                        <PreviewTabMockup scheme={lightScheme} />
                    </div>
                )}
                {activeTab === 'colors' && (
                    <div className="w-full pb-20 flex flex-col gap-12">
                        <ThemeGrid scheme={lightScheme} isDark={false} title="Light Theme" />
                        <ThemeGrid scheme={darkScheme} isDark={true} title="Dark Theme" />
                        <FixedGrid palettes={palettes} scheme={lightScheme} />
                        <TonalMatrixGrid palettes={palettes} scheme={lightScheme} />
                    </div>
                )}

            </div>
        </LaboratoryTemplate>
    );
}
