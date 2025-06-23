"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from "@/components/dynamic-table/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bulkActionsApi, deleteApi, fetchTableData, moreActionApi } from "@/services/pages/user/table-services";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGlobalPreferencesContext } from "@/app/context/global-preferences-context";
import { QuickFilters } from "@/components/dynamic-table/quick-filters";
import CurrentColumnFilters from "@/components/dynamic-table/current-column-filters";
import { useTableContext } from "@/app/context/table-context";
import { RxDragHandleDots2 } from "react-icons/rx";
import type {
  ApiQueryParams,
  BulkAction,
  BulkActionApi,
  CustomTableMeta,
  DataTableProps,
  SortingParams,
  TableData,
} from "@/types/table/table.type";

const staticTableData = [
  {
    "id": "U001",
    "user_name": "riya",
    "email": "riya@gmail.com",
    "first_name": "riya",
    "last_name": "raana",
    "is_active": true,
    "first_login": true,
    "latest_login_at": "2024-03-21T00:00:00.000Z",
    "account_locked": false,
    "roles": [
      {
        "id": "R001",
        "role_name": "Principal Admin"
      },
      {
        "id": "R002",
        "role_name": "paymnet Admin"
      }
    ],
    "address":
    {
      "id": "AD001",
      "address1": "converse katadipalayam"
    }

  },
  {
    "id": "U002",
    "user_name": "sam",
    "email": "sam@gmail.com",
    "first_name": "sam",
    "last_name": "mohan",
    "is_active": false,
    "first_login": true,
    "latest_login_at": "2024-02-20T00:00:00.000Z",
    "account_locked": true,
    "account_locked_at": null,
    "roles": [
      {
        "id": "R003",
        "role_name": "dashboard Admin"
      },
      {
        "id": "R002",
        "role_name": "paymnet Admin"
      }
    ],
    "address":
    {
      "id": "AD002",
      "address1": "converse Venkateshwara"
    }
  }
]

