'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { CardsSection } from '../../../../../zap/sections/molecules/containment/CardsSection';

export default function CardsPage() {
    return (
        <ComponentSandboxTemplate
            componentName="Cards"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/zap/sections/molecules/containment/CardsSection.tsx"
            importPath="@/zap/sections/molecules/containment/CardsSection"
            foundationInheritance={{
                colorTokens: [
                    'bg-layer-panel (L3 section container)',
                    'bg-layer-dialog (L4 elevated/filled cards)',
                    'bg-surface-container (outlined card)',
                    'bg-primary-container / bg-secondary-container / bg-tertiary-container (icon badges)',
                ],
                typographyScales: ['text-on-surface text-transform-primary', 'text-on-surface-variant text-transform-secondary'],
            }}
            platformConstraints={{
                web: 'User Mini Cards grid is 3-col on desktop, 2-col on tablet, 1-col on mobile. Standard Cards are 3-col on desktop, 1-col on mobile.',
                mobile: 'Cards stack vertically. Padding and gaps reduce. Touch targets remain accessible.',
            }}
            foundationRules={[
                'Section containers use bg-layer-panel (L3 surface).',
                'Inner cards that need elevation use bg-layer-dialog (L4 surface).',
                'Outlined cards use bg-surface-container with border — no layer tag needed.',
                'Buttons inside cards are EXEMPT from layer tagging — they use M3 color roles.',
                'Never use bg-surface-container directly — use bg-layer-panel for elevation control.',
            ]}
        >
            <div className="w-full flex flex-col gap-8 py-8">
                <CardsSection />
            </div>
        </ComponentSandboxTemplate>
    );
}
