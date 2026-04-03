'use client';

import React, { useState, useId } from 'react';
import { motion, LayoutGroup } from 'motion/react';

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
    const [focusedTab, setFocusedTab] = useState<string | null>(null);
    const layoutGroupId = useId();

    return (
        <LayoutGroup id={layoutGroupId}>
            <div className={`flex items-center gap-2 border-b-[length:var(--card-border-width,2px)] border-card-border pb-px ${className}`}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            onFocus={() => setFocusedTab(tab.id)}
                            onBlur={() => setFocusedTab(null)}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ backgroundColor: 'var(--color-surface-container)' }}
                            className={`
                                relative px-6 py-3 font-bold text-[13px] text-transform-primary font-display tracking-wider
                                transition-colors outline-none rounded-t-[length:var(--radius-shape-small,8px)]
                                ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}
                          `}
                        >
                            {/* Animated Focus Keyboard Highlight */}
                            {focusedTab === tab.id && (
                                <motion.div
                                    layoutId="focusTabBackground"
                                    className="absolute inset-x-0 bottom-0 top-0 bg-surface-variant/80 rounded-[length:var(--radius-shape-small,8px)] -z-10 border border-outline-variant shadow-sm"
                                    layout
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}

                            <span className="relative z-10">{tab.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute inset-x-0 bottom-0 h-[2px] bg-primary z-0"
                                    layout
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </LayoutGroup>
    );
};
