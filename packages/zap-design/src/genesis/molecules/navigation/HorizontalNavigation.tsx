'use client';

import React from 'react';
import { UserSession } from '../user-session';
import { Wrapper } from '../../../components/dev/Wrapper';
import { QuickNavigate } from '../quick-navigate';

export interface HorizontalNavigationProps {
    user?: {
        name?: string | null;
        email: string;
        role: string;
        avatarUrl?: string | null;
        status?: "online" | "offline" | "busy" | "away";
        position?: string | null;
        employee?: {
            position?: string | null;
        } | null;
    };
    isLoggedIn?: boolean;
    dropdownSide?: 'top' | 'bottom';
    onLoginClick?: () => void;
    onLogoutClick?: () => void;
}

export function HorizontalNavigation({
    user = {
        name: "Alex Designer",
        email: "alex@zap.design",
        role: "Design • Admin",
        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        status: "online",
        position: "Principal Designer"
    },
    isLoggedIn = true,
    dropdownSide,
    onLoginClick,
    onLogoutClick
}: HorizontalNavigationProps) {
    return (
        <header className="w-full h-14 flex items-center justify-between px-5 md:px-12 border-b border-black shrink-0 relative z-40 bg-layer-panel">
            {/* Left: Quick Navigation */}
            <div className="flex-1 max-w-xs">
                <QuickNavigate />
            </div>

            {/* Right: User Session */}
            <div className="flex-shrink-0 flex items-center justify-end">
                <Wrapper identity={{ displayName: "User Session", type: "Molecule", filePath: "genesis/molecules/user-session.tsx" }}>
                    <UserSession
                        size="small"
                        variant="ghost"
                        showLabel={false}
                        isLoggedIn={isLoggedIn}
                        user={user ? {
                            name: user.name || "User",
                            role: user.role,
                            avatarUrl: user.avatarUrl || undefined,
                            status: (user.status as "online" | "offline" | "busy" | "away") || "online"
                        } : undefined}
                        dropdownSide={dropdownSide}
                        onLoginClick={onLoginClick}
                        onLogoutClick={onLogoutClick}
                    />
                </Wrapper>
            </div>
        </header>
    );
}
