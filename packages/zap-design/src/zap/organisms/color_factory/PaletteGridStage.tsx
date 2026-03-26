'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { hexFromArgb, Hct } from "@material/material-color-utilities";

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
            <div className="absolute bottom-3 left-3 text-[10.5px] font-dev text-transform-tertiary opacity-100 cursor-pointer" onClick={cycleFormat} title="Click to toggle format">{displayValue}</div>
            <span className="text-[11px] font-dev text-transform-tertiary absolute bottom-3 right-3 opacity-90">{toneLabel}</span>
            <div className="absolute top-3 right-3 flex gap-1 opacity-100">
                <button onClick={() => onCopy(displayValue)} className="p-1 rounded-md hover:bg-black/10 active:bg-black/20 flex items-center justify-center min-w-[24px] min-h-[24px]">
                    {copied === displayValue ? <span className="text-[9px] font-bold px-1 whitespace-nowrap">Copied!</span> : <CopyIcon />}
                </button>
                {twClass && (() => {
                    const twCopyContent = cssVar ? `${twClass}\\n${cssVar}` : twClass;
                    return (
                        <button onClick={() => onCopy(twCopyContent)} className="p-1 rounded-md hover:bg-black/10 active:bg-black/20 flex items-center justify-center min-w-[24px] min-h-[24px]">
                            {copied === twCopyContent ? <span className="text-[9px] font-bold px-1 whitespace-nowrap">Copied!</span> : <TailwindIcon />}
                        </button>
                    );
                })()}
            </div>
        </motion.div>
    );
};

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
                    <span className="text-[9px] font-dev text-transform-tertiary opacity-100 cursor-pointer font-normal" onClick={cycleFormat}>{displayValue}</span>
                </span>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-dev text-transform-tertiary leading-none opacity-90">{toneLabel}</span>
                <div className="flex gap-1 opacity-100">
                    <button onClick={() => onCopy(displayValue)} className="p-1 rounded-sm hover:bg-black/10 active:bg-black/20 flex items-center justify-center min-w-[20px] min-h-[20px]">
                        {copied === displayValue ? <span className="text-[9px] font-bold px-1 whitespace-nowrap">Copied!</span> : <CopyIcon className="w-3 h-3" />}
                    </button>
                    {twClass && (() => {
                        const twCopyContent = cssVar ? `${twClass}\\n${cssVar}` : twClass;
                        return (
                            <button onClick={() => onCopy(twCopyContent)} className="p-1 rounded-sm hover:bg-black/10 active:bg-black/20 flex items-center justify-center min-w-[20px] min-h-[20px]">
                                {copied === twCopyContent ? <span className="text-[9px] font-bold px-1 whitespace-nowrap">Copied!</span> : <TailwindIcon className="w-3 h-3" />}
                            </button>
                        );
                    })()}
                </div>
            </div>
        </motion.div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemeGrid = ({ scheme, isDark, title }: { scheme: any, isDark: boolean, title: string }) => {
    const containerBg = hexFromArgb(scheme.surfaceContainerLowest);
    const outlineColor = hexFromArgb(scheme.outlineVariant);
    
    const getTone = (prefix: string, argb: number) => {
        return `${prefix}-${Math.round(Hct.fromInt(argb).tone)}`;
    };

    return (
        <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
            <div className="rounded-xl p-8 border shadow-sm transition-colors w-full" style={{ backgroundColor: containerBg, borderColor: outlineColor }}>
                <div className="flex flex-col gap-[3px]">
                <div className="flex gap-[3px] w-full">
                    <div className="flex-1 min-w-0 flex flex-col gap-[1px]">
                        <Swatch label="Primary" bg={scheme.primary} text={scheme.onPrimary} toneLabel={getTone("P", scheme.primary)} twClass="bg-primary" cssVar="--md-sys-color-primary" />
                        <ThinSwatch label="On Primary" bg={scheme.onPrimary} text={scheme.primary} toneLabel={getTone("P", scheme.onPrimary)} twClass="text-on-primary bg-on-primary" cssVar="--md-sys-color-on-primary" />
                        <Swatch label="Primary Container" bg={scheme.primaryContainer} text={scheme.onPrimaryContainer} toneLabel={getTone("P", scheme.primaryContainer)} twClass="bg-primary-container" cssVar="--md-sys-color-primary-container" />
                        <ThinSwatch label="On Primary Container" bg={scheme.onPrimaryContainer} text={scheme.primaryContainer} toneLabel={getTone("P", scheme.onPrimaryContainer)} twClass="text-on-primary-container" cssVar="--md-sys-color-on-primary-container" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-[1px]">
                        <Swatch label="Secondary" bg={scheme.secondary} text={scheme.onSecondary} toneLabel={getTone("S", scheme.secondary)} twClass="bg-secondary" cssVar="--md-sys-color-secondary" />
                        <ThinSwatch label="On Secondary" bg={scheme.onSecondary} text={scheme.secondary} toneLabel={getTone("S", scheme.onSecondary)} twClass="text-on-secondary bg-on-secondary" cssVar="--md-sys-color-on-secondary" />
                        <Swatch label="Secondary Container" bg={scheme.secondaryContainer} text={scheme.onSecondaryContainer} toneLabel={getTone("S", scheme.secondaryContainer)} twClass="bg-secondary-container" cssVar="--md-sys-color-secondary-container" />
                        <ThinSwatch label="On Secondary Container" bg={scheme.onSecondaryContainer} text={scheme.secondaryContainer} toneLabel={getTone("S", scheme.onSecondaryContainer)} twClass="text-on-secondary-container" cssVar="--md-sys-color-on-secondary-container" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-[1px]">
                        <Swatch label="Tertiary" bg={scheme.tertiary} text={scheme.onTertiary} toneLabel={getTone("T", scheme.tertiary)} twClass="bg-tertiary" cssVar="--md-sys-color-tertiary" />
                        <ThinSwatch label="On Tertiary" bg={scheme.onTertiary} text={scheme.tertiary} toneLabel={getTone("T", scheme.onTertiary)} twClass="text-on-tertiary bg-on-tertiary" cssVar="--md-sys-color-on-tertiary" />
                        <Swatch label="Tertiary Container" bg={scheme.tertiaryContainer} text={scheme.onTertiaryContainer} toneLabel={getTone("T", scheme.tertiaryContainer)} twClass="bg-tertiary-container" cssVar="--md-sys-color-tertiary-container" />
                        <ThinSwatch label="On Tertiary Container" bg={scheme.onTertiaryContainer} text={scheme.tertiaryContainer} toneLabel={getTone("T", scheme.onTertiaryContainer)} twClass="text-on-tertiary-container" cssVar="--md-sys-color-on-tertiary-container" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-[1px]">
                        <Swatch label="Error" bg={scheme.error} text={scheme.onError} toneLabel={getTone("E", scheme.error)} twClass="bg-error" cssVar="--md-sys-color-error" />
                        <ThinSwatch label="On Error" bg={scheme.onError} text={scheme.error} toneLabel={getTone("E", scheme.onError)} twClass="text-on-error bg-on-error" cssVar="--md-sys-color-on-error" />
                        <Swatch label="Error Container" bg={scheme.errorContainer} text={scheme.onErrorContainer} toneLabel={getTone("E", scheme.errorContainer)} twClass="bg-error-container" cssVar="--md-sys-color-error-container" />
                        <ThinSwatch label="On Error Container" bg={scheme.onErrorContainer} text={scheme.errorContainer} toneLabel={getTone("E", scheme.onErrorContainer)} twClass="text-on-error-container" cssVar="--md-sys-color-on-error-container" />
                    </div>
                </div>

                <div className="flex gap-[3px] w-full mt-[12px]">
                    <div className="flex flex-col gap-[1px]" style={{ flex: '3' }}>
                        <div className="flex gap-[1px]">
                            <Swatch label="Surface Dim" bg={scheme.surfaceDim} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceDim)} heightClass="h-[140px]" widthClass="flex-1" twClass="bg-surface-dim" cssVar="--md-sys-color-surface-dim" />
                            <Swatch label="Surface" bg={scheme.surface} text={scheme.onSurface} toneLabel={getTone("N", scheme.surface)} heightClass="h-[140px]" widthClass="flex-1 bg-transparent" twClass="bg-surface" cssVar="--md-sys-color-surface" />
                            <Swatch label="Surface Bright" bg={scheme.surfaceBright} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceBright)} heightClass="h-[140px]" widthClass="flex-1" twClass="bg-surface-bright" cssVar="--md-sys-color-surface-bright" />
                        </div>
                        <div className="flex gap-[1px]">
                            <Swatch label="Surface Container Lowest" bg={scheme.surfaceContainerLowest} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainerLowest)} heightClass="h-[100px]" widthClass="flex-1" twClass="bg-surface-lowest" cssVar="--md-sys-color-surface-container-lowest" />
                            <Swatch label="Surface Container Low" bg={scheme.surfaceContainerLow} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainerLow)} heightClass="h-[100px]" widthClass="flex-1" twClass="bg-surface-low" cssVar="--md-sys-color-surface-container-low" />
                            <Swatch label="Surface Container" bg={scheme.surfaceContainer} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainer)} heightClass="h-[100px]" widthClass="flex-1" twClass="bg-surface-container" cssVar="--md-sys-color-surface-container" />
                            <Swatch label="Surface Container High" bg={scheme.surfaceContainerHigh} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainerHigh)} heightClass="h-[100px]" widthClass="flex-1" twClass="bg-surface-high" cssVar="--md-sys-color-surface-container-high" />
                            <Swatch label="Surface Container Highest" bg={scheme.surfaceContainerHighest} text={scheme.onSurface} toneLabel={getTone("N", scheme.surfaceContainerHighest)} heightClass="h-[100px]" widthClass="flex-1" twClass="bg-surface-highest" cssVar="--md-sys-color-surface-container-highest" />
                        </div>
                        <div className="flex gap-[1px] w-full pt-[2px]">
                            <Swatch label="On Surface" bg={scheme.onSurface} text={scheme.surface} toneLabel={getTone("N", scheme.onSurface)} widthClass="flex-[1.5]" heightClass="h-[100px]" twClass="text-on-surface" cssVar="--md-sys-color-on-surface" />
                            <Swatch label="On Surface Variant" bg={scheme.onSurfaceVariant} text={scheme.surfaceVariant} toneLabel={getTone("NV", scheme.onSurfaceVariant)} widthClass="flex-[1.5]" heightClass="h-[100px]" twClass="text-on-surface-variant" cssVar="--md-sys-color-on-surface-variant" />
                            <Swatch label="Outline" bg={scheme.outline} text={scheme.surface} toneLabel={getTone("NV", scheme.outline)} widthClass="flex-1" heightClass="h-[100px]" twClass="border-outline" cssVar="--md-sys-color-outline" />
                            <Swatch label="Outline Variant" bg={scheme.outlineVariant} text={scheme.onSurface} toneLabel={getTone("NV", scheme.outlineVariant)} widthClass="flex-1" heightClass="h-[100px]" twClass="border-outline-variant" cssVar="--md-sys-color-outline-variant" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[1px]" style={{ flex: '1' }}>
                        <Swatch label="Inverse Surface" bg={scheme.inverseSurface} text={scheme.inverseOnSurface} toneLabel={getTone("N", scheme.inverseSurface)} heightClass="h-full" widthClass="w-full flex-1" twClass="bg-inverse-surface" cssVar="--md-sys-color-inverse-surface" />
                        <Swatch label="Inverse On Surface" bg={scheme.inverseOnSurface} text={scheme.inverseSurface} toneLabel={getTone("N", scheme.inverseOnSurface)} heightClass="h-full" widthClass="w-full flex-1" twClass="text-inverse-on-surface" cssVar="--md-sys-color-inverse-on-surface" />
                        <Swatch label="Inverse Primary" bg={scheme.inversePrimary} text={scheme.primary} toneLabel={getTone("P", scheme.inversePrimary)} heightClass="h-full" widthClass="w-full flex-1" twClass="bg-inverse-primary" cssVar="--md-sys-color-inverse-primary" />
                        <Swatch label="Scrim" bg={scheme.scrim} text={isDark ? 0xFFFFFF : scheme.surface} toneLabel={getTone("N", scheme.scrim)} heightClass="h-full" widthClass="w-full flex-1" twClass="bg-scrim" cssVar="--md-sys-color-scrim" />
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FixedGrid = ({ palettes, scheme }: { palettes: Record<string, any>, scheme: any }) => {
    const bg = hexFromArgb(scheme.surfaceContainerLowest);
    const outline = hexFromArgb(scheme.outlineVariant);

    return (
        <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Fixed Colors (independent of theme)</h3>
            <div className="rounded-xl p-8 border shadow-sm transition-colors w-full" style={{ backgroundColor: bg, borderColor: outline }}>
                <div className="flex w-full gap-[3px]">
                <div className="flex-1 flex flex-col gap-[1px]">
                    <Swatch label="Primary Fixed" bg={palettes.primary.tone(90)} text={palettes.primary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-primary-fixed" cssVar="--md-sys-color-primary-fixed" />
                    <Swatch label="Primary Fixed Dim" bg={palettes.primary.tone(80)} text={palettes.primary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-primary-fixed-dim" cssVar="--md-sys-color-primary-fixed-dim" />
                    <ThinSwatch label="On Primary Fixed" bg={palettes.primary.tone(10)} text={palettes.primary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-primary-fixed" cssVar="--md-sys-color-on-primary-fixed" />
                    <ThinSwatch label="On Primary Fixed Variant" bg={palettes.primary.tone(30)} text={palettes.primary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-primary-fixed-variant" cssVar="--md-sys-color-on-primary-fixed-variant" />
                </div>
                <div className="flex-1 flex flex-col gap-[1px]">
                    <Swatch label="Secondary Fixed" bg={palettes.secondary.tone(90)} text={palettes.secondary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-secondary-fixed" cssVar="--md-sys-color-secondary-fixed" />
                    <Swatch label="Secondary Fixed Dim" bg={palettes.secondary.tone(80)} text={palettes.secondary.tone(10)} toneLabel="" heightClass="h-[80px]" twClass="bg-secondary-fixed-dim" cssVar="--md-sys-color-secondary-fixed-dim" />
                    <ThinSwatch label="On Secondary Fixed" bg={palettes.secondary.tone(10)} text={palettes.secondary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-secondary-fixed" cssVar="--md-sys-color-on-secondary-fixed" />
                    <ThinSwatch label="On Secondary Fixed Variant" bg={palettes.secondary.tone(30)} text={palettes.secondary.tone(90)} toneLabel="" heightClass="h-[40px]" twClass="text-on-secondary-fixed-variant" cssVar="--md-sys-color-on-secondary-fixed-variant" />
                </div>
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
export const TonalMatrixGrid = ({ palettes, scheme }: { palettes: Record<string, any>, scheme: any }) => {
    const tones = [100, 99, 98, 96, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
    const names = ['primary', 'secondary', 'tertiary', 'error', 'neutral', 'neutralVariant'];
    const bg = hexFromArgb(scheme.surfaceContainerLowest);
    const outline = hexFromArgb(scheme.outlineVariant);
    const textColor = hexFromArgb(scheme.onSurface);

    return (
        <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Absolute 0-100 Tonal Matrices</h3>
            <div className="rounded-xl p-8 border shadow-sm transition-colors w-full" style={{ backgroundColor: bg, borderColor: outline }}>
                <div className="flex flex-col gap-6">
                {names.map(name => (
                    <div key={name} className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold capitalize tracking-wide opacity-80" style={{ color: textColor }}>{name.replace('Variant', ' Variant')}</h3>
                        <div className="flex w-full h-[60px] rounded-lg overflow-hidden border border-black/5 shadow-inner">
                            {tones.map(tone => {
                                const bgValue = palettes[name] ? palettes[name].tone(tone) : 0xffffff;
                                const bgColor = hexFromArgb(bgValue);
                                const itemTextColor = tone > 50 ? '#000' : '#fff';
                                return (
                                    <div key={tone} className="flex-1 flex items-center justify-center text-[10px] font-medium transition-all hover:flex-[1.5]" style={{ backgroundColor: bgColor, color: itemTextColor }} title={`${name} ${tone}: ${bgColor}`}>
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

export interface PaletteGridStageProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lightScheme: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    darkScheme: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    palettes: any;
}

export const PaletteGridStage: React.FC<PaletteGridStageProps> = ({ lightScheme, darkScheme, palettes }) => {
    return (
        <div className="w-full pb-20 flex flex-col gap-12">
            <ThemeGrid scheme={lightScheme} isDark={false} title="Light Theme" />
            <ThemeGrid scheme={darkScheme} isDark={true} title="Dark Theme" />
            <FixedGrid palettes={palettes} scheme={lightScheme} />
            <TonalMatrixGrid palettes={palettes} scheme={lightScheme} />
        </div>
    );
};
