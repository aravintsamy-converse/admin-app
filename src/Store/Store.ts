'use client';
import { configureStore } from '@reduxjs/toolkit';
import filterDataReducer from './Slices/filterDataSlice';
import columnFiltersReducer from './Slices/columnFiltersSlice';

export const store = configureStore({
  reducer: {
    filterData: filterDataReducer,
    columnFilters: columnFiltersReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;