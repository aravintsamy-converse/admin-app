import React from 'react'
import { MetricIcon, SquarHamburgerIcon } from '@/components/client/icons/dynamicForm/AllDynamicFormIcons'
import CurrentViewFilterDetails from '@/components/DynamicTable/CurrentViewFilterDetails'
import CreateIcon from '@/TableIcon/commonIcons/create'
import CustomPreferencePopup from '@/components/DynamicTable/Header/CustomPreferencePopup'
import { TableData } from '@/Types/Table/tableTypes'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/Store/Store';
import { togglePopover } from '@/Store/Slices/metricPopoverSlice';
import { ViewSelect } from '@/components/DynamicTable/Header/ViewSelect'


interface DynamicTableBodyProps {
  metadata: TableData;
  selectedView: string;
  onSelectedViewChange: (view: string) => void;
  defaultView: string;
  onDefaultViewChange: (view: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;

}

const DynamicTableHeader = ({ metadata, selectedView, onSelectedViewChange, defaultView, onDefaultViewChange, open, onOpenChange }: DynamicTableBodyProps) => {
 const dispatch = useDispatch();
 const metricPopOverOpen = useSelector((state: RootState) => state.popover.isOpen); // 🆕 use popover state from Redux store

 const toggleMetricPopOver = () => {
  dispatch(togglePopover());
};

  return (
    <div className="grid grid-cols-2 h-full items-center border-b border-formheaderborder bg-mainbackground rounded-tl-sm">
      <div className="flex h-full">
        <div className="p-3 md:pl-[21px] md:pr-[20px]  !bg-formHeaderCardBackground text-selectsecondaryforeground rounded-tl-sm flex items-center justify-center ">
          <SquarHamburgerIcon />
        </div>
        <div className="rounded-tr-md items-center flex  w-full">
          <div className="flex items-center p-1">
             <ViewSelect
              metadata={metadata}
              selectedView={selectedView}
              onSelectedViewChange={onSelectedViewChange}
              defaultView={defaultView}
              onDefaultViewChange={onDefaultViewChange}
              open={open}
              onOpenChange={onOpenChange}
            />
            <CurrentViewFilterDetails metadata={metadata} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end  pr-2 md:pr-[15px]">
        <button onClick={toggleMetricPopOver} className={`pb-[6px] pt-[7px] hidden md:flex pl-[6px] pr-[4px]  items-center justify-center mr-3 text-nowrap bg-background text-primary hover:text-primary-foreground hover:bg-primary text-[18px] font-[600] rounded-[4px] cursor-pointer transition-all duration-300 shadow-primaryButtonActive border border-metricborder hover:border-transparent
          ${metricPopOverOpen ? 'text-primary-foreground bg-primary border-transparent' : ''} 
          `}>
          <MetricIcon />
        </button>
        <button className="w-[117px] h-[35px]  flex items-center  justify-center mr-[6px] bg-primary text-[#ffffff] hover:text-primary hover:bg-background text-[14px] font-[500] leading-[21.6px] rounded-[4px] cursor-pointer transition-all duration-300 !shadow-primaryButtonActive hover:shadow-primaryButtonActive">
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