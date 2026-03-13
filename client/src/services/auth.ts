import axios from "axios";
import type {UserData} from '../types/userData'; 

// Use the API from the Backend 
const apiUrl = "http://127.0.0.1:3000/auth"
// Mock Data for now 



export const login = async(userData: UserData) => {
    const response = await axios.post(`${apiUrl}/login`, userData); 
    //const accessToken = response?.data?.accessToken;
    if(response.data.token){
        localStorage.setItem('token', response.data.token); 
    }
    return response.data; 
}

export const register = async(userData: UserData): Promise<void> => {
     await axios.post(`${apiUrl}/signup`, userData); 

}

export const logout = () => {
    localStorage.removeItem("token")
}






