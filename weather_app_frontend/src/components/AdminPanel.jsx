//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-AUTH-ADMIN-001
// User Story: As an admin, I can access an admin-only placeholder panel.
// Acceptance Criteria: Access denied for non-admins with audit log; simple UI.
// GxP Impact: YES (Authorization)
// Risk Level: LOW
// Validation Protocol: VP-FE-AUTH-ADMIN-001
// ============================================================================

import React, { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * AdminPanel placeholder
 */
export default function AdminPanel() {
  const { isAuthorized, currentUser } = useContext(AuthContext);
  const allowed = useMemo(() => isAuthorized("admin"), [isAuthorized]);

  if (!allowed) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card} role="alert">
          <div style={styles.title}>Access Denied</div>
          <div style={styles.text}>You must be an admin to view this page.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.title}>Admin Panel (Placeholder)</div>
        <div style={styles.text}>Welcome, {currentUser?.id || "admin"}.</div>
        <div style={styles.note} role="note">
          Future: Configure real backend/OAuth and add privileged operations.
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "var(--color-surface)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--color-border)",
    padding: 20,
  },
  title: { fontWeight: 800, fontSize: 18, color: "var(--color-text)" },
  text: { marginTop: 8, color: "var(--color-text)" },
  note: { marginTop: 10, color: "var(--color-subtle-text)", fontSize: 12 },
};
