'use client';

import React, { useState, useMemo } from 'react';
import {
    themeFromSourceColor,
    hexFromArgb,
    argbFromHex,
    SchemeVibrant,
    SchemeTonalSpot,
    SchemeExpressive,
    SchemeNeutral,
    SchemeFidelity,
    Hct,
    TonalPalette
} from "@material/material-color-utilities";
import { Button } from '../../../genesis/atoms/interactive/button';
import { Input } from '../../../genesis/atoms/interactive/input';

import { Settings, Smartphone, Monitor } from 'lucide-react';
import { Switch } from '../../../genesis/atoms/interactive/switch';
import { ScrollArea } from '../../../genesis/molecules/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../genesis/molecules/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../genesis/atoms/interactive/select';

// Helper to render Semantic color boxes
const SemanticSwatch = ({ label, argbColor, textColorArgb }: { label: string, argbColor: number, textColorArgb: number }) => {
    const bgHex = hexFromArgb(argbColor);
    const textHex = hexFromArgb(textColorArgb);
    return (
        <div className="flex flex-col justify-end p-3 rounded-md shadow-sm border border-black/10 h-24" style={{ backgroundColor: bgHex, color: textHex }}>
            <div className="text-xs font-bold truncate">{label}</div>
            <div className="text-[10px] font-dev text-transform-tertiary opacity-80 ">{bgHex}</div>
        </div>
    );
};

