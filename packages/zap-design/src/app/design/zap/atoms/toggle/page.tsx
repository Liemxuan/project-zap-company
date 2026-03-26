
'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Toggle } from '../../../../../genesis/atoms/interactive/toggle';
import { Toggle as GenesisToggle } from '../../../../../genesis/atoms/interactive/custom-toggle';
import { Bold, Italic, AlignCenter } from 'lucide-react';

export default function ToggleSandboxPage() {
    const [visualStyle, setVisualStyle] = useState<'solid' | 'outline' | 'ghost'>('solid');
    const [switchOn, setSwitchOn] = useState(true);
    const [switchOff, setSwitchOff] = useState(false);

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/toggle/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Toggle Structural Settings", type: "Docs Link", filePath: "zap/atoms/toggle/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>
                        
                        <div className="p-3 text-sm text-muted-foreground bg-layer-surface border border-border/50 rounded-md">
                            Button-style Toggle inherits from Button foundation tokens. Switch Toggle inherits from <code className="text-primary font-mono text-xs">--toggle-border-radius</code> and <code className="text-primary font-mono text-xs">--toggle-border-width</code>.
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--button-visual-style']) {
            setVisualStyle(variables['--button-visual-style'] as 'solid' | 'outline' | 'ghost');
        }
    };
        
    return (
        <ComponentSandboxTemplate
            componentName="Toggle"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/components/ui/toggle.tsx"
            importPath="@/components/ui/toggle"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "N/A",
                mobile: "N/A"
            }}
            foundationRules={[
                "Arbitrary Token Syntax Only."
            ]} onLoadedVariables={handleLoadedVariables}
        >
            <div className="w-full space-y-12 animate-in fade-in duration-500 pb-16">

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* GENESIS SWITCH TOGGLE - Consumes --toggle-border-* foundation */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="p-12 bg-layer-panel shadow-sm border border-outline-variant flex flex-col items-center justify-center text-on-surface w-full min-h-[160px] [border-radius:var(--toggle-border-radius,var(--layer-border-radius,9999px))]">
                   <div className="flex flex-col gap-12 items-start justify-center w-full max-w-sm">

                       <div className="flex flex-col gap-2 w-full">
                           <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Genesis Switch Toggle</span>
                           <span className="text-[10px] font-dev text-muted-foreground">
                               Inherits: <code>--toggle-border-radius</code> · <code>--toggle-border-width</code>
                           </span>
                           <div className="flex gap-6 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                               <div className="flex flex-col items-center gap-1">
                                   <GenesisToggle checked={switchOn} onChange={setSwitchOn} ariaLabel="Switch on" />
                                   <span className="text-[10px] font-dev text-muted-foreground">{switchOn ? 'ON' : 'OFF'}</span>
                               </div>
                               <div className="flex flex-col items-center gap-1">
                                   <GenesisToggle checked={switchOff} onChange={setSwitchOff} ariaLabel="Switch off" />
                                   <span className="text-[10px] font-dev text-muted-foreground">{switchOff ? 'ON' : 'OFF'}</span>
                               </div>
                               <div className="flex flex-col items-center gap-1">
                                   <GenesisToggle checked={true} onChange={() => {}} disabled ariaLabel="Disabled on" />
                                   <span className="text-[10px] font-dev text-muted-foreground">DISABLED</span>
                               </div>
                           </div>
                       </div>

                       <div className="flex flex-col gap-2 w-full">
                           <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Small Size</span>
                           <div className="flex gap-6 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                               <div className="flex flex-col items-center gap-1">
                                   <GenesisToggle checked={switchOn} onChange={setSwitchOn} size="sm" ariaLabel="Small switch" />
                                   <span className="text-[10px] font-dev text-muted-foreground">sm</span>
                               </div>
                               <div className="flex flex-col items-center gap-1">
                                   <GenesisToggle checked={false} onChange={() => {}} size="sm" ariaLabel="Small off" />
                                   <span className="text-[10px] font-dev text-muted-foreground">sm off</span>
                               </div>
                           </div>
                       </div>

                   </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* SHADCN BUTTON-STYLE TOGGLE - Inherits from Button foundation  */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="p-12 bg-layer-panel shadow-sm border border-outline-variant flex flex-col items-center justify-center text-on-surface w-full min-h-[160px] [border-radius:var(--button-border-radius)]">
                   <div className="flex flex-col gap-12 items-start justify-center w-full max-w-sm">

                       {/* Interactive Uncontrolled Example */}
                       <div className="flex flex-col gap-2 w-full">
                           <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Button-Style Toggle (Shadcn)</span>
                           <span className="text-[10px] font-dev text-muted-foreground">
                               Inherits: <code>--button-border-radius</code> · <code>--button-border-width</code>
                           </span>
                           <div className="flex gap-4 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                               <Toggle size="default" visualStyle={visualStyle} aria-label="Toggle bold">
                                   <Bold className="size-4" />
                                   <span className="font-bold">Bold</span>
                               </Toggle>
                               <span className="text-sm text-on-surface-variant">
                                   Click to toggle state natively without passing `pressed`.
                               </span>
                           </div>
                       </div>

                       {/* Interactive Disabled Example */}
                       <div className="flex flex-col gap-2 w-full">
                           <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Disabled Toggle</span>
                           <div className="flex gap-4 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                               <Toggle size="default" visualStyle={visualStyle} disabled>
                                   <Italic className="size-4" />
                                   <span className="italic">Italic</span>
                               </Toggle>
                               <span className="text-sm text-on-surface-variant">
                                   Disabled state, non-interactive.
                               </span>
                           </div>
                       </div>

                       {/* Sizes Example */}
                       <div className="flex flex-col gap-2 w-full">
                           <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Sizes</span>
                           <div className="flex gap-4 items-center p-4 bg-layer-surface border border-outline/20 rounded-md">
                               <Toggle size="sm" visualStyle={visualStyle}>
                                   <AlignCenter className="size-3" /> Sm
                               </Toggle>
                               <Toggle size="default" visualStyle={visualStyle}>
                                   <AlignCenter className="size-4" /> Default
                               </Toggle>
                               <Toggle size="default" visualStyle={visualStyle}>
                                   <AlignCenter className="size-5" /> Lg
                               </Toggle>
                           </div>
                       </div>

                   </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}

