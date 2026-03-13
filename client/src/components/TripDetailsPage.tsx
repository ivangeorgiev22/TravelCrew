import { useEffect, useState } from "react";
import { useParams} from 'react-router-dom';
import image from '../assets/panoramic.jpg'
import TripForm from "./TripForm";

export default function TripDetails () {
    
    const {id} = useParams; 
    const [trip, setTripDetails] = useState(''); 
    const [isSeen, setIsSeen] = useState(false);

    const getData = () => {
        fetch(`http://127.0.0.1:3000/trips/${id}`)
          .then((response) => response.json())
          .then((result) => setTripDetails(result))
          .then((error) => console.log("error", error))
    }

    useEffect( () => {
       getData();
    }, [id]);

   const addActivity = () => {
      setSeen(!seen); 
   } 

    return (
    <div>
    < div className="bg-red-50 mb-20">
        {/* <navBar/> */}
    </div>
    <div className="h-125 w-full bg-cover bg-center mb-10" style={{backgroundImage: `url(${image})`}}  >
    <h1 className ="text-white ml-10 font-bold leading-10">Destination</h1> {/* trip.destination*/}
    <h1 className ="text-white ml-10 font-bold leading-10">Dates</h1> {/* trip.startdate && trip.enddate*/}
    </div>
    <div className="grid justify-center">
      <div className=" flex items-center border text-center text-lg mb-10 bg-gray-900 text-white rounded-lg">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
      <button onClick={() => setIsSeen(true)}>Add Activity</button>
      {isSeen && (
            <TripForm onClose={() => setIsSeen(false)}/>
          )}
      </div>
    {/*{trips.activity.map((index, i) => (*/}
    <div className="font-serif text-lg  "> {/* key={index}*/}
      <details className=" border mb-10 bg-gray-200 justify-center">
        <summary className="mb-5 font-bold text-center justify-center"> 
          Activity date 
        </summary>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
      </details>  

    </div>
    {/*))}*/}
    </div>
    <div className="formInvite">
        {/*components pop with link ? */}
    </div>
    <div className="map">
        {/*based on the acvity in the city*/}
    </div>
    </div>

    );
}