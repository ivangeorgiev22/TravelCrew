import axios from "axios";

const apiUrl = "http://127.0.0.1:3000/invites";

export const sendInvite = async (
  tripId: number,
  name: string,
  email: string
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${apiUrl}/${tripId}`,
    { name, email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const acceptInvite = async (inviteToken: string) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${apiUrl}/accept`,
    { inviteToken },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};