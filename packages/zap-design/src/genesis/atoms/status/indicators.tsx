import React from 'react';
import { cn } from '../../../lib/utils';

export type StatusIntent = 'online' | 'offline' | 'warning' | 'idle' | 'processing';

export interface StatusDotProps {
    intent?: StatusIntent;
    pulse?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: React.CSSProperties;
}

export const StatusDot: React.FC<StatusDotProps> = ({
    intent = 'online',
    pulse = false,
    size = 'md',
    className = '',
    style
}) => {

    const intentColors: Record<StatusIntent, string> = {
        online: 'bg-[var(--color-state-success)]',
        offline: 'bg-gray-400',
        warning: 'bg-[var(--color-state-warning)]',
        idle: 'bg-[var(--color-state-info)]',
        processing: 'bg-brand-yellow',
    };

    const sizeStyles: Record<string, string> = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2.5 h-2.5',
        lg: 'w-4 h-4',
    };

    return (
        <div 
            className={cn(
                "relative flex items-center justify-center shrink-0", 
                sizeStyles[size],
                "[height:var(--indicator-height)] [width:var(--indicator-height)]",
                "border-[length:var(--indicator-border-width,0px)] border-border",
                "rounded-[length:var(--indicator-border-radius,9999px)]",
                className
            )}
            style={style}
        >
            {pulse && (
                <span
                    className={cn(
                        "absolute inline-flex h-full w-full opacity-75 animate-ping",
                        "rounded-[length:var(--indicator-border-radius,9999px)]",
                        intentColors[intent]
                    )}
                />
            )}
            <span
                className={cn(
                    "relative inline-flex w-full h-full",
                    "rounded-[length:var(--indicator-border-radius,9999px)]",
                    intentColors[intent]
                )}
            />
        </div>
    );
};
