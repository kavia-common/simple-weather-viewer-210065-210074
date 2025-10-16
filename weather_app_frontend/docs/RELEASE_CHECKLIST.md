# Release Checklist

## Purpose
This checklist verifies readiness of the Weather App Frontend for a release. It focuses on validation controls, audit behavior, documentation, and testing, aligning with GxP-oriented practices for a frontend demo.

## Pre-Release Validation
- [ ] Environment variables documented and configured (REACT_APP_OPENWEATHER_API_KEY if real mode is required).
- [ ] Mock vs Real mode behavior verified (UI pill shown in mock; real mode fetch normalizes data).
- [ ] Input validation behavior verified (rejects empty, too long, or invalid characters).
- [ ] Error messages verified (404, network error, generic service errors).
- [ ] Audit trail writes SEARCH and READ entries with ISO timestamps.

## Testing
- [ ] All unit and integration tests pass locally (npm test).
- [ ] Coverage meets or exceeds 80% (npm run test:coverage).
- [ ] GxP compliance tests pass (validation and audit trail behavior).
- [ ] No reliance on external network in test runs unless explicitly mocked.

## Security and Compliance
- [ ] No secrets committed to the repository.
- [ ] README and COMPLIANCE docs reviewed and current.
- [ ] Access control placeholders acknowledged (no RBAC in this demo).
- [ ] Dependencies reviewed and updated where necessary.

## Documentation
- [ ] README includes setup, scripts, environment, mock vs real modes, usage, and links to docs.
- [ ] ARCHITECTURE.md reflects current components and services.
- [ ] API_GUIDE.md describes the integration and mock schema.
- [ ] TESTING.md includes commands, coverage, and test inventory.
- [ ] TRACEABILITY_MATRIX.md updated with REQ-to-implementation-to-test mapping.

## Build and Packaging
- [ ] Production build succeeds (npm run build).
- [ ] Static assets reference the correct paths.
- [ ] Any deployment-specific configurations prepared as needed.

Sources:
- package.json (scripts)
- src/services/WeatherService.js
- src/utils/validation.js
- src/utils/audit.js
- src/App.js
- Test suite under src/__tests__
