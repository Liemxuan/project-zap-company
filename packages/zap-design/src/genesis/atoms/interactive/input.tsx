import * as React from 'react';
import { cn } from '../../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Define input size variants
const inputVariants = cva(
    `
    flex w-full bg-[color:var(--input-bg,var(--color-surface-container-highest))] border border-[length:var(--input-border-width,1px)] border-outline-variant shadow-xs shadow-black/5 transition-[color,box-shadow] text-on-surface placeholder:text-on-surface-variant/80 placeholder:text-transform-secondary font-body text-transform-primary
    focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:outline-none focus-visible:ring-[length:var(--input-focus-width,2px)]
    disabled:cursor-not-allowed disabled:opacity-60 
    [&[readonly]]:bg-[color:color-mix(in_srgb,var(--input-bg,var(--color-surface-container-highest))_80%,transparent)] [&[readonly]]:cursor-not-allowed
    file:h-full [&[type=file]]:py-0 file:border-solid file:border-[length:var(--input-border-width,1px)] file:border-outline-variant file:bg-transparent 
    file:font-medium file:not-italic file:text-on-surface file:p-0 file:border-0 file:border-e
    aria-invalid:border-[color:var(--input-error-border,var(--color-error))] aria-invalid:ring-[length:var(--input-error-width,2px)] aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] dark:aria-invalid:border-[color:var(--input-error-border,var(--color-error))] dark:aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))]
  `,
    {
        variants: {
            variant: {
                lg: 'h-[calc(var(--input-height,36px)*1.2)] px-4 text-sm rounded-[length:var(--input-border-radius,8px)] file:pe-4 file:me-4',
                md: 'h-[length:var(--input-height,36px)] px-3 text-sm rounded-[length:var(--input-border-radius,8px)] file:pe-3 file:me-3',
                sm: 'h-[calc(var(--input-height,36px)*0.8)] px-2.5 text-xs rounded-[length:var(--input-border-radius,8px)] file:pe-2.5 file:me-2.5',
            },
        },
        defaultVariants: {
            variant: 'md',
        },
    },
);

const inputAddonVariants = cva(
    'flex items-center shrink-0 justify-center bg-[color:var(--input-bg,var(--color-surface-container-highest))] border border-[length:var(--input-border-width,1px)] border-outline-variant shadow-xs shadow-[rgba(0,0,0,0.05)] text-on-surface-variant [&_svg]:text-on-surface-variant/60 font-body text-transform-secondary text-transform-primary text-sm',
    {
        variants: {
            variant: {
                sm: 'rounded-[length:var(--input-border-radius,8px)] h-[calc(var(--input-height,36px)*0.8)] min-w-7 text-xs px-2.5 [&_svg:not([class*=size-])]:size-3.5',
                md: 'rounded-[length:var(--input-border-radius,8px)] h-[length:var(--input-height,36px)] min-w-8.5 px-3 [&_svg:not([class*=size-])]:size-4.5',
                lg: 'rounded-[length:var(--input-border-radius,8px)] h-[calc(var(--input-height,36px)*1.2)] min-w-10 px-4 [&_svg:not([class*=size-])]:size-4.5',
            },
            mode: {
                default: '',
                icon: 'px-0 justify-center',
            },
        },
        defaultVariants: {
            variant: 'md',
            mode: 'default',
        },
    },
);

