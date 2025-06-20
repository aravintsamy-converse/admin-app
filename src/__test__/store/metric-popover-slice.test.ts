import reducer, {
  togglePopover,
  popoverSlice,
} from "@/store/slices/metric-popover-slice";

describe("metricPopoverSlice", () => {
  it("should export correct initial state", () => {
    expect(popoverSlice.getInitialState()).toEqual({ isOpen: false });
  });
  it("should return the initial state from reducer", () => {
    const initialState = { isOpen: false };
    const nextState = reducer(undefined, { type: "" });
    expect(nextState).toEqual(initialState);
  });

  it("should toggle isOpen from false to true", () => {
    const prevState = { isOpen: false };
    const nextState = reducer(prevState, togglePopover());
    expect(nextState.isOpen).toBe(true);
  });

  it("should toggle isOpen from true to false", () => {
    const prevState = { isOpen: true };
    const nextState = reducer(prevState, togglePopover());
    expect(nextState.isOpen).toBe(false);
  });
});
