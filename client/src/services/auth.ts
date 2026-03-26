import axios from "axios";
import type { UserData } from "../types/userData";

const apiUrl = "http://127.0.0.1:3000/auth";

export const login = async (userData: UserData) => {
  const response = await axios.post(`${apiUrl}/login`, userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem('userName', response.data.name);
  }
  return response.data;
};

export const register = async (userData: UserData): Promise<void> => {
  await axios.post(`${apiUrl}/signup`, userData);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
};