const inputGroupVariants = cva(
    `
    flex items-stretch
    [&_[data-slot=input]]:grow
    [&_[data-slot=input-addon]:has(+[data-slot=input])]:rounded-e-none [&_[data-slot=input-addon]:has(+[data-slot=input])]:border-e-0
    [&_[data-slot=input-addon]:has(+[data-slot=datefield])]:rounded-e-none [&_[data-slot=input-addon]:has(+[data-slot=datefield])]:border-e-0 
    [&_[data-slot=input]+[data-slot=input-addon]]:rounded-s-none [&_[data-slot=input]+[data-slot=input-addon]]:border-s-0
    [&_[data-slot=input-addon]:has(+[data-slot=button])]:rounded-e-none
    [&_[data-slot=input]+[data-slot=button]]:rounded-s-none
    [&_[data-slot=button]+[data-slot=input]]:rounded-s-none
    [&_[data-slot=input-addon]+[data-slot=input]]:rounded-s-none
    [&_[data-slot=input-addon]+[data-slot=datefield]]:[&_[data-slot=input]]:rounded-s-none
    [&_[data-slot=datefield]:has(+[data-slot=input-addon])]:[&_[data-slot=input]]:rounded-e-none
    [&_[data-slot=input]:has(+[data-slot=button])]:rounded-e-none
    [&_[data-slot=input]:has(+[data-slot=input-addon])]:rounded-e-none
    [&_[data-slot=datefield]]:grow
    [&_[data-slot=datefield]+[data-slot=input-addon]]:rounded-s-none [&_[data-slot=datefield]+[data-slot=input-addon]]:border-s-0
  `,
    {
        variants: {},
        defaultVariants: {},
    },
);

const inputWrapperVariants = cva(
    `
    flex items-center gap-1.5
    has-[:focus-visible]:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] 
    has-[:focus-visible]:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))]
    has-[:focus-visible]:outline-none 
    has-[:focus-visible]:ring-[length:var(--input-focus-width,2px)]

    [&_[data-slot=datefield]]:grow 
    [&_[data-slot=input]]:data-focus-within:ring-transparent  
    [&_[data-slot=input]]:data-focus-within:ring-0 
    [&_[data-slot=input]]:data-focus-within:border-0 
    [&_[data-slot=input]]:flex 
    [&_[data-slot=input]]:w-full 
    [&_[data-slot=input]]:outline-none 
    [&_[data-slot=input]]:transition-colors 
    [&_[data-slot=input]]:text-on-surface
    [&_[data-slot=input]]:placeholder:text-on-surface-variant/80 
    [&_[data-slot=input]]:placeholder:text-transform-secondary
    [&_[data-slot=input]]:border-0 
    [&_[data-slot=input]]:bg-transparent 
    [&_[data-slot=input]]:p-0
    [&_[data-slot=input]]:shadow-none 
    [&_[data-slot=input]]:focus-visible:ring-0 
    [&_[data-slot=input]]:h-auto 
    [&_[data-slot=input]]:disabled:cursor-not-allowed
    [&_[data-slot=input]]:disabled:opacity-50    

    [&_svg]:text-on-surface-variant/80 
    [&_svg]:shrink-0
  `,
    {
        variants: {
            variant: {
                sm: 'gap-1.25 [&_svg:not([class*=size-])]:size-3.5',
                md: 'gap-1.5 [&_svg:not([class*=size-])]:size-4',
                lg: 'gap-1.5 [&_svg:not([class*=size-])]:size-4',
            },
        },
        defaultVariants: {
            variant: 'md',
        },
    },
);

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & VariantProps<typeof inputVariants>>(
    ({ className, type, variant, ...props }, ref) => {
        return <input ref={ref} data-slot="input" type={type} className={cn(inputVariants({ variant }), className)} {...props} />;
    }
);
Input.displayName = 'Input';

function InputAddon({
    className,
    variant,
    mode,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputAddonVariants>) {
    return <div data-slot="input-addon" className={cn(inputAddonVariants({ variant, mode }), className)} {...props} />;
}

function InputGroup({ className, ...props }: React.ComponentProps<'div'> & VariantProps<typeof inputGroupVariants>) {
    return <div data-slot="input-group" className={cn(inputGroupVariants(), className)} {...props} />;
}

function InputWrapper({
    className,
    variant,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputWrapperVariants>) {
    return (
        <div
            data-slot="input-wrapper"
            className={cn(inputVariants({ variant }), inputWrapperVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Input, InputAddon, InputGroup, InputWrapper, inputVariants, inputAddonVariants };
