import type { TableData } from '@/Types/Table/tableTypes';

export const mockViewOptions: TableData["view_options"] = [
  {
    value: "f5ad065e-92a2-4725-b626-6d44bbb2f58f",
    label: "Default",
    order: 1,
    is_default: true,
  },
  {
    value: "er434-92a2-4725-b626-6d44bbb2f58f",
    label: "Non-Experied products",
    order: 2,
    is_default: false,
  },
  {
    value: "45dfd65e-92a2-4725-b626-6d44bbb2f445f",
    label: "Out of Stock products only including Experied",
    order: 3,
    is_default: false,
  },
];