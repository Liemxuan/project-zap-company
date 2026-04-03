"use client"

import * as React from "react"
import { X, ChevronDown, ChevronUp, Check } from "lucide-react"
import { Badge } from '../../../genesis/atoms/interactive/badge'
import { Command, CommandGroup, CommandItem, CommandList } from '../../../genesis/atoms/interactive/command'
import { Popover, PopoverContent, PopoverTrigger } from '../../../genesis/molecules/popover'
import { cn } from '../../../lib/utils'

export interface MultiSelectOption {
  label: string
  value: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  allowCustom?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  allowCustom = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (itemValue: string) => {
    onChange(selected.filter((i) => i !== itemValue))
  }

  const handleSelect = (itemValue: string) => {
    if (selected.includes(itemValue)) {
      onChange(selected.filter((i) => i !== itemValue))
    } else {
      onChange([...selected, itemValue])
    }
    // Optional: Keep input open and don't clear, or clear it depending on UX preferred
    // In many multi-selects we keep it open so they can select more.
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
      onChange(selected.slice(0, -1))
    }
    if (e.key === "Enter" && allowCustom && inputValue.trim() !== "") {
      e.preventDefault()
      const newTag = inputValue.trim()
      if (!selected.includes(newTag)) {
        onChange([...selected, newTag])
        setInputValue("")
      }
    }
  }

  const isSelected = (value: string) => selected.includes(value)
  const getLabel = (value: string) => {
    const opt = options.find((o) => o.value === value)
    return opt ? opt.label : value
  }

  // Filter options manually based on search as we might need to inject standard items or "Create new" items
  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(inputValue.toLowerCase()))
  const showCreateOption = allowCustom && inputValue.trim() !== "" && !filteredOptions.some(o => o.label.toLowerCase() === inputValue.trim().toLowerCase())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          // This acts as the visual input container
          className={cn(
            "flex min-h-[var(--input-height,36px)] w-full items-center justify-between rounded-[var(--input-border-radius,8px)] border-[length:var(--input-border-width,1px)] border-[color:var(--input-border-filled,transparent)] bg-[color:var(--input-bg-filled,var(--color-surface-container-high))] px-3 py-1 shadow-sm ring-offset-[color:var(--input-focus-ring-offset,transparent)] cursor-text font-body text-transform-secondary text-sm font-normal text-transform-primary transition-all",
            open ? "ring-[length:var(--input-focus-width,2px)] ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] border-[color:var(--input-focus-border,var(--color-primary))]" : "",
            className
          )}
          onClick={(e) => {
            // Focus the inner input when clicking the container
            const input = e.currentTarget.querySelector("input")
            if (input) input.focus()
          }}
        >
          <div className="flex flex-wrap items-center gap-2 flex-1 outline-none relative">
            {selected.map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-transparent"
              >
                {getLabel(item)}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnselect(item)
                  }}
                  className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3 text-primary hover:text-primary/80" />
                  <span className="sr-only">Remove {getLabel(item)}</span>
                </button>
              </Badge>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent py-1 px-1 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px] font-body text-transform-secondary text-sm font-normal text-transform-primary"
              placeholder={selected.length === 0 ? placeholder : undefined}
            />
          </div>
          <div className="flex items-center pl-2 border-l border-outline-variant/30 ml-2">
            {open ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground cursor-pointer" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground cursor-pointer" />
            )}
          </div>
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0 border-outline-variant shadow-xl"
        align="start"
        // Prevent autofocus from stealing focus from our inner input
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false} className="bg-layer-dialog">
          <CommandList className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-sm flex flex-col items-center justify-center gap-3">
                {inputValue ? (
                  <>
                    <span className="text-muted-foreground text-center">No results for &quot;{inputValue}&quot;</span>
                    {allowCustom && (
                      <CommandItem
                        value={`create_${inputValue}`}
                        onSelect={() => {
                          const newTag = inputValue.trim()
                          if (!selected.includes(newTag)) {
                            onChange([...selected, newTag])
                            setInputValue("")
                          }
                        }}
                        className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-[var(--input-border-radius,8px)] bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 font-body text-transform-secondary text-xs font-medium text-transform-tertiary transition-colors cursor-pointer data-[selected=true]:bg-secondary-container/90 data-[selected=true]:text-on-secondary-container"
                      >
                        <span className="material-symbols-outlined text-[16px] mr-2">add</span>
                        Add New Item
                      </CommandItem>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground text-center block py-2">No options found.</span>
                )}
              </div>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      "font-medium cursor-pointer flex items-center justify-between",
                      isSelected(option.value) ? "text-primary bg-primary/5" : ""
                    )}
                  >
                    {option.label}
                    {isSelected(option.value) && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                ))}
                
                {showCreateOption && (
                   <CommandItem
                     value={`create_${inputValue}`}
                     onSelect={() => {
                        const newTag = inputValue.trim()
                        if (!selected.includes(newTag)) {
                          onChange([...selected, newTag])
                          setInputValue("")
                        }
                     }}
                     className="font-medium cursor-pointer flex items-center gap-2 text-primary"
                   >
                     <span className="text-muted-foreground font-normal">Create</span>
                     &quot;{inputValue}&quot;
                   </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
