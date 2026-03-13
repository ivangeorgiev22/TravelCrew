import axios from "axios";

const apiURL = 'http://127.0.0.1:3000/trips';

const authHeader = () => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
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