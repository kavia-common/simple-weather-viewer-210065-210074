import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

// Using mock mode (no API key), tests should be deterministic.

function renderWithAuth() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

test("renders login page initially (unauthenticated), then login and see search UI", async () => {
  renderWithAuth();
  expect(screen.getByLabelText("login-card")).toBeInTheDocument();
  // Login
  fireEvent.change(screen.getByLabelText("login-identifier"), { target: { value: "jane" } });
  fireEvent.change(screen.getByLabelText("login-password"), { target: { value: "Secret123" } });
  fireEvent.click(screen.getByLabelText("login-submit"));
  // Weather UI appears
  await screen.findByLabelText("city-input");
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
