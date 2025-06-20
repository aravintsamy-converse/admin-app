import { fetchFilterDataApi } from "@/services/filter-data";
import { FilterDataState } from "@/Types/Table/filterData";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch filter data
export const fetchFilterData = createAsyncThunk("filterData/fetch", async () => {
  return await fetchFilterDataApi();
});

const initialState: FilterDataState = {
  data: [], // initialize as an empty array
  loading: false,
  error: null,
};

const filterDataSlice = createSlice({
  name: "filterData",
  initialState,
  reducers: {
    setFilterData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilterData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFilterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilterData } = filterDataSlice.actions;
export default filterDataSlice.reducer;
