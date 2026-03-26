'use client';

import React from 'react';

import { SideNav } from '../../genesis/molecules/navigation/SideNav';
import { useTheme } from '../../components/ThemeContext';

interface EmptyStateContainerProps {
    children: React.ReactNode;
}

export const EmptyStateContainer = ({ children }: EmptyStateContainerProps) => {
    const { sidebarState } = useTheme();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isSidebarCollapsed = sidebarState === 'collapsed';

    return (
        <div className="flex h-screen w-full overflow-hidden relative">
            {/* Global Left Navigation */}
            <SideNav showDevWrapper={true} />

            {/* Center Area (Header + Main) */}
            <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto relative bg-surface-container-low">
                    <div className="w-full max-w-lg mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
