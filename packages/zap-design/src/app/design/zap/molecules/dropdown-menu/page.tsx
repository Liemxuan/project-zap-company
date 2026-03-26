'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../../../genesis/molecules/dropdown-menu';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function DropdownMenuSandboxPage() {    const [gap, setGap] = useState([2]);
    const [padding, setPadding] = useState([8]);
    const [radius, setRadius] = useState([6]);
    const [borderWidth, setBorderWidth] = useState([1]);

    // Fetch initial settings
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/dropdown-menu" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Dropdown Menu Structural Settings", type: "Docs Link", filePath: "zap/molecules/dropdown-menu/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dropdown-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Slider value={gap} onValueChange={setGap} min={0} max={16} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dropdown-padding</span>
                                    <span className="font-bold">{padding[0]}px</span>
                                </div>
                                <Slider value={padding} onValueChange={setPadding} min={0} max={32} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dropdown-radius</span>
                                    <span className="font-bold">{radius[0]}px</span>
                                </div>
                                <Slider value={radius} onValueChange={setRadius} min={0} max={32} step={1} className="w-full" />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dropdown-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Dropdown Menu"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/dropdown-menu.tsx"
            importPath="@/components/ui/dropdown-menu"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: [],
                typographyScales: ["font-display", "font-body", "text-transform-primary", "text-transform-secondary"]
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
            foundationRules={[]}
        >
            <div 
                className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl"
            >
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="flat">Open Menu</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        onInteractOutside={(e) => e.preventDefault()}
                        style={Object.assign({}, {
                             '--dropdown-gap': `${gap[0]}px`,
                             '--dropdown-padding': `${padding[0]}px`,
                             '--dropdown-radius': `${radius[0]}px`,
                             '--dropdown-border-width': `${borderWidth[0]}px`,
                        } as React.CSSProperties)}
                    >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </ComponentSandboxTemplate>
    );
}