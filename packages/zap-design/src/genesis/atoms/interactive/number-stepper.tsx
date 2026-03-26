"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from '../../../lib/utils'
import { Button } from '../../../genesis/atoms/interactive/button'
import { Input } from '../../../genesis/atoms/interactive/inputs';

interface NumberStepperProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}

const NumberStepper = React.forwardRef<HTMLInputElement, NumberStepperProps>(
  ({ className, value = 0, onChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    
    // Internal state if uncontrolled
    const [internalValue, setInternalValue] = React.useState<number>(value)
    
    // Sync external value with internal state
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    const handleIncrement = () => {
      const newValue = Math.min(internalValue + step, max)
      setInternalValue(newValue)
      if (onChange) onChange(newValue)
    }

    const handleDecrement = () => {
      const newValue = Math.max(internalValue - step, min)
      setInternalValue(newValue)
      if (onChange) onChange(newValue)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10)
      if (!isNaN(val)) {
        // Clamp the value between min and max when user manually types
        const clampedVal = Math.min(Math.max(val, min), max)
        setInternalValue(clampedVal)
        if (onChange) onChange(clampedVal)
      } else if (e.target.value === '') {
        setInternalValue(min)
        if (onChange) onChange(min)
      }
    }

    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-[var(--input-height,36px)] w-[var(--input-height,36px)] rounded-[var(--input-border-radius,8px)] bg-layer-dialog shrink-0 border-outline-variant hover:bg-layer-dialog-hover [&_svg]:size-4"
          onClick={handleDecrement}
          disabled={internalValue <= min}
        >
          <Minus />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="relative">
          <Input
            ref={ref}
            type="number"
            value={internalValue}
            onChange={handleChange}
            className="w-16 h-[var(--input-height,36px)] rounded-[var(--input-border-radius,8px)] text-center text-transform-primary font-medium tracking-wide bg-layer-dialog border-outline-variant focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[length:var(--input-focus-width,2px)] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...props}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-[var(--input-height,36px)] w-[var(--input-height,36px)] rounded-[var(--input-border-radius,8px)] bg-layer-dialog shrink-0 border-outline-variant hover:bg-layer-dialog-hover [&_svg]:size-4"
          onClick={handleIncrement}
          disabled={internalValue >= max}
        >
          <Plus />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
    )
  }
)
NumberStepper.displayName = "NumberStepper"

export { NumberStepper }
