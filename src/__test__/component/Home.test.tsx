import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/components/User/Home';
import '@testing-library/jest-dom';
// // Optionally mock the dropdown components
jest.mock('@/components/TableUI/multi-select-dropdown', () => ({
  MultiSelectLazyDropdown:  ({ placeholder}: any) => (
    <div data-testid="multi-select">{placeholder}</div>
  ),
}));

jest.mock('@/components/TableUI/single-select-lazy-dropdown', () => ({
  SingleSelectLazyDropdown: ({ placeholder }: any) => (
    <div data-testid="single-select">{placeholder}</div>
  ),
}));

describe('Home Component', () => {
  test('renders correctly with all UI elements', () => {
    render(<Home />);
    expect(screen.getByText('Multi-Select Dropdown Example')).toBeInTheDocument();
    expect(screen.getByText('Select multiple options from the dropdown below:')).toBeInTheDocument();
  });
});
