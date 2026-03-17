import axios from "axios";
import type {formData} from '../types/inviteForm'; 

const apiURL = "http://127.0.0.1:3000/trips";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const sendInvite = async(FormData : formData) => {
    try {
      const send = await axios.post(apiURL, FormData, authHeader())  ; 
      return send.data; 
    } catch (error) {
      console.log(error, "Could not create activity");
    }
}

export const acceptInvite = async() => {
    try {
      const send = await axios.post(apiURL, authHeader())  ; 
      return send.data; 
    } catch (error) {
      console.log(error, "Could not create activity");
    }
}






