"use client";

import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../components/ThemeContext';
import { ContainerDevWrapper, DevIdentity } from '../../components/dev/ContainerDevWrapper';

export interface WrapperProps {
    children: React.ReactNode;
    identity?: DevIdentity;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
    align?: 'left' | 'right';
    codeSnippet?: string;
}

export const Wrapper: React.FC<WrapperProps> = ({
    children,
    identity,
    title = "Content Wrapper",
    className = '',
    style,
    align = 'right',
    codeSnippet
}) => {
    const { devMode } = useTheme();

    const autoSnippet = React.useMemo(() => {
        if (devMode && !codeSnippet && (!identity || !identity.codeSnippet)) {
            return ""; // FIX CRASH
        }
        return codeSnippet;
    }, [devMode, codeSnippet, identity]);

    const resolvedIdentity = identity
        ? { ...identity, codeSnippet: identity.codeSnippet || autoSnippet }
        : {
            displayName: title,
            type: "Wrapped Snippet",
            architecture: "GENERIC",
            filePath: "dynamic-wrapper",
            codeSnippet: autoSnippet
        };

    return (
        <div className={cn('relative w-full group', className)} style={style}>
            <ContainerDevWrapper
                showClassNames={devMode}
                identity={resolvedIdentity}
                className={cn(
                    "w-full h-full",
                    className.includes('flex') && 'flex',
                    className.includes('flex-col') && 'flex-col',
                    className.includes('flex-1') && 'flex-1',
                    className.includes('items-center') && 'items-center',
                    className.includes('justify-center') && 'justify-center'
                )}
                style={style}
                align={align}
            >
                {children}
            </ContainerDevWrapper>
        </div>
    );
};
