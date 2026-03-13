import { useNavigate } from "react-router";

export default function TripCard({trip}: TripData) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/trips/${trip.id}`)}>
      <h3>{trip.destination}</h3>

      <p>
        {trip.startDate} - {trip.endDate}
      </p>
      
    </div>
  )
}