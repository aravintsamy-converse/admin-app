"use client";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useState, useRef, useEffect } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { ChevronDown } from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers";
import { format, parse, isValid } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setColumnFilter, removeColumnFilter } from "@/store/slices/column-filters-slice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Input } from "@/components/table-ui/input";
import { MultiSelectDropdown } from "@/components/table-ui/multiSelectDropdown";
import { TimeInput } from "@/components/table-ui/time-input";
import { CustomFilterDropdownProps, InputField } from "@/types/table/filter-data.type";
import { useTableContext } from "@/app/context/table-context"; // Import useTableContext
import { FilterDotIcon, FilterIcon } from "@/components/client/icons/table/preference-popover";

export default function ColumnFilters({ columnType, column_name, options }: CustomFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterData = useSelector((state: RootState) => state.filterData.data);
  const dispatch = useDispatch();
  const currentFilter = useSelector((state: RootState) =>
    state.columnFilters.filters.find((f: any) => f.columnName === column_name),
  );
  const columnFilterData = filterData.find((data) => data.columnType === columnType)?.conditions || [];
  const multiDropdownOptions = options || [];
  const { setPageIndex } = useTableContext(); // Use context for setPageIndex

  useEffect(() => {
    if (currentFilter) {
      const conditionData = columnFilterData.find((c) => c.filterCondition === currentFilter.condition);
      if (conditionData) {
        const inputFieldCount = conditionData.inputField.length;
        if (inputFieldCount === 1) {
          // Single input field (e.g., multiDropdown): wrap the value in an array
          setInputValues([currentFilter.value]);
        } else {
          // Multiple input fields (e.g., "Is Between"): use the value as-is
          setInputValues(currentFilter.value);
        }
      }
      setSelectedCondition(currentFilter.condition);
    }
  }, [currentFilter, columnType, columnFilterData]);

  const handleConditionSelect = (condition: string) => {
    const conditionData = columnFilterData.find((c) => c.filterCondition === condition);
    setSelectedCondition(condition);

    if (conditionData) {
      const newInputs = conditionData.inputField.map((field) => {
        if (field.type === "multiDropdown") {
          return [];
        }
        return "";
      });
      setInputValues(newInputs);

      if (!conditionData.inputRequired) {
        dispatch(
          setColumnFilter({
            columnName: column_name,
            columnType,
            condition: condition,
            value: null,
          }),
        );
        setIsOpen(false);
        setPageIndex(0);
      }
    }
  };

  const handleInputChange = (index: number, value: any) => {
    const newValues = [...inputValues];

    try {
      if (value instanceof Date) {
        if (!isValid(value)) {
          throw new Error('Invalid date');
        }

        if (columnType === "DateTime") {
          newValues[index] = format(value, "yyyy-MM-dd'T'HH:mm:ss");
        } else {
          newValues[index] = format(value, "yyyy-MM-dd");
        }
      } else if (typeof value === 'string') {
        if (columnType === "DateTime" || columnType === "Date") {
          // Use different format patterns based on column type
          const formatPattern = columnType === "DateTime"
            ? "dd/MM/yyyy HH:mm"
            : "dd/MM/yyyy";

          const parsedDate = parse(value, formatPattern, new Date());

          if (isValid(parsedDate)) {
            // Directly handle valid parsed date instead of recursion
            if (columnType === "DateTime") {
              newValues[index] = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss");
            } else {
              newValues[index] = format(parsedDate, "yyyy-MM-dd");
            }
          } else {
            // Store raw value only for partial inputs
            newValues[index] = value;
          }
        } else {
          newValues[index] = value;
        }
      } else {
        newValues[index] = value;
      }
    } catch (error) {
      console.warn('Invalid date input:', error);
      newValues[index] = inputValues[index];
    }

    setInputValues(newValues);
  };

  const handleSubmit = () => {
    if (selectedCondition) {
      let formattedValue = inputValues.length > 1 ? inputValues : inputValues[0];

      if ((columnType === "Date" || columnType === "DateTime") && selectedCondition === "Is Between") {
        if (Array.isArray(formattedValue)) {
          formattedValue = formattedValue.map(v => v);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          formattedValue;
        }
      }

      dispatch(
        setColumnFilter({
          columnName: column_name,
          columnType,
          condition: selectedCondition,
          value: formattedValue,
        }),
      );
      setPageIndex(0);
    }
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    dispatch(removeColumnFilter(column_name));
    setSelectedCondition(null);
    setInputValues([]);
    setPageIndex(0);
  };

  const isApplyDisabled = () => {
    const conditionData = columnFilterData.find((c) => c.filterCondition === selectedCondition);
    if (!conditionData) return true;

    let disabled = false;

    // Check individual field validations first
    if (conditionData.inputRequired) {
      disabled = conditionData.inputField.some((field, index) => {
        const value = inputValues[index];

        switch (field.type) {
          case "number":
            return isNaN(value) || value === "" || value === null || value < 0;
          case "calendar":
          case "datetimeinput":
            return !value || isNaN(new Date(value).getTime());
          case "Dropdown":
            return !value || value.trim() === "";
          case "multiDropdown":
            return !value || value.length === 0;
          case "text":
          case "timeinput":
            return typeof value !== "string" || value.trim() === "";
          default:
            return typeof value !== "string" || value.trim() === "";
        }
      });
    }

    // Additional validation for date range
    if (!disabled && selectedCondition === "Is Between" && (columnType === "Date" || columnType === "DateTime")) {
      const [start, end] = inputValues;

      // Parse dates
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Check if both dates are valid
      const validDates = !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());

      // Check if end date is after start date
      if (validDates && startDate >= endDate) {
        disabled = true;
      }
    }

    // Additional validation for time range
    if (!disabled && selectedCondition === "Is Between" && columnType === "Time") {
      const [start, end] = inputValues;

      // Check if both times are valid and end is after start
      if (start && end && start >= end) {
        disabled = true;
      }
    }

    // Additional validation for number range
    if (!disabled && selectedCondition === "Between" && columnType === "Number") {
      const [start, end] = inputValues;

      // Check if both values are valid numbers and end is greater than start
      if (!isNaN(start) && !isNaN(end) && Number(start) >= Number(end)) {
        disabled = true;
      }
    }

    return disabled;
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if click is inside any popover/dropdown content or main filter
      const isInsideFilter = dropdownRef.current?.contains(target);
      const isInsidePopover = !!target.closest('.filter-popover-content');
      const isMUIDateTimePicker = !!target.closest('.MuiPickersLayout-root')

      if (!isInsideFilter && !isInsidePopover && !isMUIDateTimePicker) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="py-1 hover:bg-gray-100"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {!currentFilter ? <FilterIcon className={` ${isOpen ? "text-[#1D57C7]" : "text-[#889ABC]"} hover:text-[#1D57C7]`} />
          : <FilterDotIcon className={` text-[#1D57C7] hover:text-[#1D57C7]`} />}
      </button>

      {isOpen && (
        <div className="absolute left-[-10px] top-8 mt-1 w-[230px] bg-white border rounded-md shadow-[0px_0px_20px_0px_#C2D1EF] z-50">
          <SimpleBar style={{ maxHeight: "300px" }}>
            <div className="py-2">
              {columnFilterData.map((condition) => (
                <div key={condition.filterCondition}>
                  <div
                    onClick={() => handleConditionSelect(condition.filterCondition)}
                    className={`px-6 py-1.5 cursor-pointer hover:bg-[#F6F8FD] hover:text-[#1D57C7] text-[14px] font-[600]  ${selectedCondition === condition.filterCondition ? "text-[#1D57C7]" : "text-[#81868C]"
                      }`}
                  >
                    {condition.filterCondition}
                  </div>
                  {selectedCondition === condition.filterCondition && condition.inputField?.length > 0 && (
                    <div className="grid px-4 py-2 gap-y-1">
                      {condition.inputRequired && condition.inputField.map((field: InputField, index: number) => (
                        <div key={index}>
                          {field.type === "calendar" && (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                value={inputValues[index] ? new Date(inputValues[index]) : null}
                                onChange={(date) => handleInputChange(index, date)}
                                format="dd/MM/yyyy"
                                slots={{
                                  openPickerIcon: (props) => {
                                    const { ...rest } = props;
                                    return <LuCalendarDays {...rest} className="opacity-50" />;
                                  }
                                }}
                                slotProps={{
                                  textField: {
                                    variant: 'outlined',
                                    placeholder: field.placeholder,
                                    sx: {
                                      width: '100%',
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: '4px',
                                        borderColor: '#ADADAD',
                                        padding: '2px 12px',
                                        fontSize: '13px',
                                        color: inputValues[index] ? '#81868C' : '#ADADAD',
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: '#1D57C7',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                          borderColor: '#1D57C7 !important',
                                          borderWidth: '1px',
                                        },
                                      },
                                      '& .MuiOutlinedInput-input': {
                                        padding: 0,
                                      },
                                    },
                                  },
                                  // Customize the icon properties
                                  openPickerIcon: {
                                    sx: {
                                      color: '#ADADAD',
                                      fontSize: '18px',
                                      '&:hover': {
                                        color: '#1D57C7'
                                      }
                                    }
                                  }
                                }}
                              />
                            </LocalizationProvider>
                          )}
                          {field.type === "datetimeinput" && (
                            <div className="space-y-2">
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                  value={inputValues[index] ? new Date(inputValues[index]) : null}
                                  onChange={(date) => handleInputChange(index, date)}
                                  format="dd/MM/yyyy HH:mm"
                                  ampm={false} // 24-hour format
                                  slots={{
                                    openPickerIcon: (props) => {
                                      const { ...rest } = props;
                                      return <LuCalendarDays {...rest} />;
                                    }
                                  }}
                                  slotProps={{
                                    textField: {
                                      variant: 'outlined',
                                      placeholder: field.placeholder,
                                      sx: {
                                        width: '100%',
                                        '& .MuiOutlinedInput-root': {
                                          borderRadius: '4px',
                                          borderColor: '#ADADAD',
                                          padding: '2px 12px',
                                          fontSize: '13px',
                                          color: inputValues[index] ? '#81868C' : '#ADADAD',
                                          '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1D57C7 !important',
                                          },
                                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#1D57C7 !important',
                                            borderWidth: '1px',
                                          },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                          padding: 0,
                                        },
                                      },
                                    },
                                    openPickerIcon: {
                                      sx: {
                                        color: '#ADADAD',
                                        fontSize: '18px',
                                        '&:hover': {
                                          color: '#1D57C7'
                                        }
                                      }
                                    },
                                  }}
                                />
                              </LocalizationProvider>
                            </div>
                          )}
                          {field.type === "Dropdown" && (
                            <div className="space-y-2">
                              <Select
                                value={inputValues[index] || ""}
                                onValueChange={(value) => handleInputChange(index, value)}
                              >
                                <SelectTrigger className={`w-full rounded-sm h-8 filter-popover-content bg-white text-sm border text-[#81868C]`}>
                                  <SelectValue placeholder={field.placeholder} className={cn(
                                    "filter-popover-content",
                                    !inputValues[index] ? "text-[#ADADAD]" : "text-[#81868C]", // Conditional text color
                                  )}
                                  >
                                    {field.options?.find(option => option.value === inputValues[index])?.label || field.placeholder}
                                  </SelectValue>
                                  <ChevronDown className="h-4 w-4 " />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 bg-white rounded-[4px] shadow-[0px_0px_20px_0px_#C2D1EF]  overflow-y-auto filter-popover-content">
                                  {field.options?.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                      className="text-[#81868C] hover:bg-[#F8F9FC]"
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {field.type === "multiDropdown" && (
                            <div className="space-y-2">
                              <MultiSelectDropdown
                                options={multiDropdownOptions}
                                selectedValues={inputValues[index] || []}
                                onSelect={(values) => handleInputChange(index, values)}
                                placeholder={field.placeholder}
                                height={8}
                                triggerClassName={`w-[200px] bg-white rounded-[4px] font-[400] border ${inputValues[index] ? "text-[#7B8190] text-[13px]" : "text-[#7B8190] text-[13px]"}`}
                                itemClassName="text-[#81868C] text-[14px] font-[400] hover:bg-[#1D57C712]"
                              />
                            </div>
                          )}
                          {field.type === "number" && (
                            <Input
                              type="number"
                              placeholder={field.placeholder}
                              value={inputValues[index] || ""}
                              onChange={(e) => handleInputChange(index, e.target.value)}
                              className={cn(
                                "py-1 w-full rounded-[4px] font-[400] h-8 bg-white text-[14px] border ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D57C7] focus-visible:ring-offset-0 disabled:cursor-not-allowed",
                                inputValues[index] ? "text-[#81868C]" : "text-[#ADADAD]", // Text color
                                "placeholder:text-[#ADADAD]", // Placeholder color
                              )}
                            />
                          )}
                          {field.type === "text" && (

                            <Input
                              type="text"
                              placeholder={field.placeholder}
                              value={inputValues[index] || ""}
                              onChange={(e) => handleInputChange(index, e.target.value)}
                              className={cn(
                                "py-1 w-full rounded-[4px] font-[400] h-8 bg-white text-[14px] border ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D57C7] focus-visible:ring-offset-0 disabled:cursor-not-allowed ",
                                inputValues[index] ? "text-[#81868C]" : "text-[#ADADAD]", // Text color
                                "placeholder:text-[#ADADAD]", // Placeholder color
                              )}
                            />
                          )}
                          {field.type === "timeinput" && (
                            <TimeInput
                              value={inputValues[index] || ""}
                              onChange={(value) => handleInputChange(index, value)}
                              placeholder={field.placeholder || "Select time"}
                              className={cn(
                                "w-full rounded-sm bg-white text-[14px]",
                                inputValues[index] ? "text-[#81868C]" : "text-[#ADADAD]",
                              )}
                            />
                          )}
                        </div>
                      ))}
                      {selectedCondition === "Is Between" && (columnType === "Date" || columnType === "DateTime") && inputValues[0] && inputValues[1] && (
                        new Date(inputValues[0]) >= new Date(inputValues[1]) && (
                          <div className="text-red-500 text-sm mt-1">
                            End date must be after start date
                          </div>
                        )
                      )}
                      {(selectedCondition === "Is Between" || selectedCondition === "Between") && (columnType === "Time" || columnType === "Number") && inputValues[0] && inputValues[1] && (
                        inputValues[0] >= inputValues[1] && (
                          <div className="text-red-500 text-sm mt-1">
                            End Value must be after Start Value
                          </div>
                        )
                      )}
                      {selectedCondition === "Between" && columnType === "Number" && inputValues[0] && inputValues[1] && (
                        isNaN(inputValues[0]) || isNaN(inputValues[1]) || Number(inputValues[0]) >= Number(inputValues[1]) && (
                          <div className="text-red-500 text-sm mt-1">
                            End Value must be greater than Start Value
                          </div>
                        )
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {condition.inputRequired && (
                          <button
                            className={`w-full mt-2 px-2 py-1 rounded ${isApplyDisabled()
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                              }`}
                            onClick={handleSubmit}
                            disabled={isApplyDisabled()}
                          >
                            Apply
                          </button>
                        )}
                        {currentFilter && (
                          <button
                            className="w-full mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            onClick={handleClearFilter}
                          >
                            Clear Filter
                          </button>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          </SimpleBar>
        </div>
      )}
    </div>
  );
}