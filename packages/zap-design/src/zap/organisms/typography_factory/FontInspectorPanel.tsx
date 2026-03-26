'use client';

import React from 'react';

import { Wrapper } from '../../../components/dev/Wrapper';
import { LayoutTemplate } from 'lucide-react';
import type { TypographyTemplate } from '../../../zap/sections/atoms/typography/inspector';
import { InspectorAccordion } from '../../../zap/organisms/laboratory/InspectorAccordion';

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

interface FontInspectorPanelProps {
    activeTemplate: TypographyTemplate;
    setActiveTemplate: (t: TypographyTemplate) => void;
}

export const FontInspectorPanel: React.FC<FontInspectorPanelProps> = ({
    activeTemplate,
    setActiveTemplate,
}) => {
    return (
        <div className="space-y-6 font-sans select-none pb-20 px-4">
            {/* TEMPLATE GALLERY */}
            <Wrapper identity={{ displayName: "Template Gallery", filePath: "zap/organisms/typography_factory/FontInspectorPanel.tsx", type: "Organism/Panel" }}>
                <InspectorAccordion title="Template Gallery" icon={LayoutTemplate} defaultOpen={true}>
                    <div className="grid grid-cols-2 gap-3 pb-2 pt-2">
                        {/* Basic */}
                        <button
                            onClick={() => setActiveTemplate('basic')}
                            className={`relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] ${activeTemplate === 'basic' ? 'bg-brand-yellow shadow-[4px_4px_0_0_#1c1a0d] translate-x-[-2px] translate-y-[-2px]' : 'bg-layer-cover hover:bg-gray-100'}`}
                        >
                            <span className="text-[8px] font-medium text-brand-midnight/60 mb-1">The</span>
                            <span className="text-[14px] font-black text-brand-midnight text-transform-secondary tracking-tight">BASIC</span>
                            <div className="absolute bottom-2 left-2 bg-brand-midnight text-layer-cover px-1.5 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest">STANDARD</div>
                            {activeTemplate === 'basic' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest">ACTIVE</div>}
                        </button>

                        {/* Corp Trust */}
                        <button
                            onClick={() => setActiveTemplate('corp')}
                            className={`relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] ${activeTemplate === 'corp' ? 'bg-brand-yellow shadow-[4px_4px_0_0_#1c1a0d] translate-x-[-2px] translate-y-[-2px]' : 'bg-blue-100 hover:bg-blue-200'}`}
                        >
                            <span className="text-[8px] font-bold text-blue-900 border-b border-blue-900/40 mb-1 text-transform-tertiary tracking-widest">CORP.</span>
                            <span className="text-[14px] font-black text-blue-900 text-transform-secondary tracking-tight">TRUST</span>
                            <div className="absolute bottom-2 left-2 bg-brand-midnight text-layer-cover px-1.5 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest">RIGID</div>
                            {activeTemplate === 'corp' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest">ACTIVE</div>}
                        </button>

                        {/* Fun */}
                        <button
                            onClick={() => setActiveTemplate('fun')}
                            className={`relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] ${activeTemplate === 'fun' ? 'bg-brand-yellow shadow-[4px_4px_0_0_#1c1a0d] translate-x-[-2px] translate-y-[-2px]' : 'bg-pink-300 hover:bg-pink-400 rounded-lg'}`}
                        >
                            <span className="text-[18px] font-black text-white italic drop-shadow-sm text-transform-secondary">FUN!</span>
                            <div className="absolute bottom-2 left-2 bg-brand-midnight text-layer-cover px-1.5 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest">BOUNCY</div>
                            {activeTemplate === 'fun' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest">ACTIVE</div>}
                        </button>

                        {/* Wild */}
                        <button
                            onClick={() => setActiveTemplate('wild')}
                            className={`relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] bg-black ${activeTemplate === 'wild' ? 'shadow-[4px_4px_0_0_#1c1a0d] border-brand-yellow border-[4px] translate-x-[-2px] translate-y-[-2px]' : 'hover:bg-gray-900'}`}
                        >
                            <span className="text-[16px] font-black text-red-500 italic rotate-6 transform translate-x-1 text-transform-secondary absolute z-10 drop-shadow-[2px_2px_0_var(--color-layer-cover)]">WILD</span>
                            <span className="text-[18px] font-black text-green-500 italic -rotate-12 transform -translate-x-1 text-transform-secondary opacity-80">WILD</span>
                            <div className="absolute bottom-2 left-2 bg-layer-cover text-brand-midnight px-1.5 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest border border-brand-midnight">CHAOS</div>
                            {activeTemplate === 'wild' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest">ACTIVE</div>}
                        </button>

                        {/* Metro */}
                        <button
                            onClick={() => setActiveTemplate('metro')}
                            className={`col-span-2 relative border-[length:var(--card-border-width,2px)] border-brand-midnight p-3 flex flex-col items-center justify-center transition-all min-h-[80px] bg-white ${activeTemplate === 'metro' ? 'shadow-[4px_4px_0_0_#1c1a0d] translate-x-[-2px] translate-y-[-2px]' : 'hover:bg-gray-50'}`}
                        >
                            <span className="text-[18px] font-display text-transform-primary text-primary text-transform-secondary tracking-widest drop-shadow-sm">Metro Standard</span>
                            <div className="absolute bottom-2 left-2 bg-primary text-on-primary px-1.5 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest">PACIFICO</div>
                            {activeTemplate === 'metro' && <div className="absolute -top-2 -right-2 bg-brand-midnight text-brand-yellow px-1 py-0.5 text-[6px] font-black text-transform-tertiary tracking-widest">ACTIVE</div>}
                        </button>
                    </div>
                </InspectorAccordion>
            </Wrapper>
        </div>
    );
};
