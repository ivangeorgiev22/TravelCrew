import { useEffect, useState } from "react";
import { getTrips } from "../services/tripService";
import TripCard from "./TripCard";
import type { TripData } from "../types/tripData";
import TripForm from "./TripForm";

export default function Dashboard() {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [isSeen, setIsSeen] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      const data = await getTrips();
      setTrips(data);
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <button className="cursor-pointer" onClick={() => setIsSeen(true)}>
        + Add a trip
      </button>
      <h1>Your Upcoming Trips</h1>
      <div>
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
      {isSeen && <TripForm onClose={() => setIsSeen(false)} />}
    </div>
  );
}
