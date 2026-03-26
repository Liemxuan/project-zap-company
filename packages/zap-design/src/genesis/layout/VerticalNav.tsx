'use client';

import React from 'react';
import Image from 'next/image';

const menuSections = [
    {
        title: 'Site & Mobile App',
        items: [
            { label: 'Home', icon: 'home', active: true },
            { label: 'Website Site', icon: 'web' },
            { label: 'Mobile App', icon: 'smartphone' },
        ],
    },
    {
        title: 'Marketing & SEO',
        items: [
            { label: 'Marketing Home', icon: 'campaign' },
            { label: 'SEO Tools', icon: 'search' },
        ],
    },
    {
        title: 'Analytics & Reports',
        items: [
            { label: 'Traffic Overview', icon: 'bar_chart' },
            { label: 'Reports', icon: 'table_chart' },
        ],
    },
    {
        title: 'Automations',
        items: [
            { label: 'Workflows', icon: 'bolt' },
        ],
    },
];

interface VerticalNavProps {
    width?: number;
    isCollapsed?: boolean;
}

export const VerticalNav = ({ width = 260, isCollapsed = false }: VerticalNavProps) => {
    return (
        <aside
            className="bg-layer-panel border-r-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] flex flex-col shrink-0 overflow-hidden z-20 h-full text-theme-base"
            style={{ width: isCollapsed ? 74 : width }}
        >
            {/* Site Selector - Pixel Perfect ZAP.vn Box */}
            <div className={`p-4 border-b-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} group cursor-pointer hover:bg-layer-cover transition-colors`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-brand-primary)] border-[length:var(--btn-border-width,0px)] border-btn-border-[length:var(--card-border-width,0px)] rounded-[calc(var(--card-radius)/2)] flex items-center justify-center shrink-0 shadow-btn group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all overflow-hidden p-1.5 relative">
                        <Image src="/zap-logo.png" alt="ZAP" width={40} height={40} className="w-full h-auto object-contain" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-display text-transform-primary font-black text-sm tracking-tight text-theme-base leading-none">ZAP.VN</span>
                            <span className="font-display text-transform-primary text-labelSmall text-theme-muted text-transform-secondary font-bold tracking-widest mt-1">MAIN SITE</span>
                        </div>
                    )}
                </div>
                {!isCollapsed && (
                    <span className="material-symbols-outlined text-theme-base/50 group-hover:text-theme-base transition-colors text-[20px]">settings</span>
                )}
            </div>

            <div className="flex-1 py-4 overflow-y-auto">
                {menuSections.map((section) => (
                    <div key={section.title} className="space-y-1 mt-6 first:mt-0">
                        {!isCollapsed && (
                            <div className="px-6 py-2 text-labelSmall font-bold text-gray-500 text-transform-secondary tracking-wider font-display text-transform-primary">
                                {section.title}
                            </div>
                        )}
                        {section.items.map((item) => (
                            <a
                                key={item.label}
                                href="#"
                                className={`flex items-center gap-3 px-6 py-2 text-[13px] font-medium transition-colors ${item.active
                                    ? 'bg-layer-cover text-theme-base border-r-[var(--card-border-width,0px)] border-card-border'
                                    : 'text-theme-base/70 hover:bg-layer-cover hover:text-theme-base'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                {!isCollapsed && item.label}
                            </a>
                        ))}
                    </div>
                ))}
            </div>

            <div className={`p-4 border-t-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] bg-layer-cover ${isCollapsed ? 'flex justify-center' : ''}`}>
                <div className="flex items-center gap-2 text-labelMedium font-bold text-theme-base text-transform-primary">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand-secondary)] border-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] shrink-0"></span>
                    {!isCollapsed && "Design Your Site"}
                </div>
            </div>
        </aside>
    );
};
