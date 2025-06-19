import { TableData } from "@/Types/Table/tableTypes";

export interface DynamicTableHeaderProps {
  viewOptions: TableData['view_options'];
  selectedView: string;
  onSelectedViewChange: (view: string) => void;
  defaultView: string;
  onDefaultViewChange: (view: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}