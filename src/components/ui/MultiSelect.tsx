"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

export interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  maxShow?: number
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  maxShow = 2,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOptions = options.filter((option) => selected.includes(option.value))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <div
            className="relative w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setOpen(true)}
          >
            <div className="flex gap-1 flex-wrap">
              {selected.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              {selectedOptions.length > maxShow ? (
                <Badge variant="secondary" className="rounded-sm">
                  {selectedOptions.length} selected
                </Badge>
              ) : (
                selectedOptions.map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="rounded-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange(selected.filter((value) => value !== option.value))
                    }}
                  >
                    {option.label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-background" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(
                    selected.includes(option.value)
                      ? selected.filter((value) => value !== option.value)
                      : [...selected, option.value]
                  )
                }}
              >
                <div
                  className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${selected.includes(option.value)
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible"
                    }`}
                >
                  <X className="h-3 w-3" />
                </div>
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}