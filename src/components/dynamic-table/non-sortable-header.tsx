import type React from "react"
import { Button } from "@/components/ui/button"
import { NonSortableHeaderProps } from "@/types/table/table.type"

const NonSortableHeader: React.FC<NonSortableHeaderProps> = ({ title }) => {

  return (
    <Button
      variant="ghost"
      className="flex items-center font-[600]  hover:bg-[#FFFFFF] w-full justify-start gap-1"
    >
      <div className="flex items-center">
        <span className="text-[14px] text-[#81868C]">{title}</span>
      </div>
    </Button>
  )
}

export default NonSortableHeader

