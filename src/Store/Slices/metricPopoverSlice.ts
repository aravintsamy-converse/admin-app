import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    setPopoverOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    togglePopover: (state) => {
      state.isOpen = !state.isOpen;
    },
    closePopover: (state) => {
      state.isOpen = false;
    },
  },
});

export const { setPopoverOpen, togglePopover, closePopover } = popoverSlice.actions;
export default popoverSlice.reducer;
