import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { acceptInvite } from "../services/inviteService";

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

 useEffect(() => {
    const joinTrip = async () => {
      if (!token) return;
      
      try {
        const response = await acceptInvite(token);
        navigate(`/trips/${response.tripId}`);
      } catch (error) {
        console.error(error);
        navigate("/dashboard");
      }
    };

    joinTrip();
  }, [token, navigate]);


  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-xl font-semibold">
        Accepting invitation...
      </h1>
    </div>
  );
}