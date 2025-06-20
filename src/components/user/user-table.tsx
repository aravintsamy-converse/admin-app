import { fetchMetaData } from "@/services/pages/user/table-services";
import DynamicTableContainer from "@/components/dynamic-table/dynamic-table-container";
import { TableProvider } from "@/app/context/TableContext";
import { TableMetadata } from "@/Types/Table/tableTypes";

// this is a server component by default
export default async function UserTablePage() {
  let metavalue: TableMetadata;

  try {
    metavalue = await fetchMetaData();
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return <div>Error loading metadata</div>;
  }

  return (
    <TableProvider>
      <DynamicTableContainer metavalue={metavalue} />
    </TableProvider>
  );
}
