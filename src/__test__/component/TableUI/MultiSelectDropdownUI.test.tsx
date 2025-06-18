import React from 'react';
import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelectDropdownUI } from '@/components/TableUI/multi-select-dropdown-ui';

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

describe('MultiSelectDropdownUI', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', async () => {
    render(<MultiSelectDropdownUI {...defaultProps} />);
    expect(await screen.findByText('Select options')).toBeInTheDocument();
    expect(await screen.findByRole('combobox')).toBeInTheDocument();
  });

  it('handles empty value array correctly', () => {
    render(<MultiSelectDropdownUI {...defaultProps} value={[]} />);
    expect(screen.getByText('Select options')).toBeInTheDocument();
    expect(screen.queryByTestId('selected-badge')).toBeNull();
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
    const selectedOptions = mockOptions;
    render(<MultiSelectDropdownUI {...defaultProps} value={selectedOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const mockOnOpenChange = jest.fn();
    render(<MultiSelectDropdownUI {...defaultProps} onOpenChange={mockOnOpenChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(mockOnOpenChange).toHaveBeenCalledWith(true);
  });

  it('calls onRemove when X button is clicked on a badge', async () => {
    const mockOnRemove = jest.fn();
    const selectedOptions = [{ value: '1', label: 'Option 1' }];
    render(<MultiSelectDropdownUI {...defaultProps} value={selectedOptions} onRemove={mockOnRemove} />);

    const xButton = screen.getByRole('button', { name: /remove option 1/i });
    await userEvent.click(xButton);
    expect(mockOnRemove).toHaveBeenCalledWith({ value: '1', label: 'Option 1' });
  });

  it('displays all options in dropdown', () => {
    render(<MultiSelectDropdownUI {...defaultProps} open={true} />);
    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('calls onSelect when an option is clicked', async () => {
    const mockOnSelect = jest.fn();
    render(<MultiSelectDropdownUI {...defaultProps} open={true} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByText('Option 2'));
    expect(mockOnSelect).toHaveBeenCalledWith({ value: '2', label: 'Option 2' });
  });

  it('calls onSearchChange when typing in search input', async () => {
    const mockOnSearchChange = jest.fn();
    render(<MultiSelectDropdownUI {...defaultProps} open={true} onSearchChange={mockOnSearchChange} />);

    const searchInput = screen.getByPlaceholderText('Search');
    await userEvent.type(searchInput, 'test');
    expect(mockOnSearchChange).toHaveBeenCalledTimes(4);
  });

  it('displays loading message when loading is true', () => {
    render(<MultiSelectDropdownUI {...defaultProps} open={true} loading={true} options={[]} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays "No results found" when options are empty and not loading', () => {
    render(<MultiSelectDropdownUI {...defaultProps} open={true} options={[]} />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('shows "Loading more..." when loading with existing options', () => {
    render(<MultiSelectDropdownUI {...defaultProps} open={true} loading={true} />);
    expect(screen.getByText('Loading more...')).toBeInTheDocument();
  });

  // Edge cases
  it('handles empty options array', () => {
    render(<MultiSelectDropdownUI {...defaultProps} open={true} options={[]} />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('does not show "+X more" when exactly maxBadgesToShow options are selected', () => {
    const selectedOptions = mockOptions.slice(0, 3);
    render(<MultiSelectDropdownUI {...defaultProps} value={selectedOptions} />);
    expect(screen.queryByText(/\+[0-9]+ more/)).toBeNull();
  });

});

describe('MultiSelectDropdownUI default props', () => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  it('uses default value when `value` is not provided', () => {
    const { value, ...defaultPropswithoutvalue } = defaultProps

    render(<MultiSelectDropdownUI {...defaultPropswithoutvalue} />);
    expect(screen.queryByTestId('selected-badge')).toBeNull();

  });

/* eslint-disable @typescript-eslint/no-unused-vars */
  it('uses default placeholder when `placeholder` is not provided', () => {
    const { placeholder, ...defaultPropsWithoutPlaceholder } = defaultProps;

    render(<MultiSelectDropdownUI {...defaultPropsWithoutPlaceholder} />);
    expect(screen.getByText('Select options')).toBeInTheDocument();
  });
});