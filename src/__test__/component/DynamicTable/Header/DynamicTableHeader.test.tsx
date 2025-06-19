// DynamicTableHeader.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DynamicTableHeader from '@/components/DynamicTable/Header/DynamicTableHeader';
import type { TableData } from '@/Types/Table/tableTypes';
import userEvent from '@testing-library/user-event';
import { TableProvider } from "@/app/context/TableContext";
import { GlobalPreferencesProvider } from "@/app/context/GlobalPreferencesContext";


// Mock Redux slice state
const mockStore = configureStore([]);
const initialState = {
  popover: {
    isOpen: false,
  },
};

const mockViewOptions: TableData["view_options"] = [
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

jest.mock('@/components/DynamicTable/Header/CustomPreferencePopup', () => () => (
  <div data-testid="mock-custom-preference-popup">Mock Popup</div>
));

const setup = (overrides = {}) => {
  const store = mockStore(initialState);
  const props = {
    viewOptions: mockViewOptions,
    selectedView: mockViewOptions[0].value,
    defaultView: mockViewOptions[0].value,
    onSelectedViewChange: jest.fn(),
    onDefaultViewChange: jest.fn(),
    open: false,
    onOpenChange: jest.fn(),
    ...overrides,
  };

  const utils = render(
    <Provider store={store}>
        <DynamicTableHeader {...props} />
    </Provider>
  );

  return {
    ...utils,
    store,
    props,
    user: userEvent.setup(),
  };
};


describe('DynamicTableHeader', () => {
  it('renders the ViewSelect and Create button correctly', () => {
    setup();
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders MetricIcon button and triggers Redux dispatch on click', async () => {
    const { user, store } = setup();
    const metricButton = screen.getByTestId('metric-button');

    await user.click(metricButton);

    const actions = store.getActions();
    expect(actions.some((action: any) => action.type === 'popover/togglePopover')).toBe(true);
  });

  it('renders metric-button without active classes when metricPopOverOpen is false', () => {
  const { getByTestId } = setup();

  const button = getByTestId('metric-button');
  expect(button).not.toHaveClass('bg-primary');
});

it('renders metric-button with active classes when metricPopOverOpen is true', () => {
  const customState = {
    popover: { isOpen: true },
  };

  const store = mockStore(customState);

  const props = {
    viewOptions: mockViewOptions,
    selectedView: mockViewOptions[0].value,
    defaultView: mockViewOptions[0].value,
    onSelectedViewChange: jest.fn(),
    onDefaultViewChange: jest.fn(),
    open: false,
    onOpenChange: jest.fn(),
  };

  render(
    <Provider store={store}>
      <DynamicTableHeader {...props} />
    </Provider>
  );

  const button = screen.getByTestId('metric-button');
  expect(button).toHaveClass('bg-primary');
});

});
