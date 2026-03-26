'use client';

import { Wrapper } from '../../../../components/dev/Wrapper';
import { InspectorAccordion } from '../../../../zap/organisms/laboratory/InspectorAccordion';

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

export const TypographyInspector: React.FC<TypographyInspectorProps> = ({
    activeTemplate,
    setActiveTemplate,
}) => {
    return (
        <div className="font-body select-none pb-20">
            {/* TEMPLATE GALLERY */}
            <Wrapper identity={{ displayName: "Template Gallery", filePath: "zap/sections/atoms/typography/inspector.tsx", type: "Molecule" }}>
                <InspectorAccordion title="Template Gallery" icon="photo_library" defaultOpen={true}>
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
        </div>
    );
};
