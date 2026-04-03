import * as React from "react"
import { cn } from '../../lib/utils'
import { Star } from "lucide-react"

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
  label?: string
  showValue?: boolean
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ className, value, max = 5, onValueChange, disabled, label = "RATING", showValue = true, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
        <div className="flex items-center justify-between w-full">
          {label && (
 <span className="font-body text-xs font-bold text-transform-tertiary text-on-surface-variant text-transform-secondary tracking-wider">
              {label}
            </span>
          )}
          {showValue && (
            <span className="font-body text-transform-secondary text-xs font-bold text-primary">
              {value} / {max}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: max }).map((_, i) => {
            const isFilled = i < value
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => onValueChange?.(i + 1)}
                className={cn(
                  "p-0.5 rounded-sm transition-all focus-visible:outline-none focus-visible:ring-[length:var(--input-focus-width,2px)] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] disabled:cursor-not-allowed",
                  !disabled && "hover:scale-110 active:scale-95"
                )}
              >
                <Star
                  className={cn(
                    "w-6 h-6",
                    isFilled ? "fill-primary text-primary" : "text-border",
                    !disabled && !isFilled && "hover:text-primary/50"
                  )}
                  strokeWidth={isFilled ? 2 : 1.5}
                />
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)
Rating.displayName = "Rating"
