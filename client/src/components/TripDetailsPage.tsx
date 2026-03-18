import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivities } from "../services/activityService";
import { getTrip } from "../services/tripService";
import image from "../assets/panoramic.jpg";
import type { TripData } from "../types/tripData";
import NavBar from "./NavBar";
import type { ActivityData } from "../types/activityData";
import ActivityForm from "./AcitivityForm";
import Invite from './EmailInviteForm'; 
import { FaPlus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {deleteActivity} from '../services/activityService'; 
import Map from "./Map";


export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [isSeen, setIsSeen] = useState(false);
  const [addMembers, setMembers] = useState(false);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      const tripData = await getTrip(Number(id));
      const activityData = await getActivities(Number(id));
      setTrip(tripData);
      setActivities(activityData);
    };
    fetchTrip();
  }, [id]);

  const refreshActivities = async () => {
    const data = await getActivities(Number(id));
    setActivities(data);
  };

  const groupedActivities = (activities: ActivityData[]) => {
    return activities.reduce((group, activity) => {
      const date = activity.date.split('T')[0]; 
  if (!group[date]) {
        group[date] = [];
    }
    group[date].push(activity);
    return group;
  }, {} as Record<string, ActivityData[]>); 
  }

  const activityDeleted = async (id: number) => {
    try {
      await deleteActivity(id);
      setActivities(oldActivities => oldActivities.filter(oldActivity => oldActivity.id !== id));
    } catch (error) {
      console.log(error, "impossible to delete activity")
    }
  }
   
  const allActivities = groupedActivities(activities); 

  if (!trip) return <p>Loading trip...</p>;

  return (
    <div>
      <div className="">
        <NavBar />
      </div>
      <div
        className="h-125 w-full bg-cover bg-center mb-10"
        style={{ backgroundImage: `url(${image})` }}
      >
        <h1 className="text-white ml-10 font-bold leading-10">
          {trip.destination}
        </h1>{" "}
        {/* trip.destination*/}
        <h1 className="text-white ml-10 font-bold leading-10">
          {new Date(trip.startDate).toLocaleDateString()} -{" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </h1>{" "}
        {/* trip.startdate && trip.enddate*/}
      </div>
      <div className="grid justify-center">
        <div className=" flex items-center border text-center text-lg mb-10 bg-gray-900 text-white rounded-lg">
          <button className="inline-flex items-center gap-2" onClick={() => setIsSeen(true)}><FaPlus /> Add Activity</button>
        </div>
        {Object.entries(allActivities).map(([date, activity]) => (
        <div key={date} className="font-serif text-lg  ">
          {" "}
          <details className=" border mb-10 bg-gray-200 justify-center">
            <summary className="mb-5 font-bold text-center justify-center">
              {date}
            </summary>
            {activity.map((activity) => (
              <div key={activity.id}>
                {activity.name} - {activity.location} 
                <button onClick={() => activity.id && activityDeleted(Number(activity.id))}
                className="inline-flex items-center"><MdDeleteForever /> Delete</button>
              </div>
            )  )}
          </details>
        </div>
        ))}
        {isSeen && (
          <ActivityForm
            onClose={() => setIsSeen(false)}
            onActivityCreate={refreshActivities}
            tripId={Number(id)}
          />
        )}
      </div>
      <div className="flex justify-end mr-20 mb-10">
        <button className=" bg-gray-900 text-white rounded-lg text-center text-lg inline-flex items-center gap-2" 
        onClick={() => setMembers(true)}
        >
        <FaPlus /> Add Members
        </button>
        {addMembers && (
        < Invite 
        onClose={() => setMembers(false)}
        tripId={Number(id)} 
        />
        )}
        {trip.Users.map((member) => (
          <div key={member.id}>
            <span>{member.name}</span>
            <span className="ml-2">{member.TripMember.role === "owner" ? "Owner" : "Member"}</span>
          </div>
        ))}
    </div>
      <div className="map">{/*based on the activity in the city*/}</div>
      <Map activities={activities} />
    </div>
  );
}
