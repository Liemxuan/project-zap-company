'use client';

import { Wrapper } from '../../../../components/dev/Wrapper';
import { InspectorAccordion } from '../../../../zap/organisms/laboratory/InspectorAccordion';
import { Select } from '../../../../genesis/atoms/interactive/option-select';

export type TypographyTemplate = 'basic' | 'corp' | 'fun' | 'wild' | 'metro';

export interface TypographicLayer {
    enabled: boolean;
    color: string;
    opacity: number;
    // Layer 1 (Stroke) specifics
    strokeWidth?: number;
    // Layer 2 & 3 (Shadow) specifics
    x?: number;
    y?: number;
    blur?: number;
}

export interface BoxSettings {
    enabled: boolean;
    backgroundColor: string;
    padding: number;
}

export interface SpecialEffects {
    enabled: boolean;
    uppercase?: boolean;
    kineticTilt?: number;
    characterCrush?: number;
    animation?: 'none' | 'pulse' | 'bounce' | 'spin' | 'wiggle';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'; // Maps to: Free, Cap, Lower, Proper
}

export interface LayeredStylizationSettings {
    fontFamily: string;
    fontSize?: number; // Optional font size override
    box?: BoxSettings; // Background box
    layer0: TypographicLayer; // Base
    layer1: TypographicLayer; // Stroke
    layer2: TypographicLayer; // Shadow 1
    layer3: TypographicLayer; // Shadow 2
    effects?: SpecialEffects;
}

interface TypographyInspectorProps {
    activeTemplate: TypographyTemplate;
    setActiveTemplate: (t: TypographyTemplate) => void;
    activeAtom?: string | null;
    settings?: LayeredStylizationSettings | null;
    onUpdateSettings?: (settings: LayeredStylizationSettings) => void;
}

export const CORE_FONTS = [
    { name: 'Primary (Space Grotesk)', value: 'var(--font-space-grotesk), sans-serif' },
    { name: 'Secondary (Inter)', value: 'var(--font-inter), sans-serif' },
    { name: 'Development (JetBrains)', value: 'var(--font-jetbrains), monospace' },
    { name: 'Standard (Roboto)', value: 'var(--font-roboto), sans-serif' },
    { name: 'Elegant (Playfair Display)', value: 'var(--font-playfair), serif' },
    { name: 'Modern (Bricolage)', value: 'var(--font-bricolage), sans-serif' },
    { name: 'Playful (Comic Neue)', value: 'var(--font-comic-neue), cursive' },
    { name: 'Cursive (Pacifico)', value: 'var(--font-pacifico), cursive' },
];

const SectionHeader = ({ title, enabled, onToggle }: { title: string, enabled?: boolean, onToggle?: (val: boolean) => void }) => (
    <div className="flex justify-between items-center mb-1 group mt-3">
        {onToggle !== undefined ? (
            <label className="text-[10px] font-dev text-transform-tertiary font-black tracking-wide text-brand-midnight flex items-center gap-2 cursor-pointer select-none">
                <input title={`Toggle ${title}`} type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} className="accent-brand-midnight w-3 h-3" />
                {title}
            </label>
        ) : (
            <span className="text-[10px] font-dev text-transform-tertiary font-black tracking-wide text-brand-midnight">{title}</span>
        )}
    </div>
);

