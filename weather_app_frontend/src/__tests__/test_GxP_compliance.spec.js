 /**
  * GxP Compliance Test Suite
  * Traceability: ALCOA+ principles; REQ-FE-AUD-001, REQ-FE-VAL-001, REQ-FE-APP-001
  * Scope: Frontend-only demonstration. No backend persistence or RBAC here.
  */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import { getAuditLog, clearAuditLog } from "../utils/audit";
import * as WeatherService from "../services/WeatherService";

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe("GxP Compliance Checks (Frontend Demo)", () => {
  beforeEach(() => {
    jest.spyOn(WeatherService, "isMockMode").mockReturnValue(true);
    jest.spyOn(WeatherService, "getCurrentWeatherByCity").mockResolvedValue({
      city: "Boston",
      country: "US",
      tempC: 17,
      condition: "Clouds",
      humidity: 55,
      windKph: 9,
      iconUrl: "https://openweathermap.org/img/wn/02d@2x.png",
      mock: true,
    });
    clearAuditLog();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Audit trail entries include userId, ISO timestamp, action, outcome, and message/meta where available", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("city-input"), { target: { value: "Boston" } });
    fireEvent.click(screen.getByLabelText("search-button"));
    await screen.findByLabelText("weather-card");

    const entries = getAuditLog();
    expect(entries.length).toBeGreaterThanOrEqual(2);

    entries.forEach((e) => {
      expect(e.userId).toBe("anonymous");
      expect(isoRegex.test(e.timestamp)).toBe(true);
      expect(["SEARCH", "READ"]).toContain(e.action);
      expect(["SUCCESS", "ERROR"]).toContain(e.outcome);
    });
    const read = entries.find((e) => e.action === "READ");
    expect(read).toBeTruthy();
    // meta presence for mock indicator is optional but if present should be boolean flag
    if (read.meta) {
      expect(typeof read.meta.mock === "boolean").toBe(true);
    }
  });

  test("Validation control prevents empty or invalid input from invoking service", () => {
    const getSpy = jest.spyOn(WeatherService, "getCurrentWeatherByCity");
    render(<App />);

    // Empty -> validation error
    fireEvent.click(screen.getByLabelText("search-button"));
    expect(screen.getByRole("alert")).toHaveTextContent(/please enter a city name/i);

    // Invalid -> validation error
    fireEvent.change(screen.getByLabelText("city-input"), { target: { value: "Bad!!" } });
    fireEvent.click(screen.getByLabelText("search-button"));
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent(/letters, spaces, hyphens, apostrophes, periods, or commas/i);

    expect(getSpy).not.toHaveBeenCalled();
  });

  test("Access control placeholder check: UI renders without privileged actions (no RBAC)", () => {
    // For frontend demo, there are no privileged actions. Test ensures no unexpected admin controls.
    render(<App />);
    expect(screen.queryByText(/admin/i)).toBeNull();
    expect(screen.queryByText(/role/i)).toBeNull();
  });
});
