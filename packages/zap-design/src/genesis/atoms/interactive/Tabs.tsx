'use client';

import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';

export interface TabItem {
    id: string;
    label: string;
}

export interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

/**
 * ZAP Semantic Tabs
 * Represents top-level view switching within a distinct layout zone.
 * Features a neo-brutalist animated underline using Framer Motion.
 */
export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
    return (
        <LayoutGroup>
            <div className={`flex items-center gap-2 border-b-[length:var(--card-border-width,2px)] border-card-border pb-px ${className}`}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={`
                                relative px-6 py-3 font-bold text-[13px] text-transform-primary font-display tracking-wider
                                transition-colors outline-none
                                focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface
                                ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'}
                           `}
                        >
                            {tab.label}

                            {isActive && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute left-0 right-0 top-[calc(100%+1px)] h-[var(--card-border-width,2px)] bg-primary z-10"
                                    layout
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </LayoutGroup>
    );
};
