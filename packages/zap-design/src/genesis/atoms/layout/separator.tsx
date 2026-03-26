"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from '../../../lib/utils'

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        "data-[orientation=horizontal]:h-[length:var(--separator-thickness,1px)]",
        "data-[orientation=horizontal]:w-[length:var(--separator-width,100%)]",
        "data-[orientation=vertical]:w-[length:var(--separator-thickness,1px)]",
        "data-[orientation=vertical]:h-[length:var(--separator-width,100%)]",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
