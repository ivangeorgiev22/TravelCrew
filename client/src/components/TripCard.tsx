import { useNavigate } from "react-router";
import type { TripData } from "../types/tripData";

interface TripCardProps {
  trip: TripData;
}

export default function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/trips/${trip.id}`)}>
      <h3>{trip.destination}</h3>
      <p>
        {trip.startDate} - {trip.endDate}
      </p>
    </div>
  );
}
