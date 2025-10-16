 /**
  * Traceability: REQ-FE-APP-001; REQ-FE-AUD-001; REQ-FE-VAL-001
  * GxP Impact: YES (Validation + Audit Trail)
  * Purpose: Integration tests for end-to-end flows in mock mode and error scenarios.
  */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import * as WeatherService from "../services/WeatherService";
import App from "../App";
import { getAuditLog, clearAuditLog } from "../utils/audit";
import { AuthProvider } from "../context/AuthContext";

function renderWithAuth() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

async function quickLoginAs(username = "jane") {
  fireEvent.change(screen.getByLabelText("login-identifier"), { target: { value: username } });
  fireEvent.change(screen.getByLabelText("login-password"), { target: { value: "Secret123" } });
  fireEvent.click(screen.getByLabelText("login-submit"));
  await screen.findByLabelText("city-input");
}

describe("App Integration Flows (GxP)", () => {
  beforeEach(() => {
    jest.spyOn(WeatherService, "isMockMode").mockReturnValue(true);
    clearAuditLog();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders search and mock mode indicator", async () => {
    renderWithAuth();
    await quickLoginAs();
    expect(screen.getByLabelText("city-input")).toBeInTheDocument();
    expect(screen.getByLabelText("search-button")).toBeInTheDocument();
    expect(screen.getByRole("note", { name: /mock-indicator/ })).toHaveTextContent(/Mock mode/i);
  });

  test("happy path: search displays weather card and writes audit", async () => {
    jest.spyOn(WeatherService, "getCurrentWeatherByCity").mockResolvedValue({
      city: "Paris",
      country: "FR",
      tempC: 21,
      condition: "Clear",
      humidity: 40,
      windKph: 10,
      iconUrl: "https://openweathermap.org/img/wn/01d@2x.png",
      mock: true,
    });
    renderWithAuth();
    await quickLoginAs();

    fireEvent.change(screen.getByLabelText("city-input"), { target: { value: "Paris" } });
    fireEvent.click(screen.getByLabelText("search-button"));

    const card = await screen.findByLabelText("weather-card");
    expect(card).toHaveTextContent(/Paris/);

    // Audit entries should have SEARCH + READ
    const log = getAuditLog();
    expect(log.length).toBeGreaterThanOrEqual(2);
    expect(log.some((e) => e.action === "SEARCH" && e.outcome === "SUCCESS")).toBe(true);
    expect(log.some((e) => e.action === "READ" && e.outcome === "SUCCESS")).toBe(true);
  });

  test("validation error for empty query shown as alert", async () => {
    renderWithAuth();
    await quickLoginAs();

    fireEvent.click(screen.getByLabelText("search-button"));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/please enter a city name/i);
  });

  test("error path: service throws, shows user-friendly message and logs error", async () => {
    jest.spyOn(WeatherService, "getCurrentWeatherByCity").mockRejectedValue(new Error("City not found. Please check the spelling."));
    renderWithAuth();
    await quickLoginAs();

    fireEvent.change(screen.getByLabelText("city-input"), { target: { value: "Xyz" } });
    fireEvent.click(screen.getByLabelText("search-button"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/City not found/i);

    const log = getAuditLog();
    expect(log.some((e) => e.action === "READ" && e.outcome === "ERROR")).toBe(true);
  });

  test("loading state disables controls while searching", async () => {
    jest.spyOn(WeatherService, "getCurrentWeatherByCity").mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        city: "Rome",
        country: "IT",
        tempC: 25,
        condition: "Clear",
        humidity: 30,
        windKph: 8,
        iconUrl: "https://openweathermap.org/img/wn/01d@2x.png",
        mock: true,
      }), 50))
    );

    renderWithAuth();
    await quickLoginAs();
    fireEvent.change(screen.getByLabelText("city-input"), { target: { value: "Rome" } });
    fireEvent.click(screen.getByLabelText("search-button"));

    // Immediately after click, button should be disabled (busy state)
    expect(screen.getByLabelText("search-button")).toBeDisabled();

    const card = await screen.findByLabelText("weather-card");
    expect(card).toBeInTheDocument();
  });

  test("handles special characters and long input via validation", async () => {
    renderWithAuth();
    await quickLoginAs();
    fireEvent.change(screen.getByLabelText("city-input"), { target: { value: "Invalid!!" } });
    fireEvent.click(screen.getByLabelText("search-button"));
    expect(screen.getByRole("alert")).toHaveTextContent(/letters, spaces, hyphens, apostrophes, periods, or commas/i);
  });
});