export function DataTable<TData, TValue>({ columns, metadata, fetchDataFn }: DataTableProps<TData, TValue>) {

  const [data, setData] = useState<TData[]>(staticTableData as TData[]);
  const bulkActionsData: BulkAction[] = metadata.bulk_actions;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState(20);
  const { pageIndex, setPageIndex } = useTableContext();
  const [pageInput, setPageInput] = useState((pageIndex + 1).toString());
  const [totalRows, setTotalRows] = useState(staticTableData.length);
  const [seletedBulkAction, setSelectedBulkAction] = useState<string | null>(null);
  const [isPageSelectOpen, setIsPageSelectOpen] = useState(false);
  const [isBulkSelectOpen, setIsBulkSelectOpen] = useState(false);
  const columnFilters = useSelector((state: RootState) => state.columnFilters);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const { per_page_values, preferences } = useGlobalPreferencesContext();
  const rowHeight: Record<string, string> = {
    compact: "h-[38px]",
    standard: "h-[44px]",
    comfortable: "h-[48px]",
  };
  const rowHeightClass = rowHeight[preferences.density] || rowHeight.standard;
  const [isFavorite, setIsFavorite] = useState(metadata.favorite_screens);
  const actionUrl = metadata.table_actions_url;

  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [appliedFilterValues, setAppliedFilterValues] = useState<Record<string, string>>({});
  const [hoveredHeaderId, setHoveredHeaderId] = useState<string | null>(null);
  const metricPopOverOpen = useSelector((state: RootState) => state.popover.isOpen);
  const selectedView = '';

  const handleDeleteRowId = async (rowId: string) => {
    try {
      await deleteApi(actionUrl.delete, rowId);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      fetchData();
    }
  };

  const handleMoreAction = async (action: string, rowId: string) => {
    try {
      await moreActionApi(actionUrl.more_action, { action, rowId });
    } catch (error) {
      console.error("Error performing more action:", error);
    } finally {
      fetchData();
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableColumnResizing: preferences.columnResizable,
    columnResizeMode: "onChange",
    enableMultiSort: true,
    manualSorting: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount: Math.ceil(totalRows / pageSize),
    meta: {
      onDeleteRowId: handleDeleteRowId,
      onMoreAction: handleMoreAction,
      setHoveredRowId,
    } as CustomTableMeta,
    // Override getValue for columns to handle nested properties
  });

  const selectedRowIds = table.getSelectedRowModel().rows.map((row) => (row.original as TableData).id);

  const convertSortingToApiParams = useCallback((sortingState: SortingState): SortingParams[] => {
    return sortingState.map((sort) => ({
      value: sort.id,
      order: sort.desc ? "DESC" : "ASC",
    }));
  }, []);


  useEffect(() => {
    setIsFavorite(metadata.favorite_screens);
  }, [metadata.favorite_screens]);

  useEffect(() => {
    if (!preferences.columnResizable) {
      const originalSizes = columns.reduce((acc) => acc, {} as Record<string, number>);
      table.setColumnSizing(originalSizes);
    }
  }, [preferences.columnResizable, columns, table]);

  const fetchData = useCallback(async () => {
    try {
      const filterMap = new Map<string, { name: string; value: string | string[] }>();
      metadata.quick_filters.forEach((filter) => {
        const fieldName = filter.field_name;
        if (filter.filter_type === "Dropdown") {
          const value = appliedFilterValues[fieldName as string];
          if (value) {
            filterMap.set(fieldName as string, { name: fieldName as string, value: value.split(",").filter(Boolean) });
          }
        } else {
          const value = appliedFilterValues[fieldName as string];
          if (value) {
            filterMap.set(fieldName as string, { name: fieldName as string, value });
          }
        }
      });

      const quickFilter = Array.from(filterMap.values()).filter((filter) => {
        if (Array.isArray(filter.value)) return filter.value.length > 0;
        return filter.value !== "";
      });
      const params: ApiQueryParams = {
        view: selectedView,
        columnFilter: columnFilters.filters.map((filter: any) => ({
          columnName: filter.columnName,
          columnType: filter.columnType,
          condition: filter.condition,
          value: filter.value,
        })),
        page: pageIndex + 1,
        perPage: pageSize,
        sorting: convertSortingToApiParams(sorting),
        quickSearch: {
          ...(quickFilter.length > 0 && { quickFilter }),
        },
      };
      const response = await fetchTableData(actionUrl.table_action, params);
      setData(response.data as TData[]);
      setTotalRows(response.totalCount);
      setPageInput((pageIndex + 1).toString());
    } catch (error) {
      console.log("Error fetching data:", error);
      // Fallback to static data
      setData(staticTableData as TData[]);
      setTotalRows(staticTableData.length);
    }
  }, [pageIndex, pageSize, sorting, columnFilters, appliedFilterValues]);

  useEffect(() => {
    fetchData();
  }, [fetchData, fetchDataFn]);

  const handleBulkAction = async (action: string) => {
    if (!action || !selectedRowIds.length) return;
    try {
      const body: BulkActionApi = {
        status: action,
        userIds: selectedRowIds,
      };
      await bulkActionsApi(actionUrl.bulk_action, body);
      await fetchData();
    } catch (error) {
      console.log("Error performing bulk action:", error);
    } finally {
      table.toggleAllPageRowsSelected(false);
      setSelectedBulkAction(null);
    }
  };

  const handleFilterChange = (fieldName: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const applyFilters = () => {
    setAppliedFilterValues(filterValues);
    setPageIndex(0);
  };

  const handleImmediateFilterChange = (newFilterValues: Record<string, string>) => {
    setFilterValues(newFilterValues);
    setAppliedFilterValues(newFilterValues);
    setPageIndex(0);
  };

  const resetFilters = () => {
    setFilterValues({});
    setAppliedFilterValues({});
    setPageIndex(0);
  };

  return (


    <div className="w-full tanstack-table">
      <div className="w-full h-full rounded-sm bg-white">
        <div className="w-full bg-white py-1 grid grid-cols-2 md:grid-cols-1 gap-y-1 lg:grid-cols-[30.8%,69.2%] items-center">
          <CurrentColumnFilters />
          <div className="w-full flex items-center gap-4 place-content-end">
            <QuickFilters
              quickFilters={metadata.quick_filters}
              filterValues={filterValues}
              onFilterChange={handleFilterChange}
              onApplyFilters={applyFilters}
              onResetFilters={resetFilters}
              onImmediateFilterChange={handleImmediateFilterChange}
            />
          </div>
        </div>
        <div className="w-full h-full">
          <div className="relative">
            <div className="overflow-x-auto">
              {/* default old table min-h-[680px] max-h-[680px] */}
              <div className={`${metricPopOverOpen ? "min-h-[300px] max-h-[300px]" : "min-h-[300px] max-h-[300px]"} custom-scrollbar overflow-y-auto  font-[600] border rounded-tl-[4px] rounded-tr-[4px] bg-[#FDFDFF] border-1 border-[#EEEEEE]`}>
                <Table style={{ width: table.getTotalSize() }} className="w-full border-b border-r bg-[#FDFDFF] border-[#EEEEEE]">
                  <TableHeader className="sticky top-0 bg-white z-10 font-[600]">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableHeaderRow key={headerGroup.id} className="bg-white h-[38px]">
                        {headerGroup.headers.map((header) => {
                          const isActionColumn = header.id === "action";
                          const isMoreActionColumn = header.id === "more_action";
                          return (
                            <TableHead
                              key={header.id}
                              className={
                                isActionColumn
                                  ? "sticky left-0 bg-white z-20 w-16 pl-4"
                                  : isMoreActionColumn
                                    ? "sticky right-0 bg-white z-20 w-14 pl-4"
                                    : "relative border-0"
                              }
                              style={
                                isActionColumn
                                  ? { position: "sticky", left: 0, zIndex: 20, boxShadow: "1px 0 0 0 #EEEEEE" }
                                  : isMoreActionColumn
                                    ? { position: "sticky", right: 0, zIndex: 20, boxShadow: "1px 0 0 0 #EEEEEE" }
                                    : { width: header.getSize(), position: "sticky", top: 0, zIndex: 10 }
                              }
                            >
                              <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                              {!isActionColumn && !isMoreActionColumn && header.column.getCanResize() && (
                                <div
                                  onMouseDown={header.getResizeHandler()}
                                  onTouchStart={header.getResizeHandler()}
                                  onMouseEnter={() => setHoveredHeaderId(header.id)}
                                  onMouseLeave={() => setHoveredHeaderId(null)}
                                  className={`absolute right-0 top-0 h-full w-2 cursor-col-resize select-none touch-none ${header.column.getIsResizing()
                                    ? "border-r border-primary hover:border-primary"
                                    : "border-r border-[#E6E9F2] hover:border-primary"
                                    }`}
                                >
                                  {(header.column.getIsResizing() || hoveredHeaderId === header.id) && (
                                    <div className="absolute right-[18px] top-0 h-full w-2 rotate-90">
                                      <RxDragHandleDots2 className="text-[#889ABC]" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </TableHead>
                          );
                        })}
                      </TableHeaderRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className={`${rowHeightClass} transition-transform duration-200 ${hoveredRowId === row.id ? "translate-x-[6px]" : ""}`}
                        >
                          {row.getVisibleCells().map((cell) => {
                            const isActionColumn = cell.column.id === "action";
                            const isMoreActionColumn = cell.column.id === "more_action";
                            return (
                              <TableCell
                                key={cell.id}
                                className={
                                  isActionColumn
                                    ? "sticky left-0 bg-white pl-4"
                                    : isMoreActionColumn
                                      ? "sticky right-0 bg-white pl-4"
                                      : "text-[#555F7E] font-[500] text-[15px]"
                                }
                                style={
                                  isActionColumn
                                    ? { position: "sticky", left: 0, zIndex: 1 }
                                    : isMoreActionColumn
                                      ? { position: "sticky", right: 0, zIndex: 1 }
                                      : { width: cell.column.getSize() }
                                }
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <div className="flex flex-col border border-[#F0F0F0] rounded-bl-[5px] rounded-br-[5px] xl:flex-row justify-between xl:items-center md:items-start lg:px-3.5">
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 md:mt-0 md:mb-0 ">
              <Select
                value={seletedBulkAction || ""}
                onValueChange={(value) => {
                  setSelectedBulkAction(value);
                }}
                onOpenChange={setIsBulkSelectOpen}
              >
                <SelectTrigger
                  className={`w-full h-9  sm:w-[200px] rounded-sm md:w-[300px] bg-white font-[600] border ${seletedBulkAction ? "text-[#81868C] text-[15px]" : "text-[#ADADAD] text-[16px]"
                    }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <SelectValue placeholder="Bulk actions" className="" />
                    {isBulkSelectOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#81868C]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#81868C]" />
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent
                  side="top"
                  className="border-0 bg-white shadow-[0px_0px_20px_0px_#C2D1EF] min-w-[200px] sm:min-w-[300px] text-[16px]  font-[600]"
                >
                  {bulkActionsData.map((action) => (
                    <SelectItem
                      key={action.value}
                      value={action.value}
                      className="text-muted-foreground text-[16px] hover:bg-accent cursor-pointer "
                    >
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                className={`${!seletedBulkAction || selectedRowIds.length === 0
                  ? "pointer-events-none opacity-50"
                  : "hover:shadow-[0px_4px_6px_rgba(29,87,199,0.28)]"
                  } px-5 py-1.5 flex items-center gap-2 justify-center text-primary bg-white text-[15px] font-[600] rounded-[4px] cursor-pointer transition-all duration-300`}
                onClick={() => {
                  if (seletedBulkAction && selectedRowIds.length > 0) {
                    handleBulkAction(seletedBulkAction);
                  }
                }}
                disabled={!seletedBulkAction || selectedRowIds.length === 0}
              >
                Apply
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center  justify-end space-y-4 sm:space-y-0 sm:space-x-2 py-4 sm:px-7 xl:px-4 text-[#889ABC] text-[16px]">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                <p className="text-[16px] font-[600] text-[#889ABC] hidden lg:flex">Per page</p>
                <Select
                  value={`${pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                    setPageSize(Number(value));
                  }}
                  onOpenChange={setIsPageSelectOpen}
                >
                  <SelectTrigger
                    className={`rounded-[4px] ${isPageSelectOpen ? "text-[#ffffff] bg-primary" : "text-primary bg-white"
                      } h-[32px]  font-[500] w-[60px] text-[15px] border-none shadow-[2px_2px_5px_0px_#1D57C747] hover:shadow-[2px_2px_5px_0px_#1D57C747] border border-[#1D57C747]`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <SelectValue placeholder={pageSize} />
                      {isPageSelectOpen ? (
                        <ChevronUp className="h-4 w-4 text-[#ffffff]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#81868C]" />
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent
                    side="top"
                    className="border-0 bg-white shadow-[0px_0px_20px_0px_#C2D1EF] font-[15px] w-[var(--radix-select-trigger-width)]"
                  >
                    {per_page_values.map((size: { value: number }) => (
                      <SelectItem key={size.value} value={`${size.value}`}>
                        {size.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex px-2 sm:px-4 xl:px-0 items-center justify-center text-[16px] sm:text-[16px] font-[600] text-[#889ABC]">
                  {`${pageIndex * pageSize + 1}-${Math.min((pageIndex + 1) * pageSize, totalRows)} of ${totalRows}`}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="flex items-center space-x-1 sm:space-x-2 px-1">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 hidden lg:flex"
                    onClick={() => setPageIndex(0)}
                    disabled={pageIndex === 0}
                    aria-label="Go to first page"
                  >
                    <FaAngleDoubleLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                    disabled={pageIndex === 0}
                    aria-label="Go to previous page"
                  >
                    <RiArrowDropLeftLine className="h-7 w-7" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => setPageIndex(Math.min(Math.ceil(totalRows / pageSize) - 1, pageIndex + 1))}
                    disabled={pageIndex >= Math.ceil(totalRows / pageSize) - 1}
                    aria-label="Go to next page"
                  >
                    <RiArrowDropRightLine className="h-7 w-7" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-[32px] w-[32px] p-0 hidden lg:flex"
                    onClick={() => setPageIndex(Math.ceil(totalRows / pageSize) - 1)}
                    disabled={pageIndex >= Math.ceil(totalRows / pageSize) - 1}
                    aria-label="Go to last page"
                  >
                    <FaAngleDoubleRight className="h-4 w-4 text-[#889ABC] font-[600]" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
                <div className="text-[16px] sm:text-[16px] font-[600] text-[#889ABC] hidden lg:flex">Go to page</div>
                <input
                  type="number"
                  value={pageInput}
                  onChange={(e) => {
                    setPageInput(e.target.value);
                  }}
                  className="h-[31px] w-[59px] rounded border border-[#889ABCA6] p-0 text-center text-sm outline-none"
                  min={1}
                  max={Math.ceil(totalRows / pageSize)}
                />
                <Button
                  variant="outline"
                  className="h-[31px] w-[44px] p-0 hover:bg-primary text-primary hover:text-white"
                  onClick={() => {
                    const page = pageInput ? Number(pageInput) - 1 : 0;
                    if (page >= 0 && page < Math.ceil(totalRows / pageSize)) {
                      setPageIndex(page);
                    } else {
                      setPageInput(String(pageIndex + 1));
                    }
                  }}
                  aria-label="Go to page"
                >
                  <span className="text-[15px] font-[500]">Go</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 