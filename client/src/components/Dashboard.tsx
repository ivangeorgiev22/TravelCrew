import { useEffect, useState } from "react";
import { getTrips } from "../services/tripService";
import TripCard from "./TripCard";
import type { TripData } from "../types/tripData";
import TripForm from "./TripForm";
import NavBar from "./NavBar";

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

  const refreshTrips = async () => {
    const data = await getTrips();
    setTrips(data);
  };

  return (
    <div>
      <NavBar />
      <div>
        <button
          className="m-4 bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer"
          onClick={() => setIsSeen(true)}
        >
          + Add a trip
        </button>
        <h1>Your Upcoming Trips</h1>
        <div className="flex gap-4 ml-2">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
        {isSeen && (
          <TripForm
            onClose={() => setIsSeen(false)}
            onTripCreate={refreshTrips}
          />
        )}
      </div>
    </div>
  );
}
