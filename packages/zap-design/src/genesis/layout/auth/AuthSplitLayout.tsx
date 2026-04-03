'use client';

import React from 'react';
import { cn } from '../../../lib/utils';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AuthSplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 
     * The L5 Organism (like LoginForm or SignupForm) 
     */
    formSlot: React.ReactNode;
    
    /** 
     * The visual hero content for the left side
     */
    heroSlot: React.ReactNode;
    
    /** 
     * Optional brand logo/mark at the top of the form 
     */
    brandSlot?: React.ReactNode;
    
    /**
     * Swap the form to the left side and hero to the right
     */
    reverse?: boolean;
}

/**
 * L6: Auth Split Layout
 * 
 * An architectural frame that dictates spatial relationships (50/50 split), 
 * media queries (hero hides on mobile), and structural flow.
 * 
 * This contains ZERO business logic and ZERO data fetching.
 * It is pure structural scaffolding waiting for L5 Organisms.
 */
export function AuthSplitLayout({
    formSlot,
    heroSlot,
    brandSlot,
    reverse = false,
    className,
    ...props
}: AuthSplitLayoutProps) {
    return (
        <div 
            className={cn(
                "relative flex min-h-screen flex-col lg:flex-row bg-layer-base text-on-surface overflow-hidden",
                reverse ? "lg:flex-row-reverse" : "",
                className
            )} 
            {...props}
        >
            {/* L6 Region: Hero / Graphic Panel */}
            <motion.div 
                initial={{ opacity: 0, x: reverse ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                    "relative hidden lg:flex flex-col flex-1",
                    "bg-layer-panel border-black",
                    reverse ? "border-l" : "border-r"
                )}
            >
                {/* Visual Injection Point */}
                <div className="absolute inset-0 z-0">
                    {heroSlot}
                </div>

                {/* Subtle Overlay to ensure text readability if heroSlot includes a graphic */}
                <div className="absolute inset-0 bg-black/40 z-10" />

                {/* Optional Decorative Elements inherited by Layout */}
                <div className="relative z-20 mt-auto p-12 text-white">
                    <div className="flex items-center gap-2 mb-4 opacity-70">
                        <Building2 size={24} />
                        <span className="font-display text-transform-primary font-medium tracking-wide">ZAP VIBRANIUM INC.</span>
                    </div>
                </div>
            </motion.div>

            {/* L6 Region: Interactive Surface (Form) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col flex-1 items-center justify-center px-6 py-12 sm:px-12 lg:px-24"
            >
                <div className="w-full max-w-[440px] flex flex-col items-center">
                    {brandSlot && (
                        <div className="mb-8 w-full flex justify-center">
                            {brandSlot}
                        </div>
                    )}
                    
                    {/* Organism Injection Point */}
                    <div className="w-full">
                        {formSlot}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
