//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-AUTH-001
// User Story: As a user, I can log in/out and my session persists across reloads.
// Acceptance Criteria: AuthContext exposes login, logout, currentUser, session,
// and role-based isAuthorized utility.
// GxP Impact: YES (Access Controls, Audit Logging)
// Risk Level: LOW
// Validation Protocol: VP-FE-AUTH-001
// ============================================================================

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authenticate, createSession, getSession, clearSession, isAuthorized as checkRole } from "../utils/auth";
import { addAuditEntry } from "../utils/audit";

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /** Current session or null */
  session: null,
  /** Minimal current user derived from session */
  currentUser: null,
  /** Log in with credentials */
  login: async (_creds) => ({ ok: false, error: "not-implemented" }),
  /** Log out and clear session */
  logout: () => {},
  /** Role check utility */
  isAuthorized: (_role) => false,
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * AuthProvider manages client-side session and exposes auth methods.
   */
  const [session, setSession] = useState(null);

  useEffect(() => {
    const s = getSession();
    if (s) {
      setSession(s);
    }
  }, []);

  const currentUser = useMemo(() => {
    if (!session) return null;
    return {
      id: session.userId,
      role: session.role,
      email: session.email || null,
      username: session.username || null,
    };
  }, [session]);

  const login = useCallback(async (creds) => {
    // Validate basic input
    const emailOrUsername = (creds?.emailOrUsername || "").trim();
    const password = creds?.password || "";
    if (!emailOrUsername) {
      return { ok: false, error: "Email/Username is required." };
    }
    if (!password || password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    // Attempt auth
    const res = await authenticate({ emailOrUsername, password });
    if (!res.ok) {
      addAuditEntry({ action: "AUTH_LOGIN", outcome: "ERROR", message: "Login failed", meta: { userId: emailOrUsername } });
      return res;
    }
    // Create session without storing secrets
    const s = createSession(res.user);
    setSession(s);
    addAuditEntry({ action: "AUTH_LOGIN", outcome: "SUCCESS", message: "Login success", meta: { userId: res.user.id, role: res.user.role } });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    const userId = session?.userId || "unknown";
    clearSession();
    setSession(null);
    addAuditEntry({ action: "AUTH_LOGOUT", outcome: "SUCCESS", message: "User logged out", meta: { userId } });
  }, [session]);

  const isAuthorized = useCallback((role) => {
    const ok = checkRole(role, session);
    if (!ok) {
      addAuditEntry({
        action: "AUTH_DENIED",
        outcome: "ERROR",
        message: `Access denied: requires ${role}`,
        meta: { userId: session?.userId || "anonymous", role: session?.role || "none" },
      });
    }
    return ok;
  }, [session]);

  const value = useMemo(() => ({ session, currentUser, login, logout, isAuthorized }), [session, currentUser, login, logout, isAuthorized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
