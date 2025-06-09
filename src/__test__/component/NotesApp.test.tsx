import NotesApp from "@/components/NotesApp";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Testing NotesApp Component", () => {
  beforeEach(() => {
    render(<NotesApp />);
  });
  it("render notses app", () => {
    const notesHead = screen.getByText(/notes/i);
    expect(notesHead).toBeInTheDocument();
  }
  );
  it("should render text element with placeholder", () => {
    const placeholderText = screen.getByPlaceholderText(/Note Title/i);
    expect(placeholderText).toBeInTheDocument();
  });
  it("should render button element with text", () => {
    const buttonElement = screen.getByRole("button", { name: /Add Note/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it("button should be disabled when input is empty", () => {
    const buttonElement = screen.getByRole("button", { name: /Add Note/i });
    expect(buttonElement).toBeDisabled();
  });

  it("should enable button when input has text", () => {
    const inputElement = screen.getByPlaceholderText(/Note Title/i);
    const buttonElement = screen.getByRole("button", { name: /Add Note/i });
    fireEvent.change(inputElement, { target: { value: "1" } });
    expect(buttonElement).toBeEnabled();
  });

  it("should add note when form is submitted", () => {
    const inputElement = screen.getByPlaceholderText(/Note Title/i);
    const buttonElement = screen.getByRole("button", { name: /Add Note/i });
    const notesList = screen.getByTestId("notes_list");
    expect(notesList.querySelectorAll("li").length).toBe(0);
    fireEvent.change(inputElement, { target: { value: "Test Note 1" } });
    fireEvent.click(buttonElement);

    expect(notesList.querySelectorAll("li").length).not.toBe(0);

  });
  // New test to cover the missing branch
  it("should not add note when form is submitted with empty or whitespace input", () => {
    const inputElement = screen.getByPlaceholderText(/Note Title/i);
    const buttonElement = screen.getByRole("button", { name: /Add Note/i });
    const notesList = screen.getByTestId("notes_list");

    // Test with whitespace input
    fireEvent.change(inputElement, { target: { value: " " } });
    expect(buttonElement).toBeEnabled(); // Button is enabled because input is not empty
    fireEvent.click(buttonElement);
    expect(notesList.querySelectorAll("li").length).toBe(0); // No note should be added
  });

})

