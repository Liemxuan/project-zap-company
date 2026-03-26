'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { Select } from '../../../genesis/atoms/interactive/option-select';
import { LayeredStylizationSettings } from '../../../zap/sections/atoms/typography/inspector';

interface DraggableToolboxProps {
    atomId: string;
    settings: LayeredStylizationSettings;
    onUpdate: (newSettings: LayeredStylizationSettings) => void;
    onClose: () => void;
    onSave: () => void;
    onMakeGlobal?: () => void;
    onPublishComponent?: () => void;
}

const SectionHeader = ({ title, enabled, onToggle }: { title: string, enabled?: boolean, onToggle?: (val: boolean) => void }) => (
    <div className="flex justify-between items-center mb-1 group">
        {onToggle !== undefined ? (
            <label className="text-[10px] font-black text-transform-tertiary tracking-wide text-brand-midnight flex items-center gap-2 cursor-pointer select-none">
                <input title={`Toggle ${title}`} type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} className="accent-brand-midnight w-3 h-3" />
                {title}
            </label>
        ) : (
            <span className="text-[10px] font-black text-transform-tertiary tracking-wide text-brand-midnight">{title}</span>
        )}
    </div>
);

export const DraggableToolbox = ({ atomId, settings, onUpdate, onClose, onSave, onMakeGlobal, onPublishComponent }: DraggableToolboxProps) => {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState<'styling' | 'effects'>('styling');
    const dragRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const startPos = useRef({ x: 0, y: 0 });

    // Clamp position to viewport on mount and when tab changes
    const clampToViewport = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 8;
        const maxY = window.innerHeight - rect.height - 8;
        setPosition(prev => ({
            x: Math.max(8, Math.min(prev.x, maxX)),
            y: Math.max(8, Math.min(prev.y, maxY)),
        }));
    }, []);

    useEffect(() => { clampToViewport(); }, [clampToViewport, activeTab]);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const el = containerRef.current;
        const w = el?.offsetWidth || 260;
        const h = el?.offsetHeight || 400;
        setPosition({
            x: Math.max(8, Math.min(e.clientX - startPos.current.x, window.innerWidth - w - 8)),
            y: Math.max(8, Math.min(e.clientY - startPos.current.y, window.innerHeight - h - 8)),
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    const handleSettingChange = (key: keyof LayeredStylizationSettings, value: string | number | boolean | undefined) => {
        onUpdate({
            ...settings,
            [key]: value
        });
    };

    const handleBoxChange = (key: string, value: string | number | boolean | undefined) => {
        onUpdate({
            ...settings,
            box: {
                ...(settings.box || { enabled: false, backgroundColor: '#ffffff', padding: 8 }),
                [key]: value
            }
        });
    };

    const handleLayerChange = (layer: 'layer0' | 'layer1' | 'layer2' | 'layer3', key: string, value: string | number | boolean | undefined) => {
        onUpdate({
            ...settings,
            [layer]: {
                ...settings[layer],
                [key]: value
            }
        });
    };

    const handleEffectChange = (key: string, value: string | number | boolean | undefined) => {
        onUpdate({
            ...settings,
            effects: {
                ...(settings.effects || { enabled: true }),
                [key]: value
            }
        });
    };

    return (
        <div
            ref={containerRef}
            className="fixed z-[100] w-[260px] bg-[#fdfdfd] border-[length:var(--card-border-width,2px)] border-brand-midnight shadow-[4px_4px_0px_0px_var(--color-brand-midnight)] flex flex-col rounded-md overflow-hidden"
            style={{ left: position.x, top: position.y }}
        >
            {/* DRAG HANDLE */}
            <div
                ref={dragRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="bg-brand-midnight p-1.5 flex items-center justify-between cursor-move select-none"
            >
                <div className="flex items-center gap-2 pl-1">
                    <Icon name="drag_indicator" size={14} className="text-white opacity-50" />
                    <span className="text-[11px] font-black tracking-widest text-white font-display text-transform-primary">{atomId}</span>
                </div>
                <button title="Close toolbox" onClick={onClose} className="text-white hover:text-brand-yellow transition-colors pr-1">
                    <Icon name="close" size={16} />
                </button>
            </div>

            {/* TABS */}
            <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                    onClick={() => setActiveTab('styling')}
                    className={`flex-1 py-1.5 text-[10px] font-display text-transform-primary font-black tracking-widest ${activeTab === 'styling' ? 'bg-white text-brand-midnight border-b-2 border-brand-midnight' : 'text-gray-400 hover:text-brand-midnight'}`}
                >
                    Styling
                </button>
                <button
                    onClick={() => setActiveTab('effects')}
                    className={`flex-1 py-1.5 text-[10px] font-display text-transform-primary font-black tracking-widest ${activeTab === 'effects' ? 'bg-white text-brand-midnight border-b-2 border-brand-midnight' : 'text-gray-400 hover:text-brand-midnight'}`}
                >
                    Effects
                </button>
            </div>

            {/* CONTROLS */}
            <div className="p-3 space-y-4 max-h-[500px] overflow-y-auto w-full font-sans scrollbar-thin scrollbar-thumb-brand-midnight scrollbar-track-transparent">

                {activeTab === 'styling' && (
                    <>

                        {/* GLOBAL TEXT SETTINGS */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-1.5 rounded">
                                <span className="text-[9px] font-bold text-gray-500 w-8 tracking-wide">SIZE</span>
                                <input type="number" title="Font Size" value={settings.fontSize || ''} placeholder="Auto" onChange={(e) => handleSettingChange('fontSize', e.target.value ? parseInt(e.target.value) : undefined)} className="flex-1 bg-transparent text-[11px] outline-none font-dev text-transform-tertiary" />
                                <span className="text-[9px] font-bold text-gray-400">px</span>
                            </div>
                        </div>

                        <hr className="border-t border-brand-midnight border-dashed opacity-20" />

                        {/* BACKGROUND BOX */}
                        <div className="space-y-1.5">
                            <SectionHeader title="Text Box Bg" enabled={settings.box?.enabled || false} onToggle={(val) => handleBoxChange('enabled', val)} />
                            {settings.box?.enabled && (
                                <div className="flex gap-2 items-center bg-gray-50 p-2 border border-gray-200 rounded">
                                    <input type="color" title="Background Color" value={settings.box.backgroundColor} onChange={(e) => handleBoxChange('backgroundColor', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer" />
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="text-[9px] font-bold text-gray-500 text-transform-tertiary">Padding</span>
                                        <input type="range" title="Padding Size" min="0" max="40" step="2" value={settings.box.padding} onChange={(e) => handleBoxChange('padding', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                        <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right">{settings.box.padding}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <hr className="border-t border-brand-midnight border-dashed opacity-20" />

                        {/* LAYER 0: BASE */}
                        <div className="space-y-1.5">
                            <SectionHeader title="Fill (Base)" enabled={settings.layer0.enabled} onToggle={(val) => handleLayerChange('layer0', 'enabled', val)} />
                            <div className={`transition-opacity ${!settings.layer0.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                <div className="flex gap-2 items-center bg-gray-50 p-2 border border-gray-200 rounded">
                                    <input type="color" title="Layer 0 Fill Color" value={settings.layer0.color} onChange={(e) => handleLayerChange('layer0', 'color', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer" />
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="text-[9px] font-bold text-gray-500 text-transform-tertiary">Opacity</span>
                                        <input type="range" title="Layer 0 Opacity" min="0" max="1" step="0.05" value={settings.layer0.opacity} onChange={(e) => handleLayerChange('layer0', 'opacity', parseFloat(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                        <span className="text-[9px] font-dev text-transform-tertiary w-6 text-right">{Math.round(settings.layer0.opacity * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LAYER 1: STROKE */}
                        <div className="space-y-1.5">
                            <SectionHeader title="Stroke" enabled={settings.layer1.enabled} onToggle={(val) => handleLayerChange('layer1', 'enabled', val)} />
                            <div className={`transition-opacity ${!settings.layer1.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                <div className="flex gap-2 items-center bg-gray-50 p-2 border border-gray-200 rounded">
                                    <input type="color" title="Layer 1 Stroke Color" value={settings.layer1.color} onChange={(e) => handleLayerChange('layer1', 'color', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer" />
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="text-[9px] font-bold text-gray-500 text-transform-tertiary">Width</span>
                                        <input type="range" title="Layer 1 Stroke Width" min="1" max="10" step="1" value={settings.layer1.strokeWidth || 1} onChange={(e) => handleLayerChange('layer1', 'strokeWidth', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                        <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right">{settings.layer1.strokeWidth}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LAYER 2: SHADOW 1 */}
                        <div className="space-y-1.5">
                            <SectionHeader title="Drop Shadow 1" enabled={settings.layer2.enabled} onToggle={(val) => handleLayerChange('layer2', 'enabled', val)} />
                            <div className={`transition-opacity ${!settings.layer2.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                <div className="flex gap-2 bg-gray-50 p-2 border border-gray-200 rounded">
                                    <input type="color" title="Shadow 1 Color" value={settings.layer2.color} onChange={(e) => handleLayerChange('layer2', 'color', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer mt-1" />
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-gray-400 w-2">X</span>
                                            <input type="range" title="Shadow 1 X Offset" min="-20" max="20" step="1" value={settings.layer2.x || 0} onChange={(e) => handleLayerChange('layer2', 'x', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                            <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right">{settings.layer2.x}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-gray-400 w-2">Y</span>
                                            <input type="range" title="Shadow 1 Y Offset" min="-20" max="20" step="1" value={settings.layer2.y || 0} onChange={(e) => handleLayerChange('layer2', 'y', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                            <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right">{settings.layer2.y}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-gray-400 w-2">B</span>
                                            <input type="range" title="Shadow 1 Blur" min="0" max="20" step="1" value={settings.layer2.blur || 0} onChange={(e) => handleLayerChange('layer2', 'blur', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                            <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right">{settings.layer2.blur}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LAYER 3: SHADOW 2 */}
                        <div className="space-y-1.5">
                            <SectionHeader title="Drop Shadow 2" enabled={settings.layer3.enabled} onToggle={(val) => handleLayerChange('layer3', 'enabled', val)} />
                            <div className={`transition-opacity ${!settings.layer3.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                                <div className="flex gap-2 bg-gray-50 p-2 border border-gray-200 rounded">
                                    <input type="color" title="Shadow 2 Color" value={settings.layer3.color} onChange={(e) => handleLayerChange('layer3', 'color', e.target.value)} className="w-5 h-5 p-0 border border-gray-300 rounded-sm cursor-pointer mt-1" />
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-gray-400 w-2">X</span>
                                            <input type="range" title="Shadow 2 X Offset" min="-20" max="20" step="1" value={settings.layer3.x || 0} onChange={(e) => handleLayerChange('layer3', 'x', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                            <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right">{settings.layer3.x}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-gray-400 w-2">Y</span>
                                            <input type="range" title="Shadow 2 Y Offset" min="-20" max="20" step="1" value={settings.layer3.y || 0} onChange={(e) => handleLayerChange('layer3', 'y', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                            <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right">{settings.layer3.y}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-gray-400 w-2">B</span>
                                            <input type="range" title="Shadow 2 Blur" min="0" max="20" step="1" value={settings.layer3.blur || 0} onChange={(e) => handleLayerChange('layer3', 'blur', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                            <span className="text-[9px] font-dev text-transform-tertiary w-4 text-right">{settings.layer3.blur}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'effects' && (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <SectionHeader title="Effects Engine" enabled={settings.effects?.enabled || false} onToggle={(val) => handleEffectChange('enabled', val)} />
                        </div>

                        <div className={`space-y-4 transition-opacity ${!settings.effects?.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
                            {/* KINETIC TILT */}
                            <div className="space-y-1.5 border border-brand-midnight p-2 rounded relative bg-[#fdfdfd] shadow-[2px_2px_0_0_var(--color-brand-midnight)]">
                                <span className="text-[9px] font-black text-transform-tertiary text-brand-midnight tracking-widest absolute -top-2 bg-white px-1">Kinetic Tilt</span>
                                <div className="pt-2 flex items-center gap-2">
                                    <input type="range" title="Kinetic Tilt" min="-45" max="45" step="1" value={settings.effects?.kineticTilt || 0} onChange={(e) => handleEffectChange('kineticTilt', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                    <span className="text-[9px] font-dev text-transform-tertiary w-6 text-right font-bold text-brand-midnight">{settings.effects?.kineticTilt || 0}&deg;</span>
                                </div>
                            </div>

                            {/* CHARACTER CRUSH */}
                            <div className="space-y-1.5 border border-brand-midnight p-2 rounded relative bg-[#fdfdfd] shadow-[2px_2px_0_0_var(--color-brand-midnight)]">
                                <span className="text-[9px] font-black text-transform-tertiary text-brand-midnight tracking-widest absolute -top-2 bg-white px-1">Character Crush</span>
                                <div className="pt-2 flex items-center gap-2">
                                    <input type="range" title="Character Crush" min="-10" max="20" step="1" value={settings.effects?.characterCrush || 0} onChange={(e) => handleEffectChange('characterCrush', parseInt(e.target.value))} className="flex-1 h-1 bg-brand-midnight appearance-none cursor-pointer rounded-full" />
                                    <span className="text-[9px] font-dev text-transform-tertiary w-6 text-right font-bold text-brand-midnight">{settings.effects?.characterCrush || 0}px</span>
                                </div>
                            </div>

                            {/* UPPERCASE */}
                            <div className="space-y-1.5 border border-brand-midnight p-2 rounded relative bg-[#fdfdfd] shadow-[2px_2px_0_0_var(--color-brand-midnight)] flex items-center justify-between">
                                <span className="text-[9px] font-black text-transform-tertiary text-brand-midnight tracking-widest">Force Uppercase</span>
                                <input type="checkbox" title="Force Uppercase" checked={settings.effects?.uppercase || false} onChange={(e) => handleEffectChange('uppercase', e.target.checked)} className="accent-brand-midnight w-3 h-3 cursor-pointer" />
                            </div>

                            {/* ANIMATION */}
                            <div className="space-y-1.5 border border-brand-midnight p-2 rounded relative bg-[#fdfdfd] shadow-[2px_2px_0_0_var(--color-brand-midnight)]">
                                <span className="text-[9px] font-black text-transform-tertiary text-brand-midnight tracking-widest absolute -top-2 bg-white px-1">Hydra Animation</span>
                                <div className="pt-2">
                                    <Select
                                        options={[
                                            { label: 'None', value: 'none' },
                                            { label: 'Pulse', value: 'pulse' },
                                            { label: 'Bounce', value: 'bounce' },
                                            { label: 'Spin', value: 'spin' },
                                            { label: 'Wiggle', value: 'wiggle' }
                                        ]}
                                        value={settings.effects?.animation || 'none'}
                                        onChange={(val) => handleEffectChange('animation', val)}
                                        className="w-full text-[10px] font-black text-transform-tertiary tracking-widest text-brand-midnight"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ACTION FOOTER */}
            <div className="p-2 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
                <div className="flex gap-2">
                    <button
                        onClick={onSave}
                        className="flex-1 bg-gray-200 text-brand-midnight text-[10px] font-black text-transform-tertiary tracking-widest py-1.5 rounded hover:bg-gray-300 transition-colors"
                    >
                        Done
                    </button>
                    {onMakeGlobal && (
                        <button
                            onClick={onMakeGlobal}
                            className="flex-1 bg-brand-yellow text-brand-midnight text-[10px] font-black text-transform-tertiary tracking-widest py-1.5 rounded hover:bg-[#e6cc00] transition-colors shadow-[2px_2px_0_0_var(--color-brand-midnight)]"
                        >
                            Sync Global
                        </button>
                    )}
                </div>
                {onPublishComponent && (
                    <button
                        onClick={onPublishComponent}
                        className="w-full bg-primary/10 text-primary text-[10px] font-black text-transform-tertiary tracking-widest py-1.5 rounded hover:bg-primary/20 transition-colors"
                        title={"Publish " + atomId + " to active theme"}
                    >
                        Publish Atom
                    </button>
                )}
            </div>
        </div>
    );
};
