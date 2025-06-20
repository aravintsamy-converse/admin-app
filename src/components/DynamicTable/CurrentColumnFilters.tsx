"use client";

import { RootState } from '@/Store/Store';
import { useSelector, useDispatch } from 'react-redux';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/TableUI/badge';
import { format } from 'date-fns';
import { removeColumnFilter, clearAllFilters } from '@/Store/Slices/columnFiltersSlice';
import * as Popover from '@radix-ui/react-popover';
import useScreenSize from '@/components/TableUI/screenSize';
import { ColumnFilter } from '@/Types/Table/tableTypes';

const CurrentColumnFilters = () => {
  const dispatch = useDispatch();
  const columnFilters = useSelector((state: RootState) => state.columnFilters.filters);
  const screenSize = useScreenSize();

  // Determine max visible filters based on screen size
  const maxVisibleFilters = screenSize === "2xl" ? 2 : 
                          screenSize === "xl" ? 1 : 
                          screenSize === "lg" ? 1 : 
                          screenSize === "md" ? 1 : 0;
  
  const visibleFilters = columnFilters.slice(0, Math.min(maxVisibleFilters, columnFilters.length));
  const hiddenFilters = columnFilters.slice(maxVisibleFilters);

  // Function to format the display name of a column
  const formatColumnName = (name: string): string => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to format date or datetime values
  const formatDateValue = (dateString: string, includeTime = false): string => {
    try {
      const date = new Date(dateString);
      return includeTime
        ? format(date, 'dd/MM/yyyy HH:mm')
        : format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Function to format time values
  const formatTimeValue = (timeString: string): string => {
    try {
      const date = new Date(`1970-01-01T${timeString}`);
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  const formatFilterValue = (filter: ColumnFilter): string => {
    const { columnType, condition, value } = filter;

    // Handle conditions that don't require a value
    if (!value && !['Is Blank', 'Is not Blank'].includes(condition)) {
      return condition;
    }

    switch (columnType) {
      case 'Number':
        if (condition === 'Between' && Array.isArray(value)) {
          const [start, end] = value;
          return `${start.toLocaleString()} - ${end.toLocaleString()}`;
        }
        return value?.toLocaleString() || '';

      case 'String':
        return value?.toString() || '';

      case 'Boolean':
      case 'Binary':
        return value ? 'True' : 'False';

      case 'Dropdown':
      case 'MultiSelect':
        return Array.isArray(value) ? value.join(', ') : value?.toString() || '';

      case 'Date':
      case 'DateTime':
        if (condition === 'Is Between' && Array.isArray(value)) {
          const [min, max] = value;
          return `${formatDateValue(min, columnType === 'DateTime')} - ${formatDateValue(max, columnType === 'DateTime')}`;
        } else if (['Is next X', 'Is last X'].includes(condition) && Array.isArray(value)) {
          const [number, unit] = value;
          return `${number} ${unit}`;
        } else if (['Is', 'Is Not', 'Is After', 'Is on or After', 'Is Before', 'Is on or Before'].includes(condition)) {
          return formatDateValue(value, columnType === 'DateTime');
        }
        return condition;

      case 'Time':
        if (condition === 'Is Between' && Array.isArray(value)) {
          const [start, end] = value;
          return `${formatTimeValue(start)} - ${formatTimeValue(end)}`;
        } else if (['Is next X hours', 'Is last X hours'].includes(condition)) {
          return `${value} hours`;
        } else if (['Is', 'Is Not'].includes(condition)) {
          return formatTimeValue(value);
        } else if (['Is in Hour', 'Is in Minute'].includes(condition)) {
          return value?.toString() || '';
        }
        return value?.toString() || '';

      case 'Media':
        return value?.toString() || '';

      default:
        return value?.toString() || '';
    }
  };

  // Function to remove a filter
  const removeFilter = (columnName: string) => {
    dispatch(removeColumnFilter(columnName));
  };

  // Function to clear all filters
  const clearAllFiltersHandler = () => {
    dispatch(clearAllFilters());
  };

  const renderFilterBadge = (filter: ColumnFilter, index: number) => (
    <Badge
      key={index}
      variant="outline"
      className="flex items-center gap-1 py-1 px-2 bg-white border-[#F0F0F0]"
    >
      <span className="flex items-center text-[#979797] text-[14px] mr-1">
        {formatColumnName(filter.columnName)}:
      </span>
      <span className="flex items-center text-[#979797] text-[14px] mr-1">
        {filter.condition}
      </span>
      <Badge
        variant="outline"
        className="flex items-center gap-1 py-1 px-2 bg-[#F7F7F7] border-[#F0F0F0]"
      >
        {filter.value !== null && (
          <span className="flex items-center font-[500] text-[#363F51] text-[14px] max-w-40 text-nowrap overflow-hidden">
            {formatFilterValue(filter)}
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-3 w-3 p-0 flex items-center justify-center"
          onClick={() => removeFilter(filter.columnName)}
        >
          <X className="h-[13px] w-[13px] text-[#889ABC]" />
        </Button>
      </Badge>
    </Badge>
  );

  return (
    <div className="w-full flex flex-wrap gap-2 text-[14px] items-center">
      {visibleFilters.map((filter, index) => renderFilterBadge(filter, index))}

      {hiddenFilters.length > 0 && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#1D57C7] hover:text-[#1D57C7]/80 p-0 h-auto"
            >
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-[14px]">+{hiddenFilters.length} more</span>
            </Button>
          </Popover.Trigger>
          <Popover.Content
            className="ml-4 md:ml-56 mt-6 p-4 z-50 w-auto bg-white rounded-[4px] shadow-[0px_0px_20px_0px_#C2D1EF]"
          >
          <div className="absolute top-2   border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[20px] rotate-90 border-r-white"></div>
            <div className="flex flex-col gap-2">
              {hiddenFilters.map((filter, index) => renderFilterBadge(filter, index))}
              <Button
                variant="outline"
                className="text-[#1D57C7] font-[500] border-0 hover:bg-transparent text-[14px] hover:text-[#1D57C7] p-0 h-auto mt-2"
                onClick={clearAllFiltersHandler}
              >
                Clear All Filters
              </Button>
            </div>
          </Popover.Content>
        </Popover.Root>
      )}
      {columnFilters.length > 0 && hiddenFilters.length === 0 && (
        <Button
          variant="outline"
          className="text-[#1D57C7] font-[500] border-0 hover:bg-transparent text-[14px] hover:text-[#1D57C7] p-0 h-auto"
          onClick={clearAllFiltersHandler}
        >
          Clear Filter
        </Button>
      )}
    </div>
  );
};

export default CurrentColumnFilters;