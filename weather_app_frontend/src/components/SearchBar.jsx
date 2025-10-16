//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-COMP-SEARCH-001
// User Story: Users can enter a city and submit to fetch weather.
// Acceptance Criteria: Input with validation, submit button, Enter key support.
// GxP Impact: YES (Validation Controls)
// Risk Level: LOW
// Validation Protocol: VP-FE-COMP-SEARCH-001
// ============================================================================

import React, { useState } from "react";
import { validateCityQuery } from "../utils/validation";

/**
 * PUBLIC_INTERFACE
 * SearchBar Component
 * Props:
 * - onSearch: (cleanedQuery: string) => void
 * - busy: boolean (disables input/button)
 */
export default function SearchBar({ onSearch, busy }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validateCityQuery(value);
    if (!v.valid) {
      setError(v.error || "Invalid input.");
      return;
    }
    setError("");
    onSearch(v.cleaned);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (error) setError("");
  };

  return (
    <form onSubmit={handleSubmit} aria-label="search form" style={styles.form}>
      <div style={styles.inputGroup}>
        <input
          aria-label="city-input"
          type="text"
          placeholder="Enter city (e.g., London, UK)"
          value={value}
          onChange={handleChange}
          disabled={busy}
          style={styles.input}
        />
        <button
          aria-label="search-button"
          type="submit"
          disabled={busy}
          style={{
            ...styles.button,
            ...(busy ? styles.buttonDisabled : {}),
          }}
        >
          {busy ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <div role="alert" style={styles.error}>{error}</div>}
    </form>
  );
}

const styles = {
  form: { width: "100%" },
  inputGroup: {
    display: "flex",
    gap: "8px",
    width: "100%",
  },
  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
    outline: "none",
    fontSize: "16px",
    color: "var(--color-text)",
    background: "var(--color-surface)",
    transition: "var(--transition-fast)",
    boxShadow: "var(--shadow-sm)",
  },
  button: {
    padding: "12px 18px",
    borderRadius: "var(--radius-sm)",
    border: "none",
    color: "#fff",
    background: "var(--color-primary)",
    cursor: "pointer",
    fontWeight: 600,
    transition: "var(--transition-fast)",
    boxShadow: "var(--shadow-sm)",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  error: {
    marginTop: "8px",
    color: "var(--color-error)",
    fontSize: "14px",
  },
};
