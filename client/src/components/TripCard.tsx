import { useNavigate } from "react-router";
import type { TripData } from "../types/tripData";
import img from '../assets/landingpage.jpg';

interface TripCardProps {
  trip: TripData;
}

export default function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/trips/${trip.id}`)} className="bg-transparent rounded-xl flex flex-col w-70 cursor-pointer shadow-[0_10px_15px_rgba(0,0,0,0.50)] transition delay-100 duration-200  hover:scale-110">
      <div className="">
        <img src={img} className="rounded-t-xl h-50 w-70"/>
      </div>
      <div className="p-2 flex flex-col text-center">
        <h3 className="">{trip.destination}</h3>
        <p className="text-sm text-neutral-500">
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
