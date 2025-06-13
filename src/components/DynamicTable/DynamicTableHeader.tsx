import React, { useState } from 'react'
import { MetricIcon, SquarHamburgerIcon } from '../client/icons/dynamicForm/AllDynamicFormIcons'
import CurrentViewFilterDetails from './CurrentViewFilterDetails'
import CreateIcon from '@/TableIcon/commonIcons/create'
import CustomPreferencePopup from './CustomPreferencePopup'
import { updateView } from '@/Services/Pages/User/TableServices'
import { DynamicTableBodyProps } from '@/Types/Table/tableTypes'
import { ViewSelect } from "@/components/DynamicTable/ViewSelect";

type Props = DynamicTableBodyProps & {
  onViewChange: (view: string) => void; // 🆕 Add prop
};

const DynamicTableHeader = ({ metadata, onRefetch, onViewChange }: Props)=> {
  const [defaultView, setDefaultView] = useState(metadata.views.options.find((option: any) => option.default)?.value || "");
  const [open, setOpen] = useState(false);
  
    const handleViewChange = async (view: string) => {
      try {
        await updateView(metadata.table_actions_url.view_filter, view || "");
      } catch (error) {
        console.error("Error updating view:", error);
      } 
    };

  return (
     <div className="grid grid-cols-2 items-center border-b border-formheaderborder bg-mainbackground rounded-tl-sm">
        <div className="flex ">
          <div className="p-3 md:pl-[21px] md:pr-[20px] py-[27px] !bg-formHeaderCardBackground text-selectsecondaryforeground rounded-tl-sm flex items-center justify-center ">
            <SquarHamburgerIcon />
          </div>
          <div className="rounded-tr-md items-center flex  w-full">
            <div className="flex items-center p-1">
          <ViewSelect
                metadata={metadata}
                onViewChange={handleViewChange}
                initialView={metadata.views.options.find((option: any) => option.default)?.value || ""}
              />
              <CurrentViewFilterDetails metadata={metadata} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end pr-[15px]">
          <button className="pb-[6px] pt-[7px] pl-[6px] pr-[4px]  flex items-center justify-center mr-3 text-nowrap bg-mainbackground text-primary hover:text-primary-foreground hover:bg-primary text-[18px] font-[600] rounded-[4px] cursor-pointer transition-all duration-300 shadow-primaryButtonActive border border-metricborder hover:border-transparent">
            <MetricIcon />
          </button>
          <button className="p-2 md:pl-[22px] md:pr-[27px] py-[7px]  flex items-center  justify-center mr-[6px] bg-primary text-primary-foreground hover:text-primary hover:bg-background text-[14px] font-[500] rounded-[4px] cursor-pointer transition-all duration-300 !shadow-primaryButtonActive hover:shadow-primaryButtonActive">
            <CreateIcon /><span className="ml-2">Create</span>
          </button>
          <div>
            <CustomPreferencePopup />
          </div>
        </div>

      </div>
  )
}

export default DynamicTableHeader