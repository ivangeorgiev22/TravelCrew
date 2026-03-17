import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivities } from "../services/activityService";
import { getTrip } from "../services/tripService";
import image from "../assets/panoramic.jpg";
import type { TripData } from "../types/tripData";
import NavBar from "./NavBar";
import type { ActivityData } from "../types/activityData";
import ActivityForm from "./AcitivityForm";
import InviteForm from "./InviteForm";

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [isSeen, setIsSeen] = useState(false);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="0.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <button onClick={() => setIsSeen(true)}>Add Activity</button>
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
      <div className="ml-3 border w-50 flex flex-col">
        <button onClick={() => setShowInviteForm(true)} className="cursor-pointer border">Invite</button>
        {showInviteForm && (
          <InviteForm tripId={Number(id)} onClose={() => setShowInviteForm(false)} />
        )}
        {trip.Users.map((member) => (
          <div key={member.id}>
            <span>{member.name}</span>
            <span className="ml-2">{member.TripMember.role === "owner" ? "Owner" : "Member"}</span>
          </div>
        ))}
      </div>
      <div className="formInvite">{/*components pop with link ? */}</div>
      <div className="map">{/*based on the acvity in the city*/}</div>
    </div>
  );
}
