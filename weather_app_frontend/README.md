# Weather App Frontend (Ocean Professional)

A single-page React application that lets users search for a city and view the current weather. The interface uses the Ocean Professional theme with a clean, modern layout and accessible controls. The app can run in either real API mode (OpenWeatherMap) or a deterministic mock mode, and it includes lightweight GxP-oriented controls such as input validation and a client-side audit trail.

## Contents
- Overview
- Quick Start
- Environment Setup and Variables
- Scripts
- Mock vs Real API Modes
- Features
- Folder Structure
- Theming and Accessibility
- Error Handling
- Audit Trail and Compliance Notes
- Testing and Coverage
- Security and Access Controls (placeholder)
- Links to Additional Documentation

## Overview
This is a React SPA with no backend or database. Weather data is provided by OpenWeatherMap in real mode, or by deterministic client-side data in mock mode. The app demonstrates validation controls, user-friendly error handling, and a client-side audit trail to support ALCOA+ concepts in a frontend-only demo context.

## Quick Start
1. Install dependencies
   - npm install
2. Run in development (mock mode if no API key)
   - npm start
3. Run tests
   - npm test
4. Run tests with coverage
   - npm run test:coverage

## Environment Setup and Variables
Create .env from an example if needed and set the OpenWeatherMap API key:
- REACT_APP_OPENWEATHER_API_KEY=your_key_here

If REACT_APP_OPENWEATHER_API_KEY is absent or empty:
- The app runs in mock mode.
- A “Mock mode” pill is shown in the header and the WeatherCard displays a mock banner when applicable.
- All requests use deterministic local mock data to support previews without configuration.

Where used in code:
- src/services/WeatherService.js reads process.env.REACT_APP_OPENWEATHER_API_KEY to decide mode and construct URLs.

Note: Keep secrets out of the repo. Never commit real API keys.

## Scripts
- start: react-scripts start
- build: react-scripts build
- test: react-scripts test --watchAll=false
- test:coverage: react-scripts test --watchAll=false --coverage
- eject: react-scripts eject

## Mock vs Real API Modes
- Mock Mode
  - Trigger: REACT_APP_OPENWEATHER_API_KEY not set or empty
  - Function: isMockMode() returns true
  - Behavior: getCurrentWeatherByCity returns deterministic mock data based on city name
  - Indicators: “Mock mode” pill in header; WeatherCard may show a mock banner
- Real API Mode
  - Trigger: REACT_APP_OPENWEATHER_API_KEY is a non-empty string
  - Function: isMockMode() returns false
  - Behavior: getCurrentWeatherByCity calls OpenWeatherMap (metric units), normalizes the response, and returns a domain object
  - Error handling: 404 produces “City not found. Please check the spelling.” Network failures produce “Network error: Unable to reach weather service.”

See src/services/WeatherService.js.

## Features
- Centered card layout with SearchBar at the top and WeatherCard below
- Ocean Professional theme with accessible color choices, rounded corners, and subtle shadows
- Input validation with specific messages and prompt feedback
- Client-side audit trail persisted in localStorage capturing timestamp, action, query, outcome, and optional message/meta
- Collapsible AuditLogPanel with clear capability
- Deterministic mock mode for configuration-free demos

## Folder Structure
- src/App.js: Main SPA and flow orchestration
- src/components/SearchBar.jsx: Input with validation and submission handling
- src/components/WeatherCard.jsx: Weather display card (temp, condition, icon, humidity, wind)
- src/components/AuditLogPanel.jsx: Collapsible audit log viewer with clear action
- src/services/WeatherService.js: isMockMode and getCurrentWeatherByCity with normalization and error handling
- src/utils/validation.js: validateCityQuery implementation
- src/utils/audit.js: addAuditEntry, getAuditLog, clearAuditLog using localStorage
- src/styles/theme.js: Ocean Professional theme tokens and applyThemeToDocument helper
- src/setupTests.js: Jest and testing library setup with default fetch and localStorage mocks
- src/__tests__/: Unit and integration tests for components, utilities, and service

## Theming and Accessibility
- The Ocean Professional theme is applied at runtime via CSS variables (applyThemeToDocument in src/styles/theme.js).
- Buttons, inputs, and links adhere to accessible color contrast and include aria-labels for testing and assistive technologies.
- Validation messages are displayed using role="alert" for screen reader support.

## Error Handling
- Validation prevents empty or invalid queries from invoking the WeatherService.
- Real API errors are translated to friendly messages (e.g., “City not found” or service/network messages).
- The UI displays errors in an alert region and clears them upon successful interactions.

## Audit Trail and Compliance Notes
- Client-side audit entries are captured in localStorage with ISO timestamps, pseudo-user id (“anonymous”), action (SEARCH/READ), query, outcome, and optional message/meta.
- This is suitable for demos and non-regulated use. For regulated contexts, integrate:
  - Authenticated user identity from a real auth provider
  - Server-side persistent audit trail and access-controlled review
  - Electronic signatures for critical operations, where applicable
- Traceability is embedded in code comments (REQ-IDs in files) and tests reference these REQ-IDs.

## Testing and Coverage
- The project uses Jest and React Testing Library.
- Run all tests:
  - npm test
- Run with coverage:
  - npm run test:coverage
- Coverage goal: 80%+ lines/statements (enforced via CI policy if applicable).
- See docs/TESTING.md for test file inventory and details.

## Security and Access Controls (placeholder)
- This demo has no backend or RBAC. All actions are unprivileged.
- For production or regulated scenarios, add:
  - Authentication with secure token storage
  - Role-based authorization for protected operations
  - Secrets management through environment or vault
  - CSP and dependency scanning

## Additional Documentation
- docs/ARCHITECTURE.md: Component and service architecture overview
- docs/API_GUIDE.md: OpenWeather integration schema and mock schema
- docs/TESTING.md: Test strategy, how to run, and coverage
- docs/COMPLIANCE.md: GxP (ALCOA+) mapping and controls
- docs/RELEASE_CHECKLIST.md: Release gates and verification
- docs/TRACEABILITY_MATRIX.md: Requirement-to-implementation-to-test mapping

