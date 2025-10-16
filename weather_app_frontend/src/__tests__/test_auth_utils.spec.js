//
// Tests: Auth utilities and session handling
import { getAuthMode, authenticate, createSession, getSession, clearSession, isAuthorized } from "../utils/auth";

describe("Auth Utilities", () => {
  beforeEach(() => {
    clearSession();
    delete process.env.AUTH_MODE;
    delete process.env.REACT_APP_AUTH_MODE;
    delete process.env.REACT_APP_AUTH_USERS;
  });

  test("default mode is mock", () => {
    expect(getAuthMode()).toBe("mock");
  });

  test("authenticate in mock mode accepts any non-empty creds and sets role", async () => {
    const resUser = await authenticate({ emailOrUsername: "adminUser", password: "Secret123" });
    expect(resUser.ok).toBe(true);
    expect(resUser.user.role).toBe("admin");
    const resUser2 = await authenticate({ emailOrUsername: "jane", password: "Secret123" });
    expect(resUser2.user.role).toBe("user");
  });

  test("envUsers mode verifies against provided JSON list", async () => {
    process.env.AUTH_MODE = "envUsers";
    process.env.REACT_APP_AUTH_USERS = JSON.stringify([{ email: "admin@example.com", password: "Secret123!", role: "admin" }]);
    const bad = await authenticate({ emailOrUsername: "admin@example.com", password: "bad" });
    expect(bad.ok).toBe(false);
    const ok = await authenticate({ emailOrUsername: "admin@example.com", password: "Secret123!" });
    expect(ok.ok).toBe(true);
    expect(ok.user.role).toBe("admin");
  });

  test("session create/get/clear with expiry", () => {
    const s = createSession({ id: "u1", email: "u1@example.com", role: "user" }, 100); // 100ms
    expect(s.token).toBeTruthy();
    const r1 = getSession();
    expect(r1.userId).toBe("u1");
  });

  test("isAuthorized respects roles", () => {
    const s = createSession({ id: "admin", role: "admin" });
    expect(isAuthorized("user", s)).toBe(true);
    expect(isAuthorized("admin", s)).toBe(true);
    clearSession();
    const s2 = createSession({ id: "u", role: "user" });
    expect(isAuthorized("admin", s2)).toBe(false);
  });
});
