import { ColumnDef, ColumnMeta } from "@tanstack/react-table"
import { TableMeta } from "@tanstack/react-table";
import { Row, Table } from "@tanstack/react-table";

export interface DynamicTableContainerProps {
  metadata: TableData;
  onRefetch: () => void;
}


export type formActionUrlType = {
  form_id: string,
  form_url: string,
  form_name: string,
}

export interface MoreActionCellProps {
  row: Row<TableData>;
  table: Table<TableData>;
  moreActions?: Array<{ label: string; value: string }>;
}

export type QuickFiltersType = Array<{
  filter_type?: string;
  type?: string;
  field_type?: string;
  id: string;
  field_name: string;
  field_label: string;
  input_field: Array<{
    placeholder: string;
    label_icon?: boolean;
    options?: Array<{
      label: string;
      value: string;
      icon?: string;
      color?: string;
    }>;
  }>;
}>;

export interface DesktopFiltersProps {
  visibleFilters: QuickFiltersType;
  hiddenFilters: QuickFiltersType;
  filterValues: Record<string, string>;
  onFilterChange: (fieldName: string, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isAllRangesValid: boolean;
  hideApplyButton?: boolean; // New prop to hide Apply button
}

export interface MobileFiltersProps {
  quickFilters: QuickFiltersType;
  filterValues: Record<string, string>;
  onFilterChange: (fieldName: string, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isAllRangesValid: boolean;
  hideApplyButton?: boolean; // New prop to hide Apply button
}

export interface QuickFiltersProps {
  quickFilters: QuickFiltersType;
  filterValues: Record<string, string>;
  onFilterChange: (fieldName: string, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onImmediateFilterChange?: (filterValues: Record<string, string>) => void; // New prop for immediate fetch
}

export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export type TableMetadata = {
  views: {
    options: Array<{ id: string; label: string; value: string; default: boolean }>;
    current_view_details: Array<{ field_name: string; filter_type: string; condition: string; value: string }>;
    example_filters: string[];
  };
  form_action_url: Array<{
    create?: formActionUrlType;
    edit?: formActionUrlType;
    show?: formActionUrlType;
  }>;
  table_actions_url: {
    edit: string;
    show: string;
    delete: string;
    table_action: string;
    view_filter: string;
    bulk_action: string;
    more_action: string;
  };
  favorite_screens: boolean;
  QuickFilters: QuickFiltersType;
  bulk_actions: Array<{ label: string; value: string }>;
  more_actions: Array<{ label: string; value: string }>;
};

export type TableData = any;

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  metadata: TableMetadata
  onFavoriteToggle?: (newState: boolean) => Promise<void>
  fetchDataFn:boolean// Corrected to accept fetchData function
  onRefetch: () => void;
}

export interface CustomTableMeta extends TableMeta<TableData> {
  onDeleteRowId?: (userId: string) => void;
  setHoveredRowId?: (rowId: string | null) => void;
  onMoreAction?: (action: string, rowId: string) => void;
}

export interface CustomColumnMeta<TData, TValue> extends ColumnMeta<TData, TValue> {
  isActionColumn?: boolean;
  isMoreActionColumn?: boolean;
}

export interface SortingParams {
  value: string
  order: "ASC" | "DESC"
}

export interface ColumnFilter {
  columnName: string;
  columnType: string;
  condition: string;
  value?:any;
}

export interface ColumnFiltersState {
  filters: ColumnFilter[];
}
export interface ApiQueryParams {
  view?: string;
  columnFilter?: ColumnFilter[];
  page?: number;
  perPage?: number;
  sorting?: SortingParams[];
  quickSearch?: {
    termSearch?: string;
    quickFilter?: {
      name: string;
      value: any;
    }[]
  };
}

export interface ApiResponse<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface BulkAction {
  label: string
  value: string
}

export interface BulkActionApi {
  status: string
  userIds: string[]
}

// types for sortable headder componennet
export interface SortableHeaderProps {
  column: any
  title: string
}

export interface NonSortableHeaderProps {
  title: string
}

export interface ColumnData {
  column_data_id: string;
  columnName: string;
  columnType: string;
  type?: string;
  headerName: string;
  associatedKey?: string;
  tableName?: string;
  columnFilter: boolean;
  sortable: boolean;
  isResizing: boolean;
  size: number;
  inLineEditing: boolean;
  options?:{ label: string; value: string }[]
}
 export interface TableContextType {
  pageIndex: number;
  setPageIndex: (index: number) => void;
}

export interface FilterRendererProps {
  filter: QuickFiltersType[number];
  fieldName: string;
  inputFields: { placeholder: string; options?: { value: string; label: string; icon?: string; color?: string }[] }[];
  filterValues: Record<string, string>;
  onFilterChange: (fieldName: string, value: string) => void;
}

export interface GlobalPreferencesContextType {
  per_page_values: { label: string; value: number }[];
  preferences: {
    density: string;
    columnResizable: boolean;
    dataWrap: boolean;
    theme: string;
    per_page: number;
  };
  filterData: any;
  updatePreferences: (
    newPreferences: Partial<{
      density: string;
      columnResizable: boolean;
      dataWrap: boolean;
      theme: string;
      per_page: number;
    }>
  ) => void;
}

// table component inline edit types

export interface EditState {
  rowId: string | null;
  columnName: string | null;
  value: string | string[];
}

export interface InlineEditInputProps {
  columnType: string;
  type?: string;
  value: string | string[];
  editState: EditState;
  setEditState?: React.Dispatch<React.SetStateAction<EditState | null>>;
  onSubmit: (currentEditState: EditState) => void;
  onClose: () => void;
  options?: Array<{ value: string; label: string }>;
}