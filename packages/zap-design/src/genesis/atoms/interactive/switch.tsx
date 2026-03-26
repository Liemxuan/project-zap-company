"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from '../../../lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & { size?: "sm" | "default" }
>(({ className, size = "default", ...props }, ref) => (
  <SwitchPrimitive.Root
    data-slot="switch"
    data-size={size}
    className={cn(
      "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[state=checked]:bg-primary bg-layer-dialog disabled:cursor-not-allowed disabled:opacity-50",
      "w-[length:var(--switch-track-width,44px)] h-[length:var(--switch-track-height,24px)]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "pointer-events-none block rounded-full ring-0 transition-transform data-[state=unchecked]:bg-primary data-[state=checked]:bg-white",
        "data-[state=checked]:translate-x-[calc(var(--switch-track-width,44px)-var(--switch-thumb-size,20px)-4px)]",
        "data-[state=unchecked]:translate-x-0",
        "w-[length:var(--switch-thumb-size,20px)] h-[length:var(--switch-thumb-size,20px)]"
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
