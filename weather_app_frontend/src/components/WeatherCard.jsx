//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-COMP-WCARD-001
// User Story: Display current weather with temp, condition, icon, humidity, wind.
// Acceptance Criteria: Shows all fields in a clean, centered card layout.
// GxP Impact: NO
// Risk Level: LOW
// Validation Protocol: N/A
// ============================================================================

import React from "react";

/**
 * PUBLIC_INTERFACE
 * WeatherCard Component
 * Props:
 * - data: { city, country, tempC, condition, humidity, windKph, iconUrl, mock?: boolean }
 */
export default function WeatherCard({ data }) {
  if (!data) return null;

  return (
    <div style={styles.card} aria-label="weather-card">
      {data.mock && (
        <div style={styles.mockBanner} role="note">
          Mock mode active (no API key configured)
        </div>
      )}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>{data.city}{data.country ? `, ${data.country}` : ""}</div>
          <div style={styles.subtitle}>{data.condition}</div>
        </div>
        <img src={data.iconUrl} alt={data.condition} style={styles.icon} />
      </div>

      <div style={styles.metrics}>
        <div style={styles.metric}>
          <div style={styles.metricValue}>{data.tempC}°C</div>
          <div style={styles.metricLabel}>Temperature</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.metricValue}>{data.humidity}%</div>
          <div style={styles.metricLabel}>Humidity</div>
        </div>
        <div style={styles.metric}>
          <div style={styles.metricValue}>{data.windKph} km/h</div>
          <div style={styles.metricLabel}>Wind</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    width: "100%",
    background: "var(--color-surface)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--color-border)",
    padding: "20px",
  },
  mockBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: "6px 10px",
    background:
      "linear-gradient(90deg, rgba(59,130,246,0.1) 0%, rgba(100,116,139,0.1) 100%)",
    color: "var(--color-secondary)",
    fontSize: "12px",
    borderTopLeftRadius: "var(--radius-lg)",
    borderTopRightRadius: "var(--radius-lg)",
    borderBottom: "1px solid var(--color-border)",
    textAlign: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--color-text)",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--color-subtle-text)",
    marginTop: "2px",
  },
  icon: {
    width: "64px",
    height: "64px",
  },
  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginTop: "8px",
  },
  metric: {
    background: "var(--color-background)",
    padding: "12px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--color-border)",
    textAlign: "center",
  },
  metricValue: {
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--color-text)",
  },
  metricLabel: {
    fontSize: "12px",
    color: "var(--color-subtle-text)",
  },
};
