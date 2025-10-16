# GxP Compliance Notes

## Scope
This is a frontend-only demonstration of GxP-oriented practices. It implements input validation and a client-side audit trail suitable for non-regulated demos. For regulated environments, server-side controls, identity management, and persistent audit logging are required.

## ALCOA+ Mapping
- Attributable: Audit entries include userId (pseudo-user “anonymous”) and action (SEARCH/READ). Source: src/utils/audit.js and calls in src/App.js.
- Legible: Code includes descriptive comments and clear function names. Public interfaces and requirement blocks are present in modules.
- Contemporaneous: Audit entries are written at the time of the action using new Date().toISOString().
- Original: In this demo, audit data is stored locally. For production, persist to a backend with immutable storage.
- Accurate: Input validation prevents invalid queries; service normalizes data and translates errors to user-friendly messages.
- Complete: Audit entries capture timestamps, action, query, outcome, and optional message/meta.
- Consistent: Validation is centralized in src/utils/validation.js; audit utils ensure a consistent entry format.
- Enduring: In this demo, audit storage is localStorage and can be cleared by the user. For GxP, use secure, durable storage with retention policies.
- Available: The UI is accessible without authentication. For GxP, implement access controls and role-based authorization for sensitive features.

## Implemented Controls
- Audit Trail
  - Location: src/utils/audit.js with addAuditEntry, getAuditLog, clearAuditLog.
  - Usage: App logs SEARCH before service calls and READ after success/error.
  - Data: ISO timestamp, pseudo-user id, action, query, outcome, message/meta.
- Validation Controls
  - Location: src/utils/validation.js and used in src/components/SearchBar.jsx.
  - Behavior: Trims, length checks, and enforces allowed characters. Shows alert on error.
- Error Handling
  - Location: src/services/WeatherService.js and src/App.js.
  - Behavior: Network and service errors converted into friendly messages. 404 → “City not found.”
- Access Controls (Placeholder)
  - No authentication/RBAC included in this demo.
  - For GxP deployments: integrate SSO/OAuth, enforce role checks on privileged operations, secure storage of secrets, and server-side authorization.

## Electronic Signatures (Placeholder)
- Not implemented in this demo.
- For critical operations in regulated environments:
  - Capture intent and meaning of signature.
  - Bind signature to data and include cryptographic non-repudiation mechanisms.
  - Verify identity with strong authentication.

## Required Artifacts and Where They Appear
- Audit Log: Client-side entries available in the AuditLogPanel and localStorage.
- Validation Evidence: Unit tests in src/__tests__ covering validation and GxP checks.
- Error Handling Evidence: Service tests simulate network and 404 errors and verify messages.
- Access Controls: Not applicable here; see placeholders above.

## Change Control and Versioning
- This repo version history serves as change tracking for the demo. For GxP, adopt formal change control, review, and approval workflows.

Sources:
- src/utils/audit.js
- src/utils/validation.js
- src/services/WeatherService.js
- src/components/AuditLogPanel.jsx
- src/App.js
- Test files under src/__tests__ and src/App.test.js
