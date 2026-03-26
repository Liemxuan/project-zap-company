'use client';

import React from 'react';
import { Wrapper } from '../../components/dev/Wrapper';
import { Heading } from '../../genesis/atoms/typography/headings';
import { Tabs, type TabItem } from '../../genesis/atoms/interactive/Tabs';

import { BreadcrumbPill } from '../../genesis/atoms/indicators/BreadcrumbPill';
import { BadgePill } from '../../genesis/atoms/indicators/BadgePill';
import { type Platform } from '../../zap/sections/atoms/foundations/components';

export interface MetroPageHeaderProps {
    title: React.ReactNode;
    breadcrumb?: string;
    badge?: string;

    tabs?: TabItem[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    platform?: Platform;
    setPlatform?: (platform: Platform) => void;
    rightSlot?: React.ReactNode;
    showBackground?: boolean;
}

export const MetroPageHeader = ({
    title,
    breadcrumb,
    badge,

    tabs,
    activeTab,
    onTabChange,
    rightSlot,
    showBackground = true,
}: MetroPageHeaderProps) => {
    // Dynamic vertical spacing calculations: Enforcing equal top/bottom padding per user request
    const paddingTop = 'pt-2 md:pt-5';
    const paddingBottom = tabs ? 'pb-2 md:pb-4' : 'pb-2 md:pb-5';

    return (
        <div className={`relative w-full flex flex-col overflow-hidden ${showBackground ? 'border-b border-border/50 bg-layer-cover z-30' : 'bg-transparent border-transparent'}`}>
            <Wrapper identity={{ displayName: "Metro Page Header", filePath: "zap/layout/MetroPageHeader.tsx", type: "Wrapped Snippet", architecture: "L5: Organisms" }}>
                <div className={`relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 px-5 md:px-12 ${paddingTop} ${paddingBottom}`}>
                    <Wrapper identity={{ displayName: "Page Title Area", filePath: "zap/layout/MetroPageHeader.tsx", type: "Wrapped Snippet", architecture: "L4: Molecules" }} className="w-auto">
                        <div className="flex flex-col items-start gap-1.5 md:gap-2">
                            {breadcrumb && <BreadcrumbPill label={breadcrumb} />}
                            <Heading level={1} className="text-foreground leading-none text-transform-primary">
                                {title}
                            </Heading>
                            {badge && <BadgePill label={badge} variant="solid" />}
                        </div>
                    </Wrapper>
                    <Wrapper identity={{ displayName: "Header Controls Area", filePath: "zap/layout/MetroPageHeader.tsx", type: "Wrapped Snippet", architecture: "L4: Molecules" }} className="w-auto flex items-end h-[28px] md:h-[32px]">
                        <div className="flex items-center gap-4 h-full">
                            {rightSlot}

                        </div>
                    </Wrapper>
                </div>

                {tabs && activeTab && onTabChange && (
                    <Wrapper identity={{ displayName: "Header Tabs Navigation", filePath: "zap/layout/MetroPageHeader.tsx", type: "Wrapped Snippet", architecture: "L4: Molecules" }}>
                        <div className="relative z-10 px-5 md:px-12 pb-0">
                            <Tabs
                                tabs={tabs}
                                activeTab={activeTab}
                                onChange={onTabChange}
                                className="w-full -ml-3 md:-ml-6"
                            />
                        </div>
                    </Wrapper>
                )}
            </Wrapper>
        </div>
    );
};
