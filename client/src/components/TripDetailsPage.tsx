import { useEffect, useState } from "react";
import { useParams} from 'react-router-dom';
import { getTrip } from "../services/tripService";
import image from '../assets/panoramic.jpg'
import type { TripData } from "../types/tripData";
import NavBar from "./NavBar";

export default function TripDetails () {
  const {id} = useParams<{id: string}>(); 
  const [trip, setTrip] = useState<TripData | null>(null); 
  // const [isSeen, setIsSeen] = useState(false);

    useEffect( () => {
       const fetchTrip = async () => {
        if(!id) return;
        const data = await getTrip(Number(id));
        setTrip(data);
       }
       fetchTrip();
    }, [id]);

    if(!trip) return <p>Loading trip...</p>

    return (
    <div>
    <div className="">
       <NavBar />
    </div>
    <div className="h-125 w-full bg-cover bg-center mb-10" style={{backgroundImage: `url(${image})`}}  >
    <h1 className ="text-white ml-10 font-bold leading-10">{trip.destination}</h1> {/* trip.destination*/}
    <h1 className ="text-white ml-10 font-bold leading-10">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</h1> {/* trip.startdate && trip.enddate*/}
    </div>
    <div className="grid justify-center">
      <div className=" flex items-center border text-center text-lg mb-10 bg-gray-900 text-white rounded-lg">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
      <button>Add Activity</button>
      </div>
    {/*{trips.activity.map((index, i) => (*/}
    <div className="font-serif text-lg  "> {/* key={index}*/}
      <details className=" border mb-10 bg-gray-200 justify-center">
        <summary className="mb-5 font-bold text-center justify-center"> 
          Activity date 
        </summary>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
      </details>  {/*use reduce exercice to have all grouped bu date*/}

    </div>
    {/*))}*/}
    </div>
    <div className="formInvite">
        {/*components pop with link + another table in backend */}
    </div>
    <div className="map">
        {/*based on the activity in the city*/}
    </div>
    </div>

    );
}