import React from 'react';
import { cn } from '../../../lib/utils';

export const Badge: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className, style }) => {
    const dynamicProps = { style: Object.assign({ minHeight: 'var(--badge-height, auto)' }, style) };
    return (
        <span 
            className={cn(`inline-flex items-center px-1.5 py-0.5 border-[length:var(--badge-border-width,0px)] border-border rounded-[length:var(--badge-border-radius,var(--rounded-btn,8px))] text-on-surface-variant font-body text-xs text-transform-secondary`, className)}
            {...dynamicProps}
        >
            {children}
        </span>
    );
};

export interface NeoBadgeProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    variant?: 'dark' | 'light' | 'yellow';
}

/**
 * NeoBadge: A standardized template for neo-brutalist badges.
 * 
 * Solves the "mismatched shadow curve" defect by using two identical 
 * layered div elements instead of relying on browser `box-shadow` interpolation.
 * This guarantees the "front piece" and "back piece" perfectly align.
 */
export const NeoBadge: React.FC<NeoBadgeProps> = ({ children, className = '', style, variant = 'dark' }) => {

    // Front layer styling
    const variantStyles = {
        dark: "bg-inverse-surface text-inverse-on-surface border-transparent",
        light: "bg-surface-container text-on-surface border-border",
        yellow: "bg-primary-container text-on-primary-container border-transparent"
    };

    const dynamicProps = { style: Object.assign({ minHeight: 'var(--badge-height, auto)' }, style) };
    const innerDynamicProps = { style: Object.assign({ minHeight: 'var(--badge-height, auto)' }) };

    return (
        <div className={cn("relative inline-block", className)} {...dynamicProps}>
            {/* The "Back Piece" (Perfect Shadow) */}
            <div className="absolute inset-0 bg-outline rounded-[length:var(--badge-border-radius,var(--rounded-btn,8px))] translate-x-1 translate-y-1"></div>

            {/* The "Front Piece" */}
            <div className={cn(`relative rounded-[length:var(--badge-border-radius,var(--rounded-btn,8px))] border-[length:var(--badge-border-width,2px)] px-4 py-1.5 text-xs font-display text-transform-primary tracking-widest flex items-center justify-center`, variantStyles[variant])}
                 {...innerDynamicProps}
            >
                {children}
            </div>
        </div>
    );
};
