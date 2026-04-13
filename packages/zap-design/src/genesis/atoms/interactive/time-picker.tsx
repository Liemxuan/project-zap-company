"use client"

import * as React from "react"
import { Clock, Check } from "lucide-react"
import { motion } from "motion/react"

import { cn } from '../../../lib/utils'
import { Button } from '../../../genesis/atoms/interactive/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../genesis/molecules/popover'

export interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  disabledText?: string;
}

export function TimePicker({
  value,
  onChange,
  className,
  placeholder = "Select time",
  disabled,
  disabledText = "Closed"
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(value)

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedTime(value)
    }
  }, [value])

  const handleSelect = (time: string) => {
    setSelectedTime(time)
    setOpen(false)
    if (onChange) {
      onChange(time)
    }
  }

  // Generate times: 00:00 to 23:30
  const times = React.useMemo(() => {
    const list = []
    for (let h = 0; h < 24; h++) {
      const hour = h.toString().padStart(2, '0')
      list.push(`${hour}:00`)
      list.push(`${hour}:30`)
    }
    return list
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-[var(--input-height,36px)] rounded-[var(--input-border-radius,8px)] border-[length:var(--input-border-width,1px)] border-[color:var(--input-border-filled,transparent)] bg-[color:var(--input-bg-filled,var(--color-surface-container-high))] transition-colors font-body text-transform-secondary text-sm font-normal text-transform-primary",
            "data-[state=open]:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] data-[state=open]:text-primary data-[state=open]:outline-none data-[state=open]:ring-[length:var(--input-focus-width,2px)] data-[state=open]:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))]",
            !open && "hover:bg-[color:var(--input-bg-filled-focus,var(--color-surface-container-highest))]",
            !selectedTime && "text-transform-primary",
            disabled && "opacity-50 cursor-not-allowed bg-surface-variant/20 grayscale-1/2",
            className
          )}
        >
          <span className="text-base">
            {disabled ? disabledText : (selectedTime || placeholder)}
          </span>
          <Clock className={cn("ml-2 h-5 w-5 shrink-0 transition-colors", open ? "text-primary" : "opacity-50 text-transform-primary")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-[var(--container-radius,12px)] bg-layer-dialog shadow-lg border-outline-variant"
        align="start"
      >
        <div className="grid grid-cols-2 max-h-[320px] overflow-y-auto overflow-x-hidden">
          {times.map((time, index) => {
            const isLeft = index % 2 === 0
            const isSelected = selectedTime === time

            return (
              <motion.button
                key={time}
                type="button"
                onClick={() => handleSelect(time)}
                whileHover={{ backgroundColor: "var(--md-sys-color-surface-container-high)" }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center justify-between px-5 py-4 text-[15px] text-left transition-colors border-b border-border/50",
                  isSelected
                    ? "bg-primary/5 text-primary font-medium"
                    : "text-transform-primary hover:text-transform-primary",
                  isLeft ? "border-r border-border/50" : ""
                )}
              >
                <span>{time}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Check className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
