
'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../../genesis/atoms/interactive/avatar';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function AvatarSandboxPage() {
    const [height, setHeight] = useState([40]);
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([8]);
    
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/avatar/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Avatar Structural Settings", type: "Docs Link", filePath: "zap/atoms/avatar/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--avatar-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={16} max={128} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--avatar-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--avatar-border-radius</span>
                                    <span className="font-bold">{borderRadius[0]}px</span>
                                </div>
                                <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={64} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

            const handleLoadedVariables = (variables: Record<string, string>) => {
                if (variables['--avatar-size-md']) setHeight([parseCssToNumber(variables['--avatar-size-md'])]);
                            if (variables['--avatar-border-width']) setBorderWidth([parseCssToNumber(variables['--avatar-border-width'])]);
                            if (variables['--avatar-border-radius']) setBorderRadius([parseCssToNumber(variables['--avatar-border-radius'])]);
            };
        
    return (
        <ComponentSandboxTemplate
            componentName="Avatar"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/components/ui/avatar.tsx"
            importPath="@/components/ui/avatar"
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
            ]} publishPayload={{ '--avatar-size-sm': (height[0] * 0.75) + 'px',
                        '--avatar-size-md': height[0] + 'px',
                        '--avatar-size-lg': (height[0] * 1.5) + 'px',
                        '--avatar-size-xl': (height[0] * 2) + 'px',
                        '--avatar-border-width': borderWidth[0] + 'px',
                        '--avatar-border-radius': borderRadius[0] + 'px' }} onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .avatar-preview-sandbox {
                    --avatar-border-width: ${borderWidth[0]}px;
                    --avatar-border-radius: ${borderRadius[0]}px;
                    --avatar-size-sm: ${height[0] * 0.75}px;
                    --avatar-size-md: ${height[0]}px;
                    --avatar-size-lg: ${height[0] * 1.5}px;
                    --avatar-size-xl: ${height[0] * 2}px;
                }
            ` }} />
            <div 
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 avatar-preview-sandbox"
            >
                <div className="p-12 bg-layer-panel shadow-sm border-[length:var(--card-border-width)] border-outline-variant rounded-[length:var(--card-radius)] flex flex-col items-center justify-center gap-12 text-on-surface w-full">
                   
                   <div className="text-center space-y-2">
                       <span className="font-display font-medium text-title-small text-transform-primary">Avatar Sandbox Mounted (M3 Token Verification)</span>
                       <p className="text-label-small font-mono opacity-80 max-w-lg mx-auto leading-relaxed">Dynamically mapped to CSS Properties (Border: {borderWidth[0]}px, Radius: {borderRadius[0]}px)</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-4xl mx-auto">
                       {/* Small Size */}
                       <div className="flex flex-col items-center gap-6">
                           <div className="h-24 flex items-end justify-center">
                               <Avatar size="sm">
                                   <AvatarFallback>SM</AvatarFallback>
                               </Avatar>
                           </div>
                           <div className="flex flex-col items-center gap-2 text-center">
                               <span className="text-label-small font-bold text-transform-secondary uppercase tracking-widest text-muted-foreground">Small (75%)</span>
                               <code className="text-label-small bg-layer-canvas px-2 py-1 rounded border border-border/50 text-transform-tertiary">
                                   &lt;Avatar size=&quot;sm&quot;&gt;
                               </code>
                           </div>
                       </div>

                       {/* Default Size */}
                       <div className="flex flex-col items-center gap-6">
                           <div className="h-24 flex items-end justify-center">
                               <Avatar size="default">
                                   <AvatarFallback>MD</AvatarFallback>
                               </Avatar>
                           </div>
                           <div className="flex flex-col items-center gap-2 text-center">
                               <span className="text-label-small font-bold text-transform-secondary uppercase tracking-widest text-muted-foreground">Default (Base)</span>
                               <code className="text-label-small bg-layer-canvas px-2 py-1 rounded border border-border/50 text-transform-tertiary">
                                   &lt;Avatar&gt;
                               </code>
                           </div>
                       </div>

                       {/* Large Size */}
                       <div className="flex flex-col items-center gap-6">
                           <div className="h-24 flex items-end justify-center">
                               <Avatar size="lg">
                                   <AvatarFallback>LG</AvatarFallback>
                               </Avatar>
                           </div>
                           <div className="flex flex-col items-center gap-2 text-center">
                               <span className="text-label-small font-bold text-transform-secondary uppercase tracking-widest text-muted-foreground">Large (150%)</span>
                               <code className="text-label-small bg-layer-canvas px-2 py-1 rounded border border-border/50 text-transform-tertiary">
                                   &lt;Avatar size=&quot;lg&quot;&gt;
                               </code>
                           </div>
                       </div>

                       {/* Manual / Escape Hatch */}
                       <div className="flex flex-col items-center gap-6">
                           <div className="h-24 flex items-end justify-center">
                               <Avatar className="size-16">
                                   <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                                   <AvatarFallback>USR</AvatarFallback>
                               </Avatar>
                           </div>
                           <div className="flex flex-col items-center gap-2 text-center">
                               <span className="text-label-small font-bold text-transform-secondary uppercase tracking-widest text-muted-foreground">Manual Override</span>
                               <code className="text-label-small bg-layer-canvas px-2 py-1 rounded border border-border/50 text-transform-tertiary">
                                   &lt;Avatar className=&quot;size-16&quot;&gt;
                               </code>
                           </div>
                       </div>
                   </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}

