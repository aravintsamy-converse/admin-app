import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MultiSelectLazyDropdown } from "@/components/TableUI/multi-select-dropdown"
import { fetchDropDownData } from "@/Services/Pages/User/TableServices"
import userEvent from "@testing-library/user-event"

jest.mock("@/Services/Pages/User/TableServices", () => ({
  fetchDropDownData: jest.fn(),
}))

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

window.HTMLElement.prototype.scrollIntoView = function () { };

const mockOptions = {
  options: [
    { label: "aarthi", value: "U030" },
    { label: "akhsay", value: "U029" },
  ],
  total_records: 30,
}

describe("MultiSelectLazyDropdown", () => {
  it("renders and loads options from mock API", async () => {
    ; (fetchDropDownData as jest.Mock).mockResolvedValueOnce(mockOptions)

    const handleChange = jest.fn()

    render(
      <MultiSelectLazyDropdown
        placeholder="Select options"
        value={[]}
        onChange={handleChange}
      />
    )

    // Click the button to open dropdown
    const button = await screen.findByText('Select options')
    expect(button).toBeInTheDocument()
    userEvent.click(button)
    //  fireEvent.click(button)


    // Wait for mocked options to appear
    await waitFor(() => {
      expect(screen.getByText("aarthi")).toBeInTheDocument()
      expect(screen.getByText("akhsay")).toBeInTheDocument()
    })
  })
  
})
