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

    const handleChange = jest.fn()


const renderComponent=()=>{
  return render(
    <MultiSelectLazyDropdown
      value={[]}
      placeholder="Select options"
      onChange={handleChange}
    />
  )
}

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
  renderComponent()
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
      renderComponent()

    userEvent.click(screen.getByText("Select options"))

    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument()
      expect(screen.getByText("akhsay")).toBeInTheDocument()
    })

    expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=1&record_limit=10")
  })

  it("handles search functionality with debounce", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValue(mockOptionsPage1)

   renderComponent()

    userEvent.click(screen.getByText("Select options"))

    const searchInput = await screen.findByPlaceholderText("Search")
    userEvent.type(searchInput, "test")

    await waitFor(() => {
      expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=1&record_limit=10")
    })

    await waitFor(() => {
      expect(fetchDropDownData).toHaveBeenCalledWith("search=test&page=1&record_limit=10")
    }, { timeout: 1000 })
  })

  it("handles infinite scroll loading", async () => {
    (fetchDropDownData as jest.Mock)
      .mockResolvedValueOnce(mockOptionsPage1) // Initial load
      .mockResolvedValueOnce(mockOptionsPage2) // Second page load

  renderComponent()

    userEvent.click(screen.getByText("Select options"))

    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument()
    })

    const dropdownContent = await screen.findByRole("listbox")
    fireEvent.scroll(dropdownContent, { target: { scrollTop: dropdownContent.scrollHeight } })

    await waitFor(() => {
      expect(screen.getByText("john")).toBeInTheDocument()
      expect(screen.getByText("jane")).toBeInTheDocument()
    })

    expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=2&record_limit=10")
  })

  it("doesn't load more when no more records available", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce({
      options: [{ label: "aarthi", value: "U030" }],
      total_records: 1, // Only 1 record total
    })

    renderComponent()

    userEvent.click(screen.getByText("Select options"))

    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument()
    })

    const dropdownContent = await screen.findByRole("listbox")
    fireEvent.scroll(dropdownContent, { target: { scrollTop: dropdownContent.scrollHeight } })

    expect(fetchDropDownData).toHaveBeenCalledTimes(1)
  })

  it("handles API errors gracefully", async () => {
    (fetchDropDownData as jest.Mock).mockRejectedValueOnce(new Error("API error"))

    console.error = jest.fn() // Suppress error logs

    renderComponent()

    userEvent.click(screen.getByText("Select options"))

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    })

    expect(console.error).toHaveBeenCalledWith("Dropdown fetch error:", expect.any(Error))
  })

  it("resets search when dropdown is closed and reopened", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValue(mockOptionsPage1)

   renderComponent()

    userEvent.click(screen.getByText("Select options"))

    const searchInput = await screen.findByPlaceholderText("Search")
    userEvent.type(searchInput, "test")

    userEvent.click(document.body)

    userEvent.click(screen.getByText("Select options"))

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

    userEvent.click(screen.getByText("Select options"))

    await waitFor(() => {
      expect(screen.getByText("No results found")).toBeInTheDocument()
    })
  })



  it("handles option selection", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptionsPage1)

    renderComponent()


    await userEvent.click(screen.getByText("Select options"))

    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText("aarthi"))

    expect(handleChange).toHaveBeenCalledWith([{ label: "aarthi", value: "U030" }])

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

    const removeButtons = screen.getAllByRole("button", {
      name: /remove/i
    })

    await userEvent.click(removeButtons[0])

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

    await userEvent.click(screen.getByText("Select options"));

    const option1 = await screen.findByTestId("option-U030");
    await userEvent.click(option1);
    expect(handleChange).toHaveBeenCalledWith([{ label: "aarthi", value: "U030" }]);

    rerender(
      <MultiSelectLazyDropdown
        value={[{ label: "aarthi", value: "U030" }]}
        onChange={handleChange}
      />
    );

    const option2 = await screen.findByTestId("option-U029");
    await userEvent.click(option2);
    expect(handleChange).toHaveBeenCalledWith([
      { label: "aarthi", value: "U030" },
      { label: "akhsay", value: "U029" }
    ]);

    rerender(
      <MultiSelectLazyDropdown
        value={[
          { label: "aarthi", value: "U030" },
          { label: "akhsay", value: "U029" }
        ]}
        onChange={handleChange}
      />
    );

    await userEvent.click(await screen.findByTestId("option-U030"));
    expect(handleChange).toHaveBeenCalledWith([{ label: "akhsay", value: "U029" }]);
  });

  it("reset search and call fetch on reopen", async () => {
    (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptionsPage1)

    renderComponent()

    await userEvent.click(screen.getByText("Select options"))

    const searchInput = await screen.findByPlaceholderText("Search")
    await userEvent.type(searchInput, "test");

    expect(searchInput).toHaveValue("test");

    await userEvent.click(document.body) // Close dropdown

    await userEvent.click(screen.getByText("Select options")) // Reopen dropdown

    const newSearchInput = await screen.findByPlaceholderText("Search");


    await waitFor(() => {
       expect(newSearchInput).toHaveValue("");
    })
     expect(fetchDropDownData).toHaveBeenCalledWith("search=&page=1&record_limit=10");
  }
  )

})