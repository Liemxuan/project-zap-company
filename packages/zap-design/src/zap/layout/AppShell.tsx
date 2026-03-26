'use client';

import React from 'react';
import { useTheme } from '../../components/ThemeContext';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { SideNav } from '../../genesis/molecules/navigation/SideNav';
import { HorizontalNavigation } from '../../genesis/molecules/navigation/HorizontalNavigation';
import { getSession, logoutAction } from '../../../../zap-auth/src/actions';

interface AppShellProps {
    children: React.ReactNode;
    inspector?: React.ReactNode;
}

interface SessionUser {
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
    status: "online" | "offline" | "busy" | "away";
}

export const AppShell = ({ children, inspector }: AppShellProps) => {
    const { sidebarState, setSidebarState, inspectorState, setInspectorState } = useTheme();
    const isSidebarCollapsed = sidebarState === 'collapsed';
    const isInspectorCollapsed = inspectorState === 'collapsed';

    const [userSession, setUserSession] = React.useState<SessionUser | null>(null);

    React.useEffect(() => {
        getSession().then((session: unknown) => {
            if (session && typeof session === 'object') {
                const s = session as Record<string, string>;
                setUserSession({
                    name: s.name || "Unknown User",
                    email: s.email || "",
                    role: s.role || "USER",
                    avatarUrl: s.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name || "Unknown")}`,
                    status: 'online',
                });
            }
        });
    }, []);

    return (
        <div className="flex h-screen w-full bg-layer-base overflow-hidden relative">
            {/* Collapsed Sidebar Trigger */}
            {isSidebarCollapsed && (
                <button
                    onClick={() => setSidebarState('expanded')}
                    title="Expand Sidebar"
                    className="absolute left-4 top-3.5 z-[200] w-7 h-7 bg-primary text-on-primary hover:bg-primary/90 rounded-[var(--button-border-radius,8px)] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 outline-none"
                >
                    <div className="flex items-center justify-center translate-x-[0.5px]">
                        <Icon name="chevron_right" size={16} weight={700} />
                    </div>
                </button>
            )}

            {/* Global Left Navigation */}
            <SideNav showDevWrapper={true} />

            {/* Center Area (Main Content Box) */}
            <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                <HorizontalNavigation 
                    user={userSession || undefined}
                    isLoggedIn={!!userSession} 
                    onLoginClick={() => window.location.href = '/'} 
                    onLogoutClick={async () => {
                        try {
                            await logoutAction();
                            window.location.href = '/';
                        } catch (e) {
                            console.error('Logout failed:', e);
                        }
                    }} 
                />
                <main className="flex-1 flex flex-col overflow-y-auto relative bg-transparent">
                    {children}
                </main>
            </div>

            {/* Inspector collapsed — show expand button with right padding */}
            {inspector && isInspectorCollapsed && (
                <button
                    onClick={() => setInspectorState('expanded')}
                    title="Expand Inspector"
                    className="absolute right-4 top-3.5 z-[60] w-7 h-7 bg-primary text-on-primary hover:bg-primary/90 rounded-[var(--button-border-radius,8px)] flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 outline-none"
                >
                    <Icon name="chevron_left" size={16} weight={700} />
                </button>
            )}

            {/* Right Area (Full-Height Inspector) */}
            {inspector && !isInspectorCollapsed && (
                <div className="relative h-full shrink-0 border-l border-border/50 z-20" data-region="inspector">
                    {/* Toggle straddles the border — half in nav, half in inspector */}
                    <button
                        onClick={() => setInspectorState('collapsed')}
                        title="Collapse Inspector"
                        className="absolute left-0 top-3.5 -translate-x-1/2 z-[60] w-7 h-7 bg-primary text-on-primary hover:bg-primary/90 rounded-[var(--button-border-radius,8px)] flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 outline-none"
                    >
                        <Icon name="chevron_right" size={16} weight={700} />
                    </button>
                    {inspector}
                </div>
            )}
        </div>
    );
};
