import React from 'react';
import { cn } from '../../../lib/utils';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    noShadow?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
    children,
    className,
    noShadow = false,
    ...props
}) => {
    return (
        <div
            className={cn(
                "bg-layer-panel flex flex-col",
                !noShadow && "shadow-card",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
