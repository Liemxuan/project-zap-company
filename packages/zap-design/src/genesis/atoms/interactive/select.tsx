"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from '../../../lib/utils'
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  bgColor,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
  bgColor?: string;
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-[length:var(--select-border-radius,var(--radius-shape-small,8px))] border border-[length:var(--select-border-width,var(--layer-border-width,1px))] border-outline-variant bg-[color:var(--select-bg,var(--color-surface-container-highest))] py-2 pr-2 pl-2.5 text-sm font-body text-transform-secondary text-transform-primary text-on-surface whitespace-nowrap transition-[color,box-shadow] outline-none select-none focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:ring-[length:var(--input-focus-width,2px)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[color:var(--input-error-border,var(--color-error))] aria-invalid:ring-[length:var(--input-error-width,2px)] aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] data-placeholder:text-muted-foreground data-[size=default]:h-[var(--select-height,32px)] data-[size=sm]:h-[calc(var(--select-height,32px)*0.8)] data-[size=sm]:px-2.5 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-[color:var(--select-bg,var(--color-surface-container-highest))] dark:text-on-surface dark:aria-invalid:border-[color:var(--input-error-border,var(--color-error))] dark:aria-invalid:ring-[color:var(--input-error-ring,var(--color-error-fixed-dim))] [&_svg]:text-on-surface-variant/80 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 border-[length:var(--input-border-width,1px)]",
        className
      )}
      style={{ height: "var(--input-height, var(--button-height, 48px))", '--select-bg': bgColor, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-[length:var(--select-border-radius,var(--radius-shape-small,8px))] bg-[color:var(--select-bg,var(--color-surface-container-highest))] text-on-surface shadow-md border border-[length:var(--select-border-width,var(--layer-border-width,1px))] border-outline-variant duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className)}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-8 pl-1.5 text-sm font-body text-on-surface outline-hidden select-none transition-colors",
        // unselected
        "text-on-surface/70 focus:bg-surface-variant/60 focus:text-on-surface",
        // selected
        "data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[state=checked]:font-semibold",
        // selected + focused
        "data-[state=checked]:focus:bg-primary/15",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center text-primary">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none size-3.5" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-layer-dialog py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-layer-dialog py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

/* ── SelectField: label-aware composite wrapper ── */
export interface SelectFieldProps {
  label?: string;
  position?: 'top' | 'floating' | 'left' | 'right';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  size?: 'sm' | 'default';
  isError?: boolean;
  errorMessage?: string;
  name?: string;
  bgColor?: string;
}

function SelectField({
  label,
  position,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  disabled,
  children,
  className,
  triggerClassName,
  size = 'default',
  isError,
  errorMessage,
  name,
  bgColor,
}: SelectFieldProps) {
  const isFloating = position === 'floating';

  const errorEl = errorMessage ? (
    <p className="text-xs text-error font-medium px-1 mt-1.5 flex items-center gap-1">
      <span className="material-symbols-rounded text-sm leading-none">error</span>
      {errorMessage}
    </p>
  ) : null;

  const triggerEl = isFloating && label ? (
    /* Floating: taller trigger + absolutely positioned label using group */
    <div className="relative group w-full">
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        data-size={size}
        disabled={disabled}
        aria-invalid={isError}
        className={cn(
          "flex w-full items-end justify-between gap-1.5 rounded-[length:var(--select-border-radius,var(--radius-shape-small,8px))] border border-[length:var(--select-border-width,var(--layer-border-width,1px))] border-outline-variant bg-[color:var(--select-bg,var(--color-surface-container-highest))] px-3 pb-1.5 pt-5 text-sm font-body text-on-surface whitespace-nowrap transition-[color,box-shadow] outline-none select-none focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:ring-[length:var(--input-focus-width,2px)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[color:var(--input-error-border,var(--color-error))] data-placeholder:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          triggerClassName
        )}
        style={{ height: 'var(--input-height, var(--button-height, 56px))', '--select-bg': bgColor } as React.CSSProperties}
      >
        <SelectPrimitive.Value placeholder="" />
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground shrink-0" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <label className={cn(
        "absolute left-3 pointer-events-none select-none transition-all duration-200",
        // Floated state (has value): small label at top
        "top-1 text-[10px] font-semibold tracking-wide",
        isError ? "text-error" : "text-muted-foreground group-focus-within:text-primary",
        // Resting state (no value = data-placeholder present, not focused)
        "group-has-[[data-placeholder]]:top-1/2 group-has-[[data-placeholder]]:-translate-y-1/2 group-has-[[data-placeholder]]:text-sm group-has-[[data-placeholder]]:font-normal group-has-[[data-placeholder]]:tracking-normal",
        // Focus overrides resting
        "group-focus-within:top-1 group-focus-within:translate-y-0 group-focus-within:text-[10px] group-focus-within:font-semibold group-focus-within:tracking-wide",
        disabled && "opacity-50"
      )}>
        {label}
      </label>
    </div>
  ) : (
    <SelectTrigger
      size={size}
      disabled={disabled}
      aria-invalid={isError}
      bgColor={bgColor}
      className={cn('w-full', triggerClassName)}
    >
      <SelectValue placeholder={placeholder ?? label} />
    </SelectTrigger>
  );

  const labelEl = label && !isFloating ? (
    <label className={cn(
      "font-display text-sm font-medium text-foreground shrink-0",
      disabled && "opacity-50",
    )}>
      {label}
    </label>
  ) : null;

  const inner = (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      {triggerEl}
      <SelectContent>{children}</SelectContent>
    </Select>
  );

  if (position === 'left') {
    return (
      <div className={cn('flex items-center gap-3 w-full', className)}>
        {labelEl}
        <div className="flex flex-col flex-1 min-w-0">
          {inner}
          {errorEl}
        </div>
      </div>
    );
  }

  if (position === 'right') {
    return (
      <div className={cn('flex items-center gap-3 w-full', className)}>
        <div className="flex flex-col flex-1 min-w-0">
          {inner}
          {errorEl}
        </div>
        {labelEl}
      </div>
    );
  }

  if (position === 'top') {
    return (
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {labelEl}
        {inner}
        {errorEl}
      </div>
    );
  }

  // floating or no position
  return (
    <div className={cn('flex flex-col w-full', className)}>
      {inner}
      {errorEl}
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
