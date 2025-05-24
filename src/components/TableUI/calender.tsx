"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    props.defaultMonth || (props.selected instanceof Date ? props.selected : new Date()),
  );

  React.useEffect(() => {
    if (props.defaultMonth) {
      setCurrentMonth(props.defaultMonth);
    } else if (props.selected instanceof Date) {
      setCurrentMonth(props.selected);
    }
  }, [props.defaultMonth, props.selected]);

  // Handle navigation to previous month
  const handlePreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  // Handle navigation to next month
  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  // Custom caption with dropdowns and navigation
  function CustomCaption({ displayMonth }: { displayMonth: Date }) {
    const month = displayMonth.getMonth();
    const year = displayMonth.getFullYear();

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 102 }, (_, i) => currentYear - 60 + i);

    const handleMonthChange = (newMonth: string) => {
      const newDate = new Date(displayMonth);
      newDate.setMonth(months.indexOf(newMonth));
      setCurrentMonth(newDate);
    };

    const handleYearChange = (newYear: string) => {
      const newDate = new Date(displayMonth);
      newDate.setFullYear(Number.parseInt(newYear));
      setCurrentMonth(newDate);
    };

    return (
      <div className="flex justify-between items-center w-full px-2">
        <button
          onClick={handlePreviousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex justify-center items-center gap-1">
          <Select value={months[month]} onValueChange={handleMonthChange}>
            <SelectTrigger className="bg-white font-[600] border text-[#1D57C7] h-8 filter-popover-content">
              <SelectValue>{months[month]}</SelectValue>
              <ChevronDown className="h-4 w-4" />

            </SelectTrigger>
            <SelectContent className="filter-popover-content h-[250px]">
              {months.map((monthName) => (
                <SelectItem key={monthName} value={monthName}
                  className="text-[#81868C]   hover:bg-[#F8F9FC]"
                >
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
          <Select value={year.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="bg-white font-[600] border text-[#1D57C7] h-8 filter-popover-content">
              <SelectValue>{year}</SelectValue>
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="filter-popover-content h-[250px]">
              {years.map((yearNum) => (
                <SelectItem key={yearNum} value={yearNum.toString()}>
                  {yearNum}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <DayPicker
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-[#1D57C7]",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-[#4375D7] rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-[#81868C] hover:text-[#1D57C7] hover:shadow-[2px_2px_5px_0px_#1D57C747]",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#1D57C7] text-[#FFFFFF] hover:bg-[#1D57C7] hover:text-[#FFFFFF] focus:bg-[#1D57C7] focus:text-[#FFFFFF]",
        day_today: "text-[#1D57C7] bg-accent", // Current date color
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: ({ displayMonth }) => <CustomCaption displayMonth={displayMonth} />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };