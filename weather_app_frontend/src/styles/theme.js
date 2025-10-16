//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-STYLE-001
// User Story: As a user, I want a clean, modern UI with an Ocean Professional theme.
// Acceptance Criteria: Colors, typography, spacing, shadows consistent with spec.
// GxP Impact: NO - Frontend styling only.
// Risk Level: LOW
// Validation Protocol: N/A
// ============================================================================
//
// IMPORTS AND DEPENDENCIES
// None
// ============================================================================
//
// FEATURE IMPLEMENTATION
// This module exports theme tokens and helper styles for components to consume.
//

export const oceanTheme = {
  name: "Ocean Professional",
  palette: {
    primary: "#3b82f6",   // blue-500
    secondary: "#64748b", // slate-500
    success: "#06b6d4",   // cyan-500
    error: "#EF4444",     // red-500
    background: "#f9fafb", // gray-50
    surface: "#ffffff",
    text: "#111827",       // gray-900
    border: "rgba(17, 24, 39, 0.08)",
    subtleText: "rgba(17, 24, 39, 0.65)"
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px"
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 6px 16px rgba(0,0,0,0.08)",
    lg: "0 12px 24px rgba(0,0,0,0.10)"
  },
  spacing: (n) => `${n * 8}px`,
  transition: "all 200ms ease",
};

// PUBLIC_INTERFACE
export function applyThemeToDocument() {
  /** Apply CSS variables to :root for consistent theming. */
  const root = document.documentElement;
  const p = oceanTheme.palette;
  root.style.setProperty("--color-primary", p.primary);
  root.style.setProperty("--color-secondary", p.secondary);
  root.style.setProperty("--color-success", p.success);
  root.style.setProperty("--color-error", p.error);
  root.style.setProperty("--color-background", p.background);
  root.style.setProperty("--color-surface", p.surface);
  root.style.setProperty("--color-text", p.text);
  root.style.setProperty("--color-subtle-text", p.subtleText);
  root.style.setProperty("--color-border", p.border);

  root.style.setProperty("--radius-sm", oceanTheme.radius.sm);
  root.style.setProperty("--radius-md", oceanTheme.radius.md);
  root.style.setProperty("--radius-lg", oceanTheme.radius.lg);

  root.style.setProperty("--shadow-sm", oceanTheme.shadow.sm);
  root.style.setProperty("--shadow-md", oceanTheme.shadow.md);
  root.style.setProperty("--shadow-lg", oceanTheme.shadow.lg);

  root.style.setProperty("--transition-fast", oceanTheme.transition);
}
