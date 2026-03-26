import React from 'react';
import { cn } from '../../../lib/utils';

export const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => {
    return (
        <div className={cn("bg-layer-panel border-[length:var(--card-border-width,1px)] border-border rounded-[length:var(--card-radius,var(--rounded-card,12px))] shadow-sm", className)} style={style}>
            {children}
        </div>
    );
};
