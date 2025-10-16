//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-COMP-AUD-001
// User Story: Users/QA can view a collapsible audit log of search operations.
// Acceptance Criteria: Collapsible panel, shows timestamp, action, query, outcome, message.
// GxP Impact: YES (Audit visibility)
// Risk Level: LOW
// Validation Protocol: VP-FE-COMP-AUD-001
// ============================================================================

import React, { useState, useEffect } from "react";
import { getAuditLog, clearAuditLog } from "../utils/audit";

/**
 * PUBLIC_INTERFACE
 * AuditLogPanel
 * Props: none
 */
export default function AuditLogPanel() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState([]);

  const reload = () => setEntries(getAuditLog());

  useEffect(() => {
    reload();
  }, []);

  return (
    <div style={styles.container}>
      <button
        aria-expanded={open}
        aria-controls="audit-content"
        onClick={() => setOpen(!open)}
        style={styles.toggle}
      >
        {open ? "Hide" : "Show"} Audit Log
      </button>
      {open && (
        <div id="audit-content" style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={{ fontWeight: 700 }}>Audit Entries</div>
            <button onClick={() => { clearAuditLog(); reload(); }} style={styles.clearBtn}>
              Clear
            </button>
          </div>
          {entries.length === 0 ? (
            <div style={styles.empty}>No entries yet.</div>
          ) : (
            <ul style={styles.list}>
              {entries.map((e, idx) => (
                <li key={idx} style={styles.item}>
                  <div style={styles.row}>
                    <span style={styles.badge(e.outcome)}>{e.outcome}</span>
                    <span style={styles.meta}>{e.action}</span>
                    <span style={styles.meta}>{e.userId}</span>
                    <span style={styles.meta}>{e.timestamp}</span>
                  </div>
                  <div style={styles.message}>
                    {e.query ? <span>Query: <strong>{e.query}</strong>. </span> : null}
                    {e.message ? <span>{e.message}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "16px",
  },
  toggle: {
    padding: "8px 12px",
    borderRadius: "var(--radius-sm)",
    background: "var(--color-secondary)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
  },
  panel: {
    marginTop: "10px",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-md)",
    padding: "12px",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  clearBtn: {
    padding: "6px 10px",
    borderRadius: "var(--radius-sm)",
    background: "var(--color-error)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  empty: {
    color: "var(--color-subtle-text)",
    fontSize: "14px",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: "8px",
  },
  item: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px",
    background: "var(--color-background)",
  },
  row: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginBottom: "4px",
  },
  badge: (outcome) => ({
    padding: "2px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    color: "#fff",
    background:
      outcome === "SUCCESS" ? "var(--color-success)" : "var(--color-error)",
  }),
  meta: {
    fontSize: "12px",
    color: "var(--color-subtle-text)",
  },
  message: {
    fontSize: "14px",
    color: "var(--color-text)",
  },
};
