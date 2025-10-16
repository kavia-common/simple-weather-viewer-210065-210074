import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import { AuthProvider } from "../context/AuthContext";

function renderWithAuth() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

describe("Auth Integration", () => {
  beforeEach(() => {
    // ensure no session
    window.localStorage.clear();
  });

  test("unauthenticated user sees Login page", () => {
    renderWithAuth();
    expect(screen.getByLabelText("login-card")).toBeInTheDocument();
  });

  test("login success leads to weather page and session persists", async () => {
    renderWithAuth();
    fireEvent.change(screen.getByLabelText("login-identifier"), { target: { value: "jane" } });
    fireEvent.change(screen.getByLabelText("login-password"), { target: { value: "Secret123" } });
    fireEvent.click(screen.getByLabelText("login-submit"));

    // After login, weather search should be visible
    await waitFor(() => {
      expect(screen.getByLabelText("city-input")).toBeInTheDocument();
    });

    // session persisted
    const stored = JSON.parse(window.localStorage.getItem("app_session"));
    expect(stored).toBeTruthy();
    expect(stored.userId).toBe("jane");
    expect(stored.token).toBeTruthy();
    expect(stored.expiry).toBeTruthy();
  });

  test("protected route: Admin shows access denied for non-admin", async () => {
    renderWithAuth();
    // login as user
    fireEvent.change(screen.getByLabelText("login-identifier"), { target: { value: "jane" } });
    fireEvent.change(screen.getByLabelText("login-password"), { target: { value: "Secret123" } });
    fireEvent.click(screen.getByLabelText("login-submit"));
    await screen.findByLabelText("city-input");

    fireEvent.click(screen.getByLabelText("nav-admin"));
    expect(screen.getByRole("alert")).toHaveTextContent(/Access Denied/i);
  });

  test("admin user can access admin page", async () => {
    renderWithAuth();
    // login as admin
    fireEvent.change(screen.getByLabelText("login-identifier"), { target: { value: "adminUser" } });
    fireEvent.change(screen.getByLabelText("login-password"), { target: { value: "Secret123" } });
    fireEvent.click(screen.getByLabelText("login-submit"));
    await screen.findByLabelText("city-input");

    fireEvent.click(screen.getByLabelText("nav-admin"));
    expect(screen.getByText(/Admin Panel/)).toBeInTheDocument();
  });

  test("logout clears session and returns to login", async () => {
    renderWithAuth();
    fireEvent.change(screen.getByLabelText("login-identifier"), { target: { value: "jane" } });
    fireEvent.change(screen.getByLabelText("login-password"), { target: { value: "Secret123" } });
    fireEvent.click(screen.getByLabelText("login-submit"));
    await screen.findByLabelText("city-input");
    fireEvent.click(screen.getByLabelText("nav-logout"));
    await waitFor(() => {
      expect(screen.getByLabelText("login-card")).toBeInTheDocument();
    });
    expect(window.localStorage.getItem("app_session")).toBeNull();
  });
});
