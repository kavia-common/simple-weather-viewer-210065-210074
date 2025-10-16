//
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-AUTH-001
// User Story: As a user, I can log in to access protected pages; as an admin, I
// can access admin-only routes. In absence of a backend, authentication is mock.
// Acceptance Criteria:
// - Login form with validation
// - Mock authentication based on env mode
// - Session stored in localStorage without secrets, includes expiry
// - Logout clears session
// - Role checks available via utility
// - Audit logs for login/logout/denied without secrets
// GxP Impact: YES (Access Controls, Audit Trail)
// Risk Level: LOW (frontend-only demo; no secrets stored)
// Validation Protocol: VP-FE-AUTH-001
// ============================================================================
//
// IMPORTS AND DEPENDENCIES
// None
// ============================================================================

const SESSION_KEY = "app_session";

// Utility: generate UUID v4 (RFC4122-like) without external deps
function uuidv4() {
  // Not cryptographically secure; sufficient for demo token
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// PUBLIC_INTERFACE
export function getAuthMode() {
  /**
   * Returns the current auth mode.
   * Values:
   * - "mock": default, accepts any non-empty credentials or matches in-memory
   * - "envUsers": reads JSON from REACT_APP_AUTH_USERS to verify against a list
   */
  const mode = process.env.AUTH_MODE || process.env.REACT_APP_AUTH_MODE || "mock";
  return mode;
}

// PUBLIC_INTERFACE
export function getConfiguredUsers() {
  /**
   * Returns a parsed array of user objects defined in REACT_APP_AUTH_USERS when AUTH_MODE=envUsers.
   * Each user: { email?: string, username?: string, password: string, role?: 'user'|'admin', id?: string }
   * Never expose passwords beyond runtime check; do not log them.
   */
  const raw = process.env.REACT_APP_AUTH_USERS;
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function createSession(user, ttlMs = 2 * 60 * 60 * 1000) {
  /**
   * Create a session token object and persist it in localStorage.
   * PUBLIC_INTERFACE
   * Params:
   * - user: { id, email?, username?, role }
   * - ttlMs: number (default 2 hours)
   * Returns: session object without password
   */
  const now = Date.now();
  const session = {
    token: uuidv4(),
    userId: user.id,
    role: user.role || "user",
    email: user.email || null,
    username: user.username || null,
    issuedAt: new Date(now).toISOString(),
    expiry: new Date(now + ttlMs).toISOString(),
  };
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage failure
  }
  return session;
}

// PUBLIC_INTERFACE
export function getSession() {
  /**
   * Returns the current session object if available and not expired, else null.
   */
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.expiry) return null;
    const exp = Date.parse(session.expiry);
    if (Number.isNaN(exp) || Date.now() > exp) {
      // expired
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function clearSession() {
  /**
   * Clears the current session from storage.
   */
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function isAuthorized(requiredRole, session = null) {
  /**
   * Check if the current (or provided) session authorizes the given required role.
   * Roles: user, admin. Admin implies user-level access as well.
   */
  const s = session || getSession();
  if (!s) return false;
  const role = s.role || "user";
  if (requiredRole === "user") return role === "user" || role === "admin";
  if (requiredRole === "admin") return role === "admin";
  return false;
}

// PUBLIC_INTERFACE
export async function authenticate(credentials) {
  /**
   * Authenticate based on current mode.
   * Params:
   * - credentials: { emailOrUsername: string, password: string }
   * Returns: { ok: boolean, user?: {id, email?, username?, role}, error?: string }
   * SECURITY: Do not log password. Do not store raw password.
   */
  const emailOrUsername = (credentials?.emailOrUsername || "").trim();
  const password = credentials?.password || "";
  if (!emailOrUsername || !password) {
    return { ok: false, error: "Please provide both email/username and password." };
    }

  const mode = getAuthMode();

  // envUsers mode
  if (mode === "envUsers") {
    const list = getConfiguredUsers();
    const match = list.find((u) => {
      const matchesId =
        (u.email && u.email.toLowerCase() === emailOrUsername.toLowerCase()) ||
        (u.username && u.username.toLowerCase() === emailOrUsername.toLowerCase());
      return matchesId && u.password === password;
    });
    if (!match) {
      return { ok: false, error: "Invalid credentials." };
    }
    const user = {
      id: match.id || (match.email || match.username),
      email: match.email || undefined,
      username: match.username || undefined,
      role: match.role || "user",
    };
    return { ok: true, user };
  }

  // Default mock mode
  // Option A: simple allow any non-empty
  const user = {
    id: emailOrUsername,
    email: emailOrUsername.includes("@") ? emailOrUsername : undefined,
    username: !emailOrUsername.includes("@") ? emailOrUsername : undefined,
    role: emailOrUsername.toLowerCase().startsWith("admin") ? "admin" : "user",
  };
  return { ok: true, user };
}
