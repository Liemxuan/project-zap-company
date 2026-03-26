'use client';

import React, { ReactNode } from 'react';
import { SideNav } from '../../genesis/molecules/navigation/SideNav';

interface SettingsLayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
}

export const SettingsLayout = ({ children, sidebar }: SettingsLayoutProps) => {
    return (
        <div className="flex h-screen w-full overflow-hidden relative text-foreground">
            {/* Global Left Navigation */}
            <SideNav showDevWrapper={true} />

            {/* Center Area (Header + Main) */}
            <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                <main className="flex-1 flex overflow-y-auto relative bg-layer-canvas p-6 lg:p-10 justify-center">
                    <div className="flex grow gap-8 max-w-[1200px] w-full">
                        {/* Sticky Settings Sidebar */}
                        <aside className="hidden lg:block w-[240px] shrink-0">
                            <div className="sticky top-6">
                                {sidebar}
                            </div>
                        </aside>

                        {/* Main Settings Content */}
                        <div className="flex flex-col items-stretch grow gap-6 max-w-[800px]">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
