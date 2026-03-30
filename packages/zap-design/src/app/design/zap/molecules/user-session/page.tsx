'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { UserSession } from '../../../../../genesis/molecules/user-session';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { ToggleGroup, ToggleGroupItem } from '../../../../../genesis/atoms/interactive/toggle-group';
export default function UserSessionSandboxPage() {    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSmall, setIsSmall] = useState(true);
    const [isGhost, setIsGhost] = useState(true);
    const [showLabel, setShowLabel] = useState(true);
    const [spacing, setSpacing] = useState<'between' | 'sm' | 'md' | 'lg'>('sm');
    const [interactionMode, setInteractionMode] = useState<'buttons' | 'dropdown'>('dropdown');
    const [dropdownSide, setDropdownSide] = useState<'top' | 'bottom'>('bottom');

    const handleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoggedIn(true);
            setIsLoading(false);
        }, 1200);
    };

    const handleLogout = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoggedIn(false);
            setIsLoading(false);
        }, 1200);
    };

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/user-session/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "User Session Settings", type: "Docs Link", filePath: "zap/molecules/user-session/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Controls</h4>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className="text-primary font-bold">Interaction Mode</span>
                                <ToggleGroup type="single" value={interactionMode} onValueChange={(val) => val && setInteractionMode(val as 'dropdown' | 'buttons')} visualStyle="segmented">
                                    <ToggleGroupItem value="dropdown">Dropdown</ToggleGroupItem>
                                    <ToggleGroupItem value="buttons">Buttons</ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={isLoggedIn ? 'text-primary font-bold' : ''}>Logged In State</span>
                                <Switch checked={isLoggedIn} onCheckedChange={setIsLoggedIn} disabled={isLoading} />
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={dropdownSide === 'top' ? 'text-primary font-bold' : ''}>Menu Orientation</span>
                                <ToggleGroup type="single" value={dropdownSide} onValueChange={(val) => val && setDropdownSide(val as 'top' | 'bottom')} visualStyle="segmented">
                                    <ToggleGroupItem value="top">Upward</ToggleGroupItem>
                                    <ToggleGroupItem value="bottom">Downward</ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={isSmall ? 'text-primary font-bold' : ''}>Small Size Variant</span>
                                <Switch checked={isSmall} onCheckedChange={setIsSmall} />
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={isGhost ? 'text-primary font-bold' : ''}>Ghost Variant (No BG)</span>
                                <Switch checked={isGhost} onCheckedChange={setIsGhost} />
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={spacing !== 'between' ? 'text-primary font-bold' : ''}>Gap Spacing</span>
                                <ToggleGroup type="single" value={spacing} onValueChange={(val) => val && setSpacing(val as 'between' | 'sm' | 'md' | 'lg')} visualStyle="segmented">
                                    {(['between', 'sm', 'md', 'lg'] as const).map((s) => (
                                        <ToggleGroupItem key={s} value={s}>{s}</ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>
                            <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={showLabel ? 'text-primary font-bold' : ''}>Show Component Label</span>
                                <Switch checked={showLabel} onCheckedChange={setShowLabel} />
                            </div>
                            <p className="text-label-small text-on-surface-variant text-transform-secondary font-body leading-relaxed">Toggle the state above to quickly preview Guest (unauthenticated) vs. Authenticated user block configurations.</p>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        const cleanVar = (val: string) => val.replace(' !important', '').trim();
        
        if (variables['--user-session-size']) {
            setIsSmall(cleanVar(variables['--user-session-size']) === 'small');
        }
        if (variables['--user-session-variant']) {
            setIsGhost(cleanVar(variables['--user-session-variant']) === 'ghost');
        }
        if (variables['--user-session-spacing']) {
            const val = cleanVar(variables['--user-session-spacing']) as 'between' | 'sm' | 'md' | 'lg';
            if (['between', 'sm', 'md', 'lg'].includes(val)) setSpacing(val);
        }
        if (variables['--user-session-interaction']) {
            const val = cleanVar(variables['--user-session-interaction']) as 'buttons' | 'dropdown';
            if (['buttons', 'dropdown'].includes(val)) setInteractionMode(val);
        }
        if (variables['--user-session-dropdown-side']) {
            const val = cleanVar(variables['--user-session-dropdown-side']) as 'top' | 'bottom';
            if (['top', 'bottom'].includes(val)) setDropdownSide(val);
        }
        if (variables['--user-session-show-label']) {
            setShowLabel(cleanVar(variables['--user-session-show-label']) === 'true');
        }
    };

    return (
        <ComponentSandboxTemplate
            componentName="User Session"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/components/ui/user-session.tsx"
            importPath="@/components/ui/user-session"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['bg-surface', 'border-outline-variant', 'text-on-surface text-transform-primary', 'bg-error'],
                typographyScales: ['font-body', 'font-display', 'text-label-small', 'text-transform-tertiary']
            }}
            platformConstraints={{ web: "Supported", mobile: "Touch Supported" }}
            foundationRules={[
                "Displays USER SESSION label with font-body and text-transform-tertiary", 
                "Leverages standard Avatar and Button primitives under composition",
                "Integrates strict M3 color variables for semantic state toggles"
            ]}
            publishPayload={{
                '--user-session-size': isSmall ? 'small' : 'default',
                '--user-session-variant': isGhost ? 'ghost' : 'default',
                '--user-session-spacing': spacing,
                '--user-session-interaction': interactionMode,
                '--user-session-dropdown-side': dropdownSide,
                '--user-session-show-label': showLabel.toString()
            }}
            onLoadedVariables={handleLoadedVariables}
        >
            <div className="w-full flex flex-col items-center justify-center min-h-[400px] p-6 lg:p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl gap-8">
                <UserSession 
                    size={isSmall ? 'small' : 'default'}
                    variant={isGhost ? 'ghost' : 'default'}
                    spacing={spacing}
                    showLabel={showLabel}
                    isLoggedIn={isLoggedIn}
                    isLoading={isLoading}
                    interactionMode={interactionMode}
                    dropdownSide={dropdownSide}
                    user={{
                        name: "Alex Designer",
                        role: "Design • Admin",
                        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                        status: "online"
                    }}
                    onLoginClick={handleLogin}
                    onLogoutClick={handleLogout}
                />
            </div>
        </ComponentSandboxTemplate>
    );
}
