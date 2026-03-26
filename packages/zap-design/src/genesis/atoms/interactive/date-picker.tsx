"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from '../../../lib/utils'
import { Button } from '../../../genesis/atoms/interactive/button'
import { Calendar } from '../../../genesis/molecules/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../genesis/molecules/popover'

interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
}

export function DatePicker({
  className,
  value,
  onChange,
  placeholder = "Pick a date"
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)

  // Sync external value with internal state
  React.useEffect(() => {
    if (value !== undefined) {
      setDate(value)
    }
  }, [value])

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (onChange) {
      onChange(newDate)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left h-[var(--input-height,36px)] rounded-[var(--input-border-radius,8px)] border-[length:var(--input-border-width,1px)] border-[color:var(--input-border-filled,transparent)] bg-[color:var(--input-bg-filled,var(--color-surface-container-high))] hover:bg-[color:var(--input-bg-filled-focus,var(--color-surface-container-highest))] font-body text-sm font-normal text-transform-primary transition-all",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-[var(--container-radius,12px)]" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
