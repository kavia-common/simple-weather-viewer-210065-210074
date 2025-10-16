//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-VAL-001
// User Story: Validate user input so empty or invalid city names are not searched.
// Acceptance Criteria: Non-empty, reasonable length, allowed characters, user-friendly errors.
// GxP Impact: YES (Validation Controls) - Frontend-only, no persistence.
// Risk Level: LOW
// Validation Protocol: VP-FE-VAL-001
// ============================================================================

/**
 * PUBLIC_INTERFACE
 * validateCityQuery
 * This function validates a user-provided city query string.
 * - Ensures non-empty
 * - Max length 64
 * - Allowed characters: letters, spaces, hyphens, apostrophes, commas
 * - Trims whitespace
 * @param {string} value Raw input string
 * @returns {{valid: boolean, cleaned: string, error?: string}}
 */
export function validateCityQuery(value) {
  // Trim and basic checks
  const cleaned = (value ?? "").trim();

  if (cleaned.length === 0) {
    return { valid: false, cleaned, error: "Please enter a city name." };
  }

  if (cleaned.length > 64) {
    return { valid: false, cleaned, error: "City name is too long (max 64 characters)." };
  }

  // Allow letters, spaces, hyphens, apostrophes, periods and commas
  const re = /^[A-Za-zÀ-ÿ'’\-\s\.,]+$/;
  if (!re.test(cleaned)) {
    return { valid: false, cleaned, error: "Use letters, spaces, hyphens, apostrophes, periods, or commas only." };
  }

  return { valid: true, cleaned };
}
