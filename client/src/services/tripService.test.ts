import { describe, test, vi, expect, beforeEach, afterEach } from "vitest";
import axios from "axios";
import {
  getTrips,
  getTrip,
  createTrip,
  deleteTrip,
  updateTrip,
} from "./tripService";
import type { MemberData, TripData } from "../types/tripData";

vi.mock("axios");
const apiURL = "http://127.0.0.1:3000/trips";
const mockToken = "test.token.here";
const mockHeader = {
  headers: { Authorization: `Bearer ${mockToken}` },
};

const mockUser = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  password: "hashedpassword",
  TripMember: {
    role: "owner",
  },
} as MemberData;

const mockTrip = {
  id: 1,
  destination: "Paris, France",
  startDate: "2026-12-12",
  endDate: "2026-12-31",
  Users: [mockUser],
} as TripData;

describe("tripService", () => {
  beforeEach(() => {
    //mock localStorage
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
    localStorage.setItem("token", mockToken);
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("should get all trips", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: [mockTrip] });
    const res = await getTrips();
    expect(axios.get).toHaveBeenCalledWith(apiURL, mockHeader);
    expect(res).toEqual([mockTrip]);
  });

  test("should get one trip", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockTrip });
    const res = await getTrip(mockTrip.id);
    expect(axios.get).toHaveBeenCalledWith(
      `${apiURL}/${mockTrip.id}`,
      mockHeader,
    );
    expect(res).toEqual(mockTrip);
  });

  test("should create trip", async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: mockTrip,
    });
    const res = await createTrip(mockTrip);
    expect(axios.post).toHaveBeenCalledWith(apiURL, mockTrip, mockHeader);
    expect(res).toEqual(mockTrip);
  });

  test("should delete trip", async () => {
    vi.mocked(axios.delete).mockResolvedValue({});
    await deleteTrip(mockTrip.id);
    expect(axios.delete).toHaveBeenCalledWith(
      `${apiURL}/${mockTrip.id}`,
      mockHeader,
    );
  });

  test("should update trip", async () => {
    const modifiedTrip = {
      id: 1,
      destination: "Paris, France",
      startDate: "2026-12-14",
      endDate: "2026-12-31",
      Users: [mockUser],
    };
    vi.mocked(axios.patch).mockResolvedValue({
      data: modifiedTrip,
    });
    const res = await updateTrip(mockTrip.id, modifiedTrip);
    expect(axios.patch).toHaveBeenCalledWith(
      `${apiURL}/${mockTrip.id}`,
      expect.objectContaining({
        startDate: modifiedTrip.startDate,
      }),
      mockHeader,
    );
    expect(res).toEqual(modifiedTrip);
  });
});
