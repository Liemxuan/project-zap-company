'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Rating } from '../../../../../genesis/molecules/rating';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function RatingSandboxPage() {    const [value, setValue] = useState(3);

    const inspectorControls = (
        
            <div className="space-y-4">
                
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Controls</h4>
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span>Current Rating Value</span>
                                <span className="font-bold">{value}</span>
                            </div>
                            <p className="text-label-small text-on-surface-variant text-transform-secondary font-body">Use the interaction preview to assign a rating score.</p>
                        </div>
                    </div>
                
            </div>
        
    );

    return (
        <ComponentSandboxTemplate
            componentName="Rating"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/components/ui/rating.tsx"
            importPath="@/components/ui/rating"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['text-primary', 'fill-primary', 'text-border'],
                typographyScales: ['font-body text-transform-secondary', 'font-display text-transform-primary', 'text-label-small', 'text-transform-tertiary']
            }}
            platformConstraints={{ web: "Supported", mobile: "Touch Supported" }}
            foundationRules={[
                "Uses font-body text-transform-secondary and text-transform-tertiary for labels", 
                "Score typography tied to primary palette",
                "Stars utilize Lucide with fill-primary mappings"
            ]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="rating" title="Rating Sandbox" description="Interactive components for Rating" icon="widgets" />
                    <CanvasBody.Demo className="w-full flex flex-col items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl gap-12">
                <div className="w-[60%] flex gap-4 flex-col max-w-[280px]">
                    <Rating 
                        label="RATING" 
                        value={value} 
                        onValueChange={setValue} 
                        max={5} 
                    />
                </div>
                
                <div className="w-[60%] flex gap-4 flex-col max-w-[280px] opacity-80 scale-95 border-t border-outline-variant pt-12">
                    <Rating 
                        label="READONLY STATE" 
                        value={4} 
                        max={5} 
                        disabled
                    />
                </div>
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}
