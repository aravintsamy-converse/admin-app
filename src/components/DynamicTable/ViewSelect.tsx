"use client";

import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PinIcon } from "../client/icons/dynamicForm/AllDynamicFormIcons";
import type { TableMetadata } from "@/Types/Table/tableTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tootipWrapper'

interface ViewSelectProps {
  metadata: TableMetadata;
  selectedView: string;
  onSelectedViewChange: (view: string) => void;
  defaultView: string;
  onDefaultViewChange: (view: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewSelect({ metadata, selectedView, onSelectedViewChange, defaultView, onDefaultViewChange, open, onOpenChange }: ViewSelectProps) {

  const handleViewChange = async (value: string) => {
    onSelectedViewChange(value);
  };

  const handlePinChange = async (value: string) => {
    onOpenChange(true);
    onDefaultViewChange(value);
  };

  // Find the label for the selected view
  const selectedViewLabel = metadata.views.options.find(option => option.value === selectedView)?.label || selectedView;

  return (
    <TooltipProvider>
      <div className="inline-block">
        <Select
          open={open}
          onOpenChange={onOpenChange}
          value={selectedView || ""}
          onValueChange={handleViewChange}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger
                className={`${open ? "!underline decoration-[2px] decoration-selectsecondaryforeground !underline-offset-4" : ""
                  } bg-transparent focus:ring-0 uppercase w-[160px] md:w-[182px] shadow-none border-0 font-[700] text-selectsecondaryforeground text-[14px] md:text-[18px] overflow-hidden whitespace-nowrap truncate
                hover:underline hover:decoration-[2px]  hover:decoration-selectsecondaryforeground hover:underline-offset-4
                focus-visible:ring-0`}
              >
                <SelectValue className="w-[50px] overflow-hidden whitespace-nowrap truncate text-selectsecondaryforeground" placeholder="Role Type" />
                <ChevronDown className="h-3.5 w-3.5 mb-[1px] text-[#889ABC]" />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{selectedViewLabel}</p>
            </TooltipContent>
          </Tooltip>

          <SelectContent className="min-w-[160px] max-w-[280px] md:min-w-[295px] md:max-w-[395px] left-3 top-[-2px] border-0 rounded-[2px] bg-background shadow-custom">
            {metadata.views.options.map((option) => (
              <div
                key={option.value}
                className={`group flex w-full items-center justify-between px-2 rounded-[4px] cursor-pointer ${selectedView === String(option.value) ? "hover:bg-transparent" : "hover:bg-accent"}`}
              >
                <SelectItem
                  value={option.value}
                  className={`${selectedView === String(option.value) ? "text-primary" : "text-foreground"}  text-[14px]  font-[400] w-full group-hover:text-primary text-nowrap truncate focus:bg-transparent focus:font-[400]`}
                >
                  <div className="w-full">{option.label}</div>
                </SelectItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => handlePinChange(String(option.value))}
                      className={`transition-opacity hover:text-primary ml-8 ${defaultView === String(option.value) ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-100 text-infoIcon"
                        }`}
                    >
                      <PinIcon />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{defaultView === String(option.value) ? "Default List" : "Set as Default"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
    </TooltipProvider>
  );
}