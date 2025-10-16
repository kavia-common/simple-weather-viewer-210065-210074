//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-AUTH-LOGIN-001
// User Story: As a user, I can log in using email/username and password.
// Acceptance Criteria:
// - Accessible labels, input validation (required, email format optional, min password length)
// - No logging of raw password; friendly errors
// GxP Impact: YES (Access Control entry point)
// Risk Level: LOW
// Validation Protocol: VP-FE-AUTH-LOGIN-001
// ============================================================================

import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Login Component
 * Renders login form and handles client-side auth via AuthContext.
 */
export default function Login() {
  const { login } = useContext(AuthContext);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const id = emailOrUsername.trim();
    if (!id) return "Email or Username is required.";
    if (!password || password.length < 6) return "Password must be at least 6 characters.";
    // If it looks like email, do a light format check
    if (id.includes("@")) {
      // very basic email pattern
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(id)) return "Please enter a valid email address.";
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    const res = await login({ emailOrUsername, password });
    if (!res.ok) {
      setError(res.error || "Invalid credentials.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} aria-label="login-card">
        <div style={styles.header}>
          <div style={styles.brand}>
            <span style={styles.logoDot} aria-hidden>●</span>
            <span style={styles.brandText}>Simple Weather</span>
          </div>
          <div style={styles.subtitle}>Please sign in</div>
        </div>

        <form onSubmit={onSubmit} style={styles.form} aria-label="login-form">
          <label htmlFor="login-id" style={styles.label}>Email or Username</label>
          <input
            id="login-id"
            aria-label="login-identifier"
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            style={styles.input}
            placeholder="you@example.com or username"
            autoComplete="username"
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 3px var(--color-focus)`;
              e.currentTarget.style.borderColor = "var(--color-primary)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          />

          <label htmlFor="login-password" style={styles.label}>Password</label>
          <input
            id="login-password"
            aria-label="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter password"
            autoComplete="current-password"
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 3px var(--color-focus)`;
              e.currentTarget.style.borderColor = "var(--color-primary)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          />

          {error && <div role="alert" style={styles.error}>{error}</div>}

          <button
            type="submit"
            aria-label="login-submit"
            style={styles.button}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-primary-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-primary)";
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 3px var(--color-focus)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
          >
            Login
          </button>

          <div style={styles.hint} role="note">
            Mode: {(process.env.AUTH_MODE || process.env.REACT_APP_AUTH_MODE || "mock")} • In mock mode, any non-empty credentials are accepted.
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(249,250,251,1) 100%)",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  brand: { display: "flex", alignItems: "center", gap: 8 },
  logoDot: { color: "var(--color-primary)", fontSize: 20 },
  brandText: { fontWeight: 800, fontSize: 18, color: "var(--color-text)" },
  subtitle: { marginTop: 6, color: "var(--color-subtle-text)", fontSize: 14 },
  form: { display: "grid", gap: 10 },
  label: { fontSize: 14, color: "var(--color-text)", fontWeight: 600 },
  input: {
    padding: "12px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
    outline: "none",
    fontSize: 16,
    color: "var(--color-text)",
    background: "var(--color-surface)",
    transition: "var(--transition-fast)",
    boxShadow: "var(--shadow-sm)",
  },
  error: {
    color: "var(--color-error)",
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    padding: 10,
    borderRadius: "var(--radius-sm)",
  },
  button: {
    marginTop: 6,
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
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: "var(--color-subtle-text)",
  },
};
