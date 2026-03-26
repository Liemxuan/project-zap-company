'use client';

import React from 'react';
import { Wrapper } from '../../../components/dev/Wrapper';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface LiveBlinkerProps {
    className?: string;
    iconOnly?: boolean;
    color?: 'red' | 'green';
}

export const LiveBlinker = ({ className, iconOnly = false, color = 'red' }: LiveBlinkerProps) => {
    const bgColor = color === 'green' ? 'bg-green-500' : 'bg-red-500';
    
    return (
        <Wrapper identity={{ displayName: "Live Blinker", filePath: "genesis/atoms/indicators/LiveBlinker.tsx", type: "Atom", architecture: "L3: Elements" }}>
            <div className={cn("flex items-center gap-1.5 md:gap-2 h-full pb-0.5 md:pb-1", className)}>
                <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className={cn("w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border border-foreground", bgColor)}
                />
                {!iconOnly && (
                    <span className="text-[9px] md:text-xs font-bold font-display text-transform-primary text-foreground/80 tracking-widest leading-none">
                        LIVE
                    </span>
                )}
            </div>
        </Wrapper>
    );
};
