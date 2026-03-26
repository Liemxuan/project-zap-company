import React from 'react';
import { cn } from '../../../lib/utils';

export type PillVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export const Pill: React.FC<{ children: React.ReactNode; variant?: PillVariant; className?: string }> = ({ children, variant = 'neutral', className }) => {

    // Map variants to specific semantic colors defined in globals.css / theme.css
    const variantStyles: Record<PillVariant, string> = {
        neutral: "bg-layer-panel text-theme-base border-card-border",
        primary: "bg-primary/10 text-primary border-primary/30",
        success: "bg-[var(--color-state-success)]/10 text-[var(--color-state-success)] border-[var(--color-state-success)]/30",
        warning: "bg-[var(--color-state-warning)]/10 text-[var(--color-state-warning)] border-[var(--color-state-warning)]/30",
        error: "bg-[var(--color-state-error)]/10 text-[var(--color-state-error)] border-[var(--color-state-error)]/30",
        info: "bg-[var(--color-state-info)]/10 text-[var(--color-state-info)] border-[var(--color-state-info)]/30"
    };

    const dynamicProps = { style: Object.assign({}, { height: 'var(--pill-height, auto)' }) };

    return (
        <span 
            className={cn(
                "px-2 py-1 text-[10px] font-black uppercase border-[length:var(--pill-border-width,var(--card-border-width,0px))] rounded-[length:var(--pill-border-radius,var(--btn-radius))] inline-flex items-center justify-center",
                variantStyles[variant],
                className
            )}
            {...dynamicProps}
        >
            {children}
        </span>
    );
};
