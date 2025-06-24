"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/table-ui/input";
import { FaLock, FaUnlock } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { GrDocumentUser } from "react-icons/gr";
import { MultiSelectDropdown } from "@/components/table-ui/multi-select-dropdown";
import { FilterRendererProps, IconProps } from "@/types/table/table.type";
import { MappedDropdown } from "./quick-filters/mapped-dropdown";

const iconMap: Record<string, React.ComponentType<IconProps>> = {
  FaLock: FaLock,
  FaUnlock: FaUnlock,
  RiUserSettingsLine: RiUserSettingsLine,
  GrDocumentUser: GrDocumentUser,
};

export function FilterRenderer({ filter, fieldName, filterValues, onFilterChange }: FilterRendererProps) {
  
   const handleSearch = (column: string, query: string) => {
    console.log(`Searching in column: ${column}, query: ${query}`)
  }

  if (filter.filter_type === "Search") {
    return (
      <div className="relative w-full">
        <Search className="absolute left-[15px] top-1/2 transform -translate-y-1/2 text-[#778294]" size={14} />
        <Input
          type="text"
          placeholder={filter.placeholder}
          value={filterValues[fieldName] || ""}
          onChange={(e) => onFilterChange(filter.field_name || "", e.target.value)}
          className="pl-10 h-[34px] font-[500] rounded-[5px] text-[14px] bg-[#F6F7FB] border text-[#778294] placeholder:[#778294] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-[#1D57C7] focus-visible:ring-offset-0"
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
      <MultiSelectDropdown
        options={filter.options || []}
        selectedValues={filterValues[fieldName] ? filterValues[fieldName].split(",") : []}
        onSelect={(values) => onFilterChange(filter.field_name || "", values.join(","))}
        placeholder={filter.placeholder}
        height={10}
        triggerClassName={`w-full bg-white rounded-[5px] h-[34px] font-[600] border ${filterValues[fieldName] ? "text-[#7B8190] text-[15px]" : "text-[#7B8190] text-[13px]"}`}
        itemClassName="text-[#81868C] text-[15px] font-[600] hover:bg-[#F8F9FC]"
        iconMap={iconMap}
      />
    );
  } else if (filter.filter_type === "MappedSearch") {
    return (
        <MappedDropdown
           columns={filter.options || []}
           placeholder={filter.placeholder}
           onSearch={handleSearch}
           className="w-full 2xl:w-[350px] bg-transparent rounded-[5px] h-[35px] font-[400] border text-[14px]"
        />
    );
  }
  return null;
}