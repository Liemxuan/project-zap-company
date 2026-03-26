"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from '../../../lib/utils'

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-[var(--layer-border-radius,var(--radius-btn,4px))] text-sm font-medium font-body text-transform-secondary whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      visualStyle: {
        solid: "border-transparent bg-transparent hover:bg-layer-panel hover:text-on-surface aria-pressed:bg-primary aria-pressed:text-on-primary data-[state=on]:bg-primary data-[state=on]:text-on-primary",
        outline: "border-[length:var(--layer-border-width,1px)] [border-style:var(--layer-border-style,solid)] border-border bg-transparent hover:bg-layer-panel hover:text-on-surface aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
        ghost: "border-transparent bg-transparent hover:bg-layer-panel hover:text-on-surface text-on-surface-variant aria-pressed:text-primary aria-pressed:bg-primary/20 data-[state=on]:text-primary data-[state=on]:bg-primary/20",
      },
      size: {
        default: "h-8 min-w-8 px-2",
        sm: "h-7 min-w-7 px-1.5 text-[0.8rem]",
        lg: "h-9 min-w-9 px-2.5",
      },
    },
    defaultVariants: {
      visualStyle: "solid",
      size: "default",
    },
  }
)

function Toggle({
  className,
  visualStyle = "solid",
  variant, // Legacy variant to intercept if necessary
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & { variant?: string }) {

  // Intercept legacy variant
  let resolvedVisualStyle = visualStyle;
  if (variant === 'outline') resolvedVisualStyle = 'outline';

  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      className={cn(toggleVariants({ visualStyle: resolvedVisualStyle as any, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
