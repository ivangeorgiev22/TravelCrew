import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App';
import {vi, it, describe, beforeEach, expect } from 'vitest';
import "@testing-library/jest-dom/vitest";

//Mock components
vi.mock("./components/AuthPage", () => ({
  default: () => <div>AuthPage</div>,
}));

vi.mock("./components/Dashboard", () => ({
  default: () => <div>Dashboard</div>,
}));

vi.mock("./components/TripDetailsPage", () => ({
  default: () => <div>TripDetailsPage</div>,
}));

vi.mock("./components/AcceptInvite", () => ({
  default: () => <div>AcceptInvite</div>,
}));

describe("App routing", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("Renders AuthPage at /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("AuthPage")).toBeInTheDocument();
  });

  it("Renders Dashboard at /dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("Renders TripDetailsPage at /trips/:id", () => {
    render(
      <MemoryRouter initialEntries={["/trips/1"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("TripDetailsPage")).toBeInTheDocument();
  });

  it("Renders AcceptInvite at /accept-invite", () => {
    render(
      <MemoryRouter initialEntries={["/accept-invite"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("AcceptInvite")).toBeInTheDocument();
  })
})