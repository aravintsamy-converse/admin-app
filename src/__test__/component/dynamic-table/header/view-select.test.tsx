// ViewSelect.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ViewSelect } from '@/components/dynamic-table/header/view-select';
import { mockViewOptions } from '@/ __mocks__/view-mocks';

const setup = (overrides = {}) => {
  const props = {
    viewOptions: mockViewOptions,
    selectedView: mockViewOptions[0].value,
    defaultView: mockViewOptions[0].value,
    onSelectedViewChange: jest.fn(),
    onDefaultViewChange: jest.fn(),
    onOpenChange: jest.fn(),
    open: true,
    ...overrides,
  };

  const utils = render(<ViewSelect {...props} />);
  return {
    ...utils,
    ...props,
    user: userEvent.setup(),
  };
};

jest.mock('@/components/dynamic-table/truncate-tooltip', () => ({
  TruncateTooltip:  ({ text}: any) => (
    <div data-testid="tooltip">{text}</div>
  ),
}));


describe('ViewSelect Component', () => {
  it('renders correctly with selected view label', () => {
    setup({ open: false });
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('calls onSelectedViewChange when a different view is selected', async () => {
    const { user, onSelectedViewChange } = setup();
    const newLabel = mockViewOptions[1].label;
    const newItem = await screen.findByText(newLabel);

    await user.click(newItem);
    expect(onSelectedViewChange).toHaveBeenCalledWith(mockViewOptions[1].value);
  });

  it('does NOT open dialog when clicking pin on current default view', async () => {
    const { user } = setup();
    const pin = screen.getByTestId(`pin-icon-${mockViewOptions[0].value}`);
    await user.click(pin);
    expect(screen.queryByText(/Do you really want to change your default list to/i)).not.toBeInTheDocument();
  });

  it('opens confirmation dialog when pin icon of non-default view is clicked', async () => {
    const { user, onDefaultViewChange } = setup();
    const pin = screen.getByTestId(`pin-icon-${mockViewOptions[1].value}`);
    await user.click(pin);

    expect(await screen.findByText(/Do you really want to change your default list to/i)).toBeInTheDocument();

    await user.click(screen.getByText(/Set Default/i));
    expect(onDefaultViewChange).toHaveBeenCalledWith(mockViewOptions[1].value);
  });

  it('closes confirmation dialog when Cancel is clicked', async () => {
    const { user } = setup();
    const pin = screen.getByTestId(`pin-icon-${mockViewOptions[1].value}`);
    await user.click(pin);

    expect(await screen.findByText(/Do you really want to change your default list to/i)).toBeInTheDocument();
    await user.click(screen.getByText(/Cancel/i));
    expect(screen.queryByText(/Do you really want to change your default list to/i)).not.toBeInTheDocument();
  });

  it('falls back to selectedView value if label is not found in viewOptions', () => {
    const unknownView = 'unknown-view-id';
    setup({ selectedView: unknownView, open: false });
    expect(screen.getByText('Select a view')).toBeInTheDocument();
  });
  
  it('renders TruncateTooltip with selected view label', () => {
  setup({ open: false });
  const tooltip = screen.getByTestId('tooltip');
  expect(tooltip).toBeInTheDocument();
  expect(tooltip).toHaveTextContent('Default');
});
});
