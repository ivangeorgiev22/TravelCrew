import axios from "axios";
import type { ActivityData } from "../types/activityData";

const API_URL = "http://127.0.0.1:3000/activities";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getActivities = async (tripId: number): Promise<ActivityData[]> => {
  try {
    const response = await axios.get(`${API_URL}/trip/${tripId}`, authHeader());
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

export const createActivity = async (
  activityData: ActivityData,
): Promise<ActivityData> => {
  try {
    const response = await axios.post(API_URL, activityData, authHeader());
    return response.data;
  } catch (error) {
    console.error(error); 
    throw error; 
  }
};

export const editActivity = async (id: number, data: Partial<ActivityData>) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, data, authHeader());
    return response.data; 
  } catch (error) {
    console.error(error)
  }
};

export const deleteActivity = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
