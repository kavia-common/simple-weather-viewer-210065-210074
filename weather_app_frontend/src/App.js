import React, { useEffect, useState, useContext } from "react";
import "./App.css";
import { applyThemeToDocument } from "./styles/theme";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import AuditLogPanel from "./components/AuditLogPanel";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import { addAuditEntry } from "./utils/audit";
import { getCurrentWeatherByCity, isMockMode } from "./services/WeatherService";
import { AuthContext } from "./context/AuthContext";

// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-APP-001, REQ-FE-AUTH-001
// User Story: As a user, I can search a city to see current weather on a single page.
// As a user, I must log in before accessing the weather page.
// Acceptance Criteria: Protected weather route, login/logout, role-based admin page,
// audit log entries for auth events.
// GxP Impact: YES (Validation + Audit Trail + Access Controls, frontend only)
// Risk Level: LOW
// Validation Protocol: VP-FE-APP-001; VP-FE-AUTH-001
// ============================================================================

// PUBLIC_INTERFACE
function App() {
  // Theme is fixed to Ocean Professional using CSS variables
  useEffect(() => {
    applyThemeToDocument();
  }, []);

  const { session, currentUser, logout } = useContext(AuthContext);

  const [busy, setBusy] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [route, setRoute] = useState("home"); // 'home' (weather) | 'admin' | 'login'

  useEffect(() => {
    // gate initial route
    if (!session) {
      setRoute("login");
    } else {
      setRoute("home");
    }
  }, [session]);

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

  // Top navigation with user and Login/Logout
  const TopNav = () => (
    <div style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logoDot} aria-hidden>●</span>
        <span style={styles.brandText}>Simple Weather</span>
        {isMockMode() && (
          <div style={styles.mockPill} role="note" aria-label="mock-indicator" title="Running without API key">
            Mock mode
          </div>
        )}
      </div>
      <div style={styles.navRight}>
        <button style={styles.navLink} onClick={() => setRoute("home")} aria-label="nav-home">Weather</button>
        <button style={styles.navLink} onClick={() => setRoute("admin")} aria-label="nav-admin">Admin</button>
        {session ? (
          <>
            <span style={styles.userBadge} aria-label="nav-user">{currentUser?.id} ({currentUser?.role})</span>
            <button style={styles.logoutBtn} onClick={logout} aria-label="nav-logout">Logout</button>
          </>
        ) : (
          <button style={styles.loginBtn} onClick={() => setRoute("login")} aria-label="nav-login">Login</button>
        )}
      </div>
    </div>
  );

  // Protected pages rendering
  const renderContent = () => {
    if (!session) {
      return <Login />;
    }
    if (route === "admin") {
      return <AdminPanel />;
    }
    // default 'home' weather page
    return (
      <div style={styles.card}>
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
    );
  };

  return (
    <div style={styles.page}>
      <TopNav />
      <div style={{ width: "100%", maxWidth: "720px" }}>
        {renderContent()}
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
      "linear-gradient(180deg, rgba(59,130,246,0.10) 0%, rgba(249,250,251,1) 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px",
    gap: "16px",
  },
  nav: {
    width: "100%",
    maxWidth: "960px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    padding: "10px 14px",
    boxShadow: "var(--shadow-md)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    backdropFilter: "saturate(110%) blur(2px)",
  },
  brand: { display: "flex", alignItems: "center", gap: "8px" },
  logoDot: { color: "var(--color-primary)", fontSize: "20px" },
  brandText: { fontWeight: 800, fontSize: "18px", color: "var(--color-text)" },
  navRight: { display: "flex", alignItems: "center", gap: "8px" },
  navLink: {
    background: "transparent",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 12px",
    cursor: "pointer",
    transition: "var(--transition-fast)",
    outline: "none",
  },
  userBadge: {
    padding: "6px 10px",
    borderRadius: "var(--radius-pill)",
    background: "rgba(59,130,246,0.12)",
    color: "var(--color-secondary)",
    border: "1px solid var(--color-border)",
    fontSize: 12,
  },
  loginBtn: {
    padding: "10px 14px",
    color: "#fff",
    background: "var(--color-primary)",
    border: "1px solid transparent",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    transition: "var(--transition-fast)",
    outline: "none",
  },
  logoutBtn: {
    padding: "10px 14px",
    color: "#fff",
    background: "var(--color-error)",
    border: "1px solid transparent",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    transition: "var(--transition-fast)",
    outline: "none",
  },
  mockPill: {
    padding: "6px 10px",
    borderRadius: "var(--radius-pill)",
    background:
      "linear-gradient(90deg, rgba(59,130,246,0.12) 0%, rgba(100,116,139,0.10) 100%)",
    color: "var(--color-secondary)",
    fontSize: "12px",
    border: "1px solid var(--color-border)",
    marginLeft: 8,
    boxShadow: "var(--shadow-sm)",
  },
  card: {
    width: "100%",
    background: "var(--color-surface)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--color-border)",
    padding: "20px",
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
