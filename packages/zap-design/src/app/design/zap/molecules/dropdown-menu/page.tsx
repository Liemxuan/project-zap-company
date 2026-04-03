'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../../../../genesis/molecules/dropdown-menu';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../../genesis/atoms/interactive/select';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function DropdownMenuSandboxPage() {    const [gap, setGap] = useState([2]);
    const [padding, setPadding] = useState([8]);
    const [radius, setRadius] = useState([6]);
    const [borderWidth, setBorderWidth] = useState([1]);

    // Fetch initial settings
    const inspectorControls = (
        
            <div className="space-y-4">
                
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dropdown-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Select value={String(gap[0])} onValueChange={(v) => setGap([parseInt(v, 10) || 0])}>
                                <SelectTrigger aria-label="Select token" className="w-full">
                                    <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BORDER_WIDTH_TOKENS.map(t => <SelectItem key={t.token} value={t.value.replace(/[^0-9.]/g, '')}>{t.name} ({t.value})</SelectItem>)}
                                </SelectContent>
                            </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dropdown-padding</span>
                                    <span className="font-bold">{padding[0]}px</span>
                                </div>
                                <Select value={String(padding[0])} onValueChange={(v) => setPadding([parseInt(v, 10) || 0])}>
                                <SelectTrigger aria-label="Select token" className="w-full">
                                    <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BORDER_WIDTH_TOKENS.map(t => <SelectItem key={t.token} value={t.value.replace(/[^0-9.]/g, '')}>{t.name} ({t.value})</SelectItem>)}
                                </SelectContent>
                            </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dropdown-radius</span>
                                    <span className="font-bold">{radius[0]}px</span>
                                </div>
                                <Select value={String(radius[0])} onValueChange={(v) => setRadius([parseInt(v, 10) || 0])}>
                                <SelectTrigger aria-label="Select token" className="w-full">
                                    <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BORDER_RADIUS_TOKENS.map(t => <SelectItem key={t.token} value={t.value.replace(/[^0-9.]/g, '')}>{t.name} ({t.value})</SelectItem>)}
                                </SelectContent>
                            </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dropdown-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Select value={String(borderWidth[0])} onValueChange={(v) => setBorderWidth([parseInt(v, 10) || 0])}>
                                <SelectTrigger aria-label="Select token" className="w-full">
                                    <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BORDER_WIDTH_TOKENS.map(t => <SelectItem key={t.token} value={t.value.replace(/[^0-9.]/g, '')}>{t.name} ({t.value})</SelectItem>)}
                                </SelectContent>
                            </Select>
                            </div>
                        </div>
                    </div>
                
            </div>
        
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
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="dropdown-menu" title="Dropdown Menu Sandbox" description="Interactive components for Dropdown Menu" icon="widgets" />
                    <CanvasBody.Demo className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl">
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
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}