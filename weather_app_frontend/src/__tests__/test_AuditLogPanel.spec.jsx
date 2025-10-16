 /**
  * Traceability: REQ-FE-COMP-AUD-001; REQ-FE-AUD-001
  * GxP Impact: YES (Audit visibility)
  */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuditLogPanel from "../components/AuditLogPanel";
import { addAuditEntry, clearAuditLog } from "../utils/audit";

describe("Component: AuditLogPanel (GxP)", () => {
  beforeEach(() => {
    clearAuditLog();
  });

  test("toggle shows and hides audit content", () => {
    render(<AuditLogPanel />);
    const toggle = screen.getByRole("button", { name: /show audit log/i });
    fireEvent.click(toggle);
    expect(screen.getByText(/Audit Entries/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /hide audit log/i }));
  });

  test("renders entries with outcome badge and metadata", () => {
    addAuditEntry({ action: "SEARCH", query: "Paris", outcome: "SUCCESS", message: "Search submitted" });
    render(<AuditLogPanel />);
    fireEvent.click(screen.getByRole("button", { name: /show audit log/i }));
    expect(screen.getByText(/Audit Entries/i)).toBeInTheDocument();
    expect(screen.getByText(/SUCCESS/i)).toBeInTheDocument();
    expect(screen.getByText(/SEARCH/i)).toBeInTheDocument();
    expect(screen.getByText(/anonymous/i)).toBeInTheDocument();
    expect(screen.getByText(/Query:/i)).toBeInTheDocument();
  });

  test("clear button removes entries", () => {
    addAuditEntry({ action: "SEARCH", outcome: "SUCCESS" });
    render(<AuditLogPanel />);
    fireEvent.click(screen.getByRole("button", { name: /show audit log/i }));
    fireEvent.click(screen.getByText(/Clear/i));
    expect(screen.getByText(/No entries yet/i)).toBeInTheDocument();
  });
});
