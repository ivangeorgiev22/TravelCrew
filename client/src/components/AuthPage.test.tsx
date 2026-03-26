import { describe, vi, test, expect, beforeEach, afterEach } from "vitest";
import AuthPage from "./AuthPage";
import Dashboard from "./Dashboard";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { login, register } from "../services/auth";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// mock services calls
vi.mock("../services/auth", () => ({
  register: vi.fn().mockResolvedValue({}),
  login: vi.fn().mockResolvedValue({ token: "new.token.here" }),
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

const mockInput = {
  name: "Jane Doe",
  email: "jane@example.com",
  password: "Password1",
};

describe("AuthPage", () => {
  // mock localStorage for dashboard redirection
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

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
    vi.clearAllMocks();
    cleanup();
  });

  test("should redirect user to dashboard after log in", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Email/i), mockInput.email);
    await user.type(
      screen.getByPlaceholderText(/••••••••/i),
      mockInput.password,
    );
    const button = screen.getByRole("button", { name: /Sign In/i });
    await user.click(button);
    expect(login).toHaveBeenCalledWith({
      email: mockInput.email,
      password: mockInput.password,
    });
    expect(await screen.findByText("Log Out")).toBeInTheDocument();
  });

  test("should redirect user to log in after registering", async () => {
    const user = userEvent.setup();
    const signUpHereButton = screen.getByRole("button", {
      name: /Sign up here/i,
    });
    await user.click(signUpHereButton);
    await user.type(screen.getByLabelText(/Name/i), mockInput.name);
    await user.type(screen.getByLabelText(/Email/i), mockInput.email);
    await user.type(
      screen.getByPlaceholderText(/••••••••/i),
      mockInput.password,
    );
    const submitRegisterButton = screen.getByRole("button", {
      name: /Sign Up/i,
    });
    await user.click(submitRegisterButton);
    expect(register).toHaveBeenCalledWith(mockInput);
    expect(await screen.findByText("Welcome back")).toBeInTheDocument();
  });
});
