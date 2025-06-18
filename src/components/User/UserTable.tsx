// app/user-table/page.tsx
import { fetchMetaData } from "@/Services/Pages/User/TableServices";
import DynamicTableContainer from "@/components/DynamicTable/DynamicTableContainer";
import { TableProvider } from "@/app/context/TableContext";
import { TableMetadata } from "@/Types/Table/tableTypes";

// this is a server component by default
export default async function UserTablePage() {
  let metavalue: TableMetadata;

  try {
    metavalue = await fetchMetaData(); // ✅ server-side fetch
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
