'use client';

import React, { useState } from 'react';
import { parseCssToNumber } from '../../../../../lib/utils';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { InputModulesShowcase } from '../../../../../zap/sections/molecules/inputs/InputModulesShowcase';

export default function InputModulesV2Page() {
    // ── L1 Inspector State ──────────────────────────────────────────
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([8]);
    const [inputHeight, setInputHeight] = useState([40]);
    const [sourceWidth, setSourceWidth] = useState<'input' | 'layer' | 'default'>('default');
    const [sourceRadius, setSourceRadius] = useState<'input' | 'layer' | 'default'>('default');
    const [sourceHeight, setSourceHeight] = useState<'input' | 'default'>('default');

    // ── Source label helper ─────────────────────────────────────────
    const sourceLabel = (src: string) =>
        src === 'input' ? '← L4 published' : src === 'layer' ? '← L1 foundation' : '← default';

    // ── L1 Inspector Controls ───────────────────────────────────────
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/inputs/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Input L1 Controls", type: "Docs Link", filePath: "zap/molecules/inputs/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider uppercase">L1 Foundation Controls</h4>

                        {/* --input-border-width */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                <span>--input-border-width</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                    <span className="text-primary/60 normal-case">{sourceLabel(sourceWidth)}</span>
                                </div>
                            </div>
                            <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={4} step={1} className="w-full" />
                        </div>

                        {/* --input-border-radius */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                <span>--input-border-radius</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{borderRadius[0]}px</span>
                                    <span className="text-primary/60 normal-case">{sourceLabel(sourceRadius)}</span>
                                </div>
                            </div>
                            <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={32} step={1} className="w-full" />
                        </div>

                        {/* --input-height */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary uppercase">
                                <span>--input-height</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{inputHeight[0]}px</span>
                                    <span className="text-primary/60 normal-case">{sourceLabel(sourceHeight)}</span>
                                </div>
                            </div>
                            <Slider value={inputHeight} onValueChange={setInputHeight} min={28} max={56} step={2} className="w-full" />
                        </div>

                        {/* Cascade info */}
                        <div className="p-3 text-[10px] font-dev text-on-surface-variant text-transform-secondary bg-layer-surface border border-outline-variant/50 rounded-md space-y-1">
                            <p><strong>L1</strong> → <code>--layer-border-*</code> (Border & Radius foundation)</p>
                            <p><strong>L4</strong> → <code>--input-border-*</code>, <code>--input-height</code> (component override)</p>
                            <p className="pt-1 text-on-surface-variant text-transform-secondary/60">Sliders seed from L4 if published, else fall through to L1 foundation values.</p>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    // ── Load saved values: L4 component → L1 foundation → hardcoded default ──
    const handleLoadedVariables = (variables: Record<string, string>) => {
        // Width cascade: --input-border-width → --layer-border-width → 1px
        if (variables['--input-border-width']) {
            setBorderWidth([parseCssToNumber(variables['--input-border-width'])]);
            setSourceWidth('input');
        } else if (variables['--layer-border-width']) {
            setBorderWidth([parseCssToNumber(variables['--layer-border-width'])]);
            setSourceWidth('layer');
        }
        // Radius cascade: --input-border-radius → --layer-border-radius → 8px
        if (variables['--input-border-radius']) {
            setBorderRadius([parseCssToNumber(variables['--input-border-radius'])]);
            setSourceRadius('input');
        } else if (variables['--layer-border-radius']) {
            setBorderRadius([parseCssToNumber(variables['--layer-border-radius'])]);
            setSourceRadius('layer');
        }
        // Height: --input-height → 40px (no L1 equivalent)
        if (variables['--input-height']) {
            setInputHeight([parseCssToNumber(variables['--input-height'])]);
            setSourceHeight('input');
        }
    };

    // ── CSS var injection (L1 → L4 cascade) ─────────────────────────
    const cssVars = {
        '--input-border-width': `${borderWidth[0]}px`,
        '--input-border-radius': `${borderRadius[0]}px`,
        '--input-height': `${inputHeight[0]}px`,
    } as React.CSSProperties;

    return (
        <ComponentSandboxTemplate
            componentName="Input Modules"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/zap/sections/molecules/inputs/InputModulesShowcase.tsx"
            importPath="@/zap/sections/molecules/inputs/InputModulesShowcase"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: [
                    'bg-layer-panel (L3 section container)',
                    'bg-layer-cover (L3 input cards)',
                    'border-outline-variant (input borders)',
                    'text-on-surface text-transform-primary (input values)',
                    'text-on-surface-variant text-transform-secondary (placeholders, hints)',
                ],
                typographyScales: [
                    'font-display (section headings)',
                    'font-body (descriptions, labels)',
                    'font-dev (token annotations)',
                ],
            }}
            platformConstraints={{
                web: 'Input cards display in 3-col grid on desktop, 2-col on tablet, single column on mobile. All inputs stretch to fill parent width.',
                mobile: 'Date pickers use native OS dialogs. OTP inputs expand to full width. Multi-select uses bottom sheet pattern.',
            }}
            foundationRules={[
                'Input cards use bg-layer-cover with rounded-[var(--input-border-radius)].',
                'Border width cascades: --input-border-width → --layer-border-width → 1px',
                'Border radius cascades: --input-border-radius → --layer-border-radius → 8px',
                'Input height controlled by --input-height (default 40px).',
                'Labels use font-body L2 typography. Section heads use Heading atoms.',
                'All state text (errors, hints) uses Text atom with iso-100 scale.',
            ]}
            publishPayload={{
                '--input-border-width': `${borderWidth[0]}px`,
                '--input-border-radius': `${borderRadius[0]}px`,
                '--input-height': `${inputHeight[0]}px`,
            }}
            onLoadedVariables={handleLoadedVariables}
        >
            <InputModulesShowcase cssVars={cssVars} />
        </ComponentSandboxTemplate>
    );
}
