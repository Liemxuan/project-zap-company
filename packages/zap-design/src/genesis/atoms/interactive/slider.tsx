"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"
import { cn } from '../../../lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

export interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /** Optional label displayed above the slider */
  label?: string
  /** Show a value badge next to the label */
  showValue?: boolean
  /** Show discrete step dots on the track */
  showSteps?: boolean
  /** Info callout text shown below the slider */
  info?: string
}

// ── Slider ───────────────────────────────────────────────────────────────────

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  showSteps = false,
  info,
  onValueChange,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(
    value || defaultValue || [min]
  )

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const handleValueChange = (newValue: number[]) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  const displayValue = Array.isArray(value) ? value : internalValue

  return (
    <div className={cn("grid w-full", label ? "gap-4" : "gap-0")}>
      {/* ── Label Row ───────────────────────────────────────────────── */}
      {label && (
        <div className="flex items-center justify-between">
          <label
            data-slot="slider-label"
            className="font-body text-xs font-bold text-transform-tertiary uppercase tracking-wide"
          >
            {label}
          </label>
          {showValue && (
            <div
              data-slot="slider-value-badge"
              className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-[var(--radius)] font-body text-xs font-semibold min-w-[36px] text-center"
            >
              {displayValue[0]}
            </div>
          )}
        </div>
      )}

      {/* ── Slider Core ─────────────────────────────────────────────── */}
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={handleValueChange}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "relative grow overflow-hidden rounded-full bg-muted",
            "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:h-[length:var(--slider-track-thickness,4px)]",
            "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[length:var(--slider-track-thickness,4px)]"
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className="absolute bg-primary select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
          {showSteps && step > 0 && (
            <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-0.5">
              {Array.from({ length: Math.floor((max - min) / step) + 1 }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="w-[3px] h-[3px] rounded-full bg-white/60 dark:bg-black/60 shadow-sm"
                  />
                )
              )}
            </div>
          )}
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className={cn(
              "relative block shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50",
              "h-[length:var(--slider-thumb-size,12px)]",
              "w-[length:var(--slider-thumb-size,12px)]"
            )}
          />
        ))}
      </SliderPrimitive.Root>

      {/* ── Info Callout ─────────────────────────────────────────────── */}
      {info && (
        <div
          data-slot="slider-info"
          className="flex items-start gap-4 p-4 mt-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-muted-foreground text-sm font-body"
        >
          <span className="material-symbols-outlined text-[18px] opacity-60 mt-[1px]">
            tune
          </span>
          <p className="flex-1 leading-relaxed text-xs">{info}</p>
        </div>
      )}
    </div>
  )
}

export { Slider }
export type { SliderProps as LabeledSliderProps }
