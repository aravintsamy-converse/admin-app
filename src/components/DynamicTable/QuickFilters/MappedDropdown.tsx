"use client"

import * as React from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

const columnOptions = [
  {
    value: "project_name",
    label: "Project Name",
  },
  {
    value: "customer_name",
    label: "Customer Name",
  },
  {
    value: "project_status",
    label: "Project Status",
  },
  {
    value: "priority",
    label: "Priority",
  },
  {
    value: "assigned",
    label: "Assigned",
  },
]

interface MappedDropdownProps {
  placeholder?: string
  columns?: Array<{ value: string; label: string }>
  onSearch?: (column: string, query: string) => void
  className?: string
  defaultColumn?: string
}

export function MappedDropdown({
  placeholder = "Search...",
  columns = columnOptions,
  onSearch,
  className,
  defaultColumn = "",
}: MappedDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedColumn, setSelectedColumn] = React.useState<string>(defaultColumn)
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleColumnSelect = (currentValue: string) => {
    setSelectedColumn(currentValue)
    setOpen(false)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch?.(selectedColumn, searchQuery.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getSelectedColumnLabel = () => {
    if (!selectedColumn) return "Select Column"
    return columns.find((col) => col.value === selectedColumn)?.label || "Select Column"
  }

  return (
    <div className={cn("relative flex w-full max-w-md", className)}>
      <div className="flex w-full border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {/* Column Selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="h-10 px-3 border-0 border-r border-input rounded-none rounded-l-md hover:bg-muted/50 focus:ring-0 focus:ring-offset-0"
            >
              <span className="text-sm font-medium">{getSelectedColumnLabel()}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  {columns.map((column) => (
                    <CommandItem
                      key={column.value}
                      value={column.value}
                      onSelect={() => handleColumnSelect(column.value)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedColumn === column.value ? "opacity-100" : "opacity-0")}
                      />
                      {column.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Search Input */}
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 rounded-none rounded-r-md focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSearch}
            disabled={!selectedColumn || !searchQuery.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
          >
            {selectedColumn && searchQuery.trim() ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
