"use client";

import { useState, useEffect, useRef } from "react";
import { TableMetadata } from "@/Types/Table/tableTypes";
import DynamicTableBody from "./DynamicTableBody";
import { fetchMetaData } from "@/Services/Pages/User/TableServices";
import DynamicTableHeader from "./DynamicTableHeader";

type DynamicTableContainerProps = {
  metavalue: TableMetadata;
};

export default function DynamicTableContainer({
  metavalue,
}: DynamicTableContainerProps) {
  const [metadata, setMetadata] = useState<TableMetadata | null>(metavalue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [open, setOpen] = useState(false);
  const [defaultView, setDefaultView] = useState(metavalue?.views.options.find((option: any) => option.default)?.value || "");
  const [selectedView, setSelectedView] = useState(defaultView);
  const didMountRef = useRef(false);

  const fetchData = async () => {
  console.log("🚀 ~ fetchData ~ fetchData is called:",)

    try {
      const data = await fetchMetaData(selectedView ?? undefined); // 🆕 use selectedView
      setMetadata({
        views: data.views,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didMountRef.current) {
      // Call your API here
      fetchData();
    } else {
      // Skip the first render
      didMountRef.current = true;
    }
  }, [selectedView]); // 🆕 depend on selectedView



  const handleRefetch = () => {
    setFetchTrigger(prev => !prev);
  };


  // if (loading) return <div>Loading column definitions...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!metadata) return <div>No metadata available</div>;

  return (
    <div className="h-full rounded-lg relative p-[2px] 2xl:ml-2 bg-background">
      <DynamicTableHeader
        metadata={metadata}
        selectedView={selectedView}
        onSelectedViewChange={setSelectedView}
        defaultView={defaultView}
        onDefaultViewChange={setDefaultView}
        open={open}
        onOpenChange={setOpen}
      />
      {/* <DynamicTableBody
        metadata={metadata}
        onRefetch={handleRefetch}
      /> */}
    </div>

  );
}
