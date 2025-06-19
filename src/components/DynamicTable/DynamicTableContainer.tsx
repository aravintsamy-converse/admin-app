"use client";

import { useState, useEffect, useRef } from "react";
import { TableMetadata } from "@/Types/Table/tableTypes";
import { fetchMetaData } from "@/Services/Pages/User/TableServices";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import MetricCards from "@/components/DynamicTable/Header/MetricCards";
import DynamicTableHeader from "./Header/DynamicTableHeader";

type DynamicTableContainerProps = {
  metavalue: TableMetadata;
};

export default function DynamicTableContainer({
  metavalue,
}: DynamicTableContainerProps) {
  const [metadata, setMetadata] = useState<TableMetadata | null>(metavalue);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [defaultView, setDefaultView] = useState(
    metavalue?.view_options.find((option: any) => option.is_default)?.value || ""
  );
  const [selectedView, setSelectedView] = useState(defaultView);
  const didMountRef = useRef(false);
  const metricPopOverOpen = useSelector((state: RootState) => state.popover.isOpen);

  const fetchData = async () => {

    try {
      const data = await fetchMetaData(selectedView ?? undefined);
      setMetadata({
        view_options: data.view_options,
        form_action_url: data.form_action_url,
        table_actions_url: data.table_actions_url,
        favorite_screens: data.favorite_screens,
        QuickFilters: data.QuickFilters,
        bulk_actions: data.bulk_actions,
        more_actions: data.more_actions,
        columnData: data.columnData,
      });
    } catch (err) {
      setError((err as Error).message);
    } 
  };

  useEffect(() => {
    if (didMountRef.current) {
      fetchData();
    } else {
      didMountRef.current = true;
    }
  }, [selectedView]);


  if (error) return <div>Error: {error}</div>;
  if (!metadata) return <div>No metadata available</div>;

  return (
    <div className="h-full overflow-y-hidden rounded-lg relative 2xl:ml-2 bg-background">
      <div
        className={`px-[2px] py-[2px] transition-all duration-700 ease-in-out ${
          metricPopOverOpen ? "h-[56px]" : "h-[77px]"
        }`}
      >
        <DynamicTableHeader
          viewOptions={metadata.view_options}
          selectedView={selectedView}
          onSelectedViewChange={setSelectedView}
          defaultView={defaultView}
          onDefaultViewChange={setDefaultView}
          open={open}
          onOpenChange={setOpen}
        />
      </div>

      {/* Main Container with Relative Positioning for Layered Animation */}
      <div className="relative bg-formHeaderCardBackground ml-3 mt-2  overflow-visible">
        {/* Dashboard Cards - Floating Overlay */}
        <div
          className={`absolute inset-x-0  top-2 z-30 transition-all duration-700 ease-in-out transform-gpu ${
            metricPopOverOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-8 scale-100 pointer-events-none"
          }`}
          style={{
            transitionProperty: "opacity, transform",
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
            <MetricCards />
        </div>

        {/* Spacer div to push table down when dashboard is open */}
        <div
          className={`transition-all duration-700 ease-in-out ${metricPopOverOpen ? "h-[180px]" : "h-0"}`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />

        {/* Dynamic Table Body */}
        {/* <div className="relative z-10">
          <DynamicTableBody metadata={metadata} onRefetch={handleRefetch} />
        </div> */}
      </div>
    </div>
  );
}