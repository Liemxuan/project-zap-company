'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, Plus } from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

// Variants
const accordionRootVariants = cva('', {
    variants: {
        variant: {
            default: '',
            outline: 'space-y-2',
            solid: 'space-y-2',
            navigation: 'space-y-1',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const accordionItemVariants = cva('', {
    variants: {
        variant: {
            default: 'border-b border-outline-variant',
            outline: 'border border-outline-variant rounded-lg px-4',
            solid: 'rounded-lg bg-surface-variant px-4',
            navigation: 'rounded-lg border-none',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const accordionTriggerVariants = cva(
    'flex flex-1 items-center justify-between transition-all cursor-pointer outline-none',
    {
        variants: {
            variant: {
                default: 'py-4 gap-2.5 text-on-surface text-transform-primary font-display text-transform-primary font-medium',
                outline: 'py-4 gap-2.5 text-on-surface text-transform-primary font-display text-transform-primary font-medium',
                solid: 'py-4 gap-2.5 text-on-surface text-transform-primary font-display text-transform-primary font-medium',
                navigation: 'py-2.5 px-3 gap-3 rounded-lg text-titleSmall tracking-tight text-on-surface-variant text-transform-primary font-display font-medium hover:bg-on-surface/5 hover:text-on-surface data-[state=open]:bg-primary/10 data-[state=open]:text-on-surface data-[state=open]:ring-1 data-[state=open]:ring-primary/20',
            },
            indicator: {
                arrow: '[&[data-state=open]>svg]:rotate-180',
                'right-arrow': '[&[data-state=closed]>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0',
                plus: '[&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180',
                none: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            indicator: 'arrow',
        },
    },
);

const accordionContentVariants = cva(
    'overflow-hidden text-sm text-on-surface text-transform-primary transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
    {
        variants: {
            variant: {
                default: '',
                outline: '',
                solid: '',
                navigation: '',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

// Context
type AccordionContextType = {
    variant?: 'default' | 'outline' | 'solid' | 'navigation';
    indicator?: 'arrow' | 'plus' | 'right-arrow' | 'none';
};

const AccordionContext = React.createContext<AccordionContextType>({
    variant: 'default',
    indicator: 'arrow',
});

// Components
function Accordion(
    props: React.ComponentProps<typeof AccordionPrimitive.Root> &
        VariantProps<typeof accordionRootVariants> & {
            indicator?: 'arrow' | 'plus' | 'right-arrow' | 'none';
        },
) {
    const { className, variant = 'default', indicator = 'arrow', children, ...rest } = props;

    return (
        <AccordionContext.Provider value={{ variant: variant || 'default', indicator }}>
            <AccordionPrimitive.Root
                data-slot="accordion"
                className={cn(accordionRootVariants({ variant }), className)}
                {...rest}
            >
                {children}
            </AccordionPrimitive.Root>
        </AccordionContext.Provider>
    );
}

function AccordionItem(props: React.ComponentProps<typeof AccordionPrimitive.Item>) {
    const { className, children, ...rest } = props;
    const { variant } = React.useContext(AccordionContext);

    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            className={cn(accordionItemVariants({ variant }), className)}
            {...rest}
        >
            {children}
        </AccordionPrimitive.Item>
    );
}

function AccordionTrigger(props: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
    const { className, children, ...rest } = props;
    const { variant, indicator } = React.useContext(AccordionContext);

    return (
        <AccordionPrimitive.Header className="flex m-0">
            <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className={cn(accordionTriggerVariants({ variant, indicator }), className)}
                {...rest}
            >
                {children}
                {indicator === 'plus' && <Plus className="size-4 shrink-0 transition-transform duration-200" strokeWidth={1} />}
                {(indicator === 'arrow' || indicator === 'right-arrow') && (
                    <ChevronDown className="size-4 shrink-0 transition-transform duration-200 text-on-surface-variant/50" strokeWidth={2.5} />
                )}
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent(props: React.ComponentProps<typeof AccordionPrimitive.Content>) {
    const { className, children, ...rest } = props;
    const { variant } = React.useContext(AccordionContext);

    return (
        <AccordionPrimitive.Content
            data-slot="accordion-content"
            className={cn(accordionContentVariants({ variant }), className)}
            {...rest}
        >
            <div className={cn('pb-5 pt-0', variant === 'navigation' && 'px-3 pb-4 pt-1', className)}>{children}</div>
        </AccordionPrimitive.Content>
    );
}

// Exports
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
