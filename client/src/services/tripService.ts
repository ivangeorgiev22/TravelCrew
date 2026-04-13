import axios from "axios";
import type { TripData } from "../types/tripData";

const API_URL = "http://127.0.0.1:3000/trips";

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
    const response = await axios.get(API_URL, authHeader());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getTrip = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createTrip = async (tripData: TripData): Promise<TripData> => {
  try {
    const res = await axios.post(API_URL, tripData, authHeader());
    return res.data; 
  } catch (error) {
    console.error(error); 
    throw error; 
  }
};

export const deleteTrip = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateTrip = async (id: number, tripData: TripData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}`,
      tripData,
      authHeader(),
    );
    if (!response.data) throw new Error("Could not update trip.");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
