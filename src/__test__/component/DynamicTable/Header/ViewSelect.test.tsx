// ViewSelect.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ViewSelect } from '@/components/DynamicTable/Header/ViewSelect';
import type { TableMetadata } from '@/Types/Table/tableTypes';

const mockViewOptions: TableMetadata["view_options"] = [
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

describe('ViewSelect Component', () => {
  it('renders correctly with selected view label', () => {
    const mockSelectedView = mockViewOptions[0].value;
    const onSelectedViewChange = jest.fn();
    const onDefaultViewChange = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <ViewSelect
        viewOptions={mockViewOptions}
        selectedView={mockSelectedView}
        onSelectedViewChange={onSelectedViewChange}
        defaultView={mockViewOptions[0].value}
        onDefaultViewChange={onDefaultViewChange}
        open={false}
        onOpenChange={onOpenChange}
      />
    );

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('calls onSelectedViewChange when a different view is selected', async () => {
    const user = userEvent.setup();
    const onSelectedViewChange = jest.fn();
    const onDefaultViewChange = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <ViewSelect
        viewOptions={mockViewOptions}
        selectedView={mockViewOptions[0].value}
        onSelectedViewChange={onSelectedViewChange}
        defaultView={mockViewOptions[0].value}
        onDefaultViewChange={onDefaultViewChange}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    const newLabel = mockViewOptions[1].label;
    const newItem = await screen.findByText(newLabel);

    await user.click(newItem);

    expect(onSelectedViewChange).toHaveBeenCalledWith(mockViewOptions[1].value);
  });
});

describe('ViewSelect Component', () => {


  it('does NOT open dialog when clicking pin on current default view', async () => {
    const user = userEvent.setup();
    const onSelectedViewChange = jest.fn();
    const onDefaultViewChange = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <ViewSelect
        viewOptions={mockViewOptions}
        selectedView={mockViewOptions[0].value}
        onSelectedViewChange={onSelectedViewChange}
        defaultView={mockViewOptions[0].value}
        onDefaultViewChange={onDefaultViewChange}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    const pinButton = screen.getByTestId(`pin-icon-${mockViewOptions[0].value}`);
    await user.click(pinButton);

    // Expect the dialog NOT to open (text won't be present)
    expect(screen.queryByText(/Do you really want to change your default list to/i)).not.toBeInTheDocument();
  });

  it('opens confirmation dialog when pin icon of non-default view is clicked', async () => {
    const user = userEvent.setup();
    const onSelectedViewChange = jest.fn();
    const onDefaultViewChange = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <ViewSelect
        viewOptions={mockViewOptions}
        selectedView={mockViewOptions[0].value}
        onSelectedViewChange={onSelectedViewChange}
        defaultView={mockViewOptions[0].value} // Default is first item
        onDefaultViewChange={onDefaultViewChange}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    // Click on the pin icon of the *non-default* view
    const pinButton = screen.getByTestId(`pin-icon-${mockViewOptions[1].value}`);
    await user.click(pinButton);

    // Confirm that the dialog appears and includes the label of the selected pending view
    expect(await screen.findByText(/Do you really want to change your default list to/i)).toBeInTheDocument();

    const setDefaultButton = screen.getByText(/Set default/i);
    const cancelButton = screen.getByText(/Cancel/i);

    await user.click(setDefaultButton);
    expect(onDefaultViewChange).toHaveBeenCalledWith(mockViewOptions[1].value);

    await user.click(cancelButton);
    expect(screen.queryByText(/Do you really want to change your default list to/i)).not.toBeInTheDocument();
  });

  it('opens confirmation dialog when pin icon of non-default view is clicked and cancel is clicked', async () => {
    const user = userEvent.setup();
    const onSelectedViewChange = jest.fn();
    const onDefaultViewChange = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <ViewSelect
        viewOptions={mockViewOptions}
        selectedView={mockViewOptions[0].value}
        onSelectedViewChange={onSelectedViewChange}
        defaultView={mockViewOptions[0].value} // Default is first item
        onDefaultViewChange={onDefaultViewChange}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    // Click on the pin icon of the *non-default* view
    const pinButton = screen.getByTestId(`pin-icon-${mockViewOptions[1].value}`);
    await user.click(pinButton);

    // Confirm that the dialog appears and includes the label of the selected pending view
    expect(await screen.findByText(/Do you really want to change your default list to/i)).toBeInTheDocument();

    const cancelButton = screen.getByText(/Cancel/i);

    await user.click(cancelButton);
    expect(screen.queryByText(/Do you really want to change your default list to/i)).not.toBeInTheDocument();
  });

  it('falls back to selectedView value if label is not found in viewOptions', () => {
    const onSelectedViewChange = jest.fn();
    const onDefaultViewChange = jest.fn();
    const onOpenChange = jest.fn();

    const unknownView = 'unknown-view-id';

    render(
      <ViewSelect
        viewOptions={mockViewOptions}
        selectedView={unknownView}
        onSelectedViewChange={onSelectedViewChange}
        defaultView={mockViewOptions[0].value}
        onDefaultViewChange={onDefaultViewChange}
        open={false}
        onOpenChange={onOpenChange}
      />
    );
    // Fallback to showing the raw selectedView string
    expect(screen.getByText('Select a view')).toBeInTheDocument();
  });
});