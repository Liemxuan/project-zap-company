'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Icon, CORE_ICONS } from '../../../../../genesis/atoms/icons/Icon';
import { AppleIcon } from '../../../../../genesis/atoms/icons/apple';
import { GoogleIcon } from '../../../../../genesis/atoms/icons/google';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function IconographySandboxPage() {
    const [size, setSize] = useState('24px');
    const [fill, setFill] = useState('0');

    const inspectorControls = (
        <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Foundation Tokens</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Optical Scale</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        >
                            {['16px', '20px', '24px', '28px', '32px', '40px', '48px', '64px'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fill Weight</label>
                        <select 
                            className="w-full bg-layer-panel border border-border/50 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={fill}
                            onChange={(e) => setFill(e.target.value)}
                        >
                            <option value="0">0 (Outlined)</option>
                            <option value="1">1 (Filled)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ComponentSandboxTemplate
            componentName="Icons"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/icons/Icon.tsx"
            importPath="@/genesis/atoms/icons/Icon"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary', '--md-sys-color-on-surface'],
                typographyScales: []
            }}
            platformConstraints={{
                web: "Accessible variable font icons with adjustable optical weight.",
                mobile: "Ensures stroke clarity on high-DPI retina displays."
            }}
            foundationRules={[
                "Icons should predominantly use --md-sys-color-on-surface color role.",
                "Primary actions should use --md-sys-color-primary for system signaling."
            ]}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader id="core-library" 
                        number="01"
                        title="Core Library"
                        icon="category"
                        description="Material Symbols variable font library testing spatial L2 layer restoration."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 w-full max-w-6xl">
                            {CORE_ICONS.map((icon) => (
                                <div key={icon.name} className="flex flex-col items-center justify-center p-6 bg-layer-panel border border-border/40 rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                                    <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                                        <Icon name={icon.name} size="md" />
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">{icon.label}</span>
                                </div>
                            ))}
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="brand-integrations" 
                        number="02"
                        title="Brand Integrations"
                        icon="verified"
                        description="Custom SVG brand assets testing structural isometric precision."
                    />
                    <CanvasBody.Demo>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                            <div className="p-8 bg-layer-panel border border-border/40 rounded-2xl flex items-center justify-center gap-12">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="text-[#4285F4] w-12 h-12 flex items-center justify-center"><GoogleIcon /></div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 tracking-widest">Google Hub</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="text-foreground w-12 h-12 flex items-center justify-center"><AppleIcon /></div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 tracking-widest">Apple ID</span>
                                </div>
                            </div>
                            <div className="p-8 bg-layer-panel border border-border/40 rounded-2xl flex flex-col justify-center">
                                <div className="text-labelSmall font-body text-primary tracking-widest uppercase border-b border-border/50 pb-2 mb-4">Implementation Rule</div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-bodySmall font-body text-muted-foreground">Always use <code>opticalSize</code> matching <code>fontSize</code>.</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="text-bodySmall font-body text-muted-foreground">Default weight is 400 (Standard).</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
