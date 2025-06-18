'use client';
import { configureStore } from '@reduxjs/toolkit';
import filterDataReducer from './Slices/filterDataSlice';
import columnFiltersReducer from './Slices/columnFiltersSlice';
import popoverSliceReducer from './Slices/metricPopoverSlice';

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