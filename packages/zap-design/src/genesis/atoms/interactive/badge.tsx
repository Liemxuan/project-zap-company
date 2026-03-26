import * as React from 'react';
import { cn } from '../../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    asChild?: boolean;
    dotClassName?: string;
    disabled?: boolean;
}

export interface BadgeButtonProps
    extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeButtonVariants> {
    asChild?: boolean;
}

export type BadgeDotProps = React.HTMLAttributes<HTMLSpanElement>;

import * as SlotPrimitive from '@radix-ui/react-slot';

const badgeVariants = cva(
    'inline-flex items-center justify-center border-[length:var(--badge-border-width,1px)] border-transparent rounded-[length:var(--badge-border-radius,var(--radius-shape-small,4px))] font-medium font-secondary text-transform-secondary focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:-ms-px [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-on-primary',
                secondary: 'bg-secondary text-on-secondary',
                success: 'bg-success text-success-foreground',
                warning: 'bg-warning text-warning-foreground',
                info: 'bg-info text-info-foreground',
                outline: 'bg-transparent border border-outline text-on-surface',
                destructive: 'bg-error text-on-error',
            },
            appearance: {
                default: '',
                light: '',
                outline: '',
                ghost: 'border-transparent bg-transparent',
            },
            disabled: {
                true: 'opacity-50 pointer-events-none',
            },
            size: {
                lg: 'px-[0.5rem] h-[var(--badge-height,1.75rem)] min-w-7 gap-1.5 text-xs [&_svg]:size-3.5',
                md: 'px-[0.45rem] h-[var(--badge-height,1.5rem)] min-w-6 gap-1.5 text-xs [&_svg]:size-3.5 ',
                sm: 'px-[0.325rem] h-[var(--badge-height,1.25rem)] min-w-5 gap-1 text-[0.6875rem] leading-[0.75rem] [&_svg]:size-3',
                xs: 'px-[0.25rem] h-[var(--badge-height,1rem)] min-w-4 gap-1 text-[0.625rem] leading-[0.5rem] [&_svg]:size-3',
            },
            shape: {
                default: '',
                circle: 'rounded-full',
            },
        },
        compoundVariants: [
            /* Light (M3 Container Protocol) */
            {
                variant: 'primary',
                appearance: 'light',
                className: 'bg-primary-container text-on-primary-container',
            },
            {
                variant: 'secondary',
                appearance: 'light',
                className: 'bg-secondary-container text-on-secondary-container',
            },
            {
                variant: 'success',
                appearance: 'light',
                className: 'bg-success/15 text-success',
            },
            {
                variant: 'warning',
                appearance: 'light',
                className: 'bg-warning/15 text-warning',
            },
            {
                variant: 'info',
                appearance: 'light',
                className: 'bg-info/15 text-info',
            },
            {
                variant: 'destructive',
                appearance: 'light',
                className: 'bg-error-container text-on-error-container',
            },
            /* Outline */
            {
                variant: 'primary',
                appearance: 'outline',
                className: 'border border-primary text-primary',
            },
            {
                variant: 'success',
                appearance: 'outline',
                className: 'border border-success text-success',
            },
            {
                variant: 'warning',
                appearance: 'outline',
                className: 'border border-warning text-warning',
            },
            {
                variant: 'info',
                appearance: 'outline',
                className: 'border border-info text-info',
            },
            {
                variant: 'destructive',
                appearance: 'outline',
                className: 'border border-error text-error',
            },
            /* Ghost */
            {
                variant: 'primary',
                appearance: 'ghost',
                className: 'text-primary hover:bg-primary/10',
            },
            {
                variant: 'secondary',
                appearance: 'ghost',
                className: 'text-secondary hover:bg-secondary/10',
            },
            {
                variant: 'success',
                appearance: 'ghost',
                className: 'text-success hover:bg-success/10',
            },
            {
                variant: 'warning',
                appearance: 'ghost',
                className: 'text-warning hover:bg-warning/10',
            },
            {
                variant: 'info',
                appearance: 'ghost',
                className: 'text-info hover:bg-info/10',
            },
            {
                variant: 'destructive',
                appearance: 'ghost',
                className: 'text-error hover:bg-error/10',
            },

            { size: 'lg', appearance: 'ghost', className: 'px-0' },
            { size: 'md', appearance: 'ghost', className: 'px-0' },
            { size: 'sm', appearance: 'ghost', className: 'px-0' },
            { size: 'xs', appearance: 'ghost', className: 'px-0' },
        ],
        defaultVariants: {
            variant: 'primary',
            appearance: 'default',
            size: 'md',
        },
    },
);

const badgeButtonVariants = cva(
    'cursor-pointer transition-all inline-flex items-center justify-center leading-none size-3.5 [&>svg]:opacity-100! [&>svg]:size-3.5! p-0 rounded-md -me-0.5 opacity-60 hover:opacity-100',
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

function Badge({
    className,
    variant,
    size,
    appearance,
    shape,
    asChild = false,
    disabled,
    ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? SlotPrimitive.Slot : 'span';

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant, size, appearance, shape, disabled }), className)}
            {...props}
        />
    );
}

function BadgeButton({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> & VariantProps<typeof badgeButtonVariants> & { asChild?: boolean }) {
    const Comp = asChild ? SlotPrimitive.Slot : 'span';
    return (
        <Comp
            data-slot="badge-button"
            className={cn(badgeButtonVariants({ variant, className }))}
            role="button"
            {...props}
        />
    );
}

function BadgeDot({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="badge-dot"
            className={cn('size-1.5 rounded-full bg-[currentColor] opacity-75', className)}
            {...props}
        />
    );
}

export { Badge, BadgeButton, BadgeDot, badgeVariants };
