import { useEffect, useState } from "react";
import { useParams} from 'react-router-dom';
import "tailwindcss";
import image from '../assets/panoramic.jpg'

export default function TripDetails () {
    
    const {id} = useParams; 
    const [trip, setTripDetails] = useState(''); 

    const getData = () => {
        fetch(`http://127.0.0.1:3000/trip/${id}`)
          .then((response) => response.json())
          .then((result) => setTripDetails(result))
          .then((error) => console.log("error", error))
    }

    useEffect(() => {
        getData();
    }, [id]);

   const addActivity = () => {
    console.log('Trip Added'); 
   } 

    return (
    <div>
    < div className="bg-red-50 mb-20">
        {/* <navBar/> */}
    </div>
    <div className="h-125 w-full bg-cover bg-center mb-10" style={{backgroundImage: `url(${image})`}}  >
    <h1 className ="text-white ml-10 font-bold leading-10">Destination</h1>
    <h1 className ="text-white ml-10 font-bold leading-10">Dates</h1>
    <h1 className ="text-white ml-10 font-bold leading-10">Description</h1>
    </div>
    <div className="grid justify-center">
      <div className='place-items-start border text-center text-lg mb-10'>
      <button onClick={addActivity}>Add Activity</button>
      </div>
    <div className="grid justify-center font-serif text-lg ">
      <details className=" border mb-10 bg-gray-200 rounded-lg ">
        <summary className="mb-5 font-bold text-center justify-center"> 
          Activity date 
        </summary>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
      </details>  

    </div>
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