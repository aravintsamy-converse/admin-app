import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataTable } from '@/components/DynamicTable/DataTable';

// Mock the necessary dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('@/Store/Store', () => ({
  RootState: jest.fn(),
}));

jest.mock('@/app/context/GlobalPreferencesContext', () => ({
  useGlobalPreferencesContext: () => ({
    per_page_values: [{ value: 10 }, { value: 20 }, { value: 50 }],
    preferences: {
      density: 'standard',
      columnResizable: true,
    },
  }),
}));

jest.mock('@/app/context/TableContext', () => ({
  useTableContext: () => ({
    pageIndex: 0,
    setPageIndex: jest.fn(),
  }),
}));

// Mock the table services
jest.mock('@/Services/Pages/User/TableServices', () => ({
  fetchTableData: jest.fn().mockResolvedValue({
    data: [
      {
        id: 'U001',
        user_name: 'riya',
        email: 'riya@gmail.com',
        first_name: 'riya',
        last_name: 'raana',
        is_active: true,
      },
    ],
    totalCount: 2,
  }),
  bulkActionsApi: jest.fn(),
  deleteApi: jest.fn(),
  moreActionApi: jest.fn(),
  updateView: jest.fn(),
}));

describe('DataTable Component', () => {
  const mockColumns = [
    {
      accessorKey: 'user_name',
      header: 'Username',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'action',
      header: 'Actions',
    },
  ];

  const mockMetadata = {
    bulk_actions: [
      { value: 'activate', label: 'Activate' },
      { value: 'deactivate', label: 'Deactivate' },
    ],
    favorite_screens: false,
    table_actions_url: {
      table_action: '/api/table',
      bulk_action: '/api/bulk',
      delete: '/api/delete',
      more_action: '/api/more',
      view_filter: '/api/view',
    },
    views: {
      options: [
        { value: 'view1', label: 'View 1', default: true },
        { value: 'view2', label: 'View 2' },
      ],
    },
    QuickFilters: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the table with header and controls', () => {
    render(
      <DataTable
        columns={mockColumns}
        metadata={mockMetadata}
        onFavoriteToggle={jest.fn()}
        fetchDataFn={jest.fn()}
        onRefetch={jest.fn()}
      />
    );

    // Check if the main container renders
    expect(screen.getByTestId('data-table-container')).toBeInTheDocument();

    // Check if the view selector renders
    expect(screen.getByText('VIEW 1')).toBeInTheDocument();

    // Check if the create button renders
    expect(screen.getByText('Create')).toBeInTheDocument();

    // Check if the table headers render
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays the correct number of rows', async () => {
    render(
      <DataTable
        columns={mockColumns}
        metadata={mockMetadata}
        onFavoriteToggle={jest.fn()}
        fetchDataFn={jest.fn()}
        onRefetch={jest.fn()}
      />
    );

    // Wait for data to load
    const rows = await screen.findAllByRole('row');
    // Header row + 2 data rows
    expect(rows.length).toBe(3);
  });

  it('allows changing the view', async () => {
    render(
      <DataTable
        columns={mockColumns}
        metadata={mockMetadata}
        onFavoriteToggle={jest.fn()}
        fetchDataFn={jest.fn()}
        onRefetch={jest.fn()}
      />
    );

    // Open the view selector
    const viewSelector = screen.getByText('VIEW 1');
    fireEvent.click(viewSelector);

    // Check if the options are displayed
    expect(screen.getByText('View 1')).toBeInTheDocument();
    expect(screen.getByText('View 2')).toBeInTheDocument();

    // Select a different view
    fireEvent.click(screen.getByText('View 2'));
    // You might need to add assertions for the view change behavior
  });

  it('handles pagination controls', async () => {
    render(
      <DataTable
        columns={mockColumns}
        metadata={mockMetadata}
        onFavoriteToggle={jest.fn()}
        fetchDataFn={jest.fn()}
        onRefetch={jest.fn()}
      />
    );

    // Check pagination info
    expect(await screen.findByText('1-2 of 2')).toBeInTheDocument();

    // Test page size selector
    const pageSizeSelector = screen.getByDisplayValue('20');
    fireEvent.click(pageSizeSelector);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('handles bulk actions', async () => {
    render(
      <DataTable
        columns={mockColumns}
        metadata={mockMetadata}
        onFavoriteToggle={jest.fn()}
        fetchDataFn={jest.fn()}
        onRefetch={jest.fn()}
      />
    );

    // Open bulk actions dropdown
    const bulkActionTrigger = screen.getByText('Bulk actions');
    fireEvent.click(bulkActionTrigger);

    // Check if bulk actions are displayed
    expect(screen.getByText('Activate')).toBeInTheDocument();
    expect(screen.getByText('Deactivate')).toBeInTheDocument();
  });

  it('toggles favorite status when clicked', async () => {
    const mockToggleFavorite = jest.fn();
    render(
      <DataTable
        columns={mockColumns}
        metadata={mockMetadata}
        onFavoriteToggle={mockToggleFavorite}
        fetchDataFn={jest.fn()}
        onRefetch={jest.fn()}
      />
    );

    // Find and click the favorite button
    const favoriteButton = screen.getByLabelText('Toggle favorite');
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith(true);
  });
});