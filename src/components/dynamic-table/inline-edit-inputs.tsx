"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/table-ui/input";
import { Switch } from "@/components/table-ui/switch";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { format, isValid } from "date-fns";
import { LuCalendarDays, LuCheck, LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { MultiSelectDropdown } from "@/components/table-ui/multi-select-dropdown";
import { InlineEditInputProps, EditState } from "@/types/table/table.type";
import { useEffect, useState } from "react";

export const InlineEditInput = ({
  columnType,
  type,
  value,
  editState,
  onSubmit,
  onClose,
  options = [],
}: InlineEditInputProps) => {
  const [currentEditState, setCurrentEditState] = useState<EditState>({
    rowId: editState.rowId,
    columnName: editState.columnName,
    value: value,
  });

  // Initialize currentEditState based on value prop
  useEffect(() => {
    setCurrentEditState({
      rowId: editState.rowId,
      columnName: editState.columnName,
      value: value,
    });
  }, [value, editState.rowId, editState.columnName]);

  const handleChange = (newValue: string | string[]) => {
    setCurrentEditState((prev) => ({
      ...prev,
      value: newValue,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    let newValue: string;
    if (date && isValid(date)) {
      newValue = format(date, columnType === "Date" ? "yyyy-MM-dd" : "yyyy-MM-dd'T'HH:mm:ss");
    } else {
      newValue = "";
    }
    setCurrentEditState((prev) => ({
      ...prev,
      value: newValue,
    }));
  };

  const handleSubmit = () => {
    onSubmit(currentEditState);
  };

  const renderInput = () => {
    switch (columnType) {
      case "String":
      case "Number":
        return (
          <Input
            type={columnType === "Number" ? "number" : "text"}
            value={typeof currentEditState.value === "string" ? currentEditState.value : ""}
            onChange={(e) => handleChange(e.target.value)}
            autoFocus
            className={cn(
              "py-1 w-full rounded-[4px] h-8 bg-white px-2 text-[14px] border ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D57C7] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              "placeholder:text-[#ADADAD]"
            )}
          />
        );

      case "Dropdown":
        if (type === "single") {
          return (
            <Select
              value={typeof currentEditState.value === "string" ? currentEditState.value : ""}
              onValueChange={(newValue) => handleChange(newValue)}
            >
              <SelectTrigger
                className={cn(
                  "w-full h-8 bg-white text-[14px] border rounded-[4px] focus:ring-1 focus:ring-[#1D57C7] focus:border-[#1D57C7]",
                  currentEditState.value ? "text-[#81868C]" : "text-[#ADADAD]"
                )}
              >
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        } else if (type === "multi") {
          const selectedValues = Array.isArray(currentEditState.value)
            ? currentEditState.value
            : typeof currentEditState.value === "string" && currentEditState.value
              ? currentEditState.value.split(",").filter(Boolean)
              : [];
          return (
            <MultiSelectDropdown
              options={options}
              selectedValues={selectedValues}
              onSelect={(selected) => handleChange(selected)}
              placeholder="Select options..."
              height={8}
              triggerClassName={cn(
                "w-full max-w-[200px] h-8 bg-white rounded-[4px] font-[400] border",
                selectedValues.length ? "text-[#81868C] text-[13px]" : "text-[#ADADAD] text-[13px]"
              )}
              itemClassName="text-[#81868C] text-[14px] font-[400] hover:bg-[#1D57C712]"
            />
          );
        }
        return null;

      case "Date":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={
                typeof currentEditState.value === "string" && currentEditState.value
                  ? new Date(currentEditState.value)
                  : null
              }
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              slots={{
                openPickerIcon: (props) => <LuCalendarDays {...props} className="opacity-50" />,
              }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  placeholder: "Select date",
                  sx: {
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                      borderColor: "#ADADAD",
                      padding: "0px 12px",
                      fontSize: "14px",
                      color: currentEditState.value ? "#81868C" : "#ADADAD",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1D57C7",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1D57C7 !important",
                        borderWidth: "1px",
                      },
                      "& .MuiInputBase-input": {
                        padding: "8px 0px",
                      },
                    },
                  },
                  onKeyDown: (e) => e.stopPropagation(),
                },
              }}
            />
          </LocalizationProvider>
        );

      case "DateTime":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={
                typeof currentEditState.value === "string" && currentEditState.value
                  ? new Date(currentEditState.value)
                  : null
              }
              onChange={handleDateChange}
              format="dd/MM/yyyy HH:mm"
              ampm={false}
              closeOnSelect={false}
              slots={{
                openPickerIcon: (props) => <LuCalendarDays {...props} className="opacity-50" />,
              }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  placeholder: "Select date and time",
                  sx: {
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "14px",
                      color: currentEditState.value ? "#81868C" : "#ADADAD",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1D57C7",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1D57C7 !important",
                        borderWidth: "1px",
                      },
                      "& .MuiInputBase-input": {
                        padding: "0",
                      },
                    },
                  },
                  onKeyDown: (e) => e.stopPropagation(),
                },
              }}
            />
          </LocalizationProvider>
        );

      case "Boolean":
        return (
          <Switch
            checked={currentEditState.value === "true"}
            onCheckedChange={(checked) => handleChange(checked ? "true" : "false")}
          />
        );

      default:
        return (
          <Input
            type="text"
            value={typeof currentEditState.value === "string" ? currentEditState.value : ""}
            onChange={(e) => handleChange(e.target.value)}
            autoFocus
            className={cn(
              "py-1 w-full rounded-[4px] h-8 bg-white text-[14px] border ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1D57C7] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              "placeholder:text-[#ADADAD]"
            )}
          />
        );
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <div className="w-full">{renderInput()}</div>
      <div className="absolute top-8 right-2 flex items-center gap-1">
        <button
          onClick={handleSubmit}
          className="px-1 py-1 text-[12px] text-white bg-[#1D57C7] rounded hover:bg-[#1D57C7]/80"
          aria-label="Submit"
        >
          <LuCheck className="h-3 w-3" />
        </button>
        <button
          onClick={onClose}
          className="px-1 py-1 text-[12px] text-white bg-[#F04438] rounded hover:bg-[#F04438]/80"
          aria-label="Close"
        >
          <LuX className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};