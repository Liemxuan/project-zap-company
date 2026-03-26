'use client';

import React, { useRef } from 'react';
import { sourceColorFromImage, hexFromArgb } from "@material/material-color-utilities";
import { Check, Sparkles, Image as ImageIcon, Palette, Wand2 } from 'lucide-react';
import { InspectorAccordion } from '../../../zap/organisms/laboratory/InspectorAccordion';

export const SCHEME_VARIANTS = [
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

const CoreColorRow = ({ label, description, color, defaultColor, onChange, isPrimary = false }: { label: string, description: string, color: string, defaultColor?: string, onChange: (val: string) => void, isPrimary?: boolean }) => {
    const displayColor = color || defaultColor || '#cccccc';
    return (
        <div className="flex items-center gap-4 p-3 rounded-[16px] bg-[#F1F3F5] hover:bg-[#E5E7EB] transition-colors relative">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm flex-shrink-0 border border-black/5" style={{ backgroundColor: displayColor }}>
                <input type="color" value={displayColor.slice(0, 7)} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0" title={`Pick ${label} color`} />
            </div>
            <div className="flex flex-col pr-8">
                <span className="text-[15px] font-medium text-[#2C3E50]">{label}</span>
                {description && <span className="text-[11px] text-[#7F8C8D] leading-tight mt-0.5">{description}</span>}
            </div>
            {!isPrimary && color && (
                <button onClick={(e) => { e.stopPropagation(); onChange(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1" aria-label={`Clear ${label} color`} title={`Clear ${label} color`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            )}
        </div>
    );
};

export interface ColorInspectorPanelProps {
    seedColor: string;
    setSeedColor: (val: string) => void;
    seedImage: string | null;
    setSeedImage: (val: string | null) => void;
    customOverrides: Record<string, string>;
    setCustomOverrides: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    schemeVariant: string;
    setSchemeVariant: (val: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lightScheme: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    palettes: any;
}

export const ColorInspectorPanel: React.FC<ColorInspectorPanelProps> = ({
    seedColor, setSeedColor,
    seedImage, setSeedImage,
    customOverrides, setCustomOverrides,
    schemeVariant, setSchemeVariant,
    lightScheme, palettes
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleOverride = (key: string, value: string) => {
        setCustomOverrides(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="pt-2 pb-8 flex flex-col gap-0">
            <div className="p-4 border-b border-border/50">
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Dynamically generate M3 tonal palettes and export Tailwind/CSS variables.
                </p>
            </div>
            
            {/* 1. Seed Color Image Chooser Section */}
            <InspectorAccordion title="Seed Color" icon={ImageIcon} defaultOpen={true}>
                <div className="space-y-4 pt-2">
                    <p className="text-xs text-[#7F8C8D] leading-relaxed">Extract from image or hex.</p>

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
                                            <div className="w-6 h-6 rounded-full bg-[#E5F4D3] flex items-center justify-center text-[#4A642B] shadow-sm">
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
                            className="w-16 h-16 rounded-xl border border-zinc-300 flex items-center justify-center text-[#4A642B] hover:bg-zinc-50 transition-colors flex-shrink-0 shadow-sm"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" title="Upload image file" />
                    </div>

                    {lightScheme && (
                        <div className="mt-2 p-3.5 rounded-[16px] flex items-center justify-between shadow-sm transition-colors" style={{ backgroundColor: hexFromArgb(lightScheme.secondaryContainer) }}>
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full shadow-inner flex-shrink-0" style={{ backgroundColor: seedColor }}>
                                    <input type="color" value={seedColor} onChange={(e) => { setSeedColor(e.target.value); setSeedImage(null); }} title="Select custom seed color" className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-medium" style={{ color: hexFromArgb(lightScheme.onSecondaryContainer) }}>Seed color</span>
                                    <span className="text-[10px] leading-tight opacity-80" style={{ color: hexFromArgb(lightScheme.onSecondaryContainer) }}>Material 3 seed generator.</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </InspectorAccordion>

            {/* 2. Core Colors Overrides */}
            {palettes && (
                <InspectorAccordion title="Core Colors" icon={Palette} defaultOpen={false}>
                    <div className="space-y-4 pt-2">
                        <p className="text-xs text-[#7F8C8D]">Override scheme keys.</p>

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
            )}

            <InspectorAccordion title="Theme Variant" icon={Wand2} defaultOpen={true}>
                <div className="space-y-4 pt-2">
                    <h3 className="text-[14px] text-muted-foreground mb-2 font-secondary uppercase">
                        Active Style: <strong className="text-foreground">{SCHEME_VARIANTS.find(v => v.id === schemeVariant)?.label || schemeVariant}</strong>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {SCHEME_VARIANTS.map((variant) => {
                            const isSelected = schemeVariant === variant.id;
                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => setSchemeVariant(variant.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] font-medium transition-colors ${isSelected
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                                        }`}
                                >
                                    {variant.label}
                                    {variant.hasSparkle && <Sparkles className="opacity-80 ml-0.5" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </InspectorAccordion>
        </div>
    );
};
