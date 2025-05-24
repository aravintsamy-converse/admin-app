"use client"

import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "@/components/ui/button"
import { Badge } from "./badge"
import * as React from "react"
import { RxChevronDown } from "react-icons/rx";
import { BiSolidChevronDown } from "react-icons/bi"


interface Option {
  value: string
  label: string
}

interface MultiSelectDropdownUIProps {
  placeholder?: string
  className?: string
  value: Option[]
  options: Option[]
  loading: boolean
  commandListRef: React.RefObject<HTMLDivElement>
  onSearchChange: (value: string) => void
  onSelect: (option: Option) => void
  onRemove: (option: Option) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MultiSelectDropdownUI({
  placeholder = "Select options",
  className,
  value = [],
  options,
  loading,
  commandListRef,
  onSearchChange,
  onSelect,
  onRemove,
  open,
  onOpenChange,
}: MultiSelectDropdownUIProps) {
  // Optional: Limit the number of badges shown in the button
  const maxBadgesToShow = 3
  const displayedBadges = value.slice(0, maxBadgesToShow)
  const extraCount = value.length > maxBadgesToShow ? value.length - maxBadgesToShow : 0

  return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal input-container"          >
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1 items-center ">
                {displayedBadges.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="flex items-center gap-1 bg-[#1D57C712] hover:bg-[#1D57C712] text-[#1D57C7] text-[12px] font-[400]"
                  >
                    {option.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent triggering the popover
                        onRemove(option)
                      }}
                    />
                  </Badge>
                ))}
                {extraCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    +{extraCount} more
                  </Badge>
                )}
              </div>
            ) : (
              <span>{placeholder}</span>
            )}
            <BiSolidChevronDown className="text-[#42526E99] h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-1">
              <CommandInput
                placeholder="Search"
                onValueChange={onSearchChange}
                className="flex h-9 w-full text-[#ADADAD] text-[14px] font-[400] rounded-md border-0 bg-transparent py-3  outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList
              ref={commandListRef}
              className="max-h-[200px] overflow-y-auto"
            >
              <CommandEmpty>
                {loading ? 'Loading...' : 'No results found'}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.some((item) => item.value === option.value)

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => onSelect(option)}
                    >
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50",
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span>{option.label}</span>
                      </div>
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