// Helper to render Raw Tonal Matrix Rows
const TonalScaleRow = ({ name, palette }: { name: string, palette: TonalPalette }) => {
    const tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
    return (
        <div className="mb-4">
            <h4 className="text-sm font-bold mb-2 capitalize text-zinc-700">{name}</h4>
            <div className="flex w-full h-12 rounded-lg overflow-hidden border border-zinc-200">
                {tones.map(tone => {
                    const argb = palette.tone(tone);
                    const bgHex = hexFromArgb(argb);
                    const textHex = tone < 60 ? '#FFFFFF' : '#000000'; // Rough contrast estimation for raw scale view
                    return (
                        <div key={tone} className="flex-1 flex flex-col justify-center items-center group relative cursor-pointer" style={{ backgroundColor: bgHex, color: textHex }}>
                            <span className="text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute top-1">{tone}</span>
                            <span className="text-[9px] font-dev text-transform-tertiary opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1">{bgHex}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function MaterialKolorClone() {
    const [seedColor, setSeedColor] = useState('#DFFF00');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [schemeVariant, setSchemeVariant] = useState('tonal_spot');

    // Generate the M3 Theme dynamically with selected Variant
    const { activeScheme, palettes } = useMemo(() => {
        let argb;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        try { argb = argbFromHex(seedColor); } catch (e) { argb = argbFromHex('#DFFF00'); }

        const hct = Hct.fromInt(argb);
        let schemeLight, schemeDark;

        switch (schemeVariant) {
            case 'vibrant':
                schemeLight = new SchemeVibrant(hct, false, 0);
                schemeDark = new SchemeVibrant(hct, true, 0);
                break;
            case 'expressive':
                schemeLight = new SchemeExpressive(hct, false, 0);
                schemeDark = new SchemeExpressive(hct, true, 0);
                break;
            case 'neutral':
                schemeLight = new SchemeNeutral(hct, false, 0);
                schemeDark = new SchemeNeutral(hct, true, 0);
                break;
            case 'fidelity':
                schemeLight = new SchemeFidelity(hct, false, 0);
                schemeDark = new SchemeFidelity(hct, true, 0);
                break;
            default: // tonal_spot
                schemeLight = new SchemeTonalSpot(hct, false, 0);
                schemeDark = new SchemeTonalSpot(hct, true, 0);
        }

        // We also need the raw palettes for the 0-100 matrices
        const theme = themeFromSourceColor(argb); // Base generation to get palettes easily

        return {
            activeScheme: isDarkMode ? schemeDark : schemeLight,
            palettes: theme.palettes // These are derived from the source, but the scheme determines exact role mapping
        };

    }, [seedColor, isDarkMode, schemeVariant]);


    return (
        <div className="flex h-screen w-full bg-layer-1 font-body text-on-surface overflow-hidden">

            {/* INSPECTOR PANEL (Left Sidebar) */}
            <aside className="w-[320px] bg-white border-r border-zinc-200 flex flex-col flex-shrink-0 z-20">
                <div className="h-14 border-b border-zinc-200 flex items-center px-4">
                    <Settings className="w-5 h-5 mr-2 text-zinc-500" />
                    <span className="font-bold text-sm">ZAP Theme Controls</span>
                </div>
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-8">

                        {/* Seed Color Input */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Seed Color</label>
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full border border-zinc-300 shadow-inner flex-shrink-0" style={{ backgroundColor: seedColor }} />
 <Input value={seedColor} onChange={(e) => setSeedColor(e.target.value)} className="font-dev text-transform-tertiary h-10" />
                            </div>
                        </div>

                        {/* M3 Scheme Variant */}
                        <div className="space-y-3 pt-6 border-t border-zinc-100">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Scheme Variant</label>
                            <Select value={schemeVariant} onValueChange={setSchemeVariant}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a variant" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tonal_spot">Tonal Spot (Default)</SelectItem>
                                    <SelectItem value="vibrant">Vibrant</SelectItem>
                                    <SelectItem value="expressive">Expressive</SelectItem>
                                    <SelectItem value="fidelity">Fidelity</SelectItem>
                                    <SelectItem value="neutral">Neutral</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-[11px] text-zinc-500">Dictates how far tertiary and secondary colors drift from the primary seed.</p>
                        </div>

                        {/* Theme Toggle */}
                        <div className="space-y-3 pt-6 border-t border-zinc-100">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mode</label>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Dark Mode Inversion</span>
                                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                            </div>
                        </div>

                        {/* Viewport Toggle */}
                        <div className="space-y-3 pt-6 border-t border-zinc-100">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Preview Viewport</label>
                            <div className="flex border border-zinc-200 rounded-md overflow-hidden">
                                <button onClick={() => setViewMode('desktop')} className={`flex-1 py-2 flex justify-center items-center ${viewMode === 'desktop' ? 'bg-zinc-100 font-bold' : 'hover:bg-zinc-50'}`}>
                                    <Monitor className="w-4 h-4 mr-2" /> <span className="text-xs">Desktop</span>
                                </button>
                                <button onClick={() => setViewMode('mobile')} className={`flex-1 py-2 flex justify-center items-center border-l border-zinc-200 ${viewMode === 'mobile' ? 'bg-zinc-100 font-bold' : 'hover:bg-zinc-50'}`}>
                                    <Smartphone className="w-4 h-4 mr-2" /> <span className="text-xs">Mobile</span>
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 border-t border-zinc-100 space-y-3">
                            <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold">Export to tailwind.config</Button>
                            <Button variant="outline" className="w-full font-bold">Save as `.toon` file</Button>
                        </div>
                    </div>
                </ScrollArea>
            </aside>

            {/* MAIN BODY (Palettes & Preview) */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50/50">
                {/* Title Header */}
                <div className="px-6 md:px-10 pt-8 pb-4 border-b border-zinc-200 bg-white">
                    <h1 className="text-3xl font-black tracking-tight mb-2">ZAP Structural Generator</h1>
                    <p className="text-zinc-500">Definitive Source of Truth for validating the 94 Metronic extractions against M3 math.</p>
                </div>

                <Tabs defaultValue="colors" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 md:px-10 bg-white border-b border-zinc-200">
                        <TabsList className="h-12 bg-transparent gap-6">
                            <TabsTrigger value="colors" className="data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 px-1 font-bold">Colors & Matrices</TabsTrigger>
                            <TabsTrigger value="inputs" className="data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 px-1 font-bold">Text Inputs</TabsTrigger>
                            <TabsTrigger value="actions" className="data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 px-1 font-bold">Actions & Buttons</TabsTrigger>
                            <TabsTrigger value="containment" className="data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 px-1 font-bold">Containment (Cards)</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 p-6 md:p-10">
                        <div className="max-w-[1200px] mx-auto pb-20">

                            {/* TAB 1: COLORS & MATRICES */}
                            <TabsContent value="colors" className="space-y-12 m-0">

                                {/* 0-100 Raw Matrices */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold border-b border-zinc-200 pb-2">0-100 Tonal Matrices (Raw)</h2>
                                    <p className="text-sm text-zinc-500 mb-6">The absolute mathematical foundation. Hover to see tonal value and hex.</p>
                                    <TonalScaleRow name="Primary" palette={palettes.primary} />
                                    <TonalScaleRow name="Secondary" palette={palettes.secondary} />
                                    <TonalScaleRow name="Tertiary" palette={palettes.tertiary} />
                                    <TonalScaleRow name="Neutral (Background/Surface)" palette={palettes.neutral} />
                                    <TonalScaleRow name="Neutral Variant (Outline)" palette={palettes.neutralVariant} />
                                    <TonalScaleRow name="Error" palette={palettes.error} />
                                </div>

                                {/* Semantic Mapping */}
                                <div className="space-y-6 pt-8 border-t border-zinc-200">
                                    <h2 className="text-xl font-bold border-b border-zinc-200 pb-2">Semantic Token Map (Mapped Roles)</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-zinc-500 uppercase">Primary</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                <SemanticSwatch label="Primary" argbColor={activeScheme.primary} textColorArgb={activeScheme.onPrimary} />
                                                <SemanticSwatch label="On Primary" argbColor={activeScheme.onPrimary} textColorArgb={activeScheme.primary} />
                                                <SemanticSwatch label="Primary Cntr" argbColor={activeScheme.primaryContainer} textColorArgb={activeScheme.onPrimaryContainer} />
                                                <SemanticSwatch label="On Primary Cntr" argbColor={activeScheme.onPrimaryContainer} textColorArgb={activeScheme.primaryContainer} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-zinc-500 uppercase">Secondary</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                <SemanticSwatch label="Secondary" argbColor={activeScheme.secondary} textColorArgb={activeScheme.onSecondary} />
                                                <SemanticSwatch label="On Secondary" argbColor={activeScheme.onSecondary} textColorArgb={activeScheme.secondary} />
                                                <SemanticSwatch label="Secondary Cntr" argbColor={activeScheme.secondaryContainer} textColorArgb={activeScheme.onSecondaryContainer} />
                                                <SemanticSwatch label="On Sec Cntr" argbColor={activeScheme.onSecondaryContainer} textColorArgb={activeScheme.secondaryContainer} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-zinc-500 uppercase">Tertiary</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                <SemanticSwatch label="Tertiary" argbColor={activeScheme.tertiary} textColorArgb={activeScheme.onTertiary} />
                                                <SemanticSwatch label="On Tertiary" argbColor={activeScheme.onTertiary} textColorArgb={activeScheme.tertiary} />
                                                <SemanticSwatch label="Tertiary Cntr" argbColor={activeScheme.tertiaryContainer} textColorArgb={activeScheme.onTertiaryContainer} />
                                                <SemanticSwatch label="On Ter Cntr" argbColor={activeScheme.onTertiaryContainer} textColorArgb={activeScheme.tertiaryContainer} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-zinc-500 uppercase">Neutral (Surfaces)</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                <SemanticSwatch label="Background" argbColor={activeScheme.background} textColorArgb={activeScheme.onBackground} />
                                                <SemanticSwatch label="Surface" argbColor={activeScheme.surface} textColorArgb={activeScheme.onSurface} />
                                                <SemanticSwatch label="Surface Variant" argbColor={activeScheme.surfaceVariant} textColorArgb={activeScheme.onSurfaceVariant} />
                                                <SemanticSwatch label="Outline" argbColor={activeScheme.outline} textColorArgb={activeScheme.surface} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* PREVIEW FRAME WRAPPER (Used by all component tabs) */}
                            <div className="hidden peer"></div> {/* Hack to allow dynamic conditional rendering if needed, keeping it simple for now */}

                            {/* TAB 2: TEXT INPUTS */}
                            <TabsContent value="inputs" className="m-0">
                                <div className={`mx-auto transition-all duration-500 ease-in-out border-[8px] border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative ${viewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full h-[600px] border-4 rounded-xl'}`}>
                                    <div className="w-full h-full p-8 space-y-8 overflow-y-auto" style={{ backgroundColor: hexFromArgb(activeScheme.background), color: hexFromArgb(activeScheme.onBackground) }}>
                                        <h2 className="text-2xl font-bold">Text Inputs</h2>

                                        <div className="p-6 rounded-xl border space-y-4" style={{ backgroundColor: hexFromArgb(activeScheme.surface), borderColor: hexFromArgb(activeScheme.outlineVariant) }}>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider opacity-70">Standard Input</label>
                                                <input type="text" placeholder="Placeholder..." className="w-full px-4 py-3 rounded-md border text-sm outline-none focus:ring-2" style={{ backgroundColor: hexFromArgb(activeScheme.surfaceVariant), color: hexFromArgb(activeScheme.onSurfaceVariant), borderColor: hexFromArgb(activeScheme.outlineVariant) }} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider opacity-70 flex justify-between">
                                                    <span>Error Input</span>
                                                    <span style={{ color: hexFromArgb(activeScheme.error) }}>Required</span>
                                                </label>
                                                <input type="text" defaultValue="Invalid data" className="w-full px-4 py-3 rounded-md border text-sm outline-none focus:ring-2" style={{ backgroundColor: hexFromArgb(activeScheme.surfaceVariant), color: hexFromArgb(activeScheme.error), borderColor: hexFromArgb(activeScheme.error) }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* TAB 3: ACTIONS */}
                            <TabsContent value="actions" className="m-0">
                                <div className={`mx-auto transition-all duration-500 ease-in-out border-[8px] border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative ${viewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full h-[600px] border-4 rounded-xl'}`}>
                                    <div className="w-full h-full p-8 space-y-8 overflow-y-auto" style={{ backgroundColor: hexFromArgb(activeScheme.background), color: hexFromArgb(activeScheme.onBackground) }}>
                                        <h2 className="text-2xl font-bold">Actions & Buttons</h2>

                                        <div className="p-6 rounded-xl border grid grid-cols-2 gap-4" style={{ backgroundColor: hexFromArgb(activeScheme.surface), borderColor: hexFromArgb(activeScheme.outlineVariant) }}>
                                            {/* Primary */}
                                            <button className="px-4 py-3 rounded-full font-bold shadow-sm" style={{ backgroundColor: hexFromArgb(activeScheme.primary), color: hexFromArgb(activeScheme.onPrimary) }}>Primary Action</button>
                                            {/* Secondary */}
                                            <button className="px-4 py-3 rounded-full font-bold shadow-sm" style={{ backgroundColor: hexFromArgb(activeScheme.secondary), color: hexFromArgb(activeScheme.onSecondary) }}>Secondary Action</button>
                                            {/* Tertiary */}
                                            <button className="px-4 py-3 rounded-full font-bold shadow-sm" style={{ backgroundColor: hexFromArgb(activeScheme.tertiary), color: hexFromArgb(activeScheme.onTertiary) }}>Tertiary Action</button>
                                            {/* Outline */}
                                            <button className="px-4 py-3 rounded-full font-bold border" style={{ backgroundColor: 'transparent', color: hexFromArgb(activeScheme.primary), borderColor: hexFromArgb(activeScheme.outline) }}>Outline Action</button>
                                        </div>

                                        <div className="p-6 rounded-xl border flex flex-col gap-4 items-start" style={{ backgroundColor: hexFromArgb(activeScheme.surfaceVariant), borderColor: hexFromArgb(activeScheme.outlineVariant) }}>
                                            <h3 className="font-bold opacity-70 text-sm">Destructive Actions</h3>
                                            <button className="px-4 py-3 rounded-full font-bold shadow-sm" style={{ backgroundColor: hexFromArgb(activeScheme.error), color: hexFromArgb(activeScheme.onError) }}>Delete Account</button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* TAB 4: CONTAINMENT */}
                            <TabsContent value="containment" className="m-0">
                                <div className={`mx-auto transition-all duration-500 ease-in-out border-[8px] border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative ${viewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full h-[600px] border-4 rounded-xl'}`}>
                                    <div className="w-full h-full p-8 space-y-8 overflow-y-auto" style={{ backgroundColor: hexFromArgb(activeScheme.background), color: hexFromArgb(activeScheme.onBackground) }}>
                                        <h2 className="text-2xl font-bold">Containment (Cards)</h2>

                                        {/* Elevated Card */}
                                        <div className="rounded-2xl p-6 shadow-md" style={{ backgroundColor: hexFromArgb(activeScheme.surfaceContainerLow), color: hexFromArgb(activeScheme.onSurface) }}>
                                            <h3 className="text-lg font-bold mb-2">Elevated Card</h3>
                                            <p className="opacity-80 text-sm mb-4">Uses Surface Container Low or Mid.</p>
                                            <button className="px-4 py-2 rounded-full font-bold text-sm shadow-sm" style={{ backgroundColor: hexFromArgb(activeScheme.primary), color: hexFromArgb(activeScheme.onPrimary) }}>Action</button>
                                        </div>

                                        {/* Outlined Card */}
                                        <div className="rounded-2xl p-6 border" style={{ backgroundColor: hexFromArgb(activeScheme.surface), color: hexFromArgb(activeScheme.onSurface), borderColor: hexFromArgb(activeScheme.outline) }}>
                                            <h3 className="text-lg font-bold mb-2">Outlined Card</h3>
                                            <p className="opacity-80 text-sm mb-4">Uses Surface and Outline boundary.</p>
                                            <button className="px-4 py-2 rounded-full font-bold text-sm border" style={{ backgroundColor: 'transparent', color: hexFromArgb(activeScheme.primary), borderColor: hexFromArgb(activeScheme.outline) }}>Action</button>
                                        </div>

                                        {/* Filled Card */}
                                        <div className="rounded-2xl p-6" style={{ backgroundColor: hexFromArgb(activeScheme.surfaceVariant), color: hexFromArgb(activeScheme.onSurfaceVariant) }}>
                                            <h3 className="text-lg font-bold mb-2">Filled Card</h3>
                                            <p className="opacity-80 text-sm">Uses Surface Variant.</p>
                                        </div>

                                    </div>
                                </div>
                            </TabsContent>

                        </div>
                    </ScrollArea>
                </Tabs>
            </main>
        </div>
    );
}
