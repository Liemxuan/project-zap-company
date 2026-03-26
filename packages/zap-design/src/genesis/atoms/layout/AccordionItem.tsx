'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon, IconProps } from '../../../genesis/atoms/icons/Icon';
import { cn } from '../../../lib/utils';

export interface AccordionItemProps {
    title: string | React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
    iconName?: string;
    leftIcon?: string;
    variant?: 'ghost' | 'solid';
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
    title,
    children,
    isOpen,
    onToggle,
    className = '',
    iconName = 'chevron_right',
    leftIcon,
    variant = 'ghost'
}) => {

    // Ghost: Matches Inspector styling (bg-primary/5 when open, hover:bg-on-surface/5)
    // Solid: Permanent surface-container-low resting state
    const variantClasses = variant === 'solid'
        ? 'bg-surface-container-low text-on-surface'
        : cn(
            "bg-transparent transition-all duration-200",
            isOpen 
                ? "bg-primary/5 text-on-surface" 
                : "text-muted-foreground hover:bg-on-surface/5 hover:text-on-surface"
          );

    return (
        <div className={`w-full flex flex-col border-b-[length:var(--accordion-border-width,1px)] border-outline-variant last:border-b-0 rounded-[length:var(--accordion-radius,0px)] overflow-hidden ${className}`}>
            <button
                type="button"
                className={cn(
                    "w-full flex items-center justify-between min-h-[length:var(--accordion-height,48px)] py-3 px-4 outline-none focus-visible:bg-on-surface/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset group rounded-[length:var(--accordion-radius,0px)]",
                    variantClasses
                )}
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    {leftIcon && (
                        <Icon name={leftIcon as IconProps['name']} size={20} className={cn(isOpen ? "text-primary" : "text-muted-foreground/70")} />
                    )}
                    <div className="font-display font-medium text-titleSmall text-transform-primary tracking-tight text-left">
                        {title}
                    </div>
                </div>
                <motion.div
                    initial={false}
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="group-hover:text-primary transition-colors text-on-surface-variant"
                >
                    <Icon name={iconName as IconProps['name']} size={16} />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
