'use client';

import React from 'react';
import { ContainerDevWrapper } from '../../../components/dev/ContainerDevWrapper';
import { Wrapper } from '../../../components/dev/Wrapper';
import { useTheme } from '../../../components/ThemeContext';
import { Text } from '../../../genesis/atoms/typography/text';
import { cn } from '../../../lib/utils';
// Remove Icon import as it is no longer used

export interface BreadcrumbItem {
    label: string;
    active?: boolean;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    showDevWrapper?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    showDevWrapper = false
}) => {
    const { devMode } = useTheme();
    const isDev = showDevWrapper && devMode;

    const content = (
        <nav aria-label="Breadcrumb" className="h-full flex items-center py-[length:var(--breadcrumb-padding,0.5rem)]">
            <ol className="flex items-center h-full gap-[length:var(--breadcrumb-gap,0.375rem)]">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isActive = item.active || isLast;
                    return (
                        <li key={index} className="flex items-center h-full gap-[length:var(--breadcrumb-gap,0.375rem)]">
                            <Wrapper identity={{ displayName: `Crumb: ${item.label}`, type: "Atom/Action", filePath: "genesis/molecules/navigation/Breadcrumbs.tsx" }}>
                                <div className={cn(
                                    "flex items-center justify-center select-none transition-all px-2.5 py-1 min-h-[24px] rounded-md",
                                    isActive
                                        ? "bg-primary-container text-on-primary-container border border-primary-container shadow-[var(--md-sys-elevation-level1)]"
                                        : "bg-surface-variant text-on-surface-variant border border-outline-variant hover:bg-surface-variant/80"
                                )}>
                                    <Text
                                        size="iso-100"
                                        weight={isActive ? 'bold' : 'medium'}
                                        className="text-transform-secondary whitespace-nowrap leading-none"
                                    >
                                        <span className="text-transform-secondary font-body">{item.label}</span>
                                    </Text>
                                </div>
                            </Wrapper>
                            {!isLast && (
                                <span className={cn("text-on-surface-variant select-none opacity-50 font-medium", "text-[length:var(--breadcrumb-icon-size,12px)]")}>
                                    →
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );

    if (isDev) {
        return (
            <ContainerDevWrapper
                showClassNames={true}
                identity={{
                    displayName: "Breadcrumbs",
                    filePath: "genesis/molecules/navigation/Breadcrumbs.tsx",
                    type: "Molecule/Block",
                    architecture: "SYSTEMS // CORE"
                }}
            >
                {content}
            </ContainerDevWrapper>
        );
    }

    return content;
};
