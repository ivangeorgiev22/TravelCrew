import axios from "axios";
import type { TripData } from "../types/tripData";

const apiURL = "http://127.0.0.1:3000/trips";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getTrips = async () => {
  try {
    const response = await axios.get(apiURL, authHeader());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getTrip = async (id: number) => {
  try {
    const response = await axios.get(`${apiURL}/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createTrip = async (tripData: TripData): Promise<TripData> => {
  const res = await axios.post(apiURL, tripData, authHeader());
  if (!res.data) throw new Error("Could not create trip.");
  return res.data;
};
