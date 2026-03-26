'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../../genesis/atoms/icons/Icon';

import { FOUNDATION_SECTIONS } from './schema';

export const FoundationsInspector = () => {
    const [activeSection, setActiveSection] = useState('color');
    const [searchQuery, setSearchQuery] = useState('');

    // Scroll-spy: track which section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                }
            },
            { rootMargin: '-20% 0px -70% 0px' }
        );

        FOUNDATION_SECTIONS.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="space-y-6">


            {/* Section Navigator */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary text-on-primary p-1 flex items-center justify-center rounded">
                        <Icon name="menu_book" size={14} />
                    </span>
                    <h3 className="text-xs font-black uppercase tracking-tighter text-foreground">Sections</h3>
                </div>
                <div className="space-y-0.5">
                    {FOUNDATION_SECTIONS.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => scrollToSection(s.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-150",
                                activeSection === s.id
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-on-surface/5"
                            )}
                        >
                            <Icon name={s.icon} size={16} className={activeSection === s.id ? "text-primary" : "text-muted-foreground"} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">
                                    <span className="text-muted-foreground mr-1">{s.number}.</span>
                                    {s.title}
                                </p>
                            </div>
                            {activeSection === s.id && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Token Search */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary text-on-primary p-1 flex items-center justify-center rounded">
                        <Icon name="search" size={14} />
                    </span>
                    <h3 className="text-xs font-black uppercase tracking-tighter text-foreground">Quick Lookup</h3>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tokens..."
                        className="w-full px-3 py-2 text-xs bg-layer-dialog border border-border/30 rounded-md text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            title="Clear search"
                        >
                            <Icon name="close" size={14} className="text-muted-foreground" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="text-[9px] text-muted-foreground italic">
                        Use Ctrl+F for full-page search.
                    </p>
                )}
            </div>

            {/* Quick Stats */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary text-on-primary p-1 flex items-center justify-center rounded">
                        <Icon name="analytics" size={14} />
                    </span>
                    <h3 className="text-xs font-black uppercase tracking-tighter text-foreground">Token Count</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: 'Colors', count: 29 },
                        { label: 'Type Styles', count: 15 },
                        { label: 'Spacing', count: 13 },
                        { label: 'Elevations', count: 6 },
                        { label: 'Sizes', count: 11 },
                        { label: 'Breakpoints', count: 5 },
                    ].map(({ label, count }) => (
                        <div key={label} className="bg-layer-dialog rounded-md p-2.5 text-center border border-border/20">
                            <p className="text-lg font-black text-foreground leading-none">{count}</p>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* M3 Source Link */}
            <div className="bg-layer-dialog rounded-lg p-4 border border-border/20 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Reference</p>
                <a
                    href="https://m3.material.io/styles"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-primary hover:underline font-medium"
                >
                    <Icon name="open_in_new" size={14} />
                    M3 Material Design Styles
                </a>
                <a
                    href="https://github.com/flutter/flutter/issues/91605"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-primary hover:underline font-medium"
                >
                    <Icon name="open_in_new" size={14} />
                    Flutter M3 Implementation
                </a>
            </div>
        </div>
    );
};
