import { createSlice } from '@reduxjs/toolkit';

interface PopoverState {
  isOpen: boolean;
}

const initialState: PopoverState = {
  isOpen: false,
};

export const popoverSlice = createSlice({
  name: 'popover',
  initialState,
  reducers: { 
    togglePopover: (state) => {
      state.isOpen = !state.isOpen;
    }
  },
});

export const {togglePopover } = popoverSlice.actions;
export default popoverSlice.reducer;
