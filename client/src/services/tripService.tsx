import type { TripData } from "../types/tripData";
import axios from "axios";

const baseUrl = "http://localhost:3000/auth/trips";

export const createTrip = async (tripData: TripData): Promise<TripData> => {
  const res = await axios.post(baseUrl, tripData);
  if (!res.data) throw new Error("Could not create trip.");
  return res.data;
};
