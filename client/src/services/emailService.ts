import axios from "axios";

const API_URL = "http://127.0.0.1:3000/invites";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const sendInvite = async (
  tripId: number,
  name: string,
  email: string,
) => {
  try {
    const res = await axios.post(
      `${API_URL}/${tripId}`,
      { name, email },
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.log(error, "Could not send invite");
  }
};

export const acceptInvite = async (inviteToken: string) => {
  try {
    const res = await axios.post(
      `${API_URL}/accept`,
      { inviteToken },
      authHeader(),
    );
    return res.data;
  } catch (error) {
    console.log(error, "Could not accept the invite");
  }
};
