import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MultiSelectLazyDropdown } from "@/components/TableUI/multi-select-dropdown";
import { fetchDropDownData } from "@/Services/Pages/User/TableServices";
import userEvent from "@testing-library/user-event";
import { MultiSelectDropdownUI } from '@/components/TableUI/multi-select-dropdown-ui';

jest.mock("@/Services/Pages/User/TableServices", () => ({
  fetchDropDownData: jest.fn(),
}));

const mockOptionsPage1 = {
  options: [
    { label: "aarthi", value: "U030" },
    { label: "akhsay", value: "U029" },
    { label: "ashok", value: "U028" },
  ],
  total_records: 30,
};

const mockOptionsPage2 = {
  options: [
    { label: "john", value: "U031" },
    { label: "jane", value: "U032" },
  ],
  total_records: 30,
};

const mockEmptyOptions = {
  options: [],
  total_records: 0,
};

const mockOptions: { value: string; label: string }[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
];

//those below mocks are used for MultiSelectDropdownUI
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

const handleChange = jest.fn();

const renderComponent = async (props = {}) => {
  return await act(async () => render(
    <MultiSelectLazyDropdown
      value={[]}
      placeholder="Select options"
      onChange={handleChange}
      {...props}
    />
  ));
};

describe("MultiSelectLazyDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default value prop when not provided", () => {
    render(<MultiSelectLazyDropdown onChange={handleChange}/>);
    expect( screen.getByText("Select options")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
  });

  it("opens dropdown and loads initial options", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptionsPage1);
    renderComponent();

    await userEvent.click(await screen.findByText("Select options"));

    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument();
      expect(screen.getByText("akhsay")).toBeInTheDocument();
    });

    expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=1&record_limit=10");
  });

  it("handles search functionality with debounce", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValue(mockOptionsPage1);
    renderComponent();

    await userEvent.click(await screen.findByText("Select options"));

    const searchInput = await screen.findByPlaceholderText("Search");
    await userEvent.type(searchInput, "test");

    await waitFor(
      () => {
        expect(fetchDropDownData).toHaveBeenCalledWith("search=test&page=1&record_limit=10");
      },
      { timeout: 1000 }
    );
  });

  it("handles infinite scroll loading with append = true", async () => {
    (fetchDropDownData as jest.Mock)
      .mockResolvedValueOnce(mockOptionsPage1) // Initial load (append = false)
      .mockResolvedValueOnce(mockOptionsPage2); // Second page load (append = true)
    renderComponent();

    await userEvent.click(await screen.findByText("Select options"));

    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument();
    });

    const dropdownContent = await screen.findByRole("listbox");
    fireEvent.scroll(dropdownContent, { target: { scrollTop: dropdownContent.scrollHeight } });

    await waitFor(() => {
      expect(screen.getByText("john")).toBeInTheDocument();
      expect(screen.getByText("jane")).toBeInTheDocument();
    });

    expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=2&record_limit=10");
  });

  it("does not load more when totalRecords equals recordLimit", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce({
      options: [{ label: "aarthi", value: "U030" }],
      total_records: 10,
    });
    renderComponent();

    await userEvent.click(await screen.findByText("Select options"));

    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument();
    });

    const dropdownContent = await screen.findByRole("listbox");
    fireEvent.scroll(dropdownContent, { target: { scrollTop: dropdownContent.scrollHeight } });

    await waitFor(() => {
      expect(fetchDropDownData).toHaveBeenCalledTimes(1);
    });
  });

  it("handles API errors gracefully", async () => {
    (fetchDropDownData as jest.Mock).mockRejectedValueOnce(new Error("API error"));
    console.error = jest.fn();
    renderComponent();

    await userEvent.click(await screen.findByText("Select options"));

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    expect(console.error).toHaveBeenCalledWith("Dropdown fetch error:", expect.any(Error));
  });

  it("resets search when dropdown is closed and reopened", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValue(mockOptionsPage1);
    renderComponent();

    await userEvent.click(await screen.findByText("Select options"));

    const searchInput = await screen.findByPlaceholderText("Search");
    await userEvent.type(searchInput, "test");

    await userEvent.click(document.body);
    await userEvent.click(await screen.findByText("Select options"));

    await waitFor(() => {
      expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=1&record_limit=10");
    });
  });

  it("displays selected values as chips", () => {
    const selectedValues = [
      { label: "aarthi", value: "U030" },
      { label: "akhsay", value: "U029" },
    ];
    render(<MultiSelectLazyDropdown value={selectedValues} onChange={jest.fn()} />);

    expect(screen.getByText("aarthi")).toBeInTheDocument();
    expect(screen.getByText("akhsay")).toBeInTheDocument();
  });

  it("shows empty state when no options are available", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValue(mockEmptyOptions);
    renderComponent();

    await userEvent.click(await screen.findByText("Select options"));

    expect(await screen.findByText("No results found")).toBeInTheDocument();
  });

  it("handles option selection", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptionsPage1);
    renderComponent();

    await userEvent.click(await screen.findByText("Select options"));

    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("aarthi"));

    expect(handleChange).toHaveBeenCalledWith([{ label: "aarthi", value: "U030" }]);
  });

  it("allows removing selected values via chip close button", async () => {
    const selectedValues = [
      { label: "aarthi", value: "U030" },
      { label: "akhsay", value: "U029" },
    ];
    render(<MultiSelectLazyDropdown value={selectedValues} onChange={handleChange} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await userEvent.click(removeButtons[0]);

    expect(handleChange).toHaveBeenCalledWith([{ label: "akhsay", value: "U029" }]);
  });

  it("handles multiple selections correctly", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptionsPage1);
    const { rerender } = render(<MultiSelectLazyDropdown value={[]} onChange={handleChange} />);

    await userEvent.click(await screen.findByText("Select options"));

    const option1 = await screen.findByTestId("option-U030");
    await userEvent.click(option1);
    expect(handleChange).toHaveBeenCalledWith([{ label: "aarthi", value: "U030" }]);

    rerender(<MultiSelectLazyDropdown value={[{ label: "aarthi", value: "U030" }]} onChange={handleChange} />);

    const option2 = await screen.findByTestId("option-U029");
    await userEvent.click(option2);
    expect(handleChange).toHaveBeenCalledWith([
      { label: "aarthi", value: "U030" },
      { label: "akhsay", value: "U029" },
    ]);

    rerender(
      <MultiSelectLazyDropdown
        value={[
          { label: "aarthi", value: "U030" },
          { label: "akhsay", value: "U029" },
        ]}
        onChange={handleChange}
      />
    );

    await userEvent.click(await screen.findByTestId("option-U030"));
    expect(handleChange).toHaveBeenCalledWith([{ label: "akhsay", value: "U029" }]);
  });

  it("resets search and calls fetch on reopen", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptionsPage1);
    renderComponent();

    await userEvent.click(await screen.findByText("Select options"));

    const searchInput = await screen.findByPlaceholderText("Search");
    await userEvent.type(searchInput, "test");
    expect(searchInput).toHaveValue("test");

    await userEvent.click(document.body);
    await userEvent.click(await screen.findByText("Select options"));

    const newSearchInput = await screen.findByPlaceholderText("Search");
    await waitFor(() => {
      expect(newSearchInput).toHaveValue("");
    });
    expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=1&record_limit=10");
  });

});

describe("MultiSelectDropdownUI", () => {

  it("renders correctly with default props", () => {
    render(<MultiSelectDropdownUI {...defaultProps} />);
    expect(screen.getByText("Select options")).toBeInTheDocument();
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

  it('shows "+X more" badge when more than maxBadgesToShow options are selected', () => {
    const selectedOptions = mockOptions;
    render(<MultiSelectDropdownUI {...defaultProps} value={selectedOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });
});