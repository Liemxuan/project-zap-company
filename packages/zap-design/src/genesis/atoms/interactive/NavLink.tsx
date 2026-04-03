'use client';

import React from 'react';
import Link from 'next/link';


import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';

const navLinkVariants = cva(
    "relative flex items-center transition-all duration-300 outline-none w-full cursor-pointer antialiased",
    {
        variants: {
            variant: {
                default: "rounded-lg text-[13px] font-medium px-2 py-2 gap-3 group/navlist",
                subItem: "px-3 -ml-3 py-1.5 text-[12px] font-body text-transform-secondary block", // For atoms inside groups (aligned padding surface)
            },
            state: {
                default: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                active: "text-primary font-bold bg-primary/10 ring-1 ring-primary/20",
                ghostHover: "text-muted-foreground/60 hover:text-foreground hover:translate-x-0.5 group-hover/navlist:opacity-40 hover:!opacity-100 hover:bg-on-surface/5 rounded-md", // Unselected subItems (Second Focus)
                activeShifted: "bg-primary-container text-on-primary-container font-bold shadow-[var(--md-sys-elevation-level1)] rounded-md border border-primary-container" // Selected subItems (Main Focus)
            }
        },
        defaultVariants: {
            variant: "default",
            state: "default",
        }
    }
);

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof navLinkVariants> {
    href: string;
    isActive?: boolean;
    showIndicator?: boolean; // Controls whether to show the layoutId indicator balloon
    indicatorLayoutId?: string; // For framer-motion layoutId
    depth?: number; // Indentation depth for recursive menus, optional
    children: React.ReactNode;
}

/**
 * ZAP Semantic NavLink (M3/Metronic Compliant)
 * A unified atomic primitive for dynamic navigation items.
 */
export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(({
    href,
    isActive = false,
    variant = "default",
    state: _forcedState,
    showIndicator = false,
    indicatorLayoutId = "sidebar-active-indicator",
    depth = 0,
    className,
    children,
    ...props
}, ref) => {
    // Automatically determine state if not manually forced
    let computeState = _forcedState;
    if (!computeState) {
        if (variant === "default") {
            computeState = isActive ? "active" : "default";
        } else if (variant === "subItem") {
            computeState = isActive ? "activeShifted" : "ghostHover";
        }
    }

    const customStyle = {
        borderRadius: 'var(--navlink-border-radius, 8px)',
        borderWidth: 'var(--navlink-border-width, 0px)',
        borderStyle: 'solid',
        borderColor: isActive ? 'var(--color-primary-container)' : 'transparent',
        ...(depth > 0 ? { paddingLeft: `${0.75 + (depth * 0.75)}rem` } : {}),
        ...(props.style as React.CSSProperties)
    };

    return (
        <Link
            href={href}
            ref={ref}
            data-sidebar-active={isActive}
            className={cn(navLinkVariants({ variant, state: computeState }), className)}
            style={customStyle}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
            {showIndicator && isActive && variant === 'default' && (
                <motion.div
                    layoutId={indicatorLayoutId}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-md bg-primary"
                />
            )}
            {variant === 'default' ? (
                <>
                    {children}
                </>
            ) : (
                children
            )}
        </Link>
    );
});

NavLink.displayName = "NavLink";
