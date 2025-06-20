"use client";
import { configureStore } from "@reduxjs/toolkit";
import filterDataReducer from "./slices/filter-data-slice";
import columnFiltersReducer from "./slices/column-filters-slice";
import popoverSliceReducer from "./slices/metric-popover-slice";

export const store = configureStore({
  reducer: {
    filterData: filterDataReducer,
    columnFilters: columnFiltersReducer,
    popover: popoverSliceReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
