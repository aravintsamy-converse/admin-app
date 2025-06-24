"use client";

import { useMemo, useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { DataTable } from "@/components/dynamic-table/data-table";
import SortableHeader from "@/components/dynamic-table/sortable-header";
import { CustomTableMeta, CustomColumnMeta, DynamicTableBodyProps, EditState, ColumnData } from "@/types/table/table.type";
import ColumnFilters from "@/components/dynamic-table/column-filters";
import { updateCellData } from "@/services/pages/user/table-services";
import { formateDateTime } from "@/services/pages/date-time-formater";
import { TableData } from "@/types/table/table.type";
import NonSortableHeader from "@/components/dynamic-table/non-sortable-header";
import CustomPreferencePopup from "@/components/dynamic-table/header/custom-preference-popup";
import { TableProvider } from "@/app/context/table-context";
import { Checkbox } from "@/components/table-ui/checkbox";
import { InlineEditInput } from "@/components/dynamic-table/inline-edit-inputs";
import { MoreActionCell } from "@/components/dynamic-table/more-action-cell";
import useScreenSize from "@/components/table-ui/screen-size";
import { ActiveUser } from "@/components/client/icons/table/preference-popover";
import { InactiveUser, LockIcon, LockUserIcon } from "@/components/client/icons/table/common";
import { ResetPasswordIcon, RoleMappingIcon, UnLockIcon } from "@/components/client/icons/table/body";

type ItemType = {
  id: string;
  [key: string]: string; // Allows any string-valued property
};


export default function DynamicTableBody({
  metadata
}: DynamicTableBodyProps) {
  const screenSize = useScreenSize();
  const [editState, setEditState] = useState<EditState | null>(null);
  const isMobile = screenSize === "sm" || screenSize === "xs";
  const [fetchDataFn, setFetchDataFn] = useState(false);
  const columnData: ColumnData[] = metadata.columnData || [];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && editState) {
        setEditState(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editState]);

  // Filter columns based on screen size
  const filteredColumnData = useMemo(() => {
    if (!isMobile) {
      return columnData;
    }

    const nonActionColumns = columnData.filter(
      (col) => col.headerName !== "Action" && col.headerName !== "More Actions"
    );
    const firstFourColumns = nonActionColumns.slice(0, 4);
    const actionColumn = columnData.find((col) => col.headerName === "Action");
    const moreActionColumn = columnData.find((col) => col.headerName === "More Actions");

    const result = [];
    if (actionColumn) result.push(actionColumn);
    result.push(...firstFourColumns);
    if (moreActionColumn) result.push(moreActionColumn);

    return result;
  }, [isMobile]);

  const columns = useMemo<ColumnDef<TableData>[]>(
    () =>
      filteredColumnData?.map((col) => {
        const baseColumn: ColumnDef<TableData> = {
          accessorKey: col.columnName,
          header: ({ column }) => (
            <div className="flex gap-x-2 items-center px-2">
              {col.columnFilter && (
                <ColumnFilters
                  value={column.getFilterValue() as { type: string; value: string }}
                  columnType={col.columnType}
                  column_name={col.columnName}
                  options={col.options}
                />
              )}
              {col.sortable ? (
                <SortableHeader column={column} title={col.headerName} />
              ) : (
                <NonSortableHeader title={col.headerName} />
              )}
            </div>
          ),
          enableResizing: col.isResizing,
          enableColumnFilter: col.columnFilter,
          size: col.size,
        };

        if (col.columnName === "Action") {
          return {
            ...baseColumn,
            id: "action",
            meta: { isActionColumn: true } as CustomColumnMeta<TableData, unknown>,
            header: ({ table }) => (
              <div className="flex items-center">
                <Checkbox
                  checked={table.getIsAllPageRowsSelected()}
                  onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
                  aria-label="Select all"
                  className="rounded-[3px] border-[2px] border-[#889ABC] bg-white data-[state=checked]:bg-[#1D57C7] data-[state=checked]:border-[#1D57C7]"
                />
              </div>
            ),
            cell: ({ row, table }) => (
              <div className="flex items-center gap-x-1.5">
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(checked) => row.toggleSelected(checked === true)}
                  aria-label="Select row"
                  className="rounded-[3px] border-2 border-[#889ABC] data-[state=checked]:bg-[#1D57C7] data-[state=checked]:border-[#1D57C7]"
                />
                <MdOutlineEdit className="text-[#889ABC] w-[18px] h-[18px] cursor-pointer hover:text-[#FFB800]" />
                <MdDeleteOutline
                  className="text-[#889ABC] w-[19px] h-[19px] cursor-pointer hover:text-[#E53D3D]"
                  onClick={() => (table.options.meta as CustomTableMeta)?.onDeleteRowId?.(row.original.id)}
                  onMouseEnter={() => (table.options.meta as CustomTableMeta)?.setHoveredRowId?.(row.id)}
                  onMouseLeave={() => (table.options.meta as CustomTableMeta)?.setHoveredRowId?.(null)}
                />
              </div>
            ),
          };
        }

        if (col.columnName === "more_action") {
          return {
            ...baseColumn,
            id: "more_action",
            meta: { isActionColumn: true } as CustomColumnMeta<TableData, unknown>,
            header: () => <CustomPreferencePopup />,
            cell: ({ row, table }) => <MoreActionCell row={row} table={table} moreActions={metadata?.more_actions} />,
          };
        }

        if (col.associatedKey && col.columnType === "Dropdown") {
          return {
            ...baseColumn,
            cell: ({ row }) => {
              const isEditing = editState?.rowId === row.id && editState?.columnName === col.columnName;
              const items = row.getValue(col.columnName) as ItemType[];
              const associatedKey = col.associatedKey as keyof ItemType;

              if (isEditing && col.inLineEditing) {
                return (
                  <InlineEditInput
                    columnType="Dropdown"
                    type="multi"
                    value={editState.value}
                    editState={editState}
                    setEditState={setEditState}
                    onSubmit={(currentEditState: EditState) => {
                      handleSaveEdit(row.original.id, currentEditState.columnName as string, currentEditState.value, col.tableName);
                    }}
                    onClose={() => setEditState(null)}
                    options={col.options || []}
                  />
                );
              }
              return (
                <div
                  onClick={() => col.inLineEditing && setEditState({ rowId: row.id, columnName: col.columnName, value: items.map((item: ItemType) => item.id) })}
                  className="cursor-pointer rounded-[4px] px-2 text-nowrap w-[200px] truncate  hover:border hover:border-[#E5E7EB] hover:px-2 hover:py-1"
                >
                  {Array.isArray(items) ? items.map((item) => item[associatedKey]).join(", ") : "-"}
                </div>
              );
            }
          };
        }

        if (col.associatedKey && col.columnType != "Dropdown") {
          return {
            ...baseColumn,
            cell: ({ row }) => {
              const isEditing = editState?.rowId === row.id && editState?.columnName === col.columnName;
              const associatedKey = col.associatedKey as keyof ItemType;
              const value = row.getValue(col.columnName) as ItemType;
              if (isEditing && col.inLineEditing) {
                return (
                  <InlineEditInput
                    columnType={col.columnType}
                    type={col.type}
                    value={editState.value}
                    editState={editState}
                    setEditState={setEditState}
                    onSubmit={(currentEditState: EditState) => {
                      handleSaveEdit(row.original.id, associatedKey as string, currentEditState.value, col.tableName, value["id"]);
                    }}
                    onClose={() => setEditState(null)}
                    options={col.options}
                  />
                );
              }
              return (
                <div
                  onClick={() => {
                    if (col.inLineEditing) {
                      const initialValue = value ? value[associatedKey] : "-";
                      setEditState({ rowId: row.id, columnName: col.columnName, value: initialValue });
                    }
                  }}
                  className="cursor-pointer rounded-[4px] px-2 text-nowrap w-[200px] truncate  hover:border hover:border-[#E5E7EB] hover:px-2 hover:py-1"
                >
                  {value ? value[associatedKey] : "-"}
                </div>
              );
            }
          };
        }

        if (col.columnName === "account_locked") {
          return {
            ...baseColumn,
            cell: ({ row }) => {
              const lockStatus = row.getValue("account_locked") as boolean;
              return (
                <div className="inline-flex hover:cursor-pointer px-2">
                  {lockStatus ? (
                    <div className="flex px-1.5 py-[3px] items-center gap-1 text-[#F04438] text-[14px] bg-[#FEEDEC] rounded-sm">
                      <LockIcon /> Locked
                    </div>
                  ) : (
                    <div className="flex px-1.5 py-[3px] items-center gap-1 bg-[#E0F3EA] text-[#28A745] text-[14px] rounded-sm">
                      <UnLockIcon /> Unlocked
                    </div>
                  )}
                </div>
              );
            },
          };
        }

        if (col.columnName === "is_active") {
          return {
            ...baseColumn,
            cell: ({ row }) => {
              const status = row.getValue("is_active") as boolean;
              return (
                <div className="inline-flex hover:cursor-pointer px-2">
                  {status ? (
                    <div className="flex px-1.5 py-[3px] items-center gap-1 bg-[#E0F3EA] text-[#28A745] text-[14px] rounded-sm">
                      <ActiveUser /> Active
                    </div>
                  ) : (
                    <div className="flex px-1.5 py-[3px] items-center gap-1 text-[#F04438] text-[14px] bg-[#FEEDEC] rounded-sm">
                      <InactiveUser /> Inactive
                    </div>
                  )}
                </div>
              );
            },
          };
        }

        if (["lock/unlock", "reset_password", "role_mapping"].includes(col.columnName)) {
          return {
            ...baseColumn,
            header: () => (
              <span className={`text-[14px] ${col.columnName === "reset_password" ? "text-nowrap" : ""} px-1 font-[600] text-[#81868C]`}>
                {col.headerName}
              </span>
            ),
            cell: () => (
              <div className="hover:cursor-pointer text-center">
                <div className="flex px-1.5 py-[3px] justify-center">
                  {col.columnName === "lock/unlock" && <LockUserIcon />}
                  {col.columnName === "reset_password" && <ResetPasswordIcon />}
                  {col.columnName === "role_mapping" && <RoleMappingIcon />}
                </div>
              </div>
            ),
          };
        }

        if (col.inLineEditing && col.columnType && !["null", "Binary", "Array"].includes(col.columnType)) {
          return {
            ...baseColumn,
            cell: ({ row }) => {
              const isEditing = editState?.rowId === row.id && editState?.columnName === col.columnName;
              const value = row.getValue(col.columnName) as string;

              if (isEditing) {
                return (
                  <InlineEditInput
                    columnType={col.columnType}
                    type={col.type}
                    value={editState.value}
                    editState={editState}
                    setEditState={setEditState}
                    onSubmit={(currentEditState: EditState) => {
                      handleSaveEdit(row.original.id, currentEditState.columnName as string, currentEditState.value, col.tableName);
                    }}
                    onClose={() => setEditState(null)}
                    options={col.options}
                  />
                );
              }

              if (col.columnType === "Date" || col.columnType === "DateTime") {
                return (
                  <div
                    onClick={() => col.inLineEditing && setEditState({ rowId: row.id, columnName: col.columnName, value: value || "" })}
                    className="cursor-pointer px-2 py-1 rounded-[4px] hover:border hover:border-[#E5E7EB] hover:px-2 hover:py-1"
                  >
                    {value ? formateDateTime(value, "12-hour") : "-"}
                  </div>
                );
              }

              return (
                <div
                  onClick={() => {
                    if (col.inLineEditing) {
                      const initialValue = col.columnType === "Dropdown" && col.type === "multi" && value
                        ? value.split(",").filter(Boolean)
                        : value || "";
                      setEditState({ rowId: row.id, columnName: col.columnName, value: initialValue });
                    }
                  }}
                  className={`cursor-pointer rounded-[4px] px-2 hover:border hover:border-[#E5E7EB] hover:px-2 hover:py-1 ${col.columnName === "user_name" || col.columnName === "email" ? "text-[#3374EFA3]" : ""}`}
                >
                  {col.columnType === "Dropdown" && col.type === "multi" && value
                    ? value.split(",").map((val) => col.options?.find((opt) => opt.value === val)?.label || val).join(", ")
                    : value || "-"}
                </div>
              );
            },
          };
        }

        return baseColumn;
      }),
    [filteredColumnData, editState, metadata?.more_actions]
  );

  const handleSaveEdit = async (rowId: string, columnName: string, value: string | string[], tableName?: string, associatedId?: string) => {
    try {
      const formattedValue = value;
      await updateCellData(metadata.table_actions_url.edit, { rowId, columnName, value: formattedValue, tableName, associatedId });
      setEditState(null);
    } catch (error) {
      console.error("Error updating cell:", error);
      setEditState(null);
    } finally {
      setFetchDataFn((prev) => !prev);
    }
  };

  return (
    <TableProvider>
      <DataTable
        columns={columns}
        metadata={metadata}
        fetchDataFn={fetchDataFn}
      />
    </TableProvider>
  );
}