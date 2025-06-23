import FilterIcon from '@/TableIcon/commonIcons/filterIcon';
import React, { useEffect, useRef, useState } from 'react';
import { LuCalendarDays } from 'react-icons/lu';
import { InfoIcon } from '../client/icons/dynamicForm/AllDynamicFormIcons';

   const currentViewFilters = [
        {
          "field_name": "User",
          "filter_type": "String",
          "condition": "is",
          "value": "John Doe"
        },
        {
          "field_name": "Last Login",
          "filter_type": "Date",
          "condition": "is",
          "value": "12/12/2020"
        }
      ]

    const exampleFilters = ["Date Range: Last 30 days","Revenue: > $10,000 AND < $50,000", "Status: Active AND (Region: NA OR EU)"]

const CurrentViewFilterDetails = () => {
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const ViewDetailsPopupRef = useRef<HTMLDivElement>(null);
 

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ViewDetailsPopupRef.current && !ViewDetailsPopupRef.current.contains(event.target as Node)) {
                setIsViewDetailsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={ViewDetailsPopupRef}>
            <div className={`${isViewDetailsOpen ? 'text-primary' : 'text-infoIcon'}  text-[24px] md:pl-[2px] hover:text-primary cursor-pointer`}
                onClick={() => setIsViewDetailsOpen(!isViewDetailsOpen)}>
                <InfoIcon />
            </div>
            {isViewDetailsOpen && (
                <div className="absolute top-10 -left-40 md:-left-3  py-1 px-4 z-50 w-[374px] bg-background rounded-[4px] shadow-primaryButtonActive">
                    <div className="absolute -top-3 left-40 md:left-3 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent  border-r-[20px] rotate-90 border-r-background"></div>
                    <h3 className="text-[15px] font-[600] text-[#31363F]">Filters Applied</h3>
                    <div className="list-disc py-2">
                        {currentViewFilters?.map((item, index) => (
                            <div key={index} className="grid w-[250px] grid-cols-[1fr,auto,1fr] items-center gap-x-3 text-[14px] py-1">
                                <div className="text-[#81868C]">{item.field_name}:</div>
                                <div className="text-[#1D57C7] bg-[#1D57C70A] capitalize py-1 px-3 rounded-[4px] inline-flex items-center">
                                    {item.filter_type == "Date" || item.filter_type == "DateTime" ?
                                        <LuCalendarDays className="text-[14px]" /> :
                                        <FilterIcon className="text-[#1D57C7] text-[14px] hover:text-[#1D57C7]" />
                                    }
                                    <span className="ml-1">{item.condition}</span>
                                </div>
                                <div className="text-[#363F51]">{item.value}</div>
                            </div>
                        ))}
                        <h3 className="text-[13px] font-[600] pt-4 text-[#31363F]">Example Filters:</h3>
                        {exampleFilters.map((item, index) => (
                            <ul key={index} className="w-[250px] text-[12px] text-[#81868C] py-1">
                                <li className="text-[#81868C]">{item}</li>
                            </ul>
                        ))}
                        {/* Handle empty state */}
                        {currentViewFilters.length && (
                            <div className="text-[#81868C]">No filters applied</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentViewFilterDetails;