import axios from "axios";

const apiURL = "http://127.0.0.1:3000/invites";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const sendInvite = async(tripId: number, name : string, email: string) => {
    try {
      const send = await axios.post(`${apiURL}/${tripId}`, {name, email}, authHeader())  ; 
      return send.data; 
    } catch (error) {
      console.log(error, "Could not send invite");
    }
}

export const acceptInvite = async() => {
    try {
      const send = await axios.post(`${apiURL}/accept`, authHeader())  ; 
      return send.data; 
    } catch (error) {
      console.log(error, "Could not accept the invite");
    }
}






