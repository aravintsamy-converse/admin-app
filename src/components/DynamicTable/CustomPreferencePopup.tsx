import React, { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/TableUI/label";
import { RadioGroup, RadioGroupItem } from "@/components/TableUI/radioGroup";
import { FrameIcon, StandardResposiveIcon } from '@/TableIcon/commonIcons/columnRezing';
import { DisableIcon, EnableIcon } from '@/TableIcon/commonIcons/dataWrap';
import { CompactDensityIcon, ComfortableDensityIcon, StandardtDensityIcon } from '@/TableIcon/commonIcons/rowDensity';
import { useGlobalPreferencesContext } from '@/app/context/GlobalPreferencesContext';
import { ThreeDotIconMenu } from '../client/icons/dynamicForm/AllDynamicFormIcons';

const CustomPreferencePopup = () => {
  const { preferences, updatePreferences } = useGlobalPreferencesContext();
  const [isTableCustomPopup, setIsTableCustomPopup] = useState(false);
  const customPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customPopupRef.current && !customPopupRef.current.contains(event.target as Node)) {
        setIsTableCustomPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUpdatePreferences = (updates: Partial<typeof preferences>) => {
    updatePreferences(updates);
    setIsTableCustomPopup(false);
  };

  return (
    <div className="flex items-center " ref={customPopupRef}>
      <button
        className="relative"
        onClick={() => setIsTableCustomPopup(!isTableCustomPopup)}
      >
        <ThreeDotIconMenu color={`${isTableCustomPopup ? "text-[#1D57C7]" : "text-[#889ABC]"} text-[16px]`} />
      </button>
      {isTableCustomPopup && (
        <div className="absolute right-[18px] h-[342px] w-[214px] top-10 text-[#7B8190] mt-1 bg-white rounded-md shadow-[0px_0px_20px_0px_#C2D1EF]">
          <div className="absolute -top-4 right-2 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[20px] rotate-90 border-r-white"></div>
          <div className="py-3 px-4 text-[#7B8190] bg-white space-y-4">
            {/* Column Scaling */}
            <div>
              <h2 className="text-[16px] font-[700] text-[#7B8190] mb-2">Column Scaling</h2>
              <RadioGroup
                value={preferences.columnResizable ? "true" : "false"}
                onValueChange={(value) => handleUpdatePreferences({ columnResizable: value === "true" })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="true"
                    id="responsive"
                    className="h-[18px] w-[18px] border border-[#FFFFFF] shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="responsive" className="flex items-center space-x-2 text-[14px] text-[#7B8190] font-[500] cursor-pointer">
                    <FrameIcon />
                    <span>Responsive Width</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="false"
                    id="standard-width"
                    className="h-[18px] w-[18px] border border-[#FFFFFF] shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="standard-width" className="flex items-center space-x-2 text-[14px] text-[#7B8190] font-[500] cursor-pointer">
                    <StandardResposiveIcon />
                    <span>Standard Width</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Row Density */}
            <div>
              <h2 className="text-[16px] font-[700] text-[#7B8190] mb-2">Row Density</h2>
              <RadioGroup
                value={preferences.density}
                onValueChange={(value) => handleUpdatePreferences({ density: value })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="compact"
                    id="compact"
                    className="h-[18px] w-[18px] border border-[#FFFFFF] shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="compact" className="flex items-center space-x-2 text-[14px] text-[#7B8190] font-[500] cursor-pointer">
                    <CompactDensityIcon />
                    <span>Compact</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="standard"
                    id="standard-density"
                    className="h-[18px] w-[18px] border border-[#FFFFFF] shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="standard-density" className="flex items-center space-x-2 text-[14px] text-[#7B8190] font-[500] cursor-pointer">
                    <StandardtDensityIcon />
                    <span>Standard</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="comfortable"
                    id="comfortable"
                    className="h-[18px] w-[18px] border border-[#FFFFFF] shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="comfortable" className="flex items-center space-x-2 text-[14px] text-[#7B8190] font-[500] cursor-pointer">
                    <ComfortableDensityIcon />
                    <span>Comfortable</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Data Wrap */}
            <div>
              <h2 className="text-[16px] font-[700] text-[#7B8190] mb-2">Data Wrap</h2>
              <RadioGroup
                value={preferences.dataWrap ? "true" : "false"}
                onValueChange={(value) => handleUpdatePreferences({ dataWrap: value === "true" })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="true"
                    id="enable"
                    className="h-[18px] w-[18px] border border-[#FFFFFF] shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="enable" className="flex items-center space-x-2 text-[14px] text-[#7B8190] font-[500] cursor-pointer">
                    <EnableIcon />
                    <span>Enable</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="false"
                    id="disable"
                    className="h-[18px] w-[18px] border border-[#FFFFFF] shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="disable" className="flex items-center space-x-2 text-[14px] text-[#7B8190] font-[500] cursor-pointer">
                    <DisableIcon />
                    <span>Disable</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPreferencePopup;