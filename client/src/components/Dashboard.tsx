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
  const [userName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });

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
      <div className="bg-mist-100 min-h-screen">
        <div className="flex justify-between items-center container mx-auto mb-6 pb-4 pt-5 border-b border-gray-200">
          {" "}
          <div className="flex flex-col justify-center">
            <span className="text-md text-gray-500">Welcome back,</span>
            <h1 className="font-semibold text-2xl text-gray-900">{userName}</h1>
          </div>
          <button
            className="bg-gradient-to-br from-orange-400 to-rose-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition-all duration-200 shadow-sm"
            onClick={() => setIsSeen(true)}
          >
            + Add a trip
          </button>
        </div>
        <div className="container mx-auto grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="mb-4 text-lg font-semibold text-gray-900">
                Your Upcoming Trips
              </h1>
              {ownTrips.length > 0 ? (
                <div className="flex flex-wrap gap-5">
                  {ownTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming trips.</p>
              )}
            </div>
            <div>
              <h1 className="mb-4 text-lg font-semibold text-gray-900">
                Shared With You
              </h1>
              {memberTrips.length > 0 ? (
                <div className="flex flex-wrap gap-5">
                  {memberTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-md">
                  No trips shared with you.
                </p>
              )}
            </div>
          </div>
          {isSeen && (
            <TripForm
              onClose={() => setIsSeen(false)}
              onTripCreate={refreshTrips}
            />
          )}
          <div>
            <div className="w-80 calendar-wrapper bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              {" "}
              <h2 className="font-semibold text-lg text-gray-900 mb-4">
                Trip Calendar
              </h2>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                height="267px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
