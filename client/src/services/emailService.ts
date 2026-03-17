import axios from "axios";
import type {formData} from '../types/inviteForm'; 

const apiURL = "http://127.0.0.1:3000/email";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const sendEmail = async(FormData : formData) => {
    try {
      const send = await axios.post(apiURL, FormData, authHeader())  ; 
      return send.data; 
    } catch (error) {
      console.log(error, "Could not create activity");
    }
}


