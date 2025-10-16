 /**
  * Traceability: REQ-FE-COMP-WCARD-001
  * GxP Impact: NO
  */
import React from "react";
import { render, screen } from "@testing-library/react";
import WeatherCard from "../components/WeatherCard";

const base = {
  city: "Paris",
  country: "FR",
  tempC: 22,
  condition: "Clear",
  humidity: 40,
  windKph: 12,
  iconUrl: "https://openweathermap.org/img/wn/01d@2x.png",
};

describe("Component: WeatherCard", () => {
  test("renders weather metrics and labels", () => {
    render(<WeatherCard data={base} />);
    const card = screen.getByLabelText("weather-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent(/Paris, FR/);
    expect(card).toHaveTextContent(/Clear/);
    expect(card).toHaveTextContent(/22°C/);
    expect(card).toHaveTextContent(/Humidity/);
    expect(card).toHaveTextContent(/Wind/);
    const img = card.querySelector("img");
    expect(img).toHaveAttribute("src", base.iconUrl);
    expect(img).toHaveAttribute("alt", "Clear");
  });

  test("shows mock banner when data.mock is true", () => {
    render(<WeatherCard data={{ ...base, mock: true }} />);
    expect(screen.getByRole("note")).toHaveTextContent(/Mock mode active/);
  });

  test("does not render when no data", () => {
    const { container } = render(<WeatherCard data={null} />);
    expect(container.firstChild).toBeNull();
  });
});
