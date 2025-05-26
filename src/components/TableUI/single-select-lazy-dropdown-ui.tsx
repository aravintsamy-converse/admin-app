"use client"

import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import * as React from "react"
import { BiSolidChevronDown } from "react-icons/bi"
import { ChevronDown } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface SingleSelectLazyDropdownUIProps {
  placeholder?: string
  className?: string
  value: Option | null
  options: Option[]
  loading: boolean
  commandListRef: React.RefObject<HTMLDivElement | null>
  onSearchChange: (value: string) => void
  onSelect: (option: Option) => void
  onRemove: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SingleSelectLazyDropdownUI({
  placeholder = "Select an option",
  className,
  value,
  options,
  loading,
  commandListRef,
  onSearchChange,
  onSelect,
  onRemove,
  open,
  onOpenChange,
}: SingleSelectLazyDropdownUIProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full  text-selectedValue outline-none    justify-between rounded-[6px]  transition-all placeholder:font-light   font-normal text-sm border input-container  hover:bg-background  `}
        >
          {value ? (
            <span className="text-selectedValue ">
              {value.label}
            </span>
          ) : (
            <span className="text-muted-foreground font-light  ">
              {placeholder}
            </span>
          )}
          <ChevronDown
            className={`transition-transform duration-200 text-selectedValue ${open ? 'rotate-180' : 'rotate-0'
              }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-1">
            <CommandInput
              placeholder="Search"
              onValueChange={onSearchChange}
              className="flex h-9 w-full text-[#ADADAD] text-[14px] font-[400] rounded-md border-0 bg-transparent py-3 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList ref={commandListRef} className="custom-scrollbar max-h-[200px] overflow-y-auto">
            <CommandEmpty>{loading ? "Loading..." : "No results found"}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value?.value === option.value
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => onSelect(option)}
                    className={cn(
                      "cursor-pointer",
                      isSelected && "bg-[#1D57C712] text-[#1D57C7]"
                    )}
                  >
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
              {loading && options.length > 0 && (
                <div className="py-2 text-center text-sm text-muted-foreground">Loading more...</div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}