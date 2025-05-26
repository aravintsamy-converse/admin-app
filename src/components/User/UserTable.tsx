"use client";

import { useState, useEffect } from "react";
import DynamicTableContainer from "@/components/DynamicTable/DynamicTableContainer";
import { fetchMetaData } from "@/Services/Pages/User/TableServices";
import { ColumnData, TableMetadata } from "@/Types/Table/tableTypes";

export default function UserTable() {
  const [columnData, setColumnData] = useState<ColumnData[]>([]);
  console.log("🚀 ~ UserTable ~ columnData:", columnData)
  const [metadata, setMetadata] = useState<TableMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMetaData();
        setColumnData(data.columnData as ColumnData[]);
        setMetadata({
          views: data.views,
          form_action_url: data.form_action_url,
          table_actions_url: data.table_actions_url,
          favorite_screens: data.favorite_screens,
          QuickFilters: data.QuickFilters,
          bulk_actions: data.bulk_actions,
          more_actions: data.more_actions,
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchTrigger]);

  const handleRefetch = () => {
    setFetchTrigger(prev => !prev);
  };

  if (loading) return <div>Loading column definitions...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!metadata) return <div>No metadata available</div>;

  return (
    <DynamicTableContainer 
      metadata={metadata} 
      onRefetch={handleRefetch}
    />
  );
}