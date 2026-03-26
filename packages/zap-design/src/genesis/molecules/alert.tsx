import * as React from 'react';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { Button } from '../../genesis/atoms/interactive/button';

const alertVariants = cva(
  'flex items-stretch w-full transition-all duration-200 gap-[length:var(--alert-gap,0.75rem)] p-[length:var(--alert-padding,1rem)]',
  {
    variants: {
      variant: {
        secondary: 'bg-[color:var(--alert-bg,var(--m3-sys-light-surface-variant))] text-[color:var(--alert-text,var(--m3-sys-light-on-surface-variant))] border-[color:var(--alert-border,transparent)]',
        primary: 'bg-[color:var(--alert-bg,var(--color-primary-fixed))] border-[color:var(--alert-border,var(--color-primary-fixed))] text-[color:var(--alert-text,var(--color-on-primary-fixed))]',
        destructive: 'bg-[color:var(--alert-bg,color-mix(in_srgb,var(--color-error)_10%,transparent))] border-[color:var(--alert-border,color-mix(in_srgb,var(--color-error)_20%,transparent))] text-[color:var(--alert-text,var(--color-error))]',
        success: 'bg-[color:var(--alert-bg,color-mix(in_srgb,var(--color-success)_10%,transparent))] border-[color:var(--alert-border,color-mix(in_srgb,var(--color-success)_20%,transparent))] text-[color:var(--alert-text,var(--color-success))]',
        info: 'bg-[color:var(--alert-bg,color-mix(in_srgb,var(--color-info)_10%,transparent))] border-[color:var(--alert-border,color-mix(in_srgb,var(--color-info)_20%,transparent))] text-[color:var(--alert-text,var(--color-info))]',
        warning: 'bg-[color:var(--alert-bg,color-mix(in_srgb,var(--color-warning)_10%,transparent))] border-[color:var(--alert-border,color-mix(in_srgb,var(--color-warning)_20%,transparent))] text-[color:var(--alert-text,var(--color-warning))]',
        outline: 'bg-[color:var(--alert-bg,var(--m3-sys-light-surface))] border-[color:var(--alert-border,var(--m3-sys-light-outline-variant))] text-[color:var(--alert-text,var(--m3-sys-light-on-surface))]',
      },
      visualStyle: {
        standard: 'border-[length:var(--alert-border-width,1px)] rounded-[length:var(--alert-radius,0.5rem)]',
        callout: 'border-l-[length:var(--alert-callout-border,4px)] border-y-0 border-r-0 rounded-r-[length:var(--alert-radius,0.5rem)] rounded-l-none',
      },
      size: {
        lg: 'text-base [&>[data-slot=alert-icon]>svg]:size-6',
        md: 'text-sm [&>[data-slot=alert-icon]>svg]:size-5',
        sm: 'text-xs [&>[data-slot=alert-icon]>svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      visualStyle: 'standard',
      size: 'md',
    },
  }
);

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  close?: boolean;
  onClose?: () => void;
}

function Alert({ className, variant, visualStyle, size, close = false, onClose, children, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, visualStyle, size }), className)}
      {...props}
    >
      {children}
      {close && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Dismiss"
          data-slot="alert-close"
          className="ml-auto shrink-0 p-1 -mr-1 h-6 w-6 rounded-full"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div 
      data-slot="alert-title" 
      className={cn('font-display text-transform-primary font-bold tracking-tight text-on-surface text-transform-primary', className)} 
      {...props} 
    />
  );
}

function AlertIcon({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      data-slot="alert-icon" 
      className={cn('shrink-0 text-current flex items-center justify-center', className)} 
      {...props}
    >
      {children}
    </div>
  );
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('font-body text-transform-secondary text-sm opacity-90 font-medium leading-relaxed', className)}
      {...props}
    />
  );
}

function AlertContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="alert-content"
      className={cn('flex flex-col gap-1 w-full', className)}
      {...props}
    />
  );
}

export { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle };
