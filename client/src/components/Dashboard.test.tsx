import { screen, render, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, vi, expect, afterEach, beforeEach } from 'vitest';
import { getTrips } from '../services/tripService';
import type { TripData } from '../types/tripData';
import Dashboard from './Dashboard';
import "@testing-library/jest-dom/vitest";

//Mock localStorage
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

//Mock service 
vi.mock("../services/tripService", () => ({
  getTrips: vi.fn(),
}));

//Mock child components
vi.mock("./TripCard", () => ({
  default: ({ trip }: { trip: TripData}) => <div>{trip.destination}</div>,
}));

vi.mock("./NavBar", () => ({
  default: () => <div>NavBar</div>,
}));

vi.mock("./TripForm", () => ({
  default: () => <div>TripForm</div>,
}));

vi.mock("@fullcalendar/react", () => ({
  default: () => <div>Calendar</div>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

//Mock Trip
const mockTrip = (overrides: Partial<TripData> = {}): TripData => ({
  id: 1,
  destination: "Paris, France",
  startDate: "2026-03-27",
  endDate: "2026-03-30",
  Users: [],
  ...overrides
});

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.setItem("userName", "John Doe");
  })

  it("Renders Page", async () => {
    vi.mocked(getTrips).mockResolvedValue({
      ownTrips: [],
      memberTrips: [],
    });
    render(<Dashboard />);

    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("Renders trips after fetch", async () => {
    const trip = mockTrip();
    vi.mocked(getTrips).mockResolvedValue({
      ownTrips: [trip],
      memberTrips: [],
    });

    render(<Dashboard />);

    expect(await screen.findByText("Paris, France")).toBeInTheDocument();
  });

  it("Opens tripForm when clicking Add a Trip", async () => {
    vi.mocked(getTrips).mockResolvedValue({
      ownTrips: [],
      memberTrips: [],
    });
    render(<Dashboard />);

    const button = await screen.findByRole("button", { name: /add a trip/i });
    fireEvent.click(button);
    expect(screen.getByText("TripForm")).toBeInTheDocument();
  });
})