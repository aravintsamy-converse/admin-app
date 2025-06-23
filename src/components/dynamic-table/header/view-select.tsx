"use client";

import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tootip-wrapper';
import { TruncateTooltip } from "@/components/dynamic-table/truncate-tooltip";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { PinIcon } from "@/components/client/icons/dynamicForm/AllDynamicFormIcons";
import { ViewSelectProps } from "@/types/table/table-header/view-select.type";
import { ProfileCloseIcon } from "@/components/client/icons/general";

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
             bg-transparent focus:ring-0 uppercase w-[140px] md:w-[180px] shadow-none border-0 font-[700]
             text-selectsecondaryforeground text-[14px] md:text-[18px] overflow-hidden whitespace-nowrap truncate
             hover:underline hover:decoration-[2px] hover:decoration-selectsecondaryforeground hover:underline-offset-4
             focus-visible:ring-0 flex items-center justify-between`}
          >
            <div className="flex flex-1 w-full  text-start text-selectsecondaryforeground pl-[1px]">
              <TruncateTooltip
                text={selectedViewLabel || "Select a view"}
                className="text-start w-[100px] md:min-w-[143px] md:max-w-[150px] text-nowrap truncate"
              />
            </div>
            <span>
              <ChevronDown className="h-3.5 w-3.5 text-[#889ABC]" />
            </span>
          </SelectTrigger>
          <SelectContent className="min-w-[160px] max-w-[240px] md:min-w-[295px] md:max-w-[395px] left-3 top-[-2px] border-0 rounded-[2px] bg-background shadow-viewboxshadow">
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
                      <PinIcon />
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
        <DialogContent className=" max-w-[620px]  px-[36px] pt-[16px] pb-[19px] !rounded-[12px] bg-background !shadow-none">
          <DialogClose className="absolute group right-[19px] top-[20px] focus-visible:outline-none">
            <ProfileCloseIcon />
          </DialogClose>
          <DialogHeader className="text-center">
            <DialogTitle className="!text-[18px] font-[600] text-primary leading-[21.6px] tracking-[0]">Default List Change</DialogTitle>
            <div className="flex items-center gap-x-5 pt-[9px] pl-[1px]">
              <Image
                src="/Default.svg"
                alt="Default List Change"
                width={39}
                height={39}
              />
              <div className="text-[16px] font-[500] text-popover-foreground !leading-[21.6px] tracking-[0]">
                Do you really want to change your default list to <br />“{pendingViewLabel}”?
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="pt-[6px] pr-[2px]">
            <Button variant="outline" className="border-0 pt-[7px] leading-[21.6px] tracking-[0] focus-visible:outline-none text-[14px] font-[500] rounded-[4px] focus-visible:ring-0  shadow-none hover:bg-transparent  text-primary hover:text-primary hover:font-[600]" onClick={handleCancelDefault}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDefault} className=" h-[35px] w-[117px] pt-[7px] rounded-[5px] font-medium text-[14px] leading-[21.6px] tracking-[0] hover:text-primary hover:border hover:bg-background hover:border-primary shadow-none">
              Set Default
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}