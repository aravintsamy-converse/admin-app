// useIsMobile.test.tsx
import React from "react"
import { render, screen, act, waitFor } from "@testing-library/react"
import { useIsMobile } from "@/hooks/use-mobile"

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: window.innerWidth < 768,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

function TestComponent() {
  const isMobile = useIsMobile()
  return <div data-testid="device">{isMobile ? "Mobile" : "Desktop"}</div>
}

describe("useIsMobile", () => {
  const setScreenWidth = (width: number) => {
    (window.innerWidth as number) = width
    window.dispatchEvent(new Event("resize"))
  }

  it("returns true when width is less than 768px", () => {
    act(() => {
      setScreenWidth(500)
    })
    render(<TestComponent />)
    expect(screen.getByTestId("device")).toHaveTextContent("Mobile")
  })

  it("returns false when width is 768px or more", () => {
    act(() => {
      setScreenWidth(1024)
    })
    render(<TestComponent />)
    expect(screen.getByTestId("device")).toHaveTextContent("Desktop")
  })

 it("updates value when resized", async () => {
  render(<TestComponent />)

  act(() => {
    setScreenWidth(500)
  })
  
  act(() => {
    setScreenWidth(800)
  })
  await waitFor(() => {
    expect(screen.getByTestId("device")).toHaveTextContent("Desktop")
  })
})

})
