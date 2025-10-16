# Architecture Overview

## Introduction
This document describes the structure of the Weather App Frontend, including its components, services, data flow, theming, and error handling. The application is a single-page React app that presents a search-driven flow to retrieve and display current weather. It adheres to the Ocean Professional style and includes lightweight validation and audit controls.

## High-Level Design
The app is organized as a small React SPA:
- App orchestrates the search flow, applies theme variables, renders the SearchBar and WeatherCard, and displays the AuditLogPanel. It now gates pages behind a mock authentication flow.
- WeatherService provides two modes: real API calls to OpenWeatherMap or deterministic mock data when no API key is set.
- Validation utilities ensure inputs conform to constraints before calling the service.
- Audit utilities record actions into localStorage.
- AuthContext manages client-side session, login/logout, and role checks. Login and Admin routes are provided in-app without a router.

## Data Flow
Auth flow (mock):
1. User lands on Login page (unauthenticated). Provides email/username and password.
2. AuthContext.authenticate validates per AUTH_MODE:
   - mock: accepts any non-empty credentials; role derived from identifier (admin* => admin).
   - envUsers: verifies against REACT_APP_AUTH_USERS JSON string.
3. On success, a session token (UUID) with userId, role, issuedAt, expiry (2h) is stored in localStorage (no password).
4. Auth events logged: AUTH_LOGIN (success/failure), AUTH_LOGOUT, AUTH_DENIED (role checks).
5. Weather page and Admin page are gated based on session/role.

Weather flow:
1. User enters a city name and submits via SearchBar.
2. App validates the input. If invalid, an alert message is shown and service calls are not made.
3. App logs a SEARCH action to the audit trail.
4. App calls WeatherService.getCurrentWeatherByCity:
   - In mock mode, deterministic data is returned for the city.
   - In real mode, the app fetches from OpenWeatherMap and normalizes the response.
5. App renders WeatherCard with the returned data or shows an alert for errors.
6. App logs a READ action with SUCCESS or ERROR outcome.
7. Users can expand AuditLogPanel to review or clear audit entries.

## Modules and Responsibilities
- src/App.js
  - Applies theme (applyThemeToDocument).
  - Manages busy and error state, coordinates search submission.
  - Displays “Mock mode” indicator if applicable.
  - Logs SEARCH/READ actions via audit utils.
- src/components/SearchBar.jsx
  - Collects user input and triggers onSearch.
  - Performs immediate validation via validateCityQuery and displays error alerts.
- src/components/WeatherCard.jsx
  - Renders city, country, temperature, condition, humidity, wind, and icon.
  - Shows a mock banner when data.mock is true.
- src/components/AuditLogPanel.jsx
  - Collapsible viewer for client-side audit entries with a “Clear” action.
- src/services/WeatherService.js
  - isMockMode: returns true when REACT_APP_OPENWEATHER_API_KEY is absent/empty.
  - getCurrentWeatherByCity: returns normalized data or throws user-friendly errors.
- src/utils/validation.js
  - validateCityQuery: trims, length-checks, and validates allowed characters.
- src/utils/audit.js
  - addAuditEntry, getAuditLog, clearAuditLog using localStorage.
- src/styles/theme.js
  - Ocean Professional theme tokens and applyThemeToDocument to set CSS variables.

## Environment and Modes
- Environment variable: REACT_APP_OPENWEATHER_API_KEY
  - Missing or empty triggers mock mode.
  - Present triggers real API requests to OpenWeatherMap with units=metric.

## Error Handling
- User input errors are caught at the SearchBar and surfaced via role="alert".
- Service errors are translated to human-friendly messages:
  - 404 → “City not found. Please check the spelling.”
  - Network failures → “Network error: Unable to reach weather service.”
  - Other service errors → “Weather service error. Please try again later.”

## Theming and Ocean Professional Style
- Theme applied by applyThemeToDocument sets CSS variables for colors, radii, shadows, and transitions.
- Components reference these variables to keep styling consistent and simple to adjust.
- Layouts use rounded corners, subtle shadows, and accessible contrast.

## Accessibility
- Form controls include aria-labels and validation messages use role="alert".
- The mock mode indicator uses role="note".
- Buttons and inputs leverage semantic elements.

## Non-Goals and Constraints
- No backend, user authentication, or persistent server-side audit logging.
- No role-based access control; only placeholder notes are included.
- No offline caching beyond localStorage for audit entries.

## Future Enhancements
- Integrate authentication and role-based access control.
- Persist audit logs to a secure backend with review/audit trails.
- Add localization and unit switching (°C/°F).
- Expand UI to include forecast and geolocation-assisted searches.

Sources:
- src/App.js
- src/components/SearchBar.jsx
- src/components/WeatherCard.jsx
- src/components/AuditLogPanel.jsx
- src/services/WeatherService.js
- src/utils/validation.js
- src/utils/audit.js
- src/styles/theme.js
