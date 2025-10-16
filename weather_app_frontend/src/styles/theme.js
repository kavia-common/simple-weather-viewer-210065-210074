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
    primaryHover: "#2563eb", // blue-600
    secondary: "#64748b", // slate-500
    secondaryHover: "#475569", // slate-600
    success: "#06b6d4",   // cyan-500
    error: "#EF4444",     // red-500
    warning: "#f59e0b",   // amber-500
    background: "#f9fafb", // gray-50
    surface: "#ffffff",
    text: "#111827",       // gray-900
    subtleText: "rgba(17, 24, 39, 0.65)",
    border: "rgba(17, 24, 39, 0.08)",
    focusRing: "rgba(59,130,246,0.45)",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    pill: "999px",
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 6px 16px rgba(0,0,0,0.08)",
    lg: "0 12px 24px rgba(0,0,0,0.10)",
    xl: "0 20px 35px rgba(0,0,0,0.14)",
  },
  spacing: (n) => `${n * 8}px`,
  transition: "all 200ms ease",
  typography: {
    base: "16px",
    scale: {
      sm: "12px",
      base: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  icon: {
    sm: 20,
    md: 24,
    lg: 64,
  },
};

// PUBLIC_INTERFACE
export function applyThemeToDocument() {
  /** Apply CSS variables to :root for consistent theming. */
  const root = document.documentElement;
  const p = oceanTheme.palette;

  root.style.setProperty("--color-primary", p.primary);
  root.style.setProperty("--color-primary-hover", p.primaryHover);
  root.style.setProperty("--color-secondary", p.secondary);
  root.style.setProperty("--color-secondary-hover", p.secondaryHover);
  root.style.setProperty("--color-success", p.success);
  root.style.setProperty("--color-error", p.error);
  root.style.setProperty("--color-warning", p.warning);
  root.style.setProperty("--color-background", p.background);
  root.style.setProperty("--color-surface", p.surface);
  root.style.setProperty("--color-text", p.text);
  root.style.setProperty("--color-subtle-text", p.subtleText);
  root.style.setProperty("--color-border", p.border);
  root.style.setProperty("--color-focus", p.focusRing);

  root.style.setProperty("--radius-sm", oceanTheme.radius.sm);
  root.style.setProperty("--radius-md", oceanTheme.radius.md);
  root.style.setProperty("--radius-lg", oceanTheme.radius.lg);
  root.style.setProperty("--radius-pill", oceanTheme.radius.pill);

  root.style.setProperty("--shadow-sm", oceanTheme.shadow.sm);
  root.style.setProperty("--shadow-md", oceanTheme.shadow.md);
  root.style.setProperty("--shadow-lg", oceanTheme.shadow.lg);
  root.style.setProperty("--shadow-xl", oceanTheme.shadow.xl);

  root.style.setProperty("--transition-fast", oceanTheme.transition);

  // Typography tokens
  const t = oceanTheme.typography;
  root.style.setProperty("--font-size-sm", t.scale.sm);
  root.style.setProperty("--font-size-base", t.scale.base);
  root.style.setProperty("--font-size-md", t.scale.md);
  root.style.setProperty("--font-size-lg", t.scale.lg);
  root.style.setProperty("--font-size-xl", t.scale.xl);
  root.style.setProperty("--font-size-2xl", t.scale["2xl"]);
  root.style.setProperty("--font-weight-regular", t.weight.regular);
  root.style.setProperty("--font-weight-medium", t.weight.medium);
  root.style.setProperty("--font-weight-semibold", t.weight.semibold);
  root.style.setProperty("--font-weight-bold", t.weight.bold);
  root.style.setProperty("--font-weight-extrabold", t.weight.extrabold);

  // Icon sizing
  root.style.setProperty("--icon-sm", `${oceanTheme.icon.sm}px`);
  root.style.setProperty("--icon-md", `${oceanTheme.icon.md}px`);
  root.style.setProperty("--icon-lg", `${oceanTheme.icon.lg}px`);
}
