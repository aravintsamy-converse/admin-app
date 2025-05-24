"use client";

import * as React from "react";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { MultiSelectDropdownProps } from "@/Types/Table/shadcnComponentInterface";

export function MultiSelectDropdown({
  options,
  selectedValues,
  onSelect,
  placeholder = "Select options...",
}: MultiSelectDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const labelMap = new Map(options.map(option => [option.value, option.label]));

  const handleSelect = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelect(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 bg-white text-[14px] border rounded-[4px] text-[#81868C] hover:bg-[#FFF] hover:text-[#81868C] focus:outline-none focus:ring-0 focus:ring-[#1D57C7] focus:border-[#1D57C7]"
        >
          <span className={cn("truncate", !selectedValues.length && "text-[#81868C]")}>
            {selectedValues.length > 0
              ? options
                .filter((option) => selectedValues.includes(option.value))
                .map((option) => option.label)
                .join(", ")
              : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0" />

        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 filter-popover-content">
        <Command
          filter={(value, search) => {
            const label = labelMap.get(value);
            return label?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Search options..." className="h-9 text-[#81868C]" />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    "cursor-pointer hover:bg-[#F8F9FC] group",
                    isSelected && "text-[#1D57C7]" // Selected text color
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    className="mr-2 h-4 w-4 rounded-sm border-2 border-[#889ABC] data-[state=checked]:bg-[#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <span className={cn(
                    isSelected ? "text-[#1D57C7]" : "text-[#81868C]",
                    "group-hover:text-[#1D57C7]"
                  )}>
                    {option.label}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}