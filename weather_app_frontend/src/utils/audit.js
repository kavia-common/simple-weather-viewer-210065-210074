//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-AUD-001
// User Story: As a QA/compliance stakeholder, I need a minimal audit trail on the client.
// Acceptance Criteria: Log timestamp, action (SEARCH/READ), query, result summary or error, pseudo-user id.
// GxP Impact: YES (Audit Trail - Contemporaneous, Attributable (pseudo-user), Accurate)
// Risk Level: LOW (frontend-only, non-persistent)
// Validation Protocol: VP-FE-AUD-001
// ============================================================================

const STORAGE_KEY = "auditLog";
const PSEUDO_USER_ID = "anonymous";

/**
 * PUBLIC_INTERFACE
 * getAuditLog
 * Retrieve the current in-memory audit log from localStorage.
 * @returns {Array<Object>} audit entries
 */
export function getAuditLog() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * addAuditEntry
 * Adds an entry with ISO timestamp, action, userId, query, outcome.
 * @param {{ action: 'SEARCH'|'READ', query?: string, outcome: 'SUCCESS'|'ERROR', message?: string, meta?: any }} entry
 * @returns {void}
 */
export function addAuditEntry(entry) {
  const now = new Date().toISOString();
  const base = {
    timestamp: now,
    userId: PSEUDO_USER_ID,
    ...entry,
  };
  const current = getAuditLog();
  current.push(base);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // If storage fails, we silently ignore to avoid UX breakage
  }
}

/**
 * PUBLIC_INTERFACE
 * clearAuditLog
 * Clear all audit entries.
 */
export function clearAuditLog() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
