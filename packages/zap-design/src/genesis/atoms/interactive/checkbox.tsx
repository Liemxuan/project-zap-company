"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from '../../../lib/utils'
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex items-center justify-center border transition-all outline-none",
        "group-has-disabled/field:opacity-50 disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[length:var(--input-focus-width,2px)] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))]",
        "aria-invalid:border-[color:var(--input-error-border,var(--color-error))] aria-invalid:ring-[length:var(--input-error-width,2px)] aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] aria-invalid:aria-checked:border-[color:var(--input-error-border,var(--color-error))]",
        "dark:bg-input/30 dark:aria-invalid:border-[color:var(--input-error-border,var(--color-error))] dark:aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))]",
        "bg-surface border-outline data-[state=checked]:bg-primary data-[state=checked]:text-on-primary data-[state=checked]:border-primary disabled:bg-surface-dim disabled:border-outline-variant",
        "w-[var(--checkbox-size,16px)] h-[var(--checkbox-size,16px)] shrink-0",
        "border-[length:var(--checkbox-border-width,1px)]",
        "rounded-[length:var(--checkbox-border-radius,4px)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
