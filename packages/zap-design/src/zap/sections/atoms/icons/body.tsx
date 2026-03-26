'use client';

import React from 'react';
import { Icon, CORE_ICONS, ICON_SIZES } from '../../../../genesis/atoms/icons/Icon';
import { AppleIcon } from '../../../../genesis/atoms/icons/apple';
import { GoogleIcon } from '../../../../genesis/atoms/icons/google';

const SCALE_SIZES: { px: number; sizeKey: keyof typeof ICON_SIZES; label: string }[] = [
    { px: ICON_SIZES.sm, sizeKey: 'sm', label: 'Small / Inline' },
    { px: ICON_SIZES.md, sizeKey: 'md', label: 'Medium / Default' },
    { px: ICON_SIZES.lg, sizeKey: 'lg', label: 'Large / Hero' },
];

const BRAND_SVGS = [
    <GoogleIcon key="google" className="text-current" />,
    <AppleIcon key="apple" className="text-current" />,
    <svg key="bolt" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    <svg key="grid" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="3" y="3" width="18" height="18" /><path d="M3 14h18M9 21v-7" /></svg>,
    <svg key="package" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05" /><path d="M12 22.08V12" /></svg>,
    <svg key="clock" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
];


export const IconographyBody = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-20 pb-24">
            
            {/* 1. Core Icons Container */}
            <section className="space-y-6">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-lg font-semibold text-foreground">Local Google Icons (Material Symbols)</h3>
                    <span className="bg-layer-panel-high text-foreground px-3 py-1 text-[10px] font-black uppercase rounded-md border border-border">Material Outlined</span>
                </div>
                
                <div className="bg-layer-panel rounded-xl border border-border p-8 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                    {CORE_ICONS.map((icon) => (
                        <div key={icon.name} className="flex flex-col items-center justify-center p-6 border border-border bg-layer-dialog rounded-lg cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-colors">
                            <Icon name={icon.name} size="md" className="mb-3 text-foreground" />
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground text-center">{icon.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Icon Scaling Container */}
            <section className="space-y-6">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-lg font-semibold text-foreground">Icon Scaling</h3>
                    <span className="bg-layer-panel-high text-foreground px-3 py-1 text-[10px] font-black uppercase rounded-md border border-border">Pixel Perfect</span>
                </div>
                
                <div className="bg-layer-panel rounded-xl border border-border p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SCALE_SIZES.map((s) => (
                        <div key={s.px} className="flex flex-col items-center p-8 border border-border bg-layer-dialog rounded-lg">
                            <div className="h-20 flex items-center justify-center text-foreground">
                                <Icon name="grid_view" size={s.sizeKey} />
                            </div>
                            <div className="w-full border-t border-border mt-4 pt-4 text-center">
                                <span className="text-xl font-black block text-foreground">{s.px}px</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 block">{s.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Custom Brand SVG Container */}
            <section className="space-y-6">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-lg font-semibold text-foreground">Custom Brand Icons (SVG)</h3>
                    <span className="bg-layer-panel-high text-foreground px-3 py-1 text-[10px] font-black uppercase rounded-md border border-border">Local Assets</span>
                </div>
                
                <div className="bg-layer-panel rounded-xl border border-border p-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h4 className="text-xl font-bold mb-4 text-foreground">Geometric Precision</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                            ZAP custom icons are built on a strict 2px stroke weight with sharp 90-degree corners to reflect our industrial design language.
                        </p>
                        <ul className="space-y-3">
                            {['Stroke: 2px Solid', 'Corner Radius: 0px (Sharp)', 'Perspective: Isometric / Flat'].map((rule) => (
                                <li key={rule} className="flex items-center gap-3 text-sm font-bold text-foreground">
                                    <span className="w-1.5 h-1.5 bg-primary shrink-0"></span>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        {BRAND_SVGS.map((svg, i) => (
                            <div key={i} className="aspect-square border border-border bg-layer-dialog flex items-center justify-center p-8 rounded-lg text-foreground hover:bg-primary/5 hover:border-primary/30 transition-colors">
                                <div className="[&>svg]:w-12 [&>svg]:h-12">{svg}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};
