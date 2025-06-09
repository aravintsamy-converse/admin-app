import React from "react"
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react"
import { MultiSelectLazyDropdown } from "@/components/TableUI/multi-select-dropdown"
import { fetchDropDownData } from "@/Services/Pages/User/TableServices"
import userEvent from "@testing-library/user-event"

jest.mock("@/Services/Pages/User/TableServices", () => ({
  fetchDropDownData: jest.fn(),
}))

// Mock ResizeObserver and scrollIntoView for dropdown libraries
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

window.HTMLElement.prototype.scrollIntoView = jest.fn()

const mockOptionsPage1 = {
  options: [
    { label: "aarthi", value: "U030" },
    { label: "akhsay", value: "U029" },
    { label: "ashok", value: "U028" },

  ],
  total_records: 30,
}

const mockOptionsPage2 = {
  options: [
    { label: "john", value: "U031" },
    { label: "jane", value: "U032" },
  ],
  total_records: 30,
}

const mockEmptyOptions = {
  options: [],
  total_records: 0,
}

describe("MultiSelectLazyDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders with default placeholder", () => {
    render(
      <MultiSelectLazyDropdown
        value={[]}
        placeholder="Select options"
        onChange={jest.fn()}
      />
    )
    expect(screen.getByText("Select options")).toBeInTheDocument()
  })

  it("renders with custom placeholder", () => {
    render(
      <MultiSelectLazyDropdown
        placeholder="Choose items"
        value={[]}
        onChange={jest.fn()}
      />
    )
    expect(screen.getByText("Choose items")).toBeInTheDocument()
  })

  it("opens dropdown and loads initial options", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptionsPage1)

    const handleChange = jest.fn()
    render(
      <MultiSelectLazyDropdown
        value={[]}
        onChange={handleChange}
      />
    )

    // Open dropdown
    userEvent.click(screen.getByText("Select options"))

    // Wait for options to load
    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument()
      expect(screen.getByText("akhsay")).toBeInTheDocument()
    })

    // Verify API call
    expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=1&record_limit=10")
  })

  it("handles search functionality with debounce", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValue(mockOptionsPage1)

    render(
      <MultiSelectLazyDropdown
        value={[]}
        onChange={jest.fn()}
      />
    )

    // Open dropdown
    userEvent.click(screen.getByText("Select options"))

    // Find search input and type
    const searchInput = await screen.findByPlaceholderText("Search")
    userEvent.type(searchInput, "test")

    // Verify debounce works - initial call with empty query
    await waitFor(() => {
      expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=1&record_limit=10")
    })

    // After debounce, call with search query
    await waitFor(() => {
      expect(fetchDropDownData).toHaveBeenCalledWith("search=test&page=1&record_limit=10")
    }, { timeout: 1000 })
  })

  it("handles infinite scroll loading", async () => {
    (fetchDropDownData as jest.Mock)
      .mockResolvedValueOnce(mockOptionsPage1) // Initial load
      .mockResolvedValueOnce(mockOptionsPage2) // Second page load

    render(
      <MultiSelectLazyDropdown
        value={[]}
        onChange={jest.fn()}
      />
    )

    // Open dropdown
    userEvent.click(screen.getByText("Select options"))

    // Wait for initial options
    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument()
    })

    // Simulate scroll to bottom
    const dropdownContent = await screen.findByRole("listbox")
    fireEvent.scroll(dropdownContent, { target: { scrollTop: dropdownContent.scrollHeight } })

    // Wait for second page to load
    await waitFor(() => {
      expect(screen.getByText("john")).toBeInTheDocument()
      expect(screen.getByText("jane")).toBeInTheDocument()
    })

    // Verify second API call was made
    expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=2&record_limit=10")
  })

  it("doesn't load more when no more records available", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce({
      options: [{ label: "aarthi", value: "U030" }],
      total_records: 1, // Only 1 record total
    })

    render(
      <MultiSelectLazyDropdown
        value={[]}
        onChange={jest.fn()}
      />
    )

    // Open dropdown
    userEvent.click(screen.getByText("Select options"))

    // Wait for initial options
    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument()
    })

    // Simulate scroll to bottom
    const dropdownContent = await screen.findByRole("listbox")
    fireEvent.scroll(dropdownContent, { target: { scrollTop: dropdownContent.scrollHeight } })

    // Verify only one API call was made
    expect(fetchDropDownData).toHaveBeenCalledTimes(1)
  })

  it("handles API errors gracefully", async () => {
    (fetchDropDownData as jest.Mock).mockRejectedValueOnce(new Error("API error"))

    console.error = jest.fn() // Suppress error logs

    render(
      <MultiSelectLazyDropdown
        value={[]}
        onChange={jest.fn()}
      />
    )

    // Open dropdown
    userEvent.click(screen.getByText("Select options"))

    // Verify loading disappears
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    })

    // Verify error was logged
    expect(console.error).toHaveBeenCalledWith("Dropdown fetch error:", expect.any(Error))
  })

  it("resets search when dropdown is closed and reopened", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValue(mockOptionsPage1)

    render(
      <MultiSelectLazyDropdown
        value={[]}
        onChange={jest.fn()}
      />
    )

    // Open dropdown
    userEvent.click(screen.getByText("Select options"))

    // Type in search
    const searchInput = await screen.findByPlaceholderText("Search")
    userEvent.type(searchInput, "test")

    // Close dropdown
    userEvent.click(document.body)

    // Reopen dropdown
    userEvent.click(screen.getByText("Select options"))

    // Verify search was reset
    await waitFor(() => {
      expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=1&record_limit=10")
    })
  })

  it("displays selected values as chips", () => {
    (fetchDropDownData as jest.Mock).mockResolvedValue(mockOptionsPage1)

    const selectedValues = [
      { label: "aarthi", value: "U030" },
      { label: "akhsay", value: "U029" },
    ]

    render(
      <MultiSelectLazyDropdown
        value={selectedValues}
        onChange={jest.fn()}
      />
    )

    expect(screen.getByText("aarthi")).toBeInTheDocument()
    expect(screen.getByText("akhsay")).toBeInTheDocument()
  })


  it("shows empty state when no options are available", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValue(mockEmptyOptions)

    render(
      <MultiSelectLazyDropdown
        value={[]}
        onChange={jest.fn()}
      />
    )

    // Open dropdown
    userEvent.click(screen.getByText("Select options"))

    // Verify empty state
    await waitFor(() => {
      expect(screen.getByText("No results found")).toBeInTheDocument()
    })
  })



  it("handles option selection", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptionsPage1)

    const handleChange = jest.fn()
    render(
      <MultiSelectLazyDropdown
        value={[]}
        onChange={handleChange}
      />
    )

    // Open dropdown
    await userEvent.click(screen.getByText("Select options"))

    // Select an option
    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument()
    })

    // Select an option
    await userEvent.click(screen.getByText("aarthi"))

    // Verify onChange was called with the selected option
    expect(handleChange).toHaveBeenCalledWith([{ label: "aarthi", value: "U030" }])

    //verify onChange was deselected option 
    await userEvent.click(screen.getByText("aarthi"))
    expect(handleChange).toHaveBeenCalledWith([{ label: "aarthi", value: "U030" }])

  })

  it("allows removing selected values via chip close button", async () => {
    const selectedValues = [
      { label: "aarthi", value: "U030" },
      { label: "akhsay", value: "U029" },
    ]
    const handleChange = jest.fn()

    render(
      <MultiSelectLazyDropdown
        value={selectedValues}
        onChange={handleChange}
      />
    )

    // Find all remove buttons 
    const removeButtons = screen.getAllByRole("button", {
      name: /remove/i
    })

    // Click the first remove button
    await userEvent.click(removeButtons[0])

    // Verify onChange was called with remaining option
    expect(handleChange).toHaveBeenCalledWith([{ label: "akhsay", value: "U029" }])
  })

  it("handles multiple selections correctly", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptionsPage1);
    const handleChange = jest.fn();
    const { rerender } = render(
      <MultiSelectLazyDropdown
        value={[]}
        onChange={handleChange}
      />
    );

    // Open dropdown
    await userEvent.click(screen.getByText("Select options"));

    // Select first option
    const option1 = await screen.findByTestId("option-U030");
    await userEvent.click(option1);
    expect(handleChange).toHaveBeenCalledWith([{ label: "aarthi", value: "U030" }]);

    // Rerender with first option selected
    rerender(
      <MultiSelectLazyDropdown
        value={[{ label: "aarthi", value: "U030" }]}
        onChange={handleChange}
      />
    );

    // Select second option
    const option2 = await screen.findByTestId("option-U029");
    await userEvent.click(option2);
    expect(handleChange).toHaveBeenCalledWith([
      { label: "aarthi", value: "U030" },
      { label: "akhsay", value: "U029" }
    ]);

    // Rerender with both options selected
    rerender(
      <MultiSelectLazyDropdown
        value={[
          { label: "aarthi", value: "U030" },
          { label: "akhsay", value: "U029" }
        ]}
        onChange={handleChange}
      />
    );

    // Deselect first option
    await userEvent.click(await screen.findByTestId("option-U030"));
    expect(handleChange).toHaveBeenCalledWith([{ label: "akhsay", value: "U029" }]);
  });

})