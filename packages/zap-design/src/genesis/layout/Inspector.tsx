'use client';

import React from 'react';

interface InspectorProps {
    title?: string;
    children?: React.ReactNode;
    isOpen?: boolean;
    width?: number;
}

export const Inspector = ({
    title = 'Inspector',
    children,
    isOpen = true,
    width = 280,
}: InspectorProps) => {
    if (!isOpen) return null;

    return (
        <aside
            className="bg-layer-panel border-l-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] flex flex-col shrink-0 overflow-hidden z-20 h-full text-theme-base"
            style={{ width }}
        >
            {/* Scrollable Workspace Container */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    {/* Header Item */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-medium text-theme-base text-titleMedium leading-[1.2] tracking-tight text-transform-primary">
                            {title}
                        </h2>
                        <span className="material-symbols-outlined text-theme-base hover:rotate-90 cursor-pointer transition-transform text-[18px]">
                            tune
                        </span>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                        {children || (
                            <div className="aspect-square border-[length:var(--card-border-width,2px)] border-dashed border-card-border-[length:var(--card-border-width,0px)] flex items-center justify-center bg-layer-cover rounded-card">
                                <span className="text-[10px] font-mono text-transform-tertiary text-theme-base/50 font-bold text-transform-secondary italic">No Parameters</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Footer - Reference matching button */}
            <div className="mt-auto p-4 bg-layer-panel border-t-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] sticky bottom-0 shrink-0">
                <button className="w-full bg-theme-base text-theme-inverted py-3 font-bold border-[length:var(--btn-border-width,0px)] border-btn-border-[length:var(--card-border-width,0px)] rounded-btn shadow-btn hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none hover:bg-theme-base/80 transition-all flex items-center justify-center gap-2 active:shadow-none text-transform-primary tracking-widest text-xs">
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    Create Update
                </button>
            </div>
        </aside>
    );
};
