"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from '../../../lib/utils'

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-[length:var(--progress-height,0.25rem)] w-full items-center overflow-x-hidden rounded-[length:var(--progress-radius,var(--radius-shape-full,9999px))] bg-surface-variant",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all"
        style={Object.assign({}, { transform: `translateX(-${100 - (value || 0)}%)` })}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
