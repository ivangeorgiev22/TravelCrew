import axios from "axios";
import type { ActivityData } from "../types/activityData";

const apiURL = "http://127.0.0.1:3000/activities";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getActivities = async (tripId: number) => {
  try {
    const response = await axios.get(`${apiURL}/trip/${tripId}`, authHeader());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createActivity = async (
  activityData: ActivityData,
): Promise<ActivityData> => {
  const response = await axios.post(apiURL, activityData, authHeader());
  if (!response.data) throw new Error("Could not create activity");
  return response.data;
};

export const editActivity = async (id: number, data: Partial<ActivityData>) => {
  try {
    const response = await axios.patch(`${apiURL}/${id}`, data, authHeader());
    return response.data; 
  } catch (error) {
    console.error(error)
  }
};

export const deleteActivity = async (id: number) => {
  try {
    const response = await axios.delete(`${apiURL}/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
