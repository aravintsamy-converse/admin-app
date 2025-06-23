import React from 'react';
import { QuickFiltersProps } from "@/types/table/table.type";
import { DesktopFilters } from "@/components/dynamic-table/desktop-filters";
import { MobileFilters } from "@/components/dynamic-table/mobile-filters";
import useScreenSize from "@/components/table-ui/screen-size";

export function QuickFilters({
  quickFilters,
  filterValues,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onImmediateFilterChange,
}: QuickFiltersProps) {
  const screenSize = useScreenSize();

  // Sort quickFilters based on order property
  const sortedFilters = [...quickFilters].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Check validity of all DateRange and DateTimeRange filters
  const isAllRangesValid = sortedFilters.every((filter) => {
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
    sortedFilters.length === 1 &&
    !(
      (sortedFilters[0].filter_type === "Dropdown") ||
      sortedFilters[0].filter_type === "DateRange" ||
      sortedFilters[0].filter_type === "DateTimeRange" ||
      sortedFilters[0].filter_type === "String" ||
      sortedFilters[0].filter_type === "Number"
    );

  // Determine max visible filters based on screen size
  const maxVisibleFilters = screenSize === "2xl" ? 3 : (screenSize === "xl" || screenSize === "lg") ? 2 : screenSize === "md" ? 1 : 0;
  const visibleFilters = sortedFilters.slice(0, Math.min(maxVisibleFilters, sortedFilters.length));
  const hiddenFilters = sortedFilters.slice(maxVisibleFilters);

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
        quickFilters={sortedFilters}
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
