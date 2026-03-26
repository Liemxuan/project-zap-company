'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { UserSession } from '../../../../../genesis/molecules/user-session';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';

export default function UserSessionSandboxPage() {    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSmall, setIsSmall] = useState(true);
    const [isGhost, setIsGhost] = useState(true);
    const [showLabel, setShowLabel] = useState(true);
    const [spacing, setSpacing] = useState<'between' | 'sm' | 'md' | 'lg'>('sm');

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
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Controls</h4>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={isLoggedIn ? 'text-primary font-bold' : ''}>Logged In State</span>
                                <Switch checked={isLoggedIn} onCheckedChange={setIsLoggedIn} disabled={isLoading} />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={isSmall ? 'text-primary font-bold' : ''}>Small Size Variant</span>
                                <Switch checked={isSmall} onCheckedChange={setIsSmall} />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={isGhost ? 'text-primary font-bold' : ''}>Ghost Variant (No BG)</span>
                                <Switch checked={isGhost} onCheckedChange={setIsGhost} />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={spacing !== 'between' ? 'text-primary font-bold' : ''}>Gap Spacing</span>
                                <div className="flex gap-1 items-center">
                                    {(['between', 'sm', 'md', 'lg'] as const).map((s) => (
                                        <button 
                                            key={s} 
                                            onClick={() => setSpacing(s)}
                                            className={s === spacing 
                                                ? "bg-primary text-black px-2 py-1 rounded" 
                                                : "bg-surface text-on-surface px-2 py-1 rounded border border-outline-variant hover:border-primary/50"}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                <span className={showLabel ? 'text-primary font-bold' : ''}>Show Component Label</span>
                                <Switch checked={showLabel} onCheckedChange={setShowLabel} />
                            </div>
                            <p className="text-xs text-on-surface-variant text-transform-secondary font-body leading-relaxed">Toggle the state above to quickly preview Guest (unauthenticated) vs. Authenticated user block configurations.</p>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

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
                typographyScales: ['font-body', 'font-display', 'text-xs', 'text-transform-tertiary']
            }}
            platformConstraints={{ web: "Supported", mobile: "Touch Supported" }}
            foundationRules={[
                "Displays USER SESSION label with font-body and text-transform-tertiary", 
                "Leverages standard Avatar and Button primitives under composition",
                "Integrates strict M3 color variables for semantic state toggles"
            ]}
        >
            <div className="w-full flex flex-col items-center justify-center min-h-[400px] p-6 lg:p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl gap-8">
                <UserSession 
                    size={isSmall ? 'small' : 'default'}
                    variant={isGhost ? 'ghost' : 'default'}
                    spacing={spacing}
                    showLabel={showLabel}
                    isLoggedIn={isLoggedIn}
                    isLoading={isLoading}
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
