import type React from "react"
import { ChevronsUpDown } from "lucide-react"
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa"
import { SortableHeaderProps } from "@/Types/Table/tableTypes"

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, title }) => {
  const isSorted = column.getIsSorted()
  const sortIndex = column.getSortIndex()
  const showSortIndex = sortIndex > -1

  return (
    <div
      onClick={() => {
        column.toggleSorting(undefined, true)
      }}
      className="flex cursor-pointer items-center text-nowrap font-[600] w-full justify-start gap-1"
    >
      <div className="flex items-center">
        <span className="text-[14px] text-[#81868C]">{title}</span>
      </div>
      {isSorted === "asc" ? (
        <div className="flex items-center">
          <FaLongArrowAltUp
            className="h-3 w-4 text-[#6D757C]" />
        </div>
      ) : isSorted === "desc" ? (
        <div className="flex items-center">
          <FaLongArrowAltDown className="h-3.5 w-3.5 text-[#6D757C]" />
        </div>
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 text-[#6D757C]" />
      )}
      {showSortIndex && (
        <span className="flex items-center text-[12px] justify-center h-[18px] w-[18px] rounded-md bg-[#1D57C733] text-[#1D57C7] font-medium">
          {sortIndex + 1}
        </span>
      )}
    </div>
  )
}


export default SortableHeader

