 /**
  * Traceability: REQ-FE-AUD-001; VP-FE-AUD-001
  * GxP Impact: YES (Audit Trail - Attributable, Contemporaneous)
  * Purpose: Verify audit entry structure, ISO timestamp format, default userId, and clear behavior.
  */
import { addAuditEntry, getAuditLog, clearAuditLog } from "../utils/audit";

const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe("Audit Utilities (GxP)", () => {
  beforeEach(() => {
    clearAuditLog();
  });

  test("adds entry with ISO timestamp and default userId", () => {
    addAuditEntry({ action: "SEARCH", query: "Paris", outcome: "SUCCESS", message: "Search submitted" });
    const log = getAuditLog();
    expect(log.length).toBe(1);
    const entry = log[0];
    expect(entry.userId).toBe("anonymous");
    expect(isoRegex.test(entry.timestamp)).toBe(true);
    expect(entry.action).toBe("SEARCH");
    expect(entry.query).toBe("Paris");
    expect(entry.outcome).toBe("SUCCESS");
    expect(entry.message).toMatch(/submitted/i);
  });

  test("persists multiple entries and retains order", () => {
    addAuditEntry({ action: "SEARCH", query: "Rome", outcome: "SUCCESS" });
    addAuditEntry({ action: "READ", query: "Rome", outcome: "SUCCESS", message: "Weather clear" });
    const log = getAuditLog();
    expect(log).toHaveLength(2);
    expect(log[0].action).toBe("SEARCH");
    expect(log[1].action).toBe("READ");
  });

  test("clearAuditLog removes all entries", () => {
    addAuditEntry({ action: "SEARCH", outcome: "SUCCESS" });
    clearAuditLog();
    expect(getAuditLog()).toEqual([]);
  });

  test("getAuditLog tolerates corrupted storage", () => {
    window.localStorage.setItem("auditLog", "{not-json");
    expect(Array.isArray(getAuditLog())).toBe(true);
    expect(getAuditLog()).toHaveLength(0);
  });
});
