"use client"

import * as React from "react"
import { Check, ChevronDown, Search } from "lucide-react"
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
import { DownArrowIcon } from "@/components/client/icons/general"

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
   const selectedViewLabel =
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
      {/* Column Selector */}
      <Select value={selectedColumn} onValueChange={setSelectedColumn}>
        <SelectTrigger className="h-full px-3 border-0 shadow-none rounded-none rounded-l-md hover:bg-transparent focus:ring-0 focus:ring-offset-0 w-[130px]">
          <div className="flex flex-1 w-full  text-start text-selectSecondaryForeground pl-[1px]">
            <TruncateTooltip
              text={selectedViewLabel || "Select a view"}
              className="text-start text-[14px] w-[100px] md:min-w-[80px] md:max-w-[80px] text-nowrap truncate"
            />
          </div>
          <span className="flex items-center justify-center text-arrowIcon">
            <DownArrowIcon/>
          </span>
        </SelectTrigger>
        <SelectContent className="min-w-[166px] max-w-[240px] md:min-w-[295px] md:max-w-[395px] top-[-2px] border-0 rounded-[2px] bg-background shadow-viewboxshadow">
          {columns?.map((column) => (
            <SelectItem key={column.value} value={column.value}>
              {column.label}
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
          className="border-0 focus-visible:ring-0 shadow-none focus-visible:ring-offset-0 pr-10"
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
  )
}