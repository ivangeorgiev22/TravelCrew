import { cleanup, render, screen, waitFor } from "@testing-library/react";
import Map from "./Map";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";

//mock react-leaflet components
const setViewMock = vi.fn();
vi.mock("react-leaflet", () => ({
  MapContainer: vi.fn(({ children, center }) => (
    <div
      role="region"
      aria-label="map"
      center-location={JSON.stringify(center)}
    >
      {children}
    </div>
  )),
  TileLayer: vi.fn(() => null),
  Marker: vi.fn(({ children }) => (
    <div role="img" aria-label="activity marker">
      {children}
    </div>
  )),
  Popup: vi.fn(({ children }) => <div>{children}</div>),
  useMap: vi.fn(() => ({
    setView: setViewMock,
  })),
}));

const mockTrip = {
  id: 3,
  destination: "Paris, France",
  startDate: "2026-10-20",
  endDate: "2026-10-27",
  Users: [],
};

const mockActivities = [
  {
    id: 1,
    name: "City Tour",
    location: "Eiffel Tower",
    time: "10:00",
    date: "2026-10-20",
    tripId: mockTrip.id,
  },
  {
    id: 2,
    name: "Museum Visit",
    location: "Louvre Museum",
    time: "12:00",
    date: "2026-10-20",
    tripId: mockTrip.id,
  },
];

const mockCoords = {
  lat: 48.8566,
  lon: 2.3522,
};

describe("Map component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url.includes(mockTrip.destination)) {
          return Promise.resolve({
            json: () =>
              Promise.resolve([{ lat: mockCoords.lat, lon: mockCoords.lon }]),
          });
        }

        return Promise.resolve({
          json: () =>
            Promise.resolve([{ lat: mockCoords.lat, lon: mockCoords.lon }]),
        });
      }),
    );

    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  test("should center map on destination", async () => {
    render(<Map activities={[]} city={mockTrip.destination} />);
    await screen.findByRole("region", { name: /map/i });
    await waitFor(() => {
      expect(setViewMock).toHaveBeenCalledWith(
        [mockCoords.lat, mockCoords.lon],
        11,
      );
    });
  });

  test("should render a marker for each activity", async () => {
    render(<Map activities={mockActivities} city={mockTrip.destination} />);
    const markers = await screen.findAllByRole("img", {
      name: /activity marker/i,
    });
    expect(markers).toHaveLength(2);
  });

  test("should remove marker on activity delete", async () => {
    const { rerender } = render(
      <Map activities={mockActivities} city={mockTrip.destination} />,
    );
    expect(
      await screen.findAllByRole("img", { name: /activity marker/i }),
    ).toHaveLength(2);
    rerender(
      <Map activities={[mockActivities[0]]} city={mockTrip.destination} />,
    );
    await waitFor(() => {
      expect(
        screen.getAllByRole("img", { name: /activity marker/i }),
      ).toHaveLength(1);
    });
  });
});
