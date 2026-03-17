import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { acceptInvite } from "../services/emailService";

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hasRequested = useRef(false);
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the user has a session token/is logged in

  const token = params.get("token"); // Get the invite token from the URL

  useEffect(() => {
    // If the user is authenticated and there's a token, we can accept the invite
    const joinTrip = async () => {
      if (!isAuthenticated) {
        navigate("/", { state: { from: `/accept-invite?token=${token}` } });
        return;
      }
      if (!token || hasRequested.current) return;
      hasRequested.current = true;

      try {
        const response = await acceptInvite(token);
        navigate(`/trips/${response.tripId}`);
      } catch (error) {
        console.error(error);
        navigate("/dashboard");
      }
    };
    joinTrip();
  }, [token, navigate, isAuthenticated]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-xl font-semibold">Accepting invitation...</h1>
    </div>
  );
}
