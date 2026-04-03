"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from '../../../lib/utils'
import { Button } from '../../../genesis/atoms/interactive/button'
import { Calendar } from '../../../genesis/molecules/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../genesis/molecules/popover'

interface DatePickerWithRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  value,
  onChange
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)

  // Sync external value with internal state
  React.useEffect(() => {
    if (value !== undefined) {
      setDate(value)
    }
  }, [value])

  const handleSelect = (newDate: DateRange | undefined) => {
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
              "w-full justify-start text-left h-[var(--input-height,36px)] rounded-[var(--input-border-radius,8px)] border-[length:var(--input-border-width,1px)] border-[color:var(--input-border-filled,transparent)] bg-[color:var(--input-bg-filled,var(--color-surface-container-high))] hover:bg-[color:var(--input-bg-filled-focus,var(--color-surface-container-highest))] font-body text-transform-secondary text-sm font-normal text-transform-primary transition-all",
              "data-[state=open]:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] data-[state=open]:text-primary data-[state=open]:outline-none data-[state=open]:ring-[length:var(--input-focus-width,2px)] data-[state=open]:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))]",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{""}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-[var(--container-radius,12px)]" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
