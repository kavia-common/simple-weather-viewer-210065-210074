 /**
  * Traceability: REQ-FE-COMP-SEARCH-001; VP-FE-COMP-SEARCH-001
  * GxP Impact: YES (Validation Controls)
  * Purpose: Verify rendering, accessibility, validation errors, disabled states, and submission behavior.
  */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

describe("Component: SearchBar (GxP)", () => {
  test("renders input and button with accessible labels", () => {
    render(<SearchBar onSearch={() => {}} busy={false} />);
    expect(screen.getByLabelText("city-input")).toBeInTheDocument();
    expect(screen.getByLabelText("search-button")).toBeInTheDocument();
  });

  test("shows validation message on empty submit", () => {
    render(<SearchBar onSearch={() => {}} busy={false} />);
    fireEvent.click(screen.getByLabelText("search-button"));
    expect(screen.getByRole("alert")).toHaveTextContent(/please enter a city name/i);
  });

  test("submits cleaned value and clears error", () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} busy={false} />);
    const input = screen.getByLabelText("city-input");
    fireEvent.change(input, { target: { value: "  New York  " } });
    fireEvent.click(screen.getByLabelText("search-button"));
    expect(onSearch).toHaveBeenCalledWith("New York");
  });

  test("supports Enter key submission", () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} busy={false} />);
    const input = screen.getByLabelText("city-input");
    fireEvent.change(input, { target: { value: "London" } });
    fireEvent.submit(input.closest("form"));
    expect(onSearch).toHaveBeenCalledWith("London");
  });

  test("disables input and button when busy", () => {
    render(<SearchBar onSearch={() => {}} busy={true} />);
    expect(screen.getByLabelText("city-input")).toBeDisabled();
    expect(screen.getByLabelText("search-button")).toBeDisabled();
    expect(screen.getByLabelText("search-button")).toHaveTextContent(/searching/i);
  });

  test("rejects overly long input", () => {
    render(<SearchBar onSearch={() => {}} busy={false} />);
    const long = "x".repeat(70);
    fireEvent.change(screen.getByLabelText("city-input"), { target: { value: long } });
    fireEvent.click(screen.getByLabelText("search-button"));
    expect(screen.getByRole("alert")).toHaveTextContent(/too long/i);
  });

  test("rejects invalid characters", () => {
    render(<SearchBar onSearch={() => {}} busy={false} />);
    fireEvent.change(screen.getByLabelText("city-input"), { target: { value: "Paris!!" } });
    fireEvent.click(screen.getByLabelText("search-button"));
    expect(screen.getByRole("alert")).toHaveTextContent(/letters, spaces, hyphens, apostrophes, periods, or commas/i);
  });
});
