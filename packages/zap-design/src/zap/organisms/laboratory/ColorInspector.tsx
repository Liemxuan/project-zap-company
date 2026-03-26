import React from 'react';

export interface ColorInspectorProps {
    seedColor: string;
    onSeedColorChange: (color: string) => void;
    schemeVariant: string;
    onSchemeVariantChange: (variant: string) => void;
}

export function ColorInspector({
    seedColor, onSeedColorChange,
    schemeVariant, onSchemeVariantChange
}: ColorInspectorProps) {
    const SCHEME_VARIANTS = [
        'TonalSpot', 'Neutral', 'Vibrant', 'Expressive', 
        'Rainbow', 'FruitSalad', 'Monochrome', 'Fidelity', 'Content'
    ];

    return (
        <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto no-scrollbar w-[340px] bg-white border-l border-slate-200">
            <div className="flex flex-col gap-1">
                <span className="text-[12px] text-slate-500 font-dev text-transform-tertiary font-bold tracking-widest">ORGANISM: INSPECTOR</span>
                <span className="text-[10px] text-slate-400">Controls the Main Stage state.</span>
            </div>

            {/* Seed Color Controller */}
            <div className="flex flex-col gap-2">
                <span className="text-[13px] font-bold text-slate-700">Seed Color</span>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <input 
                        type="color" 
                        value={seedColor} 
                        onChange={(e) => onSeedColorChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-sm font-dev text-transform-tertiary text-slate-600">{seedColor}</span>
                </div>
            </div>

            {/* Scheme Variant Controller */}
            <div className="flex flex-col gap-2">
                <span className="text-[13px] font-bold text-slate-700">Scheme Variant</span>
                <div className="flex flex-col gap-1">
                    {SCHEME_VARIANTS.map(variant => (
                        <button 
                            key={variant}
                            onClick={() => onSchemeVariantChange(variant)}
                            className={`text-left px-3 py-2 rounded text-[12px] transition-colors ${schemeVariant === variant ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'hover:bg-slate-100 text-slate-600 border border-transparent'}`}
                        >
                            {variant}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
