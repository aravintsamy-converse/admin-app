import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelectDropdownUI } from '@/components/TableUI/multi-select-dropdown-ui';


describe('MultiSelectDropdownUI', () => {
  const mockOptions: { value: string; label: string }[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
  ];

  const defaultProps = {
    placeholder: 'Select options',
    value: [],
    options: mockOptions,
    loading: false,
    commandListRef: { current: null },
    onSearchChange: jest.fn(),
    onSelect: jest.fn(),
    onRemove: jest.fn(),
    open: false,
    onOpenChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<MultiSelectDropdownUI {...defaultProps} />);
    
    // Should show placeholder when no value is selected
    expect(screen.getByText('Select options')).toBeInTheDocument();
    // expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
  });

  it('displays selected options as badges', () => {
    const selectedOptions = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    
    render(<MultiSelectDropdownUI {...defaultProps} value={selectedOptions} />);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('shows "+X more" badge when more than maxBadgesToShow options are selected', () => {
    const selectedOptions = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
      { value: '4', label: 'Option 4' },
    ];
    
    render(<MultiSelectDropdownUI {...defaultProps} value={selectedOptions} />);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const mockOnOpenChange = jest.fn();
    render(<MultiSelectDropdownUI {...defaultProps} onOpenChange={mockOnOpenChange} />);
    
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(true);
  });

  it('calls onRemove when X button is clicked on a badge', async () => {
    const mockOnRemove = jest.fn();
    const selectedOptions = [
      { value: '1', label: 'Option 1' },
    ];
    
    render(
      <MultiSelectDropdownUI 
        {...defaultProps} 
        value={selectedOptions} 
        onRemove={mockOnRemove} 
      />
    );
    
    const xButton = screen.getByRole('button', { name: /remove option 1/i });
    await userEvent.click(xButton);
    
    expect(mockOnRemove).toHaveBeenCalledWith({ value: '1', label: 'Option 1' });
  });

  it('handles empty value array correctly', () => {
  // Explicitly pass an empty array for value
  render(<MultiSelectDropdownUI {...defaultProps} value={[]} />);
  
  // Should show placeholder when value is empty
  expect(screen.getByText('Select options')).toBeInTheDocument();
  
  // Should not show any badges
  const badges = screen.queryAllByTestId(/badge/i); // Adjust this selector based on your actual badge implementation
  expect(badges).toHaveLength(0);
  
  // Should not show "+X more" indicator
  expect(screen.queryByText(/\+[0-9]+ more/)).not.toBeInTheDocument();
});


});