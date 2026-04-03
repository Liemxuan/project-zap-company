'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface InspectorProps {
    title?: string;
    children?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    width?: number;
    /** 'inline' sits inside the layout flow; 'fixed' slides in from the right edge of the screen */
    variant?: 'inline' | 'fixed';
}

export const Inspector = ({
    title = 'Inspector',
    children,
    isOpen = true,
    onClose,
    width = 280,
    variant = 'inline',
}: InspectorProps) => {
    const isFixed = variant === 'fixed';

    return (
        <AnimatePresence initial={false}>
          {isOpen && isFixed && (
            <motion.div
              key="inspector-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 z-40"
            />
          )}
          {isOpen && (
            <motion.aside
                key="inspector"
                initial={isFixed ? { x: width, opacity: 0 } : { width: 0, opacity: 0 }}
                animate={isFixed ? { x: 0, opacity: 1 } : { width, opacity: 1 }}
                exit={isFixed ? { x: width, opacity: 0 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={isFixed ? { width } : undefined}
                className={
                  isFixed
                    ? 'fixed top-0 right-0 h-screen bg-layer-panel border-l border-outline-variant flex flex-col overflow-hidden z-50 shadow-2xl text-theme-base'
                    : 'bg-layer-panel border-l border-outline-variant flex flex-col shrink-0 overflow-hidden z-20 h-full text-theme-base'
                }
            >
            {/* Scrollable Workspace Container */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    {/* Header Item */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-medium text-theme-base text-titleMedium leading-[1.2] tracking-tight text-transform-primary">
                            {title}
                        </h2>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center h-6 w-6 rounded hover:bg-surface-variant transition-colors text-on-surface-variant hover:text-foreground"
                                aria-label="Close inspector"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                        {children || (
                            <div className="aspect-square border-[length:var(--card-border-width,2px)] border-dashed border-card-border-[length:var(--card-border-width,0px)] flex items-center justify-center bg-layer-cover rounded-card">
                                <span className="text-[10px] font-mono text-transform-tertiary text-theme-base/50 font-bold text-transform-secondary italic">No Parameters</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Footer - Reference matching button */}
            <div className="mt-auto p-4 bg-layer-panel border-t-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] sticky bottom-0 shrink-0">
                <button className="w-full bg-theme-base text-theme-inverted py-3 font-bold border-[length:var(--btn-border-width,0px)] border-btn-border-[length:var(--card-border-width,0px)] rounded-btn shadow-btn hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none hover:bg-theme-base/80 transition-all flex items-center justify-center gap-2 active:shadow-none text-transform-primary tracking-widest text-xs">
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    Create Update
                </button>
            </div>
            </motion.aside>
          )}
        </AnimatePresence>
    );
};
