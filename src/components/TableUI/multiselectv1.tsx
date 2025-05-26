import * as React from "react";
import { Checkbox } from "./checkbox";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface MultiSelectDropdownProps {
  options: { label: string; value: string; icon?: string; color?: string }[];
  selectedValues: string[];
  onSelect: (values: string[]) => void;
  onSearch?: (query: string) => void;
  onLoadMore?: () => void;
  onLoadPrevious?: () => void;
  placeholder?: string;
  height?: number;
  triggerClassName?: string;
  itemClassName?: string;
  iconMap?: Record<string, React.ComponentType<any>>;
  commandGroupRef?: React.RefObject<HTMLDivElement>; // New prop for ref
}

export const MultiSelectDropdown = React.forwardRef<HTMLDivElement, MultiSelectDropdownProps>(
  (
    {
      options,
      selectedValues,
      onSelect,
      onSearch,
      onLoadMore,
      onLoadPrevious,
      placeholder = "Select options...",
      height = 8,
      triggerClassName = "",
      itemClassName = "",
      iconMap = {},
      commandGroupRef,
    },
  ) => {
    const [open, setOpen] = React.useState(false);
    const labelMap = new Map(options.map((option) => [option.value, option.label]));
    const topSentinelRef = React.useRef<HTMLDivElement>(null);
    const bottomSentinelRef = React.useRef<HTMLDivElement>(null);

    const handleSearchInput = (value: string) => {
      onSearch?.(value);
    };

    const handleSelect = (value: string) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onSelect(newValues);
    };

    React.useEffect(() => {
      if (!onLoadMore || !bottomSentinelRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onLoadMore();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(bottomSentinelRef.current);

      return () => {
        if (bottomSentinelRef.current) observer.unobserve(bottomSentinelRef.current);
      };
    }, [onLoadMore]);

    React.useEffect(() => {
      if (!onLoadPrevious || !topSentinelRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onLoadPrevious();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(topSentinelRef.current);

      return () => {
        if (topSentinelRef.current) observer.unobserve(topSentinelRef.current);
      };
    }, [onLoadPrevious]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-white hover:bg-white text-[14px] border rounded-[4px] text-[#81868C] hover:text-[#81868C] focus:outline-none focus:ring-0 focus:ring-[#1D57C7] focus:border-[#1D57C7]",
              `h-${height}`,
              triggerClassName
            )}
          >
            <span className={cn("truncate", !selectedValues.length && "text-[#81868C]")}>
              {selectedValues.length > 0
                ? options
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => option.label)
                    .join(", ")
                : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] border-0 p-0 filter-popover-content shadow-[0px_0px_10px_0px_#1D57C733]">
          <Command
            filter={(value, search) => {
              const label = labelMap.get(value);
              return label?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
            }}
          >
            <CommandInput
              placeholder="Search options..."
              className="h-9 text-[#81868C]"
              onValueChange={handleSearchInput}
            />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup ref={commandGroupRef} className="max-h-[200px] overflow-y-auto">
              {onLoadPrevious && (
                <div ref={topSentinelRef} className="h-1" />
              )}
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const IconComponent = option.icon && iconMap[option.icon] ? iconMap[option.icon] : null;

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      "group cursor-pointer hover:bg-[#1D57C712]",
                      isSelected && "text-[#1D57C7]",
                      itemClassName
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Checkbox
                        checked={isSelected}
                        className="rounded-[3px] h-4 w-4 border-2 border-[#FFFFFF] bg-white shadow-[2px_2px_5px_0px_#1D57C747] data-[state=checked]:bg-[#1D57C7] data-[state=checked]:border-[#1D57C7]"
                      />
                      {IconComponent && (
                        <IconComponent
                          style={{ color: option.color }}
                          className="h-4 w-4 group-hover:text-[#81868C]"
                        />
                      )}
                      <span
                        className={cn(
                          "flex-1",
                          isSelected ? "text-[#1D57C7]" : "text-[#81868C]",
                          "group-hover:text-[#1D57C7]"
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
              {onLoadMore && (
                <div ref={bottomSentinelRef} className="h-1" />
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelectDropdown.displayName = "MultiSelectDropdown";

export default MultiSelectDropdown;