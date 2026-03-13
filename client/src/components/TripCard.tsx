import { useNavigate } from "react-router";
import type { TripData } from "../types/tripData";

interface TripCardProps {
  trip: TripData;
}

export default function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/trips/${trip.id}`)} className="border bg-slate-400 flex flex-col p-3 w-50 cursor-pointer">
      <h3>{trip.destination}</h3>
      <p>
        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
      </p>
    </div>
  );
}
