import {useEffect, useState} from 'react';
import { getTrips } from '../service-auth/tripService';
import TripCard from './TripCard';


export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  
  useEffect(() => {

    const fetchTrips = async () => {
      const data = await getTrips();
      setTrips(data);
    };

    fetchTrips();
    
  }, []);


  return (
    <div>
      <button className='cursor-pointer'>
        + Add a trip
      </button>
    <h1>Your Upcoming Trips</h1>
    <div>
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
    </div>
  )
}