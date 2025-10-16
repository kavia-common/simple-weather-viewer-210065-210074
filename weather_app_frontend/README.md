# Weather App Frontend (Ocean Professional)

A single-page React app to search for a location and display current weather. Runs in:
- Real API mode using OpenWeatherMap (requires API key)
- Mock mode when no API key is configured (deterministic sample data)

No backend or database is required.

## Quick Start

1. Install dependencies
   - npm install

2. Run in development (mock mode if no API key)
   - npm start

3. Run tests
   - npm test

## Environment Variables

Copy `.env.example` to `.env` and set:

- REACT_APP_OPENWEATHER_API_KEY=your_key_here

If this variable is absent or empty, the app displays a "Mock mode" banner and uses deterministic mock data so previews still work without configuration.

## Features

- Centered card layout with search bar and current weather (temp, conditions, icon, humidity, wind)
- Ocean Professional theme (blue & slate accents, subtle shadows, rounded corners, gradients)
- Input validation and user-friendly error messages
- Client-side audit trail (localStorage) with timestamp, action (SEARCH/READ), query, outcome, message
- Collapsible audit log panel with ability to clear
- No backend dependencies

## Structure

- src/App.js: Main single-page app and layout
- src/components/SearchBar.jsx: Input and submit UI + validation feedback
- src/components/WeatherCard.jsx: Current weather display
- src/components/AuditLogPanel.jsx: Collapsible client-side audit log
- src/services/WeatherService.js: Real API mode and mock mode logic
- src/utils/validation.js: Input validation utilities
- src/utils/audit.js: Client-side audit logging utilities
- src/styles/theme.js: Ocean Professional theme variables

## Testing

The project uses React Testing Library and Jest (via CRA).
- Happy path: searches and displays weather (mock mode)
- Validation: empty input shows error
- Audit: verifies audit entries appear after a search

Run:
- npm test

## Notes on Compliance (Lightweight Frontend-Only)

- Audit trail is best-effort and stored in localStorage (non-persistent across browsers/sessions), suitable for demo and non-regulated use without backend.
- Pseudo-user id is "anonymous". Integrate real authentication and persistent audit service for regulated contexts.
- No secrets are hardcoded; API key is read from environment variables.
