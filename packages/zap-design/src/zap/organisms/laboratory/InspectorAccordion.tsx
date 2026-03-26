'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Icon } from '../../../genesis/atoms/icons/Icon';

export interface InspectorAccordionProps {
    title: string;
    icon?: string | React.ElementType;  // Google Material Icon name or React Component (e.g. Lucide)
    defaultOpen?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const InspectorAccordion: React.FC<InspectorAccordionProps> = ({
    title,
    icon,
    defaultOpen = true,
    children,
    className
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn("flex flex-col", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between transition-all duration-200 outline-none text-left rounded-lg",
                    "px-3 py-2.5",
                    isOpen ? "bg-primary/10 text-on-surface ring-1 ring-primary/20" : "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface"
                )}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {icon && (
                        typeof icon === 'string' ? (
                            <Icon name={icon as never} size={20} className={cn(isOpen ? "text-primary" : "text-on-surface-variant opacity-70")} />
                        ) : (
                            React.createElement(icon, { size: 20, className: cn(isOpen ? "text-primary" : "text-on-surface-variant opacity-70") })
                        )
                    )}
                    <span className="font-display font-medium text-titleSmall text-transform-primary tracking-tight whitespace-nowrap">
                        {title}
                    </span>
                </div>
                <div className="text-on-surface-variant/50">
                    <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
                        <ChevronDown size={14} strokeWidth={2.5} />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                        animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
                        exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                        className="flex flex-col m-0"
                    >
                        <div className="px-3 pb-4 pt-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
