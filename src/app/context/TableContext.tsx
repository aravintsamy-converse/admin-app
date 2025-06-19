"use client";

import { TableContextType } from "@/Types/Table/tableTypes";
import { createContext, useContext,useState, ReactNode} from "react";

const TableContext = createContext<TableContextType | undefined>(undefined);
export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [pageIndex, setPageIndex] = useState(0);

  return (
    <TableContext.Provider value={{ pageIndex, setPageIndex }}>
      {children}
    </TableContext.Provider>
  );
}

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};