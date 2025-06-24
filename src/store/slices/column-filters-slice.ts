import { ColumnFilter, ColumnFiltersState } from '@/types/table/table.type';
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

const initialState: ColumnFiltersState = {
  filters: []
};

export const columnFiltersSlice = createSlice({
  name: "columnFilters",
  initialState,
  reducers: {
    setColumnFilter: (state, action: PayloadAction<ColumnFilter>) => {
      const existingIndex = state.filters.findIndex(
        f => f.columnName === action.payload.columnName
      );
      
      if (existingIndex >= 0) {
        state.filters[existingIndex] = action.payload;
      } else {
        state.filters.push(action.payload);
      }
    },
    removeColumnFilter: (state, action: PayloadAction<string>) => {
      state.filters = state.filters.filter(
        f => f.columnName !== action.payload
      );
    },
    clearAllFilters: (state) => {
      state.filters = [];
    }
  },
});

export const { setColumnFilter, removeColumnFilter, clearAllFilters } = columnFiltersSlice.actions;
export default columnFiltersSlice.reducer;