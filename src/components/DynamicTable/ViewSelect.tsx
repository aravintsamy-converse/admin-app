"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PinIcon } from "../client/icons/dynamicForm/AllDynamicFormIcons";
import type { TableMetadata } from "@/Types/Table/tableTypes";

interface ViewSelectProps {
  metadata: TableMetadata;
  onViewChange: (view: string) => Promise<void>;
  initialView?: string;
}

export function ViewSelect({ metadata, onViewChange, initialView = "" }: ViewSelectProps) {
  const [selectedView, setSelectedView] = useState(initialView);
  console.log("🚀 ~ ViewSelect ~ selectedView:", selectedView)
  const [open, setOpen] = useState(false);

  const handleViewChange = async (value: string) => {
    setSelectedView(value);
    await onViewChange(value);
  };

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      value={selectedView || ""}
      onValueChange={handleViewChange}
    >
      <SelectTrigger
        className={`${
          open ? "!underline decoration-[2px] decoration-selectsecondaryforeground !underline-offset-4" : ""
        } bg-transparent focus:ring-0 uppercase w-[160px] md:w-[182px] no-underline shadow-none hover:underline decoration-[2px] hover:decoration-[2px] hover:decoration-selectsecondaryforeground hover:underline-offset-4 focus-visible:ring-0 font-[700] border-0 ${
          selectedView ? "text-selectsecondaryforeground text-[18px]" : "text-selectsecondaryforeground text-[18px]"
        }`}
      >
        <SelectValue placeholder="Role Type" />
        <ChevronDown className="h-3.5 w-3.5 mb-[1px] text-[#889ABC]" />
      </SelectTrigger>
      <SelectContent className="w-[295px] left-3 top-[-2px] border-0 rounded-[2px] bg-background shadow-custom">
        {metadata.views.options.map((option) => (
          <div
            key={option.value}
            className="group flex w-full items-center justify-between px-2 rounded-[4px] cursor-pointer hover:bg-accent"
          >
            <SelectItem
              value={option.value}
              className="text-foreground text-[14px] font-[400] w-full group-hover:text-primary focus:bg-transparent focus:font-[400]"
            >
              <div className="w-full">{option.label}</div>
            </SelectItem>
            <div
              onClick={() => setOpen(true)}
              className={`transition-opacity hover:text-primary ${
                selectedView === String(option.value) ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-100 text-infoIcon"
              }`}
            >
              <PinIcon />
            </div>
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}