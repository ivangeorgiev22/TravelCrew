import type { TripData } from "../types/tripData";
import axios from "axios";

const baseUrl = "http://127.0.0.1:3000/trips";

export const createTrip = async (tripData: TripData): Promise<TripData> => {
  const token = localStorage.getItem("token");
  const res = await axios.post(baseUrl, tripData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.data) throw new Error("Could not create trip.");
  return res.data;
};
