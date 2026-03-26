'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Define CardContext
type CardContextType = {
    variant: 'default' | 'accent';
};

const CardContext = React.createContext<CardContextType>({
    variant: 'default', // Default value
});

// Hook to use CardContext
const useCardContext = () => {
    const context = React.useContext(CardContext);
    if (!context) {
        throw new Error('useCardContext must be used within a Card component');
    }
    return context;
};

// Variants
const cardVariants = cva('flex flex-col items-stretch text-on-surface text-transform-primary rounded-[var(--card-border-radius,var(--layer-1-border-radius))]', {
    variants: {
        variant: {
            default: 'bg-layer-canvas border-[length:var(--card-border-width,var(--layer-1-border-width))] border-outline-variant shadow-xs black/5',
            accent: 'bg-layer-panel shadow-xs p-1',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const cardHeaderVariants = cva('flex items-center justify-between flex-wrap px-[var(--spacing-card-pad)] pt-[var(--spacing-card-pad)] min-h-14 gap-2.5', {
    variants: {
        variant: {
            default: 'border-b border-outline-variant',
            accent: '',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const cardContentVariants = cva('grow p-[var(--spacing-card-pad)]', {
    variants: {
        variant: {
            default: '',
            accent: 'bg-layer-canvas rounded-t-[var(--card-border-radius)] [&:last-child]:rounded-b-[var(--card-border-radius)]',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const cardTableVariants = cva('grid grow', {
    variants: {
        variant: {
            default: '',
            accent: 'bg-layer-canvas rounded-[var(--card-border-radius)]',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const cardFooterVariants = cva('flex items-center px-[var(--spacing-card-pad)] pb-[var(--spacing-card-pad)] min-h-14', {
    variants: {
        variant: {
            default: 'border-t border-outline-variant',
            accent: 'bg-layer-canvas rounded-b-[var(--card-border-radius)] mt-[2px]',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

// Card Component
function Card({
    className,
    variant = 'default',
    ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
    return (
        <CardContext.Provider value={{ variant: variant || 'default' }}>
            <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />
        </CardContext.Provider>
    );
}

// CardHeader Component
function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { variant } = useCardContext();
    return <div data-slot="card-header" className={cn(cardHeaderVariants({ variant }), className)} {...props} />;
}

// CardContent Component
function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { variant } = useCardContext();
    return <div data-slot="card-content" className={cn(cardContentVariants({ variant }), className)} {...props} />;
}

// CardTable Component
function CardTable({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { variant } = useCardContext();
    return <div data-slot="card-table" className={cn(cardTableVariants({ variant }), className)} {...props} />;
}

// CardFooter Component
function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const { variant } = useCardContext();
    return <div data-slot="card-footer" className={cn(cardFooterVariants({ variant }), className)} {...props} />;
}

// Other Components
function CardHeading({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div data-slot="card-heading" className={cn('space-y-1', className)} {...props} />;
}

function CardToolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div data-slot="card-toolbar" className={cn('flex items-center gap-2.5', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            data-slot="card-title"
            className={cn('text-base font-semibold leading-none tracking-tight', className)}
            {...props}
        />
    );
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div data-slot="card-description" className={cn('text-sm text-on-surface-variant text-transform-secondary', className)} {...props} />;
}

// Exports
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardHeading, CardTable, CardTitle, CardToolbar };
