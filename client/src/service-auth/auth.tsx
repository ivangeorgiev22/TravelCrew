import axios from "axios";
import type {UserData} from '../types/userData'; 

// Use the API from the Backend 
// Mock Data for now 

export const login = async(userData: UserData) => {
    const response = await axios.post("http://localhost:3030/auth", userData); 
    const accessToken = response?.data?.accessToken;
    if(accessToken){
        localStorage.setItem('token', accessToken); 
    }
    return accessToken; 
}

export const register = async(userData: UserData): Promise<void> => {
     await axios.post("http://localhost:3030/auth", userData); 

}

export const logout = () => {
    localStorage.removeItem("token")
}






