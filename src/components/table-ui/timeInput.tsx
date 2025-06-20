"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "@/components/ui/button"
import { TimeInputProps } from "@/Types/Table/shadcnComponentInterface"

export function TimeInput({ value, onChange, placeholder = "Select time", className }: TimeInputProps) {
  const [open, setOpen] = React.useState(false)

  // Parse the current value into hours and minutes
  const [hours, minutes] = value ? value.split(":").map(Number) : [0, 0]

  // Format hours and minutes for display
  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  // Handle hour selection
  const handleHourChange = (hour: number) => {
    onChange(formatTime(hour, minutes))
  }

  // Handle minute selection
  const handleMinuteChange = (minute: number) => {
    onChange(formatTime(hours, minute))
  }

  // Generate arrays for hours and minutes
  const hoursArray = Array.from({ length: 24 }, (_, i) => i)
  const minutesArray = Array.from({ length: 60 }, (_, i) => i)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left text-[14px] font-normal h-8 bg-white border text-[#81868C] hover:bg-[#fff] hover:text-[#81868C] focus:outline-none focus:ring-1 focus:ring-[#1D57C7] focus:border-[#1D57C7]",
            !value && "text-muted-foreground",
            className,
          )}
        > 
        <span className={cn("truncate", !value && "text-[#81868C] text-[14px]")}>
          {value ? formatTime(hours, minutes) : placeholder}
        </span>
          <Clock className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-34 p-0 filter-popover-content" align="start">
        <div className="flex flex-col p-2">
          <div className="flex justify-between items-center mb-2">
            <div className="text-[14px] font-semibold text-[#81868C]">Hours</div>
            <div className="text-[14px] font-semibold text-[#81868C]">Minutes</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-[200px] overflow-y-auto pr-2 border-r">
              {hoursArray.map((hour) => (
                <div
                  key={hour}
                  className={cn(
                    "cursor-pointer text-[14px] py-1 px-2 rounded text-center",
                    hours === hour ? "bg-[#1D57C7] text-[#fff]" : "hover:bg-[#F6F8FD] hover:text-[#1D57C7]",
                  )}
                  onClick={() => handleHourChange(hour)}
                >
                  {hour.toString().padStart(2, "0")}
                </div>
              ))}
            </div>
            <div className="h-[200px] overflow-y-auto pr-2">
              {minutesArray.map((minute) => (
                <div
                  key={minute}
                  className={cn(
                    "cursor-pointer text-[14px]  py-1 px-2 rounded text-center",
                    minutes === minute ? "bg-[#1D57C7] text-[#fff]" : "hover:bg-[#F6F8FD] hover:text-[#1D57C7]",
                  )}
                  onClick={() => handleMinuteChange(minute)}
                >
                  {minute.toString().padStart(2, "0")}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

