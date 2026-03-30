"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { cn } from '../../../lib/utils'
import { toggleVariants } from '../../../genesis/atoms/interactive/toggle'

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  visualStyle: "solid",
  spacing: 0,
  orientation: "horizontal",
})

function ToggleGroup({
  className,
  visualStyle,
  variant, // Catch legacy variant
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
    variant?: string
  }) {
  let resolvedVisualStyle = visualStyle;
  if (!resolvedVisualStyle && variant === 'outline') {
      resolvedVisualStyle = 'outline';
  } else if (!resolvedVisualStyle && variant === 'segmented') {
      resolvedVisualStyle = 'segmented';
  } else if (!resolvedVisualStyle) {
      resolvedVisualStyle = 'solid';
  }

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-visual-style={resolvedVisualStyle}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      style={Object.assign({}, { 
          "--gap": spacing,
          ...(resolvedVisualStyle === 'segmented' ? { borderWidth: 'var(--toggle-border-width, 0px)' } : {})
      }) as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] bg-[color:var(--toggle-group-bg,transparent)] rounded-[var(--toggle-border-radius,var(--layer-border-radius,var(--radius-md,8px)))] data-[size=sm]:rounded-[min(var(--toggle-border-radius,var(--layer-border-radius,var(--radius-md,8px))),10px)] data-vertical:flex-col data-vertical:items-stretch",
        "data-[visual-style=segmented]:bg-[color:var(--toggle-group-bg,var(--color-layer-panel))] data-[visual-style=segmented]:p-1 data-[visual-style=segmented]:border-[color:var(--toggle-border-color,var(--color-outline-variant))] data-[visual-style=segmented]:border-solid",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={{ visualStyle: resolvedVisualStyle as any, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  visualStyle,
  variant,
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants> & { variant?: string }) {
  const context = React.useContext(ToggleGroupContext)

  let resolvedVisualStyle = visualStyle || context.visualStyle;
  if (!resolvedVisualStyle && variant === 'outline') {
      resolvedVisualStyle = 'outline';
  } else if (!resolvedVisualStyle) {
      resolvedVisualStyle = 'solid';
  }

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-visual-style={resolvedVisualStyle}
      data-size={context.size || size}
      data-spacing={context.spacing}
      style={{ borderWidth: 'var(--toggle-item-border-width, var(--toggle-border-width, 0px))' }}
      className={cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-[var(--toggle-border-radius,var(--layer-border-radius,var(--radius-md,8px)))] group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-[var(--toggle-border-radius,var(--layer-border-radius,var(--radius-md,8px)))] group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-[var(--toggle-border-radius,var(--layer-border-radius,var(--radius-md,8px)))] group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-[var(--toggle-border-radius,var(--layer-border-radius,var(--radius-md,8px)))] group-data-horizontal/toggle-group:data-[spacing=0]:data-[visual-style=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[visual-style=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[visual-style=outline]:first:border-l-[length:var(--toggle-border-width,var(--layer-border-width,1px))] group-data-vertical/toggle-group:data-[spacing=0]:data-[visual-style=outline]:first:border-t-[length:var(--toggle-border-width,var(--layer-border-width,1px))]",
        toggleVariants({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          visualStyle: resolvedVisualStyle as any,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
