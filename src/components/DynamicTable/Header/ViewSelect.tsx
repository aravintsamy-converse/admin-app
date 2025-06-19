"use client";

import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tootipWrapper';
import { TruncateTooltip } from "@/components/DynamicTable/TruncateTooltip";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { PinIcon } from "@/components/client/icons/dynamicForm/AllDynamicFormIcons";
import { ViewSelectProps } from "@/Types/Table/TableHeader/viewSelect";

export function ViewSelect({
  viewOptions,
  selectedView,
  onSelectedViewChange,
  defaultView,
  onDefaultViewChange,
  open,
  onOpenChange,
}: ViewSelectProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDefaultView, setPendingDefaultView] = useState<string | null>(null);

  const handleViewChange = async (value: string) => {
    onSelectedViewChange(value);
  };

  const handlePinChange = async (value: string) => {
    if (defaultView === value) return;
    
    setPendingDefaultView(value);
    setDialogOpen(true);
  };

  const handleConfirmDefault = () => {
    if (pendingDefaultView) {
      onDefaultViewChange(pendingDefaultView);
    }
    setDialogOpen(false);
    setPendingDefaultView(null);
  };

  const handleCancelDefault = () => {
    setDialogOpen(false);
    setPendingDefaultView(null);
  };

  const selectedViewLabel =
    viewOptions.find(option => option.value === selectedView)?.label;

  const pendingViewLabel =
    viewOptions.find(option => option.value === pendingDefaultView)?.label;

  return (
    <TooltipProvider>
      <div className="inline-block">
        <Select
          open={open}
          onOpenChange={onOpenChange}
          value={selectedView}
          onValueChange={handleViewChange}
        >
          <SelectTrigger
            className={`${open ? "!underline decoration-[2px] decoration-selectsecondaryforeground !underline-offset-4" : ""}
             bg-transparent focus:ring-0 uppercase w-[160px] md:w-[180px] shadow-none border-0 font-[700]
             text-selectsecondaryforeground text-[14px] md:text-[18px] overflow-hidden whitespace-nowrap truncate
             hover:underline hover:decoration-[2px] hover:decoration-selectsecondaryforeground hover:underline-offset-4
             focus-visible:ring-0 flex items-center justify-between`}
          >
            <div className="flex flex-1 justify-center items-center text-start text-selectsecondaryforeground pl-[1px]">
              <TruncateTooltip
                text={selectedViewLabel || "Select a view"}
                className="text-start w-[120px] md:min-w-[143px] md:max-w-[150px] text-nowrap truncate"
              />
            </div>
            <span>
              <ChevronDown className="h-3.5 w-3.5 text-[#889ABC]" />
            </span>
          </SelectTrigger>
          <SelectContent className="min-w-[160px] max-w-[280px] md:min-w-[295px] md:max-w-[395px] left-3 top-[-2px] border-0 rounded-[2px] bg-background shadow-viewboxshadow">
            {viewOptions?.sort((a, b) => a.order - b.order).map((option) => (
              <div
                key={option.value}
                className={`group flex w-full items-center justify-between pl-2 pr-3.5 rounded-[4px] cursor-pointer ${selectedView === String(option.value)
                  ? "hover:bg-transparent"
                  : "hover:bg-accent"
                  }`}
              >
                <SelectItem
                  value={option.value}
                  className={`${selectedView === (option.value)
                    ? "text-primary"
                    : "text-accent-foreground"
                    } text-[14px] font-[400] w-full py-[3px] group-hover:text-primary  text-nowrap truncate focus:bg-transparent focus:font-[400]`}
                >
                  <TruncateTooltip text={option.label} className={`${selectedView === (option.value)
                    ? "text-primary"
                    : "text-accent-foreground"
                    } w-[180px]  md:min-w-[150px] md:max-w-[250px] text-start`} />
                </SelectItem>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      data-testid={`pin-icon-${option.value}`} onClick={() => handlePinChange(String(option.value))}
                      className={`transition-opacity hover:text-primary ml-8 ${defaultView === String(option.value)
                        ? "opacity-100 text-primary"
                        : "opacity-0 group-hover:opacity-100 text-infoIcon"
                        }`}
                    >
                      <PinIcon/>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {defaultView === String(option.value)
                        ? "Default List"
                        : "Set as Default"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
        <DialogContent className=" max-w-[620px]  px-[36px] pt-[17px] pb-[20px] !rounded-[12px] bg-background !shadow-none">
          <DialogHeader className="text-center">
            <DialogTitle className="!text-[18px] font-[600] text-primary leading-[21.6px] tracking-[0]">Default List Change</DialogTitle>
            <div className="flex items-center gap-x-5 pt-[9px] pl-[1px]">
              <Image
                src="/Default.svg"
                alt="Default List Change"
                width={39}
                height={39}
              />
              <div className="text-[16px] font-[500] text-popover-foreground leading-[21.6px] tracking-[0]">
                Do you really want to change your default list to <br />“{pendingViewLabel}”?
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="pt-[5px] pr-[1px]">
            <Button variant="outline" className="border-0 leading-[21.6px] tracking-[0] focus-visible:outline-none text-[14px] font-[500] rounded-[4px] focus-visible:ring-0  shadow-none hover:bg-transparent  text-primary hover:text-primary hover:font-[600]" onClick={handleCancelDefault}>
              Cancel
            </Button>
            <Button  onClick={handleConfirmDefault} className=" flex items-center justify-center  leading-[21.6px] tracking-[0] text-[14px] font-[500] rounded-[4px] w-[119px] h-[36px] hover:text-primary border hover:bg-background hover:border-primary shadow-none ">
              Set Default
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}