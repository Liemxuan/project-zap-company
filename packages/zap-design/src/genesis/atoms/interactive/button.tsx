import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, LucideIcon } from 'lucide-react';
import * as SlotPrimitive from '@radix-ui/react-slot';
import { cn } from '../../../lib/utils';

const buttonVariants = cva(
    'cursor-pointer group whitespace-nowrap focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap text-sm font-medium font-body text-transform-secondary ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-on-primary hover:bg-primary/90 data-[state=open]:bg-primary/90',
                mono: 'bg-inverse-surface text-inverse-on-surface hover:bg-inverse-surface/90 data-[state=open]:bg-inverse-surface/90',
                destructive:
                    'bg-error text-on-error hover:bg-error/90 data-[state=open]:bg-error/90',
                secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 data-[state=open]:bg-secondary-container/90',
                outline: 'bg-surface text-on-surface border border-outline-variant hover:bg-surface-variant data-[state=open]:bg-surface-variant',
                dashed:
                    'text-on-surface border border-outline-variant border-dashed bg-surface hover:bg-surface-variant hover:text-on-surface data-[state=open]:text-on-surface',
                ghost:
                    'bg-transparent text-on-surface hover:bg-on-surface/5 hover:text-on-surface data-[state=open]:bg-on-surface/5 data-[state=open]:text-on-surface',
                dim: 'text-on-surface-variant hover:text-on-surface data-[state=open]:text-on-surface',
                foreground: '',
                inverse: '',
            },
            appearance: {
                default: '',
                ghost: '',
            },
            underline: {
                solid: '',
                dashed: '',
            },
            underlined: {
                solid: '',
                dashed: '',
            },
            size: {
                lg: 'py-[calc(var(--button-padding-y,10px)*1.25)] px-[calc(var(--button-padding-x,16px)*1.25)] text-sm gap-[calc(var(--button-icon-gap,6px)*1.25)] [&_svg:not([class*=size-])]:size-4',
                md: 'py-[var(--button-padding-y,8px)] px-[var(--button-padding-x,12px)] gap-[var(--button-icon-gap,6px)] text-[0.8125rem] leading-(--text-sm--line-height) [&_svg:not([class*=size-])]:size-4',
                sm: 'py-[calc(var(--button-padding-y,8px)*0.75)] px-[calc(var(--button-padding-x,12px)*0.75)] gap-[calc(var(--button-icon-gap,6px)*0.75)] text-xs [&_svg:not([class*=size-])]:size-3.5',
                xs: 'py-[calc(var(--button-padding-y,8px)*0.5)] px-[calc(var(--button-padding-x,12px)*0.5)] gap-[calc(var(--button-icon-gap,6px)*0.5)] text-[11px] [&_svg:not([class*=size-])]:size-3 h-7',
                icon: 'size-8.5 [&_svg:not([class*=size-])]:size-4 shrink-0',
            },
            autoHeight: {
                true: '',
                false: '',
            },
            shape: {
                default: '',
                circle: 'rounded-full',
            },
            mode: {
                default: 'focus-visible:ring-[length:var(--input-focus-width,2px)] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:ring-offset-2',
                icon: 'focus-visible:ring-[length:var(--input-focus-width,2px)] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:ring-offset-2 shrink-0',
                link: 'text-primary h-auto p-0 bg-transparent rounded-none hover:bg-transparent data-[state=open]:bg-transparent',
                input: `
            justify-start font-normal hover:bg-surface [&_svg]:transition-colors [&_svg]:hover:text-on-surface data-[state=open]:bg-surface 
            focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:outline-none focus-visible:ring-[length:var(--input-focus-width,2px)] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] 
            [[data-state=open]>&]:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] [[data-state=open]>&]:outline-none [[data-state=open]>&]:ring-[length:var(--input-focus-width,2px)] 
            [[data-state=open]>&]:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))]
            aria-invalid:border-error/60 aria-invalid:ring-error/10 dark:aria-invalid:border-error dark:aria-invalid:ring-error/20
            in-data-[invalid=true]:border-error/60 in-data-[invalid=true]:ring-error/10  dark:in-data-[invalid=true]:border-error dark:in-data-[invalid=true]:ring-error/20
          `,
            },
            placeholder: {
                true: 'text-on-surface-variant',
                false: '',
            },
        },
        compoundVariants: [
            // Icons opacity for default mode
            {
                variant: 'ghost',
                mode: 'default',
                className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
            },
            {
                variant: 'outline',
                mode: 'default',
                className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
            },
            {
                variant: 'dashed',
                mode: 'default',
                className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
            },
            {
                variant: 'secondary',
                mode: 'default',
                className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
            },

            // Icons opacity for default mode
            {
                variant: 'outline',
                mode: 'input',
                className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
            },
            {
                variant: 'outline',
                mode: 'icon',
                className: '[&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60',
            },

            // Auto height
            {
                size: 'md',
                autoHeight: true,
                className: 'h-auto min-h-8.5',
            },
            {
                size: 'sm',
                autoHeight: true,
                className: 'h-auto min-h-7',
            },
            {
                size: 'lg',
                autoHeight: true,
                className: 'h-auto min-h-10',
            },

            // Shadow support
            {
                variant: 'primary',
                mode: 'default',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'mono',
                mode: 'default',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'secondary',
                mode: 'default',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'outline',
                mode: 'default',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'dashed',
                mode: 'default',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'destructive',
                mode: 'default',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },

            // Shadow support
            {
                variant: 'primary',
                mode: 'icon',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'mono',
                mode: 'icon',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'secondary',
                mode: 'icon',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'outline',
                mode: 'icon',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'dashed',
                mode: 'icon',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },
            {
                variant: 'destructive',
                mode: 'icon',
                appearance: 'default',
                className: 'shadow-xs shadow-black/5',
            },

            // Link
            {
                variant: 'primary',
                mode: 'link',
                underline: 'solid',
                className:
                    'font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid',
            },
            {
                variant: 'primary',
                mode: 'link',
                underline: 'dashed',
                className:
                    'font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1',
            },
            {
                variant: 'primary',
                mode: 'link',
                underlined: 'solid',
                className:
                    'font-medium text-primary hover:text-primary/90 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid',
            },
            {
                variant: 'primary',
                mode: 'link',
                underlined: 'dashed',
                className:
                    'font-medium text-primary hover:text-primary/90 [&_svg]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1',
            },

            {
                variant: 'inverse',
                mode: 'link',
                underline: 'solid',
                className:
                    'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid',
            },
            {
                variant: 'inverse',
                mode: 'link',
                underline: 'dashed',
                className:
                    'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1',
            },
            {
                variant: 'inverse',
                mode: 'link',
                underlined: 'solid',
                className:
                    'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid',
            },
            {
                variant: 'inverse',
                mode: 'link',
                underlined: 'dashed',
                className:
                    'font-medium text-inherit [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1',
            },

            {
                variant: 'foreground',
                mode: 'link',
                underline: 'solid',
                className:
                    'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-solid',
            },
            {
                variant: 'foreground',
                mode: 'link',
                underline: 'dashed',
                className:
                    'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 hover:underline hover:underline-offset-4 hover:decoration-dashed decoration-1',
            },
            {
                variant: 'foreground',
                mode: 'link',
                underlined: 'solid',
                className:
                    'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-solid',
            },
            {
                variant: 'foreground',
                mode: 'link',
                underlined: 'dashed',
                className:
                    'font-medium text-foreground [&_svg:not([role=img]):not([class*=text-])]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1',
            },

            // Ghost
            {
                variant: 'primary',
                appearance: 'ghost',
                className: 'bg-transparent text-primary hover:bg-primary/5 data-[state=open]:bg-primary/5',
            },
            {
                variant: 'destructive',
                appearance: 'ghost',
                className: 'bg-transparent text-error hover:bg-error/5 data-[state=open]:bg-error/5',
            },
            {
                variant: 'ghost',
                mode: 'icon',
                className: 'text-muted-foreground',
            },

            // Size
            {
                size: 'sm',
                mode: 'icon',
                className: 'w-7 h-7 p-0 [[&_svg:not([class*=size-])]:size-3.5',
            },
            {
                size: 'md',
                mode: 'icon',
                className: 'w-8.5 h-8.5 p-0 [&_svg:not([class*=size-])]:size-4',
            },
            {
                size: 'icon',
                className: 'w-8.5 h-8.5 p-0 [&_svg:not([class*=size-])]:size-4',
            },
            {
                size: 'lg',
                mode: 'icon',
                className: 'w-10 h-10 p-0 [&_svg:not([class*=size-])]:size-4',
            },

            // Input mode
            {
                mode: 'input',
                placeholder: true,
                variant: 'outline',
                className: 'font-normal text-on-surface-variant',
            },
            {
                mode: 'input',
                variant: 'outline',
                size: 'sm',
                className: 'gap-1.25',
            },
            {
                mode: 'input',
                variant: 'outline',
                size: 'md',
                className: 'gap-1.5',
            },
            {
                mode: 'input',
                variant: 'outline',
                size: 'lg',
                className: 'gap-1.5',
            },
        ],
        defaultVariants: {
            variant: 'primary',
            mode: 'default',
            size: 'md',
            shape: 'default',
            appearance: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ComponentProps<'button'>,
        VariantProps<typeof buttonVariants> {
    selected?: boolean;
    asChild?: boolean;
    placeholder?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            selected,
            variant,
            shape,
            appearance,
            mode,
            size,
            autoHeight,
            underlined,
            underline,
            asChild = false,
            placeholder = false,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? SlotPrimitive.Slot : 'button';
        return (
            <Comp
                data-slot="button"
                className={cn(
                    buttonVariants({
                        variant,
                        size,
                        shape,
                        appearance,
                        mode,
                        autoHeight,
                        placeholder,
                        underlined,
                        underline,
                        className,
                    }),
                    asChild && props.disabled && 'pointer-events-none opacity-50',
                )}
                ref={ref}
                {...(selected && { 'data-state': 'open' })}
                style={Object.assign(
                    {},
                    shape !== 'circle' ? { borderRadius: 'var(--button-border-radius, var(--radius-btn, 4px))' } : {},
                    { borderWidth: 'var(--button-border-width, 1px)' },
                    props.style as React.CSSProperties
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

interface ButtonArrowProps extends React.SVGProps<SVGSVGElement> {
    icon?: LucideIcon; // Allows passing any Lucide icon
}

function ButtonArrow({ icon: Icon = ChevronDown, className, ...props }: ButtonArrowProps) {
    return <Icon data-slot="button-arrow" className={cn('ms-auto -me-1', className)} {...props} />;
}

export { Button, ButtonArrow, buttonVariants };
