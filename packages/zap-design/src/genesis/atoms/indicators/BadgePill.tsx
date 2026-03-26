import React from 'react';
import { Wrapper } from '../../../components/dev/Wrapper';
import { cn } from '../../../lib/utils';

interface BadgePillProps {
    label: string;
    variant?: 'solid' | 'container';
    className?: string;
}

export const BadgePill = ({ label, variant = 'solid', className }: BadgePillProps) => {
    return (
        <Wrapper identity={{ displayName: "Badge Pill", filePath: "genesis/atoms/indicators/BadgePill.tsx", type: "Atom", architecture: "L3: Elements" }}>
            <div 
                className={cn(
                    "px-2 py-0.5 md:px-3 md:py-1.5 text-transform-secondary font-secondary font-bold tracking-widest text-[9px] md:text-xs rounded-sm inline-flex items-center justify-center",
                    variant === 'solid' ? "bg-primary text-on-primary" : "bg-primary-container text-on-primary-container",
                    className
                )}
            >
                {label}
            </div>
        </Wrapper>
    );
};
