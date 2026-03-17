import { useEffect, useState } from "react";
import { getTrips } from "../services/tripService";
import TripCard from "./TripCard";
import type { TripData } from "../types/tripData";
import TripForm from "./TripForm";
import NavBar from "./NavBar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Dashboard() {
  const [ownTrips, setOwnTrips] = useState<TripData[]>([]);
  const [memberTrips, setMemberTrips] = useState<TripData[]>([]);
  const [isSeen, setIsSeen] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      const data = await getTrips();
      setOwnTrips(data.ownTrips);
      setMemberTrips(data.memberTrips);
    };
    fetchTrips();
  }, []);

  const refreshTrips = async () => {
    const data = await getTrips();
    setOwnTrips(data.ownTrips);
    setMemberTrips(data.memberTrips);
  };
  //combine trips you own and trips you are a member of for calendar view
  const allTrips = [...ownTrips, ...memberTrips];
  
  // Trip view in calendar
  const calendarEvents = allTrips.map((trip) => {
    const end = new Date(trip.endDate);
    end.setDate(end.getDate() + 1);

    return {
      start: trip.startDate.split("T")[0],
      end: end.toISOString().split("T")[0],
      display: "background",
      backgroundColor: "#cfdfe3",
    };
  });

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
        <div className="ml-2">
          <h1>Your Upcoming Trips</h1>
          <div className="flex gap-4">
            {ownTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
        <div className="ml-2">
          <h1>Trips you've been invited to</h1>
          <div className="flex gap-4">
          {memberTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
          </div>
        </div>
        {isSeen && (
          <TripForm
            onClose={() => setIsSeen(false)}
            onTripCreate={refreshTrips}
          />
        )}
      </div>
      <div className="w-80 calendar-wrapper bg-white rounded-xl shadow-md border p-6 ml-100">
        <h2 className="font-bold text-xl mb-3">Trip Calendar</h2>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          height="260px"
        />
      </div>
    </div>
  );
}