export const TypographyInspector: React.FC<TypographyInspectorProps> = ({
    activeTemplate,
    setActiveTemplate,
    activeAtom,
    settings,
    onUpdateSettings
}) => {
    const handleLayerChange = (layer: 'layer0' | 'layer1' | 'layer2' | 'layer3', key: string, value: string | number | boolean | undefined) => {
        if (!settings || !onUpdateSettings) return;
        onUpdateSettings({
            ...settings,
            [layer]: {
                ...settings[layer],
                [key]: value
            }
        });
    };

    const handleBoxChange = (key: string, value: string | number | boolean | undefined) => {
        if (!settings || !onUpdateSettings) return;
        onUpdateSettings({
            ...settings,
            box: {
                ...(settings.box || { enabled: false, backgroundColor: 'var(--theme-surface)', padding: 8 }),
                [key]: value
            }
        });
    };

    const handleEffectChange = (key: string, value: string | number | boolean | undefined) => {
        if (!settings || !onUpdateSettings) return;
        onUpdateSettings({
            ...settings,
            effects: {
                ...(settings.effects || { enabled: true }),
                [key]: value
            }
        });
    };

    const handleSettingChange = (key: keyof LayeredStylizationSettings, value: string | number | boolean | undefined) => {
        if (!settings || !onUpdateSettings) return;
        onUpdateSettings({
            ...settings,
            [key]: value
        });
    };

    return (
        <div className="font-body text-transform-secondary select-none pb-20 flex flex-col gap-0">
            {/* TEMPLATE GALLERY */}
            <Wrapper identity={{ displayName: "Template Gallery", filePath: "zap/sections/atoms/typography/inspector.tsx", type: "Molecule" }}>
                <InspectorAccordion title="Template Gallery" icon="photo_library" defaultOpen={!activeAtom}>
                    <div className="grid grid-cols-2 gap-3 pb-2 pt-2">
                        {/* Basic */}
                        <button
                            onClick={() => setActiveTemplate('basic')}
                            className={`relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] ${activeTemplate === 'basic' ? 'bg-brand-yellow shadow-[4px_4px_0_0_var(--color-brand-midnight)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-100'}`}
                        >
                            <span className="text-[8px] font-display text-transform-primary font-medium text-brand-midnight/60 mb-1">The</span>
                            <span className="text-[14px] font-display text-transform-primary font-black text-brand-midnight tracking-tight">BASIC</span>
                            <div className="absolute bottom-2 left-2 bg-brand-midnight text-white px-1.5 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest">STANDARD</div>
                            {activeTemplate === 'basic' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest">ACTIVE</div>}
                        </button>

                        {/* Corp Trust */}
                        <button
                            onClick={() => setActiveTemplate('corp')}
                            className={`relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] ${activeTemplate === 'corp' ? 'bg-brand-yellow shadow-[4px_4px_0_0_var(--color-brand-midnight)] translate-x-[-2px] translate-y-[-2px]' : 'bg-blue-50 hover:bg-blue-100'}`}
                        >
                            <span className="text-[8px] font-display text-transform-primary font-bold text-blue-900 border-b border-blue-900/40 mb-1 tracking-widest">CORP.</span>
                            <span className="text-[14px] font-display text-transform-primary font-black text-blue-900 tracking-tight">TRUST</span>
                            <div className="absolute bottom-2 left-2 bg-brand-midnight text-white px-1.5 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest">RIGID</div>
                            {activeTemplate === 'corp' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest">ACTIVE</div>}
                        </button>

                        {/* Fun */}
                        <button
                            onClick={() => setActiveTemplate('fun')}
                            className={`relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] ${activeTemplate === 'fun' ? 'bg-brand-yellow shadow-[4px_4px_0_0_var(--color-brand-midnight)] translate-x-[-2px] translate-y-[-2px]' : 'bg-pink-100 hover:bg-pink-200 rounded-lg'}`}
                        >
                            <span className="text-[18px] font-display text-transform-primary font-black text-pink-600 italic drop-shadow-sm">FUN!</span>
                            <div className="absolute bottom-2 left-2 bg-brand-midnight text-white px-1.5 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest">BOUNCY</div>
                            {activeTemplate === 'fun' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest">ACTIVE</div>}
                        </button>

                        {/* Wild */}
                        <button
                            onClick={() => setActiveTemplate('wild')}
                            className={`relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] bg-black ${activeTemplate === 'wild' ? 'shadow-[4px_4px_0_0_var(--color-brand-midnight)] border-brand-yellow border-[4px] translate-x-[-2px] translate-y-[-2px]' : 'hover:bg-gray-900'}`}
                        >
                            <span className="text-[16px] font-display text-transform-primary font-black text-red-500 italic rotate-6 transform translate-x-1 absolute z-10 drop-shadow-[2px_2px_0_white]">WILD</span>
                            <span className="text-[18px] font-display text-transform-primary font-black text-green-500 italic -rotate-12 transform -translate-x-1 opacity-80">WILD</span>
                            <div className="absolute bottom-2 left-2 bg-white text-brand-midnight px-1.5 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest border border-brand-midnight">CHAOS</div>
                            {activeTemplate === 'wild' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest">ACTIVE</div>}
                        </button>

                        {/* Metro */}
                        <button
                            onClick={() => setActiveTemplate('metro')}
                            className={`col-span-2 relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] bg-white ${activeTemplate === 'metro' ? 'shadow-[4px_4px_0_0_var(--color-brand-midnight)] translate-x-[-2px] translate-y-[-2px]' : 'hover:bg-gray-50'}`}
                        >
                            <span className="text-[18px] font-display text-transform-primary text-primary tracking-widest drop-shadow-sm">Metro Standard</span>
                            <div className="absolute bottom-2 left-2 bg-primary text-on-primary px-1.5 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest">PACIFICO</div>
                            {activeTemplate === 'metro' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-dev text-transform-tertiary font-black tracking-widest">ACTIVE</div>}
                        </button>
                    </div>
                </InspectorAccordion>
            </Wrapper>

            {/* LIVE ATOM STYLING */}
            {activeAtom && settings && (
                <>
                    <Wrapper identity={{ displayName: "Styling", filePath: "zap/sections/atoms/typography/inspector.tsx", type: "Molecule" }}>
                        <InspectorAccordion title={`Styling: ${activeAtom}`} icon="format_paint" defaultOpen={true}>
                            <div className="space-y-4 pt-2">
                                {/* GLOBAL TEXT SETTINGS */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 bg-on-surface/5 border border-border/50 p-1.5 rounded">
                                        <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant w-8 tracking-wide">SIZE</span>
                                        <input type="number" title="Font Size" value={settings.fontSize || ''} placeholder="Auto" onChange={(e) => handleSettingChange('fontSize', e.target.value ? parseInt(e.target.value) : undefined)} className="flex-1 bg-transparent text-[11px] outline-none font-dev text-transform-tertiary text-on-surface" />
                                        <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant">px</span>
                                    </div>
                                </div>

                                <hr className="border-t border-border border-dashed opacity-50" />

                                {/* LAYER 0: BASE */}
                                <div className="space-y-1.5">
                                    <SectionHeader title="Fill (Base)" enabled={settings.layer0.enabled} onToggle={(val) => handleLayerChange('layer0', 'enabled', val)} />
                                    <div className={`transition-opacity ${!settings.layer0.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                        <div className="flex gap-2 items-center bg-on-surface/5 p-2 border border-border/50 rounded">
                                            <input type="color" title="Layer 0 Fill Color" value={settings.layer0.color} onChange={(e) => handleLayerChange('layer0', 'color', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer" />
                                            <div className="flex-1 flex items-center gap-2">
                                                <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant">Opacity</span>
                                                <input type="range" title="Layer 0 Opacity" min="0" max="1" step="0.05" value={settings.layer0.opacity} onChange={(e) => handleLayerChange('layer0', 'opacity', parseFloat(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                                <span className="text-[9px] font-dev text-transform-tertiary w-6 text-right text-on-surface">{Math.round(settings.layer0.opacity * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* LAYER 1: STROKE */}
                                <div className="space-y-1.5">
                                    <SectionHeader title="Stroke" enabled={settings.layer1.enabled} onToggle={(val) => handleLayerChange('layer1', 'enabled', val)} />
                                    <div className={`transition-opacity ${!settings.layer1.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                        <div className="flex gap-2 items-center bg-on-surface/5 p-2 border border-border/50 rounded">
                                            <input type="color" title="Layer 1 Stroke Color" value={settings.layer1.color} onChange={(e) => handleLayerChange('layer1', 'color', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer" />
                                            <div className="flex-1 flex items-center gap-2">
                                                <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant">Width</span>
                                                <input type="range" title="Layer 1 Stroke Width" min="1" max="10" step="1" value={settings.layer1.strokeWidth || 1} onChange={(e) => handleLayerChange('layer1', 'strokeWidth', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                                <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right text-on-surface">{settings.layer1.strokeWidth}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <hr className="border-t border-border border-dashed opacity-50" />

                                {/* BACKGROUND BOX */}
                                <div className="space-y-1.5">
                                    <SectionHeader title="Text Box Bg" enabled={settings.box?.enabled || false} onToggle={(val) => handleBoxChange('enabled', val)} />
                                    {settings.box?.enabled && (
                                        <div className="flex gap-2 items-center bg-on-surface/5 p-2 border border-border/50 rounded">
                                            <input type="color" title="Background Color" value={settings.box.backgroundColor} onChange={(e) => handleBoxChange('backgroundColor', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer" />
                                            <div className="flex-1 flex items-center gap-2">
                                                <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant">Padding</span>
                                                <input type="range" title="Padding Size" min="0" max="40" step="2" value={settings.box.padding} onChange={(e) => handleBoxChange('padding', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                                <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right text-on-surface">{settings.box.padding}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </InspectorAccordion>
                    </Wrapper>

                    <Wrapper identity={{ displayName: "Drop Shadows", filePath: "zap/sections/atoms/typography/inspector.tsx", type: "Molecule" }}>
                        <InspectorAccordion title="Drop Shadows" icon="layers" defaultOpen={false}>
                            <div className="space-y-4 pt-2">
                                {/* LAYER 2: SHADOW 1 */}
                                <div className="space-y-1.5">
                                    <SectionHeader title="Drop Shadow 1" enabled={settings.layer2.enabled} onToggle={(val) => handleLayerChange('layer2', 'enabled', val)} />
                                    <div className={`transition-opacity ${!settings.layer2.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                        <div className="flex gap-2 bg-on-surface/5 p-2 border border-border/50 rounded">
                                            <input type="color" title="Shadow 1 Color" value={settings.layer2.color} onChange={(e) => handleLayerChange('layer2', 'color', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer mt-1" />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant w-2">X</span>
                                                    <input type="range" title="Shadow 1 X Offset" min="-20" max="20" step="1" value={settings.layer2.x || 0} onChange={(e) => handleLayerChange('layer2', 'x', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                                    <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right text-on-surface">{settings.layer2.x}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant w-2">Y</span>
                                                    <input type="range" title="Shadow 1 Y Offset" min="-20" max="20" step="1" value={settings.layer2.y || 0} onChange={(e) => handleLayerChange('layer2', 'y', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                                    <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right text-on-surface">{settings.layer2.y}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant w-2">B</span>
                                                    <input type="range" title="Shadow 1 Blur" min="0" max="20" step="1" value={settings.layer2.blur || 0} onChange={(e) => handleLayerChange('layer2', 'blur', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                                    <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right text-on-surface">{settings.layer2.blur}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* LAYER 3: SHADOW 2 */}
                                <div className="space-y-1.5 mt-4">
                                    <SectionHeader title="Drop Shadow 2" enabled={settings.layer3.enabled} onToggle={(val) => handleLayerChange('layer3', 'enabled', val)} />
                                    <div className={`transition-opacity ${!settings.layer3.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                        <div className="flex gap-2 bg-on-surface/5 p-2 border border-border/50 rounded">
                                            <input type="color" title="Shadow 2 Color" value={settings.layer3.color} onChange={(e) => handleLayerChange('layer3', 'color', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer mt-1" />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant w-2">X</span>
                                                    <input type="range" title="Shadow 2 X Offset" min="-20" max="20" step="1" value={settings.layer3.x || 0} onChange={(e) => handleLayerChange('layer3', 'x', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                                    <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right text-on-surface">{settings.layer3.x}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant w-2">Y</span>
                                                    <input type="range" title="Shadow 2 Y Offset" min="-20" max="20" step="1" value={settings.layer3.y || 0} onChange={(e) => handleLayerChange('layer3', 'y', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                                    <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right text-on-surface">{settings.layer3.y}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-dev text-transform-tertiary font-bold text-on-surface-variant w-2">B</span>
                                                    <input type="range" title="Shadow 2 Blur" min="0" max="20" step="1" value={settings.layer3.blur || 0} onChange={(e) => handleLayerChange('layer3', 'blur', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                                    <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right text-on-surface">{settings.layer3.blur}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </InspectorAccordion>
                    </Wrapper>

                    <Wrapper identity={{ displayName: "Effects Engine", filePath: "zap/sections/atoms/typography/inspector.tsx", type: "Molecule" }}>
                        <InspectorAccordion title="Visual Effects" icon="auto_graph" defaultOpen={false}>
                            <div className="space-y-4 pt-2">
                                <SectionHeader title="Effects Engine" enabled={settings.effects?.enabled || false} onToggle={(val) => handleEffectChange('enabled', val)} />

                                <div className={`space-y-4 transition-opacity ${!settings.effects?.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                    {/* KINETIC TILT */}
                                    <div className="space-y-1.5 border border-border/50 p-3 rounded relative bg-on-surface/5">
                                        <span className="text-[9px] font-dev text-transform-tertiary font-black text-on-surface tracking-widest absolute -top-2 bg-layer-panel px-1">Kinetic Tilt</span>
                                        <div className="pt-1 flex items-center gap-2">
                                            <input type="range" title="Kinetic Tilt" min="-45" max="45" step="1" value={settings.effects?.kineticTilt || 0} onChange={(e) => handleEffectChange('kineticTilt', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                            <span className="text-[9px] font-dev text-transform-tertiary w-6 text-right font-bold text-on-surface">{settings.effects?.kineticTilt || 0}&deg;</span>
                                        </div>
                                    </div>

                                    {/* CHARACTER CRUSH */}
                                    <div className="space-y-1.5 border border-border/50 p-3 rounded relative bg-on-surface/5">
                                        <span className="text-[9px] font-dev text-transform-tertiary font-black text-on-surface tracking-widest absolute -top-2 bg-layer-panel px-1">Character Crush</span>
                                        <div className="pt-1 flex items-center gap-2">
                                            <input type="range" title="Character Crush" min="-10" max="20" step="1" value={settings.effects?.characterCrush || 0} onChange={(e) => handleEffectChange('characterCrush', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                            <span className="text-[9px] font-dev text-transform-tertiary w-6 text-right font-bold text-on-surface">{settings.effects?.characterCrush || 0}px</span>
                                        </div>
                                    </div>

                                    {/* UPPERCASE */}
                                    <div className="space-y-1.5 border border-border/50 p-2 rounded bg-on-surface/5 flex items-center justify-between">
                                        <span className="text-[9px] font-dev text-transform-tertiary font-black text-on-surface tracking-widest pl-1">Force Casing</span>
                                        <input type="checkbox" title="Force Uppercase" checked={settings.effects?.uppercase || false} onChange={(e) => handleEffectChange('uppercase', e.target.checked)} className="accent-brand-midnight w-3 h-3 cursor-pointer" />
                                    </div>

                                    {/* ANIMATION */}
                                    <div className="space-y-1.5 border border-border/50 p-3 rounded relative bg-on-surface/5">
                                        <span className="text-[9px] font-dev text-transform-tertiary font-black text-on-surface tracking-widest absolute -top-2 bg-layer-panel px-1">Hydra Animation</span>
                                        <div className="pt-1">
                                            <Select
                                                options={[
                                                    { label: 'None', value: 'none' },
                                                    { label: 'Pulse', value: 'pulse' },
                                                    { label: 'Bounce', value: 'bounce' },
                                                    { label: 'Spin', value: 'spin' },
                                                    { label: 'Wiggle', value: 'wiggle' }
                                                ]}
                                                value={settings.effects?.animation || 'none'}
                                                onChange={(value) => handleEffectChange('animation', value)}
                                                className="w-full text-[10px] font-dev text-transform-tertiary font-black tracking-widest text-on-surface bg-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </InspectorAccordion>
                    </Wrapper>
                </>
            )}
        </div>
    );
};
