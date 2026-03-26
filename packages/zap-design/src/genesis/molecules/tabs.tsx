"use client";

import * as React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Button } from '../../genesis/atoms/interactive/button';

// Variants for TabsList
const tabsListVariants = cva('flex items-center shrink-0', {
    variants: {
        variant: {
            default: 'bg-surface-container p-1',
            button: 'gap-1',
            line: 'border-b border-outline-variant',
        },
        shape: {
            default: '',
            pill: '',
        },
        size: {
            lg: 'h-12',
            md: 'h-10',
            sm: 'h-9',
            xs: 'h-8',
        },
    },
    compoundVariants: [
        { variant: 'default', size: 'lg', className: 'p-[length:var(--tabs-list-padding,0.375rem)]' },
        { variant: 'default', size: 'md', className: 'p-[length:var(--tabs-list-padding,0.25rem)]' },
        { variant: 'default', size: 'sm', className: 'p-[length:var(--tabs-list-padding,0.25rem)]' },
        { variant: 'default', size: 'xs', className: 'p-[length:var(--tabs-list-padding,0.25rem)]' },

        {
            variant: 'default',
            shape: 'default',
            size: 'lg',
            className: 'rounded-[length:var(--tabs-radius,var(--radius-shape-large,16px))]',
        },
        {
            variant: 'default',
            shape: 'default',
            size: 'md',
            className: 'rounded-[length:var(--tabs-radius,var(--radius-shape-medium,8px))]',
        },
        {
            variant: 'default',
            shape: 'default',
            size: 'sm',
            className: 'rounded-[length:var(--tabs-radius,var(--radius-shape-small,4px))]',
        },
        {
            variant: 'default',
            shape: 'default',
            size: 'xs',
            className: 'rounded-[length:var(--tabs-radius,var(--radius-shape-small,4px))]',
        },

        { variant: 'line', size: 'lg', className: 'gap-[length:var(--tabs-gap,2.25rem)]' },
        { variant: 'line', size: 'md', className: 'gap-[length:var(--tabs-gap,2rem)]' },
        { variant: 'line', size: 'sm', className: 'gap-[length:var(--tabs-gap,1rem)]' },
        { variant: 'line', size: 'xs', className: 'gap-[length:var(--tabs-gap,1rem)]' },

        {
            variant: 'default',
            shape: 'pill',
            className: 'rounded-full [&_[role=tab]]:rounded-full',
        },
        {
            variant: 'button',
            shape: 'pill',
            className: 'rounded-full [&_[role=tab]]:rounded-full',
        },
    ],
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});

// Variants for TabsContent
const tabsContentVariants = cva(
    'mt-2.5',
    {
        variants: {
            variant: {
                default: '',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

// Context
type TabsContextType = {
    variant?: 'default' | 'button' | 'line';
    size?: 'lg' | 'sm' | 'xs' | 'md';
};
const TabsContext = React.createContext<TabsContextType>({
    variant: 'default',
    size: 'md',
});

// Components
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return <TabsPrimitive.Root data-slot="tabs" className={cn('', className)} {...props} />;
}

function TabsList({
    className,
    variant = 'default',
    shape = 'default',
    size = 'md',
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
    return (
        <TabsContext.Provider value={{ variant: variant || 'default', size: size || 'md' }}>
            <TabsPrimitive.List
                data-slot="tabs-list"
                className={cn(tabsListVariants({ variant, shape, size }), className)}
                {...props}
            />
        </TabsContext.Provider>
    );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    const { variant, size } = React.useContext(TabsContext);

    // Map Tabs scale to Button scale where applicable
    let buttonSize: 'lg' | 'md' | 'sm' | 'icon' = 'md';
    if (size === 'lg') buttonSize = 'lg';
    else if (size === 'sm') buttonSize = 'sm';
    else if (size === 'xs') buttonSize = 'sm'; // Atom Button doesn't have xs, map to sm

    // M3 Theming logic: Tabs are essentially ghost buttons that alter their appearance on [data-state=active]
    return (
        <Button
            asChild
            variant="ghost"
            size={buttonSize}
            className={cn(
                'data-[state=active]:opacity-100', // Ensure active state is always fully opaque
                
                // Variant: Default (The pill sliding style)
                variant === 'default' &&
                    'text-on-surface-variant hover:bg-transparent hover:text-on-surface data-[state=active]:bg-secondary-container data-[state=active]:text-on-secondary-container data-[state=active]:shadow-xs data-[state=active]:shadow-black/5 focus-visible:bg-secondary-container focus-visible:text-on-secondary-container',
                
                // Variant: Button (Independent buttons)
                variant === 'button' &&
                    'text-on-surface-variant hover:text-on-surface hover:bg-secondary-container/50 data-[state=active]:bg-secondary-container data-[state=active]:text-on-secondary-container data-[state=active]:shadow-none focus-visible:bg-secondary-container focus-visible:text-on-secondary-container',
                
                // Variant: Line (Standard generic underline)
                variant === 'line' &&
                    'rounded-none border-b-2 border-transparent bg-transparent hover:bg-transparent hover:text-primary data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent shadow-none px-0',
                className
            )}
        >
            <TabsPrimitive.Trigger
                data-slot="tabs-trigger"
                {...props}
            />
        </Button>
    );
}

function TabsContent({
    className,
    variant,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> & VariantProps<typeof tabsContentVariants>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn(tabsContentVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
