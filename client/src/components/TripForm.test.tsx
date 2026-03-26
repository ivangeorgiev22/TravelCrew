import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import TripForm from './TripForm';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createTrip, updateTrip } from '../services/tripService';
import type { TripData } from '../types/tripData';
import "@testing-library/jest-dom/vitest";

// Mock service
vi.mock("../services/tripService", () => ({
  createTrip: vi.fn(),
  updateTrip: vi.fn(),
}));

//Mock Trip
const mockTrip = (overrides: Partial<TripData> = {}): TripData => ({
  id: 1,
  destination: "Paris, France",
  startDate: "2026-03-27",
  endDate: "2026-03-30",
  Users: [],
  ...overrides
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("TripForm", () => {

  it("Renders create form", () => {
    render(<TripForm onClose={vi.fn()} />);

    expect(screen.getByText(/create a trip/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /create/i})).toBeInTheDocument();
  });

  it("Renders edit form with prefilled data", () => {
    const trip = mockTrip();

    render(<TripForm trip={trip} onClose={vi.fn()} onTripEdit={vi.fn()} />);

    expect(screen.getByDisplayValue("Paris, France")).toBeInTheDocument();
    expect(screen.getByText(/edit trip/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /save changes/i})).toBeInTheDocument();
  });

  it("Calls createTrip on submit", async () => {
    const onClose = vi.fn();
    const onTripCreate = vi.fn();
    const mockedTrip = mockTrip();

    vi.mocked(createTrip).mockResolvedValue(mockedTrip);

    render(<TripForm onClose={onClose} onTripCreate={onTripCreate} />);

    fireEvent.change(screen.getByLabelText(/destination/i), { target: { value: "London" } });
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: "2026-03-27" } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: "2026-03-30" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(createTrip).toHaveBeenCalled();
      expect(onTripCreate).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("Calls editTrip on submit in edit mode", async () => {
    const trip = mockTrip();
    const onClose = vi.fn();
    const onTripEdit = vi.fn();

    vi.mocked(updateTrip).mockResolvedValue(trip);

    render(<TripForm trip={trip} onClose={onClose} onTripEdit={onTripEdit} />);

    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: "2026-03-28" } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: "2026-03-31" } });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i } ));

    await waitFor(() => {
      expect(updateTrip).toHaveBeenCalledWith(trip.id, expect.any(Object));
      expect(onTripEdit).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});