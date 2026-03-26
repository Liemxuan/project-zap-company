import React from 'react';

export interface ColorStageProps {
    seedColor: string;
    schemeVariant: string;
}

export function ColorStage({ seedColor, schemeVariant }: ColorStageProps) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-12 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                <span className="text-[12px] text-slate-400 font-dev text-transform-tertiary font-bold tracking-widest">ORGANISM: MAIN STAGE</span>
                <span className="text-[10px] text-slate-400">Receives state from the Page.</span>
            </div>

            <div className="flex flex-col items-center text-center max-w-lg mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-slate-800 mb-2">Live Factory State</h1>
                <p className="text-sm text-slate-500">
                    This Stage Organism is completely decoupled from the Inspector. The state flows downwards from the LaboratoryTemplate parent.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
                {/* Visualizer for Seed Color */}
                <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white shadow-sm border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 text-transform-secondary tracking-wider">Current Seed</span>
                    <div 
                        className="w-full h-32 rounded-xl border border-black/10 shadow-inner flex items-center justify-center transition-colors duration-300"
                        style={{ backgroundColor: seedColor }}
                    >
                        <div className="px-4 py-2 bg-white/90 rounded font-dev text-transform-tertiary text-sm font-bold shadow-sm backdrop-blur">
                            {seedColor}
                        </div>
                    </div>
                </div>

                {/* Visualizer for Variant */}
                <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white shadow-sm border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 text-transform-secondary tracking-wider">Current Variant</span>
                    <div className="w-full h-32 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-700 tracking-tight">
                            {schemeVariant}
                        </span>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
