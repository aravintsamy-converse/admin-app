import React, { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/TableUI/label";
import { RadioGroup, RadioGroupItem } from "@/components/TableUI/radioGroup";
import { FrameIcon, StandardResposiveIcon } from '@/TableIcon/commonIcons/columnRezing';
import { DisableIcon, EnableIcon } from '@/TableIcon/commonIcons/dataWrap';
import { CompactDensityIcon, ComfortableDensityIcon, StandardtDensityIcon } from '@/TableIcon/commonIcons/rowDensity';
import { useGlobalPreferencesContext } from '@/app/context/GlobalPreferencesContext';
import { MetricIcon, ThreeDotIconMenu } from '../client/icons/dynamicForm/AllDynamicFormIcons';
import { FavoriteIcon, UnFavoriteIcon } from '@/TableIcon/commonIcons/manageFavorite';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/Store/Store';
import { togglePopover } from '@/Store/Slices/metricPopoverSlice';

const CustomPreferencePopup = () => {
  const { preferences, updatePreferences } = useGlobalPreferencesContext();
  const [isTableCustomPopup, setIsTableCustomPopup] = useState(false);
  const customPopupRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const metricPopOverOpen = useSelector((state: RootState) => state.popover.isOpen);

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

  const toggleMetricPopOver = () => {
    dispatch(togglePopover());
    setIsTableCustomPopup(false);
  };

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
        <ThreeDotIconMenu color={`${isTableCustomPopup ? "text-primary text-[20px]" : "text-dotMenuDeselected"}`} />
      </button>
      {isTableCustomPopup && (
        <div className="absolute z-20 right-[7px]  w-[219px] top-[59px] text-popoverheaderforeground mt-1 bg-background rounded-[4px] shadow-viewboxshadow">
          <div className="absolute -top-2 right-0 md:right-2 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[20px] rotate-90 border-r-background"></div>
          <div className="pt-1 pb-3.5 px-4 text-popoverheaderforeground space-y-2">
            <div>
              <button onClick={toggleMetricPopOver} className={`pb-[6px] pt-[7px] md:hidden pl-[6px] pr-[4px]  items-center justify-center mr-3 text-nowrap bg-background text-primary hover:text-primary-foreground hover:bg-primary text-[18px] font-[600] rounded-[4px] cursor-pointer transition-all duration-300 shadow-primaryButtonActive border border-metricborder hover:border-transparent
                        ${metricPopOverOpen ? 'text-primary-foreground bg-primary border-transparent' : ''} 
                        `}>
                <MetricIcon />
              </button>
            </div>
            {/* Column Scaling */}
            <div>
              <h2 className="text-[16px] font-[700] text-popoverheaderforeground mb-2">Column Scaling</h2>
              <RadioGroup
                value={preferences.columnResizable ? "true" : "false"}
                onValueChange={(value) => handleUpdatePreferences({ columnResizable: value === "true" })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="true"
                    id="responsive"
                    className="h-[18px] w-[18px] border border-popoverradioforground shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="responsive" className="flex items-center space-x-2 text-[15px] text-popoversecondaryforground font-[400] cursor-pointer">
                    <FrameIcon />
                    <span>Responsive Width</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="false"
                    id="standard-width"
                    className="h-[18px] w-[18px] border border-popoverradioforground shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="standard-width" className="flex items-center space-x-2 text-[15px] text-popoversecondaryforground font-[400] cursor-pointer">
                    <StandardResposiveIcon />
                    <span>Standard Width</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Row Density */}
            <div>
              <h2 className="text-[16px] font-[700] text-popoverheaderforeground mb-2">Row Density</h2>
              <RadioGroup
                value={preferences.density}
                onValueChange={(value) => handleUpdatePreferences({ density: value })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="compact"
                    id="compact"
                    className="h-[18px] w-[18px] border border-popoverradioforground shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="compact" className="flex items-center space-x-2 text-[15px] text-popoversecondaryforground font-[400] cursor-pointer">
                    <CompactDensityIcon />
                    <span>Compact</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="standard"
                    id="standard-density"
                    className="h-[18px] w-[18px] border border-popoverradioforground shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="standard-density" className="flex items-center space-x-2 text-[15px] text-popoversecondaryforground font-[400] cursor-pointer">
                    <StandardtDensityIcon />
                    <span>Standard</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="comfortable"
                    id="comfortable"
                    className="h-[18px] w-[18px] border border-popoverradioforground shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="comfortable" className="flex items-center space-x-2 text-[15px] text-popoversecondaryforground font-[400] cursor-pointer">
                    <ComfortableDensityIcon />
                    <span>Comfortable</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Data Wrap */}
            <div>
              <h2 className="text-[16px] font-[700] text-popoverheaderforeground mb-2">Data Wrap</h2>
              <RadioGroup
                value={preferences.dataWrap ? "true" : "false"}
                onValueChange={(value) => handleUpdatePreferences({ dataWrap: value === "true" })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="true"
                    id="enable"
                    className="h-[18px] w-[18px] border border-popoverradioforground shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="enable" className="flex items-center space-x-2 text-[15px] text-popoversecondaryforground font-[400] cursor-pointer">
                    <EnableIcon />
                    <span>Enable</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="false"
                    id="disable"
                    className="h-[18px] w-[18px] border border-popoverradioforground shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="disable" className="flex items-center space-x-2 text-[15px] text-popoversecondaryforground font-[400] cursor-pointer">
                    <DisableIcon />
                    <span>Disable</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {/* favorites */}
            <div>
              <h2 className="text-[16px] font-[700] text-popoverheaderforeground mb-2">Mark as Favorite</h2>
              <RadioGroup
                value={preferences.dataWrap ? "true" : "false"}
                onValueChange={(value) => handleUpdatePreferences({ dataWrap: value === "true" })}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="true"
                    id="enable"
                    className="h-[18px] w-[18px] border border-popoverradioforground shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="enable" className="flex items-center space-x-2 text-[15px] text-popoversecondaryforground font-[400] cursor-pointer">
                    <FavoriteIcon />
                    <span>Yes</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="false"
                    id="disable"
                    className="h-[18px] w-[18px] border !border-popoverradioforground shadow-[0px_0px_2.5px_0px_#1D57C7] data-[state=checked]:border-[#1D57C7]"
                  />
                  <Label htmlFor="disable" className="flex items-center space-x-2 text-[15px] text-popoversecondaryforground font-[400] cursor-pointer">
                    <UnFavoriteIcon />
                    <span>No</span>
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