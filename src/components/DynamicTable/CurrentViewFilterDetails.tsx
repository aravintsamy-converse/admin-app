import FilterIcon from '@/TableIcon/commonIcons/filterIcon';
import { TableMetadata } from '@/Types/Table/tableTypes';
import React, { useEffect, useRef, useState } from 'react';
import { CgInfo } from 'react-icons/cg';
import { LuCalendarDays } from 'react-icons/lu';
import { InfoIcon } from '../client/icons/dynamicForm/AllDynamicFormIcons';

const CurrentViewFilterDetails = ({ metadata }: { metadata: TableMetadata }) => {
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
            <div className={`${isViewDetailsOpen ? 'text-primary' : 'text-infoIcon'} hidden md:flex text-[24px] hover:text-[#1D57C7] cursor-pointer`}
                onClick={() => setIsViewDetailsOpen(!isViewDetailsOpen)}>
                <InfoIcon />
            </div>
            {isViewDetailsOpen && (
                <div className="absolute top-10 -left-40 md:-left-3  py-1 px-4 z-50 w-[374px] bg-white rounded-[4px] shadow-[0px_0px_20px_0px_#C2D1EF]">
                    <div className="absolute -top-3 left-40 md:left-3 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent  border-r-[20px] rotate-90 border-r-white"></div>
                    <h3 className="text-[15px] font-[600] text-[#31363F]">Filters Applied</h3>
                    <div className="list-disc py-2">
                        {metadata.views?.current_view_details?.map((item, index) => (
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
                        {metadata.views?.example_filters?.map((item, index) => (
                            <ul key={index} className="w-[250px] text-[12px] text-[#81868C] py-1">
                                <li className="text-[#81868C]">{item}</li>
                            </ul>
                        ))}
                        {/* Handle empty state */}
                        {!metadata.views?.current_view_details?.length && (
                            <div className="text-[#81868C]">No filters applied</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentViewFilterDetails;