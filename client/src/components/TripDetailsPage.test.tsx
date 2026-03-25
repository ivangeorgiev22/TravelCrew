import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, beforeEach, vi, expect, type Mock } from 'vitest';
import TripDetails from './TripDetailsPage';
import "@testing-library/jest-dom/vitest";

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

// Mock services 
vi.mock("../services/tripService", () => ({
  getTrip: vi.fn(),
  deleteTrip: vi.fn(),
}));

vi.mock("../services/activityService", () => ({
  getActivities: vi.fn(),
  deleteActivity: vi.fn()
}));

// Mock router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
    useNavigate: () => vi.fn(),
  }
});

// Mock child components
vi.mock("./NavBar", () => ({
  default: () => <div>NavBar</div>
}));

vi.mock("./ActivityForm", () => ({
  default: () => <div>ActivityForm</div>
}));

vi.mock("./TripForm", () => ({
  default: () => <div>TripForm</div>
}));

vi.mock("./EmailInviteForm", () => ({
  default: () => <div>InviteForm</div>
}));

vi.mock("../components/Map", () => ({
  default: () => <div>Map</div>
}));

describe("TripDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  })

  it("Renders Trip", async () => {
    const { getTrip } = await import("../services/tripService");
    const { getActivities } = await import("../services/activityService");

    (getTrip as Mock).mockResolvedValue({
      destination: "Paris, France",
      startDate: "2026-03-25",
      endDate: "2026-03-28",
      Users: [],
    });

    (getActivities as Mock).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/paris, france/i)).toBeInTheDocument();
    });
  });

  it("Shows Edit and Delete buttons for trip owner", async () => {
    localStorage.setItem("userName", "John");
    const { getTrip } = await import("../services/tripService");
    const { getActivities } = await import("../services/activityService");

    (getTrip as Mock).mockResolvedValue({
      destination: "Paris, France",
      startDate: "2026-03-25",
      endDate: "2026-03-28",
      Users: [{
        id: 1,
        name: "John",
        TripMember: {role: "owner"}
      }],
    });

    (getActivities as Mock).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeInTheDocument();
      expect(screen.getByText(/delete/i)).toBeInTheDocument();
    });
  });

  it("Renders activities", async () => {
    const { getTrip } = await import("../services/tripService");
    const { getActivities } = await import("../services/activityService");

    (getTrip as Mock).mockResolvedValue({
      destination: "Paris, France",
      startDate: "2026-03-25",
      endDate: "2026-03-28",
      Users: [],
    });

    (getActivities as Mock).mockResolvedValue([{
      id: 1,
      name: "Museum",
      location: "Louvre",
      date: "2026-03-25",
      time: "10:00",
    }]);

    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("Museum")).toBeInTheDocument();
      expect(screen.getByText("Louvre")).toBeInTheDocument();
    });
  });

  it("Opens Activity form when clicking on Add Activity", async () => {
    const { getTrip } = await import("../services/tripService");
    const { getActivities } = await import("../services/activityService");

    (getTrip as Mock).mockResolvedValue({
      destination: "Paris, France",
      startDate: "2026-03-25",
      endDate: "2026-03-28",
      Users: [],
    });

    (getActivities as Mock).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TripDetails />
      </MemoryRouter>
    );
    const addButton = await screen.findAllByRole("button", {name: /add activity/i});
    expect(addButton.length).toBeGreaterThan(0);
    fireEvent.click(addButton[0]);
    expect(screen.getByText("Add Activity")).toBeInTheDocument();
  })
})