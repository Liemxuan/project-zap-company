'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { HorizontalNavigation } from '../../../../../genesis/molecules/navigation/HorizontalNavigation';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';

export default function HorizontalNavigationSandboxPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [showContent, setShowContent] = useState(true);
    const [showBorder, setShowBorder] = useState(true);
    const [showRadius, setShowRadius] = useState(true);
    const [isFullWidth, setIsFullWidth] = useState(false);

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/horizontal-navigation/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Navigation Settings", type: "Docs Link", filePath: "zap/molecules/horizontal-navigation/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Controls</h4>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={isLoggedIn ? 'text-primary font-bold' : ''}>Logged In State</span>
                                <Switch checked={isLoggedIn} onCheckedChange={setIsLoggedIn} />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={showContent ? 'text-primary font-bold' : ''}>Show Page Content</span>
                                <Switch checked={showContent} onCheckedChange={setShowContent} />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={showBorder ? 'text-primary font-bold' : ''}>Border Width</span>
                                <Switch checked={showBorder} onCheckedChange={setShowBorder} />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={showRadius ? 'text-primary font-bold' : ''}>Border Radius</span>
                                <Switch checked={showRadius} onCheckedChange={setShowRadius} />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary mt-4">
                                <span className={isFullWidth ? 'text-primary font-bold' : ''}>Full Width Container</span>
                                <Switch checked={isFullWidth} onCheckedChange={setIsFullWidth} />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
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
                typographyScales: ['font-body', 'text-sm']
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
                '--nav-show-content': showContent ? 'true' : 'false'
            }}
            onLoadedVariables={handleLoadedVariables}
        >
            <div className={`w-full h-full flex items-start justify-center p-0 ${isFullWidth ? '' : 'md:p-12'} relative overflow-visible rounded-xl`}>
                <Wrapper identity={{ displayName: "Horizontal Navigation Molecule", type: "Organism", filePath: "zap/molecules/horizontal-navigation/page.tsx" }}>
                    <div className={`w-full ${isFullWidth ? '' : 'max-w-[1240px]'} bg-background ${showBorder ? 'border border-outline-variant' : ''} ${showRadius ? 'rounded-xl overflow-hidden' : ''} ${showContent ? 'min-h-[400px]' : ''}`}>
                        <HorizontalNavigation 
                            isLoggedIn={isLoggedIn} 
                            onLoginClick={() => setIsLoggedIn(true)}
                            onLogoutClick={() => setIsLoggedIn(false)}
                        />
                        {showContent && (
                            <div className="p-8">
                                <h2 className="text-xl font-bold font-display text-transform-primary mb-2">Page Content</h2>
                                <p className="text-muted-foreground font-body">
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
                </Wrapper>
            </div>
        </ComponentSandboxTemplate>
    );
}
