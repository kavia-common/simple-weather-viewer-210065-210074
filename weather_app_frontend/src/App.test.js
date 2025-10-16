import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Using mock mode (no API key), tests should be deterministic.

test("renders search input and button", () => {
  render(<App />);
  expect(screen.getByLabelText("city-input")).toBeInTheDocument();
  expect(screen.getByLabelText("search-button")).toBeInTheDocument();
});

test("shows validation error for empty input", async () => {
  render(<App />);
  fireEvent.click(screen.getByLabelText("search-button"));
  expect(await screen.findByRole("alert")).toHaveTextContent(/please enter a city name/i);
});

test("performs a search and displays weather card (mock mode)", async () => {
  render(<App />);
  const input = screen.getByLabelText("city-input");
  fireEvent.change(input, { target: { value: "Paris" } });
  fireEvent.click(screen.getByLabelText("search-button"));
  const card = await screen.findByLabelText("weather-card");
  expect(card).toBeInTheDocument();
  expect(card).toHaveTextContent(/Paris/i);
});

test("audit log records actions", async () => {
  render(<App />);
  const input = screen.getByLabelText("city-input");
  fireEvent.change(input, { target: { value: "Berlin" } });
  fireEvent.click(screen.getByLabelText("search-button"));
  await screen.findByLabelText("weather-card");

  fireEvent.click(screen.getByText(/show audit log/i));
  await waitFor(() => {
    expect(screen.getByText(/Audit Entries/i)).toBeInTheDocument();
  });
  // Should contain at least one SUCCESS entry
  expect(screen.getAllByText(/SUCCESS/i).length).toBeGreaterThan(0);
});
