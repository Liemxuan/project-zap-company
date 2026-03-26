import React from 'react';
import { cn } from '../../../lib/utils';

export interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({
    children,
    className = '',
    style,
    ...props
}) => {
    return (
        <main
            className={cn(
                'w-full bg-layer-canvas text-on-surface font-body text-transform-secondary',
                className
            )}
            style={style}
            {...props}
        >
            {children}
        </main>
    );
};
