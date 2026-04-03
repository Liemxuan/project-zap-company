"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from '../../../genesis/atoms/interactive/badge'
import { cn } from '../../../lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../../../genesis/molecules/popover'
import { Command, CommandGroup, CommandItem, CommandList } from '../../../genesis/atoms/interactive/command'

export interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  suggestions?: string[]
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ className, value, onChange, placeholder, suggestions = [], ...props }, ref) => {
    const [tags, setTags] = React.useState<string[]>(value || [])
    const [inputValue, setInputValue] = React.useState("")
    const [open, setOpen] = React.useState(false)

    const filteredSuggestions = suggestions.filter(
      (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
    )

    React.useEffect(() => {
      if (value !== undefined) {
        setTags(value)
      }
    }, [value])

    const addTag = (newTagStr: string) => {
      const newTag = newTagStr.trim()
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag]
        setTags(newTags)
        onChange?.(newTags)
        setInputValue("")
        setOpen(false)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // If Popover is open and has items, let Command handle Enter
      // Actually, standard Popover+Command steals focus to CommandItem if arrow keys are used.
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault()
        addTag(inputValue)
      } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
        removeTag(tags[tags.length - 1])
      }
    }

    const removeTag = (tagToRemove: string) => {
      const newTags = tags.filter((tag) => tag !== tagToRemove)
      setTags(newTags)
      onChange?.(newTags)
    }

    return (
      <div
        className={cn(
          "flex min-h-[var(--input-height,36px)] w-full flex-wrap items-center gap-2 rounded-[var(--input-border-radius,8px)] border-[length:var(--input-border-width,1px)] border-[color:var(--input-border-filled,transparent)] bg-[color:var(--input-bg-filled,var(--color-surface-container-high))] px-3 py-1 shadow-sm transition-all focus-within:ring-[length:var(--input-focus-width,2px)] focus-within:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-within:border-[color:var(--input-focus-border,var(--color-primary))] focus-within:outline-none font-body text-transform-secondary text-sm font-normal text-transform-primary",
          className
        )}
      >
        {tags.map((tag) => (
          <Badge key={tag} className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary border-transparent rounded-[calc(var(--input-border-radius,8px)-4px)] px-2 py-0.5 font-medium transition-colors">
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag} tag`}
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <input
              ref={ref}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                if (suggestions.length > 0) setOpen(true)
              }}
              onFocus={() => {
                if (suggestions.length > 0) setOpen(true)
              }}
              onKeyDown={handleKeyDown}
              placeholder={tags.length === 0 ? placeholder : undefined}
              className="flex-1 bg-transparent px-1 py-1 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px] font-body text-transform-secondary text-sm font-normal text-transform-primary"
              autoComplete="off"
              {...props}
            />
          </PopoverTrigger>
          {suggestions.length > 0 && (
             <PopoverContent 
               className="p-0 border-outline-variant shadow-xl w-[max-content] min-w-[260px]"
               align="start"
               onOpenAutoFocus={(e) => e.preventDefault()}
             >
               <Command shouldFilter={false} className="bg-layer-dialog">
                 <CommandList>
                   {filteredSuggestions.length === 0 ? (
                     <div className="py-4 px-3 text-sm flex flex-col items-center justify-center gap-3">
                       {inputValue ? (
                         <>
                           <span className="text-muted-foreground text-center">No results for &quot;{inputValue}&quot;</span>
                           <CommandItem
                             value={`create_${inputValue}`}
                             onSelect={() => addTag(inputValue)}
                             className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-[var(--input-border-radius,8px)] bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 font-secondary text-sm font-medium text-transform-secondary transition-colors cursor-pointer data-[selected=true]:bg-secondary-container/90 data-[selected=true]:text-on-secondary-container"
                           >
                             <span className="material-symbols-outlined text-[16px] mr-2">add</span>
                             Add New Item
                           </CommandItem>
                         </>
                       ) : (
                         <span className="text-muted-foreground text-center block py-2">No suggestions found.</span>
                       )}
                     </div>
                   ) : (
                     <CommandGroup>
                       {filteredSuggestions.map((suggestion) => (
                         <CommandItem
                           key={suggestion}
                           value={suggestion}
                           onSelect={() => {
                             // Shadcn's CommandItem lowercases the value by default, so we use the original suggestion
                             addTag(suggestion)
                           }}
                           className="font-medium cursor-pointer"
                         >
                           {suggestion}
                         </CommandItem>
                       ))}
                     </CommandGroup>
                   )}
                 </CommandList>
               </Command>
             </PopoverContent>
          )}
        </Popover>
      </div>
    )
  }
)
TagInput.displayName = "TagInput"
