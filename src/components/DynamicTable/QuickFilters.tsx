"use client";

import { QuickFiltersProps } from "@/Types/Table/tableTypes";
import { DesktopFilters } from "@/components/DynamicTable/DesktopFilters";
import { MobileFilters } from "@/components/DynamicTable/MobileFilters";
import useScreenSize from "@/components/TableUI/screenSize";

export function QuickFilters({
  quickFilters,
  filterValues,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onImmediateFilterChange,
}: QuickFiltersProps) {
  const screenSize = useScreenSize();

  // Check validity of all DateRange and DateTimeRange filters
  const isAllRangesValid = quickFilters.every((filter) => {
    if (filter.filter_type === "DateRange" || filter.filter_type === "DateTimeRange") {
      const fromKey = `${filter.field_name}_from`;
      const toKey = `${filter.field_name}_to`;
      const fromDate = filterValues[fromKey] ? new Date(filterValues[fromKey]) : null;
      const toDate = filterValues[toKey] ? new Date(filterValues[toKey]) : null;
      return !fromDate || !toDate || fromDate <= toDate;
    }
    return true;
  });

  // Determine if we should hide Apply Filter and fetch immediately
  const isSingleSimpleFilter =
    quickFilters.length === 1 &&
    !(
      (quickFilters[0].filter_type === "Dropdown") ||
      quickFilters[0].filter_type === "DateRange" ||
      quickFilters[0].filter_type === "DateTimeRange" ||
      quickFilters[0].filter_type === "String" ||
      quickFilters[0].filter_type === "Number" 
    );

  // Determine max visible filters based on screen size
  const maxVisibleFilters = screenSize === "2xl" ? 3 : (screenSize === "xl" || screenSize === "lg") ? 2 : screenSize === "md" ? 1 : 0;
  const visibleFilters = quickFilters.slice(0, Math.min(maxVisibleFilters, quickFilters.length));
  const hiddenFilters = quickFilters.slice(maxVisibleFilters);

  // Handle filter change and trigger immediate fetch if applicable
  const handleFilterChangeWrapper = (fieldName: string, value: string) => {
    onFilterChange(fieldName, value);
    if (isSingleSimpleFilter && onImmediateFilterChange) {
      const updatedFilterValues = { ...filterValues, [fieldName]: value };
      onImmediateFilterChange(updatedFilterValues);
    }
  };

  return (
    <div className="w-auto md:w-full flex flex-col gap-4">
      <DesktopFilters
        visibleFilters={visibleFilters}
        hiddenFilters={hiddenFilters}
        filterValues={filterValues}
        onFilterChange={handleFilterChangeWrapper} // Use wrapper
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
        isAllRangesValid={isAllRangesValid}
        hideApplyButton={isSingleSimpleFilter} // Pass flag to hide Apply button
      />
      <MobileFilters
        quickFilters={quickFilters}
        filterValues={filterValues}
        onFilterChange={handleFilterChangeWrapper} // Use wrapper
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
        isAllRangesValid={isAllRangesValid}
        hideApplyButton={isSingleSimpleFilter} // Pass flag to hide Apply button
      />
    </div>
  );
}