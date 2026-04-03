'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { HorizontalNavigation } from '../../../../../genesis/molecules/navigation/HorizontalNavigation';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { ToggleGroup, ToggleGroupItem } from '../../../../../genesis/atoms/interactive/toggle-group';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function HorizontalNavigationSandboxPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [showContent, setShowContent] = useState(true);
    const [showBorder, setShowBorder] = useState(true);
    const [showRadius, setShowRadius] = useState(true);
    const [isFullWidth, setIsFullWidth] = useState(false);
    const [dropdownSide, setDropdownSide] = useState<'top' | 'bottom'>('bottom');

    const inspectorControls = (
        
            <div className="space-y-4">
                
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Controls</h4>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={isLoggedIn ? 'text-primary font-bold' : ''}>Logged In State</span>
                                <Switch aria-label="Switch component" checked={isLoggedIn} onCheckedChange={setIsLoggedIn} />
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={showContent ? 'text-primary font-bold' : ''}>Show Page Content</span>
                                <Switch aria-label="Switch component" checked={showContent} onCheckedChange={setShowContent} />
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={dropdownSide === 'top' ? 'text-primary font-bold' : ''}>Menu Orientation</span>
                                <ToggleGroup type="single" value={dropdownSide} onValueChange={(val) => val && setDropdownSide(val as 'top' | 'bottom')} visualStyle="segmented">
                                    <ToggleGroupItem value="top">Upward</ToggleGroupItem>
                                    <ToggleGroupItem value="bottom">Downward</ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={showBorder ? 'text-primary font-bold' : ''}>Border Width</span>
                                <Switch aria-label="Switch component" checked={showBorder} onCheckedChange={setShowBorder} />
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={showRadius ? 'text-primary font-bold' : ''}>Border Radius</span>
                                <Switch aria-label="Switch component" checked={showRadius} onCheckedChange={setShowRadius} />
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={isFullWidth ? 'text-primary font-bold' : ''}>Full Width Container</span>
                                <Switch aria-label="Switch component" checked={isFullWidth} onCheckedChange={setIsFullWidth} />
                            </div>
                        </div>
                    </div>
                
            </div>
        
    );

    // ── Load saved values from Active Theme ──
    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--nav-max-width']) {
            setIsFullWidth(variables['--nav-max-width'] === '100%');
        }
        if (variables['--nav-border-width']) {
            setShowBorder(variables['--nav-border-width'] !== '0px');
        }
        if (variables['--nav-border-radius']) {
            setShowRadius(variables['--nav-border-radius'] !== '0px');
        }
        if (variables['--nav-show-content']) {
            setShowContent(variables['--nav-show-content'] === 'true');
        }
        if (variables['--nav-dropdown-side']) {
            const side = variables['--nav-dropdown-side'].replace(' !important', '').trim() as 'top' | 'bottom';
            if (['top', 'bottom'].includes(side)) setDropdownSide(side);
        }
    };

    return (
        <ComponentSandboxTemplate
            componentName="Horizontal Navigation"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/genesis/molecules/navigation/HorizontalNavigation.tsx"
            importPath="@/genesis/molecules/navigation/HorizontalNavigation"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['bg-layer-panel', 'border-black'],
                typographyScales: ['font-body text-transform-secondary', 'text-body-small']
            }}
            platformConstraints={{ web: "Supported", mobile: "Touch Supported" }}
            foundationRules={[
                "Navigation height is fixed to h-14 to match the inspector header.",
                "Divider line at the bottom correctly maps to border-black.",
                "Left side strictly aligns Quick Navigation combobox.",
                "Right side strictly aligns User Session block."
            ]}
            fullWidth={isFullWidth}
            publishPayload={{
                '--nav-max-width': isFullWidth ? '100%' : '1240px',
                '--nav-border-width': showBorder ? '1px' : '0px',
                '--nav-border-radius': showRadius ? '12px' : '0px',
                '--nav-show-content': showContent ? 'true' : 'false',
                '--nav-dropdown-side': dropdownSide
            }}
            onLoadedVariables={handleLoadedVariables}
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="horizontal-navigation" title="Horizontal Navigation Sandbox" description="Interactive components for Horizontal Navigation" icon="widgets" />
                    <CanvasBody.Demo className="">
                
                    <div className={`w-full ${isFullWidth ? '' : 'max-w-[1240px]'} bg-background ${showBorder ? 'border border-outline-variant' : ''} ${showRadius ? 'rounded-xl overflow-hidden' : ''} ${showContent ? 'min-h-[400px]' : ''}`}>
                        <HorizontalNavigation 
                            isLoggedIn={isLoggedIn} 
                            dropdownSide={dropdownSide}
                            onLoginClick={() => setIsLoggedIn(true)}
                            onLogoutClick={() => setIsLoggedIn(false)}
                        />
                        {showContent && (
                            <div className="p-8">
                                <h2 className="text-title-medium font-bold font-display text-transform-primary mb-2">Page Content</h2>
                                <p className="text-muted-foreground font-body text-transform-secondary">
                                    The horizontal navigation is mounted at the top of this layout wrapper. Use the Quick Navigate combobox or test the User Session authentication toggle using the Inspector controls in the sidebar.
                                </p>
                                <div className="mt-8 border-t border-outline-variant/50 pt-8 space-y-4">
                                    <div className="h-4 bg-outline-variant/30 rounded w-1/3 animate-pulse"></div>
                                    <div className="h-4 bg-outline-variant/30 rounded w-1/2 animate-pulse"></div>
                                    <div className="h-4 bg-outline-variant/30 rounded w-1/4 animate-pulse"></div>
                                </div>
                            </div>
                        )}
                    </div>
                
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}
