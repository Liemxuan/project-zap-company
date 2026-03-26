
'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { NavLink } from '../../../../../genesis/atoms/interactive/NavLink';

const NAV_ITEMS = [
    { href: '#', label: 'Dashboard', icon: '📊' },
    { href: '#', label: 'Analytics', icon: '📈' },
    { href: '#', label: 'Customers', icon: '👥' },
    { href: '#', label: 'Products', icon: '📦' },
    { href: '#', label: 'Settings', icon: '⚙️' },
];

export default function NavLinkSandboxPage() {
    return (
        <ComponentSandboxTemplate
            componentName="NavLink"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/interactive/NavLink.tsx"
            importPath="@/genesis/atoms/interactive/NavLink"
            foundationInheritance={{
                colorTokens: ['--color-brand-primary', '--color-brand-midnight', '--color-iso-gray-500'],
                typographyScales: ['--font-display']
            }}
            platformConstraints={{ web: "Full support", mobile: "Touch targets" }}
            foundationRules={[
                "NavLink is the L3 navigation primitive — SideNav composes it.",
                "Active state uses bg-brand-primary with brutalist border via --card-border-width.",
                "Ghost state uses iso-gray-500 text with panel hover.",
                "Font: 11px bold tracking-tight display font.",
            ]}
        >
            <div className="w-full space-y-10 animate-in fade-in duration-500 pb-8">

                {/* Active vs Ghost States */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Active vs Ghost States</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        First item active, rest ghost · <code>isActive</code> prop
                    </span>
                    <Wrapper identity={{ displayName: "NavLink", type: "Atom", filePath: "genesis/atoms/interactive/NavLink.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-4 w-full max-w-xs space-y-1">
                            {NAV_ITEMS.map((item, i) => (
                                <NavLink
                                    key={item.label}
                                    href={item.href}
                                    isActive={i === 0}
                                    className="px-3 py-2 rounded-md"
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </Wrapper>
                </div>

                {/* All Active */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">All Active State</span>
                    <span className="text-[10px] font-dev text-muted-foreground block">
                        Shows how multiple active links would render
                    </span>
                    <Wrapper identity={{ displayName: "NavLink (All Active)", type: "Atom", filePath: "genesis/atoms/interactive/NavLink.tsx" }}>
                        <div className="bg-layer-panel border border-card-border rounded-lg p-4 w-full max-w-xs space-y-1">
                            {NAV_ITEMS.slice(0, 3).map((item) => (
                                <NavLink
                                    key={item.label}
                                    href={item.href}
                                    isActive={true}
                                    className="px-3 py-2 rounded-md"
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </Wrapper>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
