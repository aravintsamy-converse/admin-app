"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/TableUI/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { GrDocumentUser } from "react-icons/gr";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format, isValid } from "date-fns";
import { LuCalendarDays } from "react-icons/lu";
import { MultiSelectDropdown } from "@/components/TableUI/multiSelectDropdown";
import { FilterRendererProps, IconProps } from "@/Types/Table/tableTypes";

const iconMap: Record<string, React.ComponentType<IconProps>> = {
  FaLock: FaLock,
  FaUnlock: FaUnlock,
  RiUserSettingsLine: RiUserSettingsLine,
  GrDocumentUser: GrDocumentUser,
};

export function FilterRenderer({ filter, fieldName, inputFields, filterValues, onFilterChange }: FilterRendererProps) {
  if (filter.filter_type === "String") {
    const inputField = inputFields[0];
    return (
      <div className="relative w-full">
        <Search className="absolute left-[15px] top-1/2 transform -translate-y-1/2 text-[#778294]" size={14} />
        <Input
          type="text"
          placeholder={inputField.placeholder}
          value={filterValues[fieldName] || ""}
          onChange={(e) => onFilterChange(fieldName, e.target.value)}
          className="pl-10 py-2.5 h-10 font-[500] rounded-[8px] text-[13px] bg-[#F6F7FB] border-0 text-[#778294] placeholder:[#778294] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-[#1D57C7] focus-visible:ring-offset-0"
        />
      </div>
    );
  } else if (filter.filter_type === "Number") {
    const inputField = inputFields[0];
    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#778294]" size={14} />
        <Input
          type="number"
          placeholder={inputField.placeholder}
          value={filterValues[fieldName] || ""}
          onChange={(e) => onFilterChange(fieldName, e.target.value)}
          className="pl-10 py-2.5 font-[500] rounded-[8px] text-[13px] bg-[#F6F7FB] border-0 text-[#778294] placeholder:[#778294] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-[#1D57C7] focus-visible:ring-offset-0"
        />
      </div>
    );
  } else if (filter.filter_type === "Dropdown" && filter.type === "single") {
    const inputField = inputFields[0];
    return (
      <Select
        value={filterValues[fieldName] || ""}
        onValueChange={(value) => onFilterChange(fieldName, value)}
      >
        <SelectTrigger
          className={`w-full bg-white  rounded-[8px] font-[600] border ${filterValues[fieldName] ? "text-[#7B8190] text-[15px]" : "text-[#7B8190] text-[13px]"}`}
        >
          <SelectValue placeholder={inputField.placeholder} />
          <ChevronDown className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent className="w-[var(--radix-select-trigger-width)] border-0 p-0 filter-popover-content shadow-[0px_0px_10px_0px_#1D57C733]">
          {inputField?.options?.map((option: any) => {
            const IconComponent = option.icon ? iconMap[option.icon] : null;
            const iconClassName = `h-4 w-4 hover:text-[#81868C]`;
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-[#81868C] text-[15px] font-[600] hover:bg-[#F8F9FC]"
              >
                <div className="flex items-center gap-2">
                  {IconComponent && (
                    <IconComponent style={{ color: option.color }} className={iconClassName} />
                  )}
                  {option.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  } else if (filter.filter_type === "Dropdown" && filter.type === "multi") {
    const inputField = inputFields[0];
    return (
      <MultiSelectDropdown
        options={inputField.options || []}
        selectedValues={filterValues[fieldName] ? filterValues[fieldName].split(",") : []}
        onSelect={(values) => onFilterChange(fieldName, values.join(","))}
        placeholder={inputField.placeholder}
        height={10}
        triggerClassName={`w-full bg-white rounded-[8px] font-[600] border ${filterValues[fieldName] ? "text-[#7B8190] text-[15px]" : "text-[#7B8190] text-[13px]"}`}
        itemClassName="text-[#81868C] text-[15px] font-[600] hover:bg-[#F8F9FC]"
        iconMap={iconMap}
      />
    );
  } else if (filter.filter_type === "Date") {
    const inputField = inputFields[0];
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={filterValues[fieldName] ? new Date(filterValues[fieldName]) : null}
          onChange={(date) => {
            if (date && isValid(date)) {
              onFilterChange(fieldName, format(date, "yyyy-MM-dd"));
            } else {
              onFilterChange(fieldName, "");
            }
          }}
          format="dd/MM/yyyy"
          slots={{ openPickerIcon: (props) => <LuCalendarDays {...props} className="opacity-50" /> }}
          desktopModeMediaQuery="@media (min-width: 640px)"
          slotProps={{
            textField: {
              variant: "outlined",
              placeholder: inputField.placeholder,
              sx: {
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  borderColor: "#ADADAD",
                  padding: "6px 12px",
                  fontSize: "14px",
                  color: filterValues[fieldName] ? "#81868C" : "#ADADAD",
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1D57C7" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1D57C7 !important",
                    borderWidth: "1px",
                  },
                },
                "& .MuiOutlinedInput-input": { padding: 0 },
              },
            },
            openPickerIcon: { sx: { color: "#ADADAD", fontSize: "18px", "&:hover": { color: "#1D57C7" } } },
          }}
        />
      </LocalizationProvider>
    );
  } else if (filter.filter_type === "DateRange") {
    const [fromField, toField] = inputFields;
    const fromKey = `${fieldName}_from`;
    const toKey = `${fieldName}_to`;
    const fromDate = filterValues[fromKey] ? new Date(filterValues[fromKey]) : null;
    const toDate = filterValues[toKey] ? new Date(filterValues[toKey]) : null;
    const isValidRange = !fromDate || !toDate || fromDate <= toDate;

    return (
      <div className="relative grid grid-cols-2 gap-2">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={fromDate}
            onChange={(date) => {
              if (date && isValid(date)) {
                onFilterChange(fromKey, format(date, "yyyy-MM-dd"));
              } else {
                onFilterChange(fromKey, "");
              }
            }}
            format="dd/MM/yyyy"
            slots={{ openPickerIcon: (props) => <LuCalendarDays {...props} className="opacity-50" /> }}
            desktopModeMediaQuery="@media (min-width: 640px)"
            slotProps={{
              textField: {
                variant: "outlined",
                placeholder: fromField.placeholder,
                sx: {
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: !isValidRange ? "#F04438" : "#ADADAD",
                    padding: "6px 12px",
                    fontSize: "14px",
                    color: filterValues[fromKey] ? "#81868C" : "#ADADAD",
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1D57C7" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1D57C7 !important",
                      borderWidth: "1px",
                    },
                  },
                  "& .MuiOutlinedInput-input": { padding: 0 },
                },
              },
              openPickerIcon: { sx: { color: "#ADADAD", fontSize: "18px", "&:hover": { color: "#1D57C7" } } },
            }}
          />
          <DatePicker
            value={toDate}
            onChange={(date) => {
              if (date && isValid(date)) {
                onFilterChange(toKey, format(date, "yyyy-MM-dd"));
              } else {
                onFilterChange(toKey, "");
              }
            }}
            format="dd/MM/yyyy"
            slots={{ openPickerIcon: (props) => <LuCalendarDays {...props} className="opacity-50" /> }}
            desktopModeMediaQuery="@media (min-width: 640px)"
            slotProps={{
              textField: {
                variant: "outlined",
                placeholder: toField.placeholder,
                sx: {
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: !isValidRange ? "#F04438" : "#ADADAD",
                    padding: "6px 12px",
                    fontSize: "14px",
                    color: filterValues[toKey] ? "#81868C" : "#ADADAD",
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1D57C7" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1D57C7 !important",
                      borderWidth: "1px",
                    },
                  },
                  "& .MuiOutlinedInput-input": { padding: 0 },
                },
              },
              openPickerIcon: { sx: { color: "#ADADAD", fontSize: "18px", "&:hover": { color: "#1D57C7" } } },
            }}
          />
        </LocalizationProvider>
        {!isValidRange && <div className="absolute col-span-2 top-8 md:top-10 text-red-500 text-sm">To date must be after From date</div>}
      </div>
    );
  } else if (filter.filter_type === "DateTime") {
    const inputField = inputFields[0];
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          value={filterValues[fieldName] ? new Date(filterValues[fieldName]) : null}
          onChange={(date) => {
            if (date && isValid(date)) {
              onFilterChange(fieldName, format(date, "yyyy-MM-dd'T'HH:mm:ss"));
            } else {
              onFilterChange(fieldName, "");
            }
          }}
          format="dd/MM/yyyy HH:mm"
          ampm={false}
          slots={{ openPickerIcon: (props) => <LuCalendarDays {...props} className="opacity-50" /> }}
          desktopModeMediaQuery="@media (min-width: 640px)"
          slotProps={{
            textField: {
              variant: "outlined",
              placeholder: inputField.placeholder,
              sx: {
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  borderColor: "#ADADAD",
                  padding: "6px 12px",
                  fontSize: "14px",
                  color: filterValues[fieldName] ? "#81868C" : "#ADADAD",
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1D57C7" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1D57C7 !important",
                    borderWidth: "1px",
                  },
                },
                "& .MuiOutlinedInput-input": { padding: 0 },
              },
            },
            openPickerIcon: { sx: { color: "#ADADAD", fontSize: "18px", "&:hover": { color: "#1D57C7" } } },
          }}
        />
      </LocalizationProvider>
    );
  } else if (filter.filter_type === "DateTimeRange") {
    const [fromField, toField] = inputFields;
    const fromKey = `${fieldName}_from`;
    const toKey = `${fieldName}_to`;
    const fromDate = filterValues[fromKey] ? new Date(filterValues[fromKey]) : null;
    const toDate = filterValues[toKey] ? new Date(filterValues[toKey]) : null;
    const isValidRange = !fromDate || !toDate || fromDate <= toDate;

    return (
      <div className="grid grid-cols-2 gap-2 relative">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            value={fromDate}
            onChange={(date) => {
              if (date && isValid(date)) {
                onFilterChange(fromKey, format(date, "yyyy-MM-dd'T'HH:mm:ss"));
              } else {
                onFilterChange(fromKey, "");
              }
            }}
            format="dd/MM/yyyy HH:mm"
            ampm={false}
            desktopModeMediaQuery="@media (min-width: 640px)"
            slots={{ openPickerIcon: (props) => <LuCalendarDays {...props} className="opacity-50" /> }}
            slotProps={{
              textField: {
                variant: "outlined",
                placeholder: fromField.placeholder,
                sx: {
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: !isValidRange ? "#F04438" : "#ADADAD",
                    padding: "6px 12px",
                    fontSize: "14px",
                    color: filterValues[fromKey] ? "#81868C" : "#ADADAD",
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1D57C7" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1D57C7 !important",
                      borderWidth: "1px",
                    },
                  },
                  "& .MuiOutlinedInput-input": { padding: 0 },
                },
              },
              openPickerIcon: { sx: { color: "#ADADAD", fontSize: "18px", "&:hover": { color: "#1D57C7" } } },
            }}
          />
          <DateTimePicker
            value={toDate}
            onChange={(date) => {
              if (date && isValid(date)) {
                onFilterChange(toKey, format(date, "yyyy-MM-dd'T'HH:mm:ss"));
              } else {
                onFilterChange(toKey, "");
              }
            }}
            format="dd/MM/yyyy HH:mm"
            ampm={false}
            desktopModeMediaQuery="@media (min-width: 640px)"
            slots={{ openPickerIcon: (props) => <LuCalendarDays {...props} className="opacity-50" /> }}
            slotProps={{
              textField: {
                variant: "outlined",
                placeholder: toField.placeholder,
                sx: {
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: !isValidRange ? "#F04438" : "#ADADAD",
                    padding: "6px 12px",
                    fontSize: "14px",
                    color: filterValues[toKey] ? "#81868C" : "#ADADAD",
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1D57C7" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1D57C7 !important",
                      borderWidth: "1px",
                    },
                  },
                  "& .MuiOutlinedInput-input": { padding: 0 },
                },
              },
              openPickerIcon: { sx: { color: "#ADADAD", fontSize: "18px", "&:hover": { color: "#1D57C7" } } },
            }}
          />
        </LocalizationProvider>
        {!isValidRange && <div className="md:absolute col-span-2 top-10 text-red-500 text-sm">To date must be after From date</div>}
      </div>
    );
  }
  return null;
}