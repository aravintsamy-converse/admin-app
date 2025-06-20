import { useState, useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { CustomTableMeta, MoreActionCellProps } from "@/Types/Table/tableTypes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/table-ui/popover";

export function MoreActionCell({ row, table, moreActions }: MoreActionCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null); // Ref for the PopoverTrigger
  const tableContainerRef = useRef<HTMLElement | null>(null);
  const [isPopOverBelow, setIsPopoverBelow] = useState(true);

  useEffect(() => {
    // Find the table container element (adjust selector as needed)
    tableContainerRef.current = document.querySelector(".custom-scrollbar");

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (tableContainerRef.current) {
      tableContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (tableContainerRef.current) {
        tableContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const checkPosition = () => {
        if (triggerRef.current && popoverRef.current) {
          const triggerRect = triggerRef.current.getBoundingClientRect();
          const popoverRect = popoverRef.current.getBoundingClientRect();
          const isBelow = popoverRect.top >= triggerRect.bottom;
          setIsPopoverBelow(isBelow);
        }
      };

      const raf = requestAnimationFrame(checkPosition);
      return () => cancelAnimationFrame(raf);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div ref={triggerRef} className="flex items-center gap-x-1.5">
          <BsThreeDots
            className={`text-[16px] cursor-pointer transition-colors ${isOpen ? "text-[#1D57C7]" : "text-[#889ABC] hover:text-[#1D57C7]"
              }`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        className="mr-7 2xl:mr-11 mt-2 py-1.5 px-0 w-[166px] h-[112px] border-0 bg-white rounded-[4px] shadow-[0px_0px_20px_0px_#C2D1EF]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {
          isPopOverBelow ? (
            <div className="absolute -top-1.5 right-[40px] 2xl:right-[50px] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[20px] rotate-90 border-r-white"></div>
          ) : (
            <div className="absolute -bottom-2.5 right-[40px] 2xl:right-[50px] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[20px] rotate-[-90deg] border-r-white"></div>
          )
        }
        <div className="flex flex-col gap-y-1 font-[600] text-[#81868C] text-[15px]">
          {moreActions?.map((action, index) => (
            <button
              key={index}
              className="text-left pl-2 py-1 hover:text-[#1D57C7] text-[15px] font-[600] hover:bg-[#1D57C70A] outline-none focus-outline-none"
              onClick={() => {
                (table.options.meta as CustomTableMeta)?.onMoreAction?.(
                  action.value,
                  row.original.id
                );
                setIsOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}