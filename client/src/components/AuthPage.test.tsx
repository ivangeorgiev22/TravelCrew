import { describe, vi, test, expect, beforeEach, afterEach } from "vitest";
import AuthPage from "./AuthPage";
import Dashboard from "./Dashboard";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { login } from "../services/auth";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// mock services calls
vi.mock("../services/auth", () => ({
  register: vi.fn().mockResolvedValue({}),
  login: vi.fn().mockResolvedValue({}),
}));

//mock theme context, otherwise it throws an error about missing provider
vi.mock("../context/theme/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

//mock trip service call for dashboard redirection
vi.mock("../services/tripService", () => ({
  getTrips: vi.fn().mockResolvedValue({ ownTrips: [], memberTrips: [] }),
}));

//mock NavBar for dashboard redirection
vi.mock("./NavBar", () => ({
  default: () => (
    <nav>
      <button>Log Out</button>
    </nav>
  ),
}));

const mockLogin = {
  email: "jane@example.com",
  password: "hashedpassword",
};

const mockToken = "new.token.here";

describe("AuthPage", () => {
  // mock localStorage
  beforeEach(() => {
    const store: Record<string, string> = {};

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      },
    });

    // Set a token to simulate an authenticated user
    localStorage.setItem("token", mockToken);

    // Render within a MemoryRouter to handle navigation
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>,
    );
  });

  afterEach(() => {
    localStorage.clear();
    cleanup();
  });

  test("should switch between sign in and sign up", async () => {
    const user = userEvent.setup();
    const registerButton = screen.getByRole("button", {
      name: /Sign up here/i,
    });
    await user.click(registerButton);
    expect(screen.getByText(/Sign in here/i)).toBeInTheDocument();

    const loginButton = screen.getByRole("button", {
      name: /Sign in here/i,
    });
    await user.click(loginButton);
    expect(screen.getByText(/Sign up here/i)).toBeInTheDocument();
  });

  test("should redirect user to dashboard after log in", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Email/i), mockLogin.email);
    await user.type(
      screen.getByPlaceholderText(/••••••••/i),
      mockLogin.password,
    );
    const button = screen.getByRole("button", { name: /Sign In/i });
    await user.click(button);
    expect(login).toHaveBeenCalledWith(mockLogin);
    expect(await screen.findByText("Log Out")).toBeInTheDocument();
  });
});
