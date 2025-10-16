import React, { useEffect, useState } from "react";
import "./App.css";
import { applyThemeToDocument } from "./styles/theme";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import AuditLogPanel from "./components/AuditLogPanel";
import { addAuditEntry } from "./utils/audit";
import { getCurrentWeatherByCity, isMockMode } from "./services/WeatherService";

// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-APP-001
// User Story: As a user, I can search a city to see current weather on a single page.
// Acceptance Criteria: Centered card layout, validation, error handling, mock banner,
// audit log with timestamp/action/query/outcome, Ocean Professional theme.
// GxP Impact: YES (Validation + Audit Trail, frontend only)
// Risk Level: LOW
// Validation Protocol: VP-FE-APP-001
// ============================================================================

// PUBLIC_INTERFACE
function App() {
  // Theme is fixed to Ocean Professional using CSS variables
  useEffect(() => {
    applyThemeToDocument();
  }, []);

  const [busy, setBusy] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (city) => {
    setBusy(true);
    setError("");
    addAuditEntry({ action: "SEARCH", query: city, outcome: "SUCCESS", message: "Search submitted" });

    try {
      const data = await getCurrentWeatherByCity(city);
      setWeather(data);
      addAuditEntry({
        action: "READ",
        query: city,
        outcome: "SUCCESS",
        message: `Weather: ${data.condition}, ${data.tempC}°C`,
        meta: { mock: data.mock },
      });
    } catch (e) {
      const msg = e?.message || "Unexpected error.";
      setError(msg);
      setWeather(null);
      addAuditEntry({ action: "READ", query: city, outcome: "ERROR", message: msg });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.brand}>
            <span style={styles.logoDot} aria-hidden>●</span>
            <span style={styles.brandText}>Simple Weather</span>
          </div>
          {isMockMode() && (
            <div style={styles.mockPill} role="note" aria-label="mock-indicator">
              Mock mode
            </div>
          )}
        </div>

        <div style={styles.search}>
          <SearchBar onSearch={handleSearch} busy={busy} />
        </div>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.result}>
          {weather ? (
            <WeatherCard data={weather} />
          ) : (
            <div style={styles.placeholder}>
              Search for a city to view the current weather.
            </div>
          )}
        </div>

        <AuditLogPanel />
      </div>
      <div style={styles.footer}>
        <span>Powered by </span>
        <a
          href="https://openweathermap.org"
          target="_blank"
          rel="noreferrer"
          style={styles.link}
        >
          OpenWeather
        </a>
        <span> • Ocean Professional Theme</span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(249,250,251,1) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "720px",
    background: "var(--color-surface)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--color-border)",
    padding: "20px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  brand: { display: "flex", alignItems: "center", gap: "8px" },
  logoDot: { color: "var(--color-primary)", fontSize: "20px" },
  brandText: { fontWeight: 800, fontSize: "18px", color: "var(--color-text)" },
  mockPill: {
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(59,130,246,0.12)",
    color: "var(--color-secondary)",
    fontSize: "12px",
    border: "1px solid var(--color-border)",
  },
  search: { marginBottom: "12px" },
  error: {
    color: "var(--color-error)",
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    padding: "10px",
    borderRadius: "var(--radius-sm)",
    marginBottom: "12px",
  },
  result: { marginTop: "8px" },
  placeholder: {
    color: "var(--color-subtle-text)",
    background: "var(--color-background)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    padding: "20px",
    textAlign: "center",
  },
  footer: {
    marginTop: "16px",
    color: "var(--color-subtle-text)",
    fontSize: "12px",
    textAlign: "center",
  },
  link: {
    color: "var(--color-primary)",
    textDecoration: "none",
    fontWeight: 600,
    margin: "0 4px",
  },
};

export default App;
