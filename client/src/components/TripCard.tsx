import { useNavigate } from "react-router";
import type { TripData } from "../types/tripData";
// import img from "../assets/landingpage.jpg";
import { format } from "date-fns";

interface TripCardProps {
  trip: TripData;
}

export default function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="relative rounded-xl flex flex-col w-60 cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.50)] transition duration-200 hover:scale-110 overflow-hidden"
    >
      {/* Background */}
      <div className="bg-linear-to-br from-orange-400 to-rose-500 h-50 w-full"></div>
      {/* <div className="absolute inset-0 bg-black/15"></div> */}
      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h3 className="text-white font-bold text-2xl leading-tight">
          {trip.destination}
        </h3>

        <p className="text-white text-sm mt-2 opacity-90">
          {format(new Date(trip.startDate), "MMM dd, yyyy")} –{" "}
          {format(new Date(trip.endDate), "MMM dd, yyyy")}
        </p>
      </div>
    </div>
  );
}
