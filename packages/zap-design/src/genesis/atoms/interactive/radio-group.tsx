"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from '../../../lib/utils'

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex shrink-0 rounded-[length:var(--radio-border-radius,9999px)] border outline-none after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:ring-[length:var(--input-focus-width,2px)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[color:var(--input-error-border,var(--color-error))] aria-invalid:ring-[length:var(--input-error-width,2px)] aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] aria-invalid:aria-checked:border-[color:var(--input-error-border,var(--color-error))]",
        "dark:bg-input/30 dark:aria-invalid:border-[color:var(--input-error-border,var(--color-error))] dark:aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))]",
        "data-[state=checked]:border-primary text-primary transition-all bg-transparent",
        "w-[var(--radio-size,16px)] h-[var(--radio-size,16px)] aspect-square",
        "border-[length:var(--radio-border-width,1px)]",
        "border-input",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex h-full w-full items-center justify-center relative"
      >
        <span className="absolute top-1/2 left-1/2 w-[55%] h-[55%] -translate-x-1/2 -translate-y-1/2 rounded-[length:var(--radio-border-radius,9999px)] bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
