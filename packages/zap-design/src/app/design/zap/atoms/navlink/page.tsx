'use client';

import React, { useState } from 'react';
import { ChevronDown, LayoutDashboard, LineChart, Users, Package, Settings, Search, Menu } from 'lucide-react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { NavLink } from '../../../../../genesis/atoms/interactive/NavLink';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../genesis/atoms/interactive/select';
import { cn } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/atoms/foundations/components';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, type BorderWidthToken, type BorderRadiusToken } from '../../../../../zap/sections/atoms/foundations/schema';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', IconNode: LayoutDashboard, colorClass: 'text-blue-500' },
    { id: 'analytics', label: 'Analytics', IconNode: LineChart, colorClass: 'text-purple-500' },
    { id: 'customers', label: 'Customers', IconNode: Users, colorClass: 'text-amber-500' },
    { id: 'products', label: 'Products', IconNode: Package, colorClass: 'text-emerald-500' },
    { id: 'settings', label: 'Settings', IconNode: Settings, colorClass: 'text-gray-500' },
];

export default function NavLinkSandboxPage() {
    const [iconStyle, setIconStyle] = useState<'none' | 'mono' | 'color'>('mono');
    const [borderWidth, setBorderWidth] = useState('border');
    const [borderRadius, setBorderRadius] = useState('rounded-lg');

    // Helper to get raw px value for styles from tokens
    const getRadiusValue = (tokenStr: string) => {
        const token = BORDER_RADIUS_TOKENS.find(t => t.token === tokenStr);
        return token ? token.value.match(/\d+px/)?.[0] || '8px' : '8px';
    };

    const getBorderWidthValue = (tokenStr: string) => {
        const token = BORDER_WIDTH_TOKENS.find(t => t.token === tokenStr);
        return token ? token.value : '1px';
    };

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--navlink-border-width-token']) setBorderWidth(variables['--navlink-border-width-token']);
        if (variables['--navlink-border-radius-token']) setBorderRadius(variables['--navlink-border-radius-token']);
    };

    const inspectorControls = (
        <div className="space-y-4 transition-all duration-300">
            {/* Icon Style Option */}
            <div className="space-y-4 pb-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Icon Style</h4>
                    <span className="text-label-small text-primary font-secondary font-bold tracking-widest text-transform-secondary uppercase">
                        {iconStyle}
                    </span>
                </div>
                <div className="flex bg-layer-panel p-1 border border-border/50 rounded-[var(--radius)]">
                    {(['none', 'mono', 'color'] as const).map((mode) => (
                        <Button
                            key={mode}
                            onClick={() => setIconStyle(mode)}
                            visualStyle={iconStyle === mode ? 'solid' : 'ghost'}
                            color="primary"
                            size="tiny"
                            className={cn("flex-1", iconStyle !== mode && "text-muted-foreground")}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Border & Radius */}
            <div className="space-y-6">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Structural</h4>
                
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-label-small font-secondary text-transform-secondary text-muted-foreground">
                        <span>Border width</span>
                    </div>
                    <Select value={borderWidth} onValueChange={setBorderWidth}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select width" />
                        </SelectTrigger>
                        <SelectContent>
                            {BORDER_WIDTH_TOKENS.map((token: BorderWidthToken) => (
                                <SelectItem key={token.token} value={token.token}>
                                    {token.name} ({token.value})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-label-small font-secondary text-transform-secondary text-muted-foreground">
                        <span>Corner radius</span>
                    </div>
                    <Select value={borderRadius} onValueChange={setBorderRadius}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select radius" />
                        </SelectTrigger>
                        <SelectContent>
                            {BORDER_RADIUS_TOKENS.map((token: BorderRadiusToken) => (
                                <SelectItem key={token.token} value={token.token}>
                                    {token.name} ({token.value})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );

    const bWidth = getBorderWidthValue(borderWidth);
    const bRadius = getRadiusValue(borderRadius);

    return (
        <div className="contents" style={{
            '--navlink-override-border-width': bWidth,
            '--navlink-override-border-radius': bRadius,
        } as React.CSSProperties}>
            <ComponentSandboxTemplate
                componentName="NavLink"
                tier="L3 ATOM"
                status="Verified"
                filePath="src/genesis/atoms/interactive/NavLink.tsx"
                importPath="@/genesis/atoms/interactive/NavLink"
                inspectorControls={inspectorControls}
                publishPayload={{
                    '--navlink-border-width-token': borderWidth,
                    '--navlink-border-radius-token': borderRadius,
                }}
                onLoadedVariables={handleLoadedVariables}
                foundationInheritance={{
                    colorTokens: ['--color-brand-primary', '--color-brand-midnight', '--color-iso-gray-500'],
                    typographyScales: ['--font-display']
                }}
                platformConstraints={{ web: "Full support", mobile: "Touch targets" }}
                foundationRules={[
                    "NavLink is the L3 navigation primitive — SideNav composes it.",
                    "Active state uses bg-brand-primary with brutalist border.",
                    "Ghost state uses iso-gray-500 text with panel hover.",
                ]}
            >
                <CanvasBody flush={false} coverTitle="Navigation Link Atoms" coverBadge="L2 // ATOMS">
                    <CanvasBody.Section flush={false} className="w-full animate-in fade-in duration-500">
                        <SectionHeader
                            number="01"
                            title="SideNav Composition"
                            icon="view_sidebar"
                            description="Visual mockup of NavLinks composed within a functional L4 sidebar structure."
                            id="visual-mockup"
                        />
                        <CanvasBody.Demo minHeight="min-h-[400px]" centered={true}>
                            <div 
                                className="w-[300px] bg-layer-panel shadow-xl flex flex-col items-stretch relative z-10 p-4 transition-all duration-300"
                                style={{
                                    borderRadius: `calc(${borderRadius} + 8px)`,
                                    border: `${borderWidth} solid var(--color-border-subtle)`
                                }}
                            >
                                <div className="text-xl font-bold tracking-tighter text-foreground mb-4 px-2 flex items-center justify-between">
                                    <span>ZAP<span className="text-primary opacity-60">/OS</span></span>
                                    <Menu size={18} className="text-muted-foreground/60" />
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="pt-4 pb-2">
                                        <h5 className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase px-3 mb-2">
                                            Level 1: Main navigation
                                        </h5>
                                        {NAV_ITEMS.slice(0, 3).map((item, i) => {
                                            const { IconNode } = item;
                                            return (
                                                <NavLink
                                                    key={item.id}
                                                    href="#"
                                                    isActive={i === 0}
                                                    className="px-3"
                                                    style={{
                                                        borderRadius: `var(--navlink-override-border-radius)`,
                                                        borderWidth: `var(--navlink-override-border-width)`,
                                                        borderColor: i === 0 ? 'var(--color-primary-container)' : 'transparent',
                                                    }}
                                                >
                                                    {iconStyle !== 'none' && (
                                                        <IconNode size={18} className={cn(
                                                            iconStyle === 'color' && i !== 0 ? item.colorClass : "opacity-70",
                                                        )} />
                                                    )}
                                                    <span>{item.label}</span>
                                                </NavLink>
                                            );
                                        })}
                                    </div>

                                    <div className="pt-4 border-t border-border/50">
                                        <h5 className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase px-3 mb-2">
                                            Level 2 & 3: Nested groups
                                        </h5>
                                        <div className="flex flex-col space-y-1 px-1">
                                            <div className="text-[13px] font-medium text-foreground px-2 py-2 flex items-center justify-between group cursor-pointer hover:bg-muted/50 transition-colors"
                                                 style={{ borderRadius: `var(--navlink-override-border-radius)` }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {iconStyle !== 'none' && <Search size={18} className={cn(iconStyle === 'color' ? 'text-indigo-400' : 'opacity-70')} />}
                                                    <span>Discover</span>
                                                </div>
                                                <ChevronDown size={14} strokeWidth={2.5} className="opacity-50 group-hover:opacity-100 transition-transform rotate-0" />
                                            </div>
                                            
                                            <div className="flex flex-col border-l border-primary/20 ml-6 pl-3 space-y-0.5 mt-1 overflow-hidden">
                                                <NavLink href="#" variant="default" isActive={true}
                                                    style={{
                                                        borderRadius: `var(--navlink-override-border-radius)`,
                                                        borderWidth: `var(--navlink-override-border-width)`,
                                                    }}
                                                >
                                                    Trending items (Level 2)
                                                </NavLink>
                                                <NavLink href="#" variant="default" isActive={false}
                                                    style={{
                                                        borderRadius: `var(--navlink-override-border-radius)`,
                                                        borderWidth: `var(--navlink-override-border-width)`,
                                                    }}
                                                >
                                                    Global search (Level 2)
                                                </NavLink>

                                                <div className="flex flex-col mt-1 mb-1">
                                                    <div className="text-[12px] font-medium text-muted-foreground px-2 py-1.5 flex items-center justify-between group cursor-pointer hover:bg-muted/50 rounded-md -ml-2 transition-colors">
                                                        <span className="opacity-80 group-hover:opacity-100 tracking-tight">Advanced</span>
                                                        <ChevronDown size={14} strokeWidth={2.5} className="opacity-50 group-hover:opacity-100 transition-transform rotate-0" />
                                                    </div>
                                                    
                                                    <div className="flex flex-col border-l border-primary/20 ml-2 pl-3 mt-1 space-y-0.5 relative">
                                                        <NavLink href="#" variant="default" isActive={false}
                                                            style={{
                                                                borderRadius: `var(--navlink-override-border-radius)`,
                                                                borderWidth: `var(--navlink-override-border-width)`,
                                                            }}
                                                        >
                                                            Data sources (Level 3)
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CanvasBody.Demo>
                    </CanvasBody.Section>
                </CanvasBody>
            </ComponentSandboxTemplate>
        </div>
    );
}
