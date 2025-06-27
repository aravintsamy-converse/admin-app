"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TruncateTooltip } from "../truncate-tooltip"
import { DownArrowIcon, SearchIcon } from "@/components/client/icons/general"

interface MappedDropdownProps {
  placeholder?: string
  columns?: Array<{ value: string; label: string }>
  onSearch?: (column: string, query: string) => void
  className?: string
}

export function MappedDropdown({
  placeholder = "Search...",
  columns,
  onSearch,
  className,
}: MappedDropdownProps) {
  const [selectedColumn, setSelectedColumn] = React.useState<string>(columns?.[0]?.value || "")
  const [searchQuery, setSearchQuery] = React.useState("")
  const selectedLabel =
    columns?.find(option => option.value === selectedColumn)?.label;
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

  return (
    <div className={cn("relative border rounded-[5px] flex items-center justify-center w-full", className)}>
      {/* Column Selector h-186 w-301  */}
      <Select value={selectedColumn} onValueChange={setSelectedColumn}>
        <SelectTrigger className="h-full px-3 border-0 shadow-none rounded-none rounded-l-md hover:bg-transparent focus:ring-0 focus:ring-offset-0 w-[37.5%]">
          <div className="flex w-full items-center h-full">
            <div className="flex-1 overflow-hidden text-selectSecondaryForeground flex items-center h-full">
              <TruncateTooltip
                text={selectedLabel || ''}
                className="text-[14px] truncate text-nowrap w-full text-start"
              />
            </div>
            <span className="flex-shrink-0 ml-2 flex items-center justify-center text-arrowIcon h-full">
              <DownArrowIcon />
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="w-full  p-1.5 top-[2px] border-0 rounded-[2px] bg-background shadow-viewboxshadow">
          {columns?.map((column) => (
            <SelectItem
              key={column.value}
              value={column.value}
              className={`${selectedColumn === column.value
                ? "text-primary"
                : "text-accent-foreground hover:!bg-accent"
                } cursor-pointer group font-normal w-full py-[4px]  hover:!text-primary focus:bg-transparent focus:font-[400]`}
            >
              <div className="max-w-[240px]">
                <TruncateTooltip
                  text={column.label}
                  className={`${selectedColumn === column.value
                    ? "text-primary"
                    : "text-accent-foreground"
                    } truncate group-hover:!text-primary group-hover:font-medium text-start w-full`}
                />
              </div>
            </SelectItem>

          ))}
        </SelectContent>
      </Select>

      {/* Search Icon */}
      <div className="border-r border h-7 flex items-center justify-center">
      </div>

      {/* Search Input */}
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border-0 text-[14px] font-normal focus-visible:ring-0 shadow-none focus-visible:ring-offset-0 pl-[7px] pr-10"
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
            <span className="flex items-center justify-between text-searchIcon">
              <SearchIcon />
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}