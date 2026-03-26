'use client';

import React from 'react';
import { PageHeader } from '../../../zap/layout/PageHeader';
import { type TabItem } from '../../../genesis/atoms/interactive/Tabs';
import { type Platform } from '../../../zap/sections/atoms/foundations/components';
import { Wrapper } from '../../../components/dev/Wrapper';
import { motion } from 'framer-motion';

export interface ExperimentalHeaderProps {
    title: React.ReactNode;
    breadcrumb?: string;
    badge?: string;
    tabs?: TabItem[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    liveIndicator?: boolean;
    platform?: Platform;
    setPlatform?: (platform: Platform) => void;
    showBackground?: boolean;
    rightSlot?: React.ReactNode;
}

export const ExperimentalHeader = ({
    title,
    breadcrumb,
    badge = 'Experimental Component Preview',
    tabs,
    activeTab,
    onTabChange,
    liveIndicator = false,
    platform,
    setPlatform,
    showBackground = true,
    rightSlot
}: ExperimentalHeaderProps) => {
    return (
        <Wrapper identity={{ displayName: "Experimental Header", filePath: "genesis/molecules/layout/ExperimentalHeader.tsx", type: "Wrapped Snippet", architecture: "L4: Molecules" }}>
            <PageHeader
                title={title}
                breadcrumb={breadcrumb}
                badge={badge}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
                platform={platform}
                setPlatform={setPlatform}
                showBackground={showBackground}
                rightSlot={
                    <div className="flex items-center gap-3">
                        {rightSlot}
                        {liveIndicator && (
                            <div className="flex items-center gap-1.5 md:gap-2 h-full pb-0.5 md:pb-1">
                                <motion.div
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500 border border-foreground"
                                />
                                <span className="text-[9px] md:text-xs font-bold font-secondary text-transform-secondary text-on-surface text-transform-primary/80 tracking-widest leading-none">LIVE</span>
                            </div>
                        )}
                    </div>
                }
            />
        </Wrapper>
    );
};
