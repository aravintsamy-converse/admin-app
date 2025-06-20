"use client";

import { useState } from "react";
import { BsFilterLeft } from "react-icons/bs";
import { FilterRenderer } from "@/components/dynamic-table/filter-renderer";
import { MobileFiltersProps } from "@/Types/Table/tableTypes";
import { X } from "lucide-react";

export function MobileFilters({
  quickFilters,
  filterValues,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  isAllRangesValid,
  hideApplyButton = false,
}: MobileFiltersProps) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const hasFilterValues = Object.values(filterValues).some((value) => value.trim() !== "");

  return (
    <>
      <div className="md:hidden flex items-center gap-4">
        <button
          onClick={() => setIsSideMenuOpen(true)}
          className="p-2 text-[#1D57C7] hover:text-[#1D57C7]/80"
        >
          <BsFilterLeft size={26} />
        </button>
      </div>

      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSideMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-72 duration-500 h-full bg-white shadow-lg p-4 flex flex-col gap-4 overflow-y-auto">
            <div>
              <button
                onClick={() => setIsSideMenuOpen(false)}
                className="absolute top-4 right-4 text-[#1D57C7] hover:text-[#1D57C7]/80"
              >
                <BsFilterLeft size={26} />
              </button>
              <h2 className="text-lg font-semibold text-[#1D57C7]">Filters</h2>
            </div>
            {quickFilters.map((filter) => (
              <div key={filter.id}>
                <FilterRenderer
                  filter={filter}
                  fieldName={filter.field_name || ""}
                  filterValues={filterValues}
                  onFilterChange={onFilterChange}
                />
              </div>
            ))}
            {!hideApplyButton ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (isAllRangesValid) {
                      onApplyFilters();
                      setIsSideMenuOpen(false);
                    }
                  }}
                  disabled={!isAllRangesValid}
                  className={`px-4 py-2 bg-white text-[#1D57C7] hover:text-white hover:bg-[#1D57C7] text-[15px] font-[600] rounded-[4px] shadow-[2px_2px_5px_0px_#1D57C747] transition-all duration-300 ${!isAllRangesValid ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Apply Filter
                </button>
                {hasFilterValues && (
                  <button
                    onClick={() => {
                      onResetFilters();
                      setIsSideMenuOpen(false);
                    }}
                    className="px-2 py-2 bg-white text-[#1D57C7] hover:text-white hover:bg-[#1D57C7] rounded-[4px] shadow-[2px_2px_5px_0px_#1D57C747] transition-all duration-300"
                    title="Reset Filters"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ) : (
              hasFilterValues && (
                <button
                  onClick={() => {
                    onResetFilters();
                    setIsSideMenuOpen(false);
                  }}
                  className="px-2 py-2 bg-white text-[#1D57C7] hover:text-white hover:bg-[#1D57C7] rounded-[4px] shadow-[2px_2px_5px_0px_#1D57C747] transition-all duration-300"
                  title="Reset Filters"
                >
                  <X size={18} />
                </button>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}