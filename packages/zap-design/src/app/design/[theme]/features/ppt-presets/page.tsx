'use client';

import React, { useState } from 'react';
import { PresentationPreset, getPresetsByCategory, PresentationCategory } from '../../../../../registry/presentation-presets';
import { Card } from '../../../../../genesis/atoms/surfaces/card';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Button } from '../../../../../components/ui/button';


export default function PresentationPresetsShowcase() {
    const [selectedPreset, setSelectedPreset] = useState<PresentationPreset | null>(null);
    const presetsByCategory = getPresetsByCategory();

    const handleSelect = (preset: PresentationPreset) => {
        setSelectedPreset(preset);
        // In the real implementation inside Swarm, this would dispatch an event
        // or configure the chat context with the prompt payload.
    };

    const handleCopyPayload = () => {
        if (!selectedPreset) return;
        const payload = JSON.stringify(selectedPreset.style_guidelines, null, 2);
        navigator.clipboard.writeText(payload);
        // Toast notification could go here
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Main Gallery Area */}
            <div className="flex-1 bg-layer-base p-8 w-full overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-12 pb-24">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Presentation & Marketing Presets</h1>
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            Visual starting points for autonomous generation. Select a design constraint payload to configure NotebookLM and OmniQueue agents.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {(Object.keys(presetsByCategory) as PresentationCategory[]).map(category => (
                            <div key={category} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-display font-semibold text-foreground">{category}</h2>
                                    <div className="h-px bg-outline-variant flex-1" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {presetsByCategory[category].map(preset => (
                                        <div key={preset.id} onClick={() => handleSelect(preset)}>
                                            <Card 
                                                className={`
                                                    group cursor-pointer overflow-hidden border transition-all duration-300
                                                    ${selectedPreset?.id === preset.id 
                                                        ? 'border-primary ring-2 ring-primary/20 shadow-md transform scale-[1.02]' 
                                                        : 'border-outline-variant hover:border-primary/50 hover:shadow-sm'
                                                    }
                                                `}
                                            >
                                            {/* Thumbnail Preview Area */}
                                            <div 
                                                className="w-full aspect-video relative flex items-center justify-center p-6 border-b border-outline-variant/30 transition-transform duration-500 group-hover:scale-105"
                                                style={{ background: preset.thumbnailPreview.background }}
                                            >
                                                <div 
                                                    className="w-3/4 aspect-video rounded-md shadow-2xl relative flex flex-col justify-center items-center p-4 border border-white/5 backdrop-blur-md"
                                                    style={{ 
                                                        backgroundColor: preset.thumbnailPreview.accent,
                                                        color: preset.thumbnailPreview.foreground,
                                                        opacity: 0.9
                                                    }}
                                                >
                                                    <div className="text-center space-y-2">
                                                        <div className="font-display font-black text-2xl tracking-tighter mix-blend-overlay">Aa</div>
                                                        <div className="h-1 w-8 mx-auto bg-current rounded-full opacity-50" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Meta Data */}
                                            <div className="p-5 space-y-3 bg-layer-surface">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h3 className="font-bold text-foreground truncate">{preset.title}</h3>
                                                    {selectedPreset?.id === preset.id && (
                                                        <Icon name="check_circle" size={20} className="text-primary flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {preset.description}
                                                </p>
                                            </div>
                                        </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Inspector Sidebar */}
            <div className="w-[400px] border-l border-outline-variant bg-layer-panel flex flex-col h-full shadow-2xl relative z-10 shrink-0">
                <div className="p-6 border-b border-outline-variant/50 sticky top-0 bg-layer-panel/95 backdrop-blur z-20">
                    <h2 className="text-sm font-bold text-transform-primary uppercase tracking-widest text-muted-foreground">Inspector</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {!selectedPreset ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center px-8 space-y-4 text-muted-foreground">
                            <Icon name="style" size={48} className="opacity-20" />
                            <p className="text-sm">Select a presentation preset from the gallery to view its constraint payload.</p>
                        </div>
                    ) : (
                        <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-sm border px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider">{selectedPreset.category}</span>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-foreground">{selectedPreset.title}</h3>
                                <p className="text-sm text-muted-foreground">{selectedPreset.description}</p>
                            </div>

                            {/* Base Prompt Injection */}
                            {selectedPreset.basePrompt && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-transform-primary uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <Icon name="chat" size={14} /> Swarm Base Prompt
                                    </h4>
                                    <div className="p-3 bg-layer-base rounded border border-outline-variant/30">
                                        <p className="text-xs font-mono text-muted-foreground leading-relaxed break-words">
                                            &quot;{selectedPreset.basePrompt}&quot;
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Constraint Payload */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-transform-primary uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                    <Icon name="code" size={14} /> Style Guidelines Payload
                                </h4>
                                <div className="space-y-4">
                                    {Object.entries(selectedPreset.style_guidelines).map(([key, value]) => (
                                        <div key={key} className="space-y-1.5">
                                            <div className="text-[10px] uppercase font-dev text-primary/80 font-bold">{key.replace('_', ' ')}</div>
                                            <div className="text-sm text-foreground/90 leading-relaxed p-2.5 bg-layer-base rounded border border-outline-variant/20 shadow-inner">
                                                {value as string}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-outline-variant bg-layer-panel z-20">
                    <Button 
                        className="w-full font-bold shadow-md hover:shadow-lg transition-all" 
                        disabled={!selectedPreset}
                        size="lg"
                        onClick={handleCopyPayload}
                    >
                        {selectedPreset ? (
                            <span className="flex items-center gap-2">
                                <Icon name="content_copy" size={18} />
                                Copy JSON Payload
                            </span>
                        ) : (
                            'Select a Preset'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
