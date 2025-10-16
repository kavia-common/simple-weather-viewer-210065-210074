# API Guide

## Overview
The application integrates with OpenWeatherMap in real mode and provides a deterministic client-side mock in mock mode. This guide documents the request/response shapes, error behaviors, and the mock schema.

## Modes
- Mock Mode
  - Trigger: REACT_APP_OPENWEATHER_API_KEY not set or empty.
  - Behavior: No network calls. Returns deterministic data based on the city string.
- Real Mode
  - Trigger: REACT_APP_OPENWEATHER_API_KEY is non-empty.
  - Behavior: Fetches current weather from OpenWeatherMap and normalizes the response.

## Endpoints (Real Mode)
- Base: https://api.openweathermap.org/data/2.5/weather
- Method: GET
- Query Parameters:
  - q: City (string, validated in UI)
  - appid: API key (REACT_APP_OPENWEATHER_API_KEY)
  - units: metric
- Example:
  - GET https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY&units=metric

## Normalized Response Object
WeatherService.getCurrentWeatherByCity returns a standardized object:
- city: string
- country: string
- tempC: number (rounded from main.temp metric)
- condition: string (weather[0].main)
- humidity: number (main.humidity)
- windKph: number (converted from m/s to km/h)
- iconUrl: string (OpenWeather icon URL)
- mock: boolean (false in real mode, true in mock mode)

## Error Handling
- 404 Not Found: Thrown as Error("City not found. Please check the spelling.")
- Network Failure: Thrown as Error("Network error: Unable to reach weather service.")
- Other Non-OK: Thrown as Error("Weather service error. Please try again later.")

Errors are caught by App, which displays a friendly alert and logs an audit entry with outcome "ERROR".

## Mock Mode Data Schema
When in mock mode, the following object is returned:
- city: input city string
- country: "XX"
- tempC: number (15–29 inclusive based on a hash of the city)
- condition: one of ["Clear","Clouds","Rain","Drizzle","Thunderstorm","Snow","Mist"]
- humidity: number (40–89)
- windKph: number (4–23)
- iconUrl: https://openweathermap.org/img/wn/{icon}@2x.png
- mock: true

## Integration Points in Code
- isMockMode(): Determines whether mock mode is active by inspecting environment variables.
- getCurrentWeatherByCity(city): Performs the normalized fetch in real mode or returns mock data in mock mode.
- App.js: Orchestrates calls, handles errors, and logs audits.

## Request and Response Examples
- Request (Real): GET /data/2.5/weather?q=Paris&appid=KEY&units=metric
- Normalized Response:
  {
    "city": "Paris",
    "country": "FR",
    "tempC": 22,
    "condition": "Clear",
    "humidity": 40,
    "windKph": 12,
    "iconUrl": "https://openweathermap.org/img/wn/01d@2x.png",
    "mock": false
  }

- Mock Response:
  {
    "city": "Paris",
    "country": "XX",
    "tempC": 27,
    "condition": "Clouds",
    "humidity": 66,
    "windKph": 10,
    "iconUrl": "https://openweathermap.org/img/wn/02d@2x.png",
    "mock": true
  }

Sources:
- src/services/WeatherService.js
- src/App.js
