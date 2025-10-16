//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-SRV-001
// User Story: As a user, I want to search a city and see the current weather.
// Acceptance Criteria: Two modes: real API (OpenWeatherMap) via REACT_APP_OPENWEATHER_API_KEY and mock fallback.
// GxP Impact: NO direct data persistence; includes error handling and validation.
// Risk Level: LOW
// Validation Protocol: VP-FE-SRV-001
// ============================================================================
//
// IMPORTS AND DEPENDENCIES
// - Uses fetch (browser API)
// ============================================================================

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// PUBLIC_INTERFACE
export function isMockMode() {
  /** Return true if no API key present so app uses deterministic mock data. */
  return !API_KEY || API_KEY.trim() === "";
}

// PUBLIC_INTERFACE
export async function getCurrentWeatherByCity(city) {
  /**
   * Purpose: Fetch current weather by city name. In mock mode, return deterministic data.
   * GxP Critical: No (frontend-only), includes validation & audit externally.
   * Parameters: city (string) - validated beforehand
   * Returns: { city, country, tempC, condition, humidity, windKph, iconUrl }
   * Throws: Error with user-friendly message on failure
   * Audit: Callers should log SEARCH/READ with outcome and message/meta.
   */
  if (isMockMode()) {
    // Deterministic mock based on hash of the city to vary slightly
    const seed = city.toLowerCase().split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const tempC = 15 + (seed % 15); // 15 - 29 C
    const humidity = 40 + (seed % 50); // 40 - 89 %
    const windKph = 4 + (seed % 20); // 4 - 23 kph
    const conditions = ["Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm", "Snow", "Mist"];
    const condition = conditions[seed % conditions.length];
    const iconMap = {
      Clear: "01d",
      Clouds: "02d",
      Rain: "10d",
      Drizzle: "09d",
      Thunderstorm: "11d",
      Snow: "13d",
      Mist: "50d",
    };
    return Promise.resolve({
      city,
      country: "XX",
      tempC,
      condition,
      humidity,
      windKph,
      iconUrl: `https://openweathermap.org/img/wn/${iconMap[condition]}@2x.png`,
      mock: true,
    });
  }

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new Error("Network error: Unable to reach weather service.");
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("City not found. Please check the spelling.");
    }
    throw new Error("Weather service error. Please try again later.");
  }

  const data = await res.json();
  // Normalize response
  const icon = data?.weather?.[0]?.icon || "01d";
  return {
    city: data?.name || city,
    country: data?.sys?.country || "",
    tempC: Math.round(data?.main?.temp ?? 0),
    condition: data?.weather?.[0]?.main || "Clear",
    humidity: data?.main?.humidity ?? 0,
    windKph: Math.round(((data?.wind?.speed ?? 0) * 3.6)), // m/s to km/h
    iconUrl: `https://openweathermap.org/img/wn/${icon}@2x.png`,
    mock: false,
  };
}
