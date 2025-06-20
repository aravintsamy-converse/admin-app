"use client";

import * as Popover from "@radix-ui/react-popover";
import { BsFilterLeft } from "react-icons/bs";
import { FilterRenderer } from "@/components/dynamic-table/filter-renderer";
import { DesktopFiltersProps } from "@/Types/Table/tableTypes";
import { X } from "lucide-react";

export function DesktopFilters({
  visibleFilters,
  hiddenFilters,
  filterValues,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  isAllRangesValid,
  hideApplyButton = false,
}: DesktopFiltersProps) {
  const hasFilterValues = Object.values(filterValues).some((value) => value.trim() !== "");

  return (
    <div className="hidden md:flex items-center gap-4">
      {visibleFilters.map((filter) => (
        <div key={filter.id} className="w-full">
          <FilterRenderer
            filter={filter}
            fieldName={filter.field_name || ""}
            filterValues={filterValues}
            onFilterChange={onFilterChange}
          />
        </div>
      ))}
      {hiddenFilters.length > 0 && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="text-[#1D57C7] hover:text-[#1D57C7]/80">
              <BsFilterLeft size={26} />
            </button>
          </Popover.Trigger>
          <Popover.Content
            className="mr-4 mt-2 p-4 z-50 w-[350px] bg-white rounded-[4px] shadow-[0px_0px_20px_0px_#C2D1EF]"
          >
            <div className="absolute -top-2 right-8 lg:right-6 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[20px] rotate-90 border-r-white"></div>
            <div className="flex flex-col gap-4">
              {hiddenFilters.map((filter) => (
                <div key={filter.id}>
                  <FilterRenderer
                    filter={filter}
                    fieldName={filter.field_name || ""}
                    filterValues={filterValues}
                    onFilterChange={onFilterChange}
                  />
                </div>
              ))}
              {!hideApplyButton && (
                <div className="flex gap-2">
                  <button
                    onClick={onApplyFilters}
                    disabled={!isAllRangesValid}
                    className={`${!isAllRangesValid ? "cursor-not-allowed" : ""} px-4 py-2 bg-white text-[#1D57C7] text-nowrap hover:text-white hover:bg-[#1D57C7] text-[15px] font-[600] rounded-[4px] shadow-[2px_2px_5px_0px_#1D57C747] transition-all duration-300`}
                  >
                    Apply Filter
                  </button>
                  {hasFilterValues && (
                    <button
                      onClick={onResetFilters}
                      className="px-2 py-2 bg-white text-[#1D57C7] hover:text-white hover:bg-[#1D57C7] rounded-[4px] shadow-[2px_2px_5px_0px_#1D57C747] transition-all duration-300"
                      title="Reset Filters"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Root>
      )}
      {hiddenFilters.length === 0 && !hideApplyButton && (
        <div className="flex gap-2">
          <button
            onClick={onApplyFilters}
            disabled={!isAllRangesValid}
            className={`${!isAllRangesValid ? "cursor-not-allowed" : ""} px-4 py-2 bg-white text-[#1D57C7] text-nowrap hover:text-white hover:bg-[#1D57C7] text-[15px] font-[600] rounded-[4px] shadow-[2px_2px_5px_0px_#1D57C747] transition-all duration-300`}
          >
            Apply Filter
          </button>
          {hasFilterValues && (
            <button
              onClick={onResetFilters}
              className="px-2 py-2 bg-white text-[#1D57C7] hover:text-white hover:bg-[#1D57C7] rounded-[4px] shadow-[2px_2px_5px_0px_#1D57C747] transition-all duration-300"
              title="Reset Filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}
      {hiddenFilters.length === 0 && hideApplyButton && hasFilterValues && (
        <button
          onClick={onResetFilters}
          className="px-2 py-2 bg-white text-[#1D57C7] hover:text-white hover:bg-[#1D57C7] rounded-[4px] shadow-[2px_2px_5px_0px_#1D57C747] transition-all duration-300"
          title="Reset Filters"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}