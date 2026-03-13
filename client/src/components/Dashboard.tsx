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
      <button
        className="w-40 bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
        onClick={() => setIsSeen(true)}
      >
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
