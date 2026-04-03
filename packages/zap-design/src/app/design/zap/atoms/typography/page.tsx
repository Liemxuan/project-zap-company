'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { TYPE_STYLES } from '../../../../../zap/sections/atoms/foundations/schema';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function TypographySandboxPage() {
    const [selectedScale, setSelectedScale] = useState(TYPE_STYLES[0].name);

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Type Scale</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={selectedScale}
                            onChange={(e) => setSelectedScale(e.target.value)}
                        >
                            {TYPE_STYLES.map(s => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const currentStyle = TYPE_STYLES.find(s => s.name === selectedScale) || TYPE_STYLES[0];

    return (
        <ComponentSandboxTemplate
            componentName="Typography"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/zap/sections/atoms/foundations/schema.ts"
            importPath="@/zap/sections/atoms/foundations/schema"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-on-surface', '--md-sys-color-primary'],
                typographyScales: TYPE_STYLES.map(s => `--font-${s.name.toLowerCase()}`)
            }}
            platformConstraints={{
                web: "Accessible type scales mapping to M3 dynamic typography tokens.",
                mobile: "Ensures line-height and font-size parity for readability."
            }}
            foundationRules={[
                "All typography must map to the --md-sys-typescale-* namespace.",
                "Display styles must use font-display for high-impact structural headers."
            ]}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="interactive-preview" 
                        number="01"
                        title="Interactive Preview"
                        icon="text_fields"
                        description="Live-configured type scale testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo centered>
                        <div className="w-full max-w-2xl p-12 bg-layer-panel border border-border/40 shadow-xl rounded-2xl flex flex-col gap-8 transition-all duration-300" style={{ borderRadius: '24px' }}>
                           <div className="space-y-4">
                               <div className="flex justify-between items-end border-b border-border/10 pb-2">
                                   <span className="text-labelSmall font-body text-primary uppercase tracking-widest font-bold">{currentStyle.name} Preview</span>
                                   <span className="text-[10px] text-muted-foreground font-mono">{currentStyle.fontSizeRem} / {currentStyle.lineHeight}</span>
                               </div>
                               <div 
                                   className="text-foreground transition-all duration-300"
                                   style={{ 
                                       fontSize: currentStyle.fontSizeRem,
                                       lineHeight: currentStyle.lineHeight,
                                       letterSpacing: `${currentStyle.letterSpacing}px`,
                                       fontWeight: currentStyle.fontWeight,
                                       fontFamily: currentStyle.name === 'Display' ? 'var(--font-display)' : 'var(--font-body)'
                                   }}
                               >
                                   The quick brown fox jumps over the lazy dog. ZAP infrastructure protocols are online and verifying.
                               </div>
                           </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="system-hierarchy" 
                        number="02"
                        title="System Hierarchy"
                        icon="format_align_left"
                        description="Structural testing across the full ZAP/M3 typography matrix."
                    />
                    <CanvasBody.Demo>
                        <div className="w-full max-w-4xl space-y-12">
                            {['Display', 'Headline', 'Title', 'Body', 'Label'].map(role => (
                                <div key={role} className="space-y-4 p-8 bg-layer-panel border border-border/40 rounded-xl">
                                    <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2 mb-6">{role} Scale</div>
                                    <div className="space-y-10">
                                        {TYPE_STYLES.filter(s => s.name.startsWith(role)).map(s => (
                                            <div key={s.name} className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                                                <div className="w-48 shrink-0 flex flex-col">
                                                    <span className="text-labelMedium font-body font-bold text-primary">{s.name}</span>
                                                    <span className="text-[10px] font-mono text-muted-foreground opacity-40">{s.fontSizeRem} · {s.fontWeight}</span>
                                                </div>
                                                <div 
                                                    className="flex-1 text-foreground"
                                                    style={{ 
                                                        fontSize: s.fontSizeRem,
                                                        lineHeight: s.lineHeight,
                                                        letterSpacing: `${s.letterSpacing}px`,
                                                        fontWeight: s.fontWeight,
                                                        fontFamily: role === 'Display' || role === 'Headline' ? 'var(--font-display)' : 'var(--font-body)'
                                                    }}
                                                >
                                                    ZAP Design Engine {s.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
