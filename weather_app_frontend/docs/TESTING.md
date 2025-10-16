# Testing Strategy

## Overview
The project uses Jest and React Testing Library to provide unit and integration coverage. Tests validate input controls, audit behavior, data normalization in services, and component rendering. The test environment includes defaults for fetch and localStorage to ensure deterministic, isolated runs.

## How to Run
- Run tests once:
  - npm test
- Run tests with coverage:
  - npm run test:coverage

The coverage goal is 80% or higher for lines and statements. You can configure CI to enforce this threshold. The existing test suite is designed to meet or exceed this target for this frontend scope.

## Test Environment
- src/setupTests.js:
  - Adds jest-dom matchers.
  - Sets a default global.fetch mock (tests can override).
  - Injects a stable localStorage mock per test.
  - Resets process.env per test to avoid leakage.

## Test Inventory
- src/App.test.js
  - Renders search UI and validates empty input errors.
  - Executes a mock mode search and displays WeatherCard.
  - Confirms audit log entries appear after a search.
- src/__tests__/test_App_flows.spec.jsx
  - End-to-end flows in mock mode including happy path, validation, and error scenarios.
  - Loading state disables controls.
  - Validation of special characters and long input behavior.
- src/__tests__/test_AuditLogPanel.spec.jsx
  - Toggle behavior for audit visibility.
  - Rendering of entries with metadata.
  - Clear button removes entries.
- src/__tests__/test_GxP_compliance.spec.js
  - GxP audit entries include userId, ISO timestamp, action, outcome.
  - Validation prevents invalid input from reaching the service.
  - Placeholder check for absence of privileged actions.
- src/__tests__/test_SearchBar.spec.jsx
  - Accessibility labels, validation errors, Enter key submission, busy state handling, boundary checks.
- src/__tests__/test_WeatherCard.spec.jsx
  - Rendering metrics and labels, mock banner presence, null data behavior.
- src/__tests__/test_audit_utils.spec.js
  - Audit entry structure, timestamp format, ordering, clear behavior, corrupted storage tolerance.
- src/__tests__/test_validation_utils.spec.js
  - Validation for null/undefined, whitespace, diacritics, length, character set.
- src/__tests__/validation.test.js
  - Additional validation checks for length and invalid characters.

## Coverage Command
- npm run test:coverage
This prints a coverage summary. You can integrate thresholds in CI to enforce a minimum coverage.

## Mock vs Real Mode in Tests
- Default behavior uses mock mode (no API key in tests).
- Some tests temporarily set REACT_APP_OPENWEATHER_API_KEY to simulate real mode normalization and error paths by stubbing fetch.

## Traceability in Tests
Many tests include comment headers with REQ IDs and GxP scope for traceability. See docs/TRACEABILITY_MATRIX.md for mapping.

Sources:
- package.json (scripts)
- src/setupTests.js
- All test files listed above
