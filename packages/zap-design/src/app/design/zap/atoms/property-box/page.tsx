
'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { PropertyBox, PropertyRow } from '../../../../../genesis/atoms/data-display/PropertyBox';

export default function PropertyBoxSandboxPage() {
    return (
        <ComponentSandboxTemplate
            componentName="PropertyBox"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/data-display/PropertyBox.tsx"
            importPath="@/genesis/atoms/data-display/PropertyBox"
            foundationInheritance={{
                colorTokens: ['--color-layer-cover', '--card-border-width', '--color-brand-midnight'],
                typographyScales: []
            }}
            platformConstraints={{ web: "Full support", mobile: "Full support" }}
            foundationRules={[
                "PropertyBox is a bordered container using layer-cover background.",
                "Uses --card-border-width for border sizing and rounded-card for radius.",
                "PropertyRow displays label-value pairs with 10px uppercase bold text.",
                "Row borders use brand-midnight/10 color.",
            ]}
        >
            <div className="w-full space-y-10 animate-in fade-in duration-500 pb-8">

                {/* Theme Properties */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Theme Properties</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        Key-value display for theme configuration · <code>PropertyBox</code> + <code>PropertyRow</code>
                    </span>
                    <Wrapper identity={{ displayName: "PropertyBox", type: "Atom", filePath: "genesis/atoms/data-display/PropertyBox.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 w-full max-w-md">
                            <PropertyBox>
                                <PropertyRow label="Theme" value="Metro Dark" />
                                <PropertyRow label="Engine" value="Material 3" />
                                <PropertyRow label="Border Radius" value="rounded-lg" />
                                <PropertyRow label="Card Border" value="2px" />
                                <PropertyRow label="Primary Font" value="Space Grotesk" />
                            </PropertyBox>
                        </div>
                    </Wrapper>
                </div>

                {/* Component Stats */}
                <div className="space-y-2">
                    <span className="text-label-small font-semibold text-muted-foreground uppercase tracking-widest">Component Stats</span>
                    <span className="text-label-small font-dev text-muted-foreground block">
                        Used in Inspector panels for component metadata
                    </span>
                    <Wrapper identity={{ displayName: "PropertyBox (Stats)", type: "Atom", filePath: "genesis/atoms/data-display/PropertyBox.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-6 w-full max-w-md">
                            <PropertyBox>
                                <PropertyRow label="Total Atoms" value="24" />
                                <PropertyRow label="Verified" value="21" />
                                <PropertyRow label="In Progress" value="3" />
                                <PropertyRow label="Test Coverage" value="87%" />
                            </PropertyBox>
                        </div>
                    </Wrapper>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
