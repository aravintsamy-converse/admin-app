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

export function FilterRenderer({ filter, fieldName, filterValues, onFilterChange }: FilterRendererProps) {
  if (filter.filter_type === "Search") {
    return (
      <div className="relative w-full">
        <Search className="absolute left-[15px] top-1/2 transform -translate-y-1/2 text-[#778294]" size={14} />
        <Input
          type="text"
          placeholder={filter.placeholder}
          value={filterValues[fieldName] || ""}
          onChange={(e) => onFilterChange(filter.field_name || "" , e.target.value)}
          className="pl-10 py-2.5 h-10 font-[500] rounded-[8px] text-[13px] bg-[#F6F7FB] border-0 text-[#778294] placeholder:[#778294] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-[#1D57C7] focus-visible:ring-offset-0"
        />
      </div>
    );
  } else if (filter.filter_type === "Number") {
    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#778294]" size={14} />
        <Input
          type="number"
          placeholder={filter.placeholder}
          value={filterValues[fieldName] || ""}
          onChange={(e) => onFilterChange(filter.field_name || "", e.target.value)}
          className="pl-10 py-2.5 font-[500] rounded-[8px] text-[13px] bg-[#F6F7FB] border-0 text-[#778294] placeholder:[#778294] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-[#1D57C7] focus-visible:ring-offset-0"
        />
      </div>
    );
  } else if (filter.filter_type === "Dropdown") {
    return (
      <Select
        value={filterValues[fieldName] || ""}
        onValueChange={(value) => onFilterChange(filter.field_name || "", value)}
      >
        <SelectTrigger
          className={`w-full bg-white  rounded-[8px] font-[600] border ${filterValues[fieldName] ? "text-[#7B8190] text-[15px]" : "text-[#7B8190] text-[13px]"}`}
        >
          <SelectValue placeholder={filter.placeholder} />
          <ChevronDown className="h-4 w-4" />
        </SelectTrigger>
        <SelectContent className="w-[var(--radix-select-trigger-width)] border-0 p-0 filter-popover-content shadow-[0px_0px_10px_0px_#1D57C733]">
          {filter?.options?.map((option: any) => {
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
  } else if (filter.filter_type === "Dropdown") {
    return (
      <MultiSelectDropdown
        options={filter.options || []}
        selectedValues={filterValues[fieldName] ? filterValues[fieldName].split(",") : []}
        onSelect={(values) => onFilterChange(filter.field_name || "", values.join(","))}
        placeholder={filter.placeholder}
        height={10}
        triggerClassName={`w-full bg-white rounded-[8px] font-[600] border ${filterValues[fieldName] ? "text-[#7B8190] text-[15px]" : "text-[#7B8190] text-[13px]"}`}
        itemClassName="text-[#81868C] text-[15px] font-[600] hover:bg-[#F8F9FC]"
        iconMap={iconMap}
      />
    );
  } 
  return null;
}