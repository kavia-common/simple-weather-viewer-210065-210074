# Traceability Matrix

## Introduction
This matrix maps requirement IDs to implementation locations and associated tests. The goal is to provide end-to-end visibility for validation and audit purposes within this frontend-only demo.

## Matrix

### REQ-FE-APP-001
- Description: Single-page app where users can search a city and view current weather with theme, validation, error handling, mock indicator, and audit logging.
- Implementation:
  - src/App.js (orchestration, theme application, mock pill, audit logging)
  - src/components/WeatherCard.jsx (display weather)
  - src/components/SearchBar.jsx (input + validation handling)
  - src/components/AuditLogPanel.jsx (audit visibility)
- Tests:
  - src/App.test.js
  - src/__tests__/test_App_flows.spec.jsx
  - src/__tests__/test_GxP_compliance.spec.js

### REQ-FE-SRV-001
- Description: WeatherService with mock and real modes; normalized result and user-friendly errors.
- Implementation:
  - src/services/WeatherService.js
- Tests:
  - src/__tests__/test_weather_service.spec.js

### REQ-FE-VAL-001
- Description: Validate city input with constraints and friendly error messages.
- Implementation:
  - src/utils/validation.js
  - src/components/SearchBar.jsx (uses validateCityQuery)
- Tests:
  - src/__tests__/test_validation_utils.spec.js
  - src/__tests__/validation.test.js
  - src/__tests__/test_SearchBar.spec.jsx

### REQ-FE-AUD-001
- Description: Client-side audit trail capturing timestamp, action, query, outcome, message/meta, and pseudo-user id.
- Implementation:
  - src/utils/audit.js
  - src/App.js (SEARCH and READ logging)
  - src/components/AuditLogPanel.jsx (visibility and clear)
- Tests:
  - src/__tests__/test_audit_utils.spec.js
  - src/__tests__/test_App_flows.spec.jsx
  - src/App.test.js
  - src/__tests__/test_GxP_compliance.spec.js

### REQ-FE-COMP-SEARCH-001
- Description: SearchBar component with input, validation, submit button, and Enter key support.
- Implementation:
  - src/components/SearchBar.jsx
- Tests:
  - src/__tests__/test_SearchBar.spec.jsx

### REQ-FE-COMP-WCARD-001
- Description: WeatherCard displays weather metrics in a modern, themed card.
- Implementation:
  - src/components/WeatherCard.jsx
- Tests:
  - src/__tests__/test_WeatherCard.spec.jsx

### REQ-FE-COMP-AUD-001
- Description: Collapsible audit log panel showing entries and allowing clear.
- Implementation:
  - src/components/AuditLogPanel.jsx
- Tests:
  - src/__tests__/test_AuditLogPanel.spec.jsx

### REQ-FE-STYLE-001
- Description: Ocean Professional theme via CSS variables with consistent tokens.
- Implementation:
  - src/styles/theme.js
  - src/index.css (CSS variable baselines)
- Tests:
  - Visual/theming verified implicitly by component rendering tests.

### REQ-FE-AUTH-001
- Description: Frontend mock authentication with session management and audit logging; role-based access with admin-only route.
- Implementation:
  - src/context/AuthContext.jsx
  - src/utils/auth.js
  - src/components/Login.jsx
  - src/components/AdminPanel.jsx
  - src/App.js (protected views and nav)
- Tests:
  - src/__tests__/test_auth_utils.spec.js
  - src/__tests__/test_auth_integration.spec.jsx
  - Updated flows in src/App.test.js and src/__tests__/test_App_flows.spec.jsx

Sources:
- Code files and test files listed in each row above.
