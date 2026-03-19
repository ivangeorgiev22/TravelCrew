import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivities } from "../services/activityService";
import { getTrip } from "../services/tripService";
// import image from "../assets/panoramic.jpg";
import type { TripData } from "../types/tripData";
import NavBar from "./NavBar";
import type { ActivityData } from "../types/activityData";
import ActivityForm from "./AcitivityForm";
import Invite from "./EmailInviteForm";
import { FaPlus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { deleteActivity } from "../services/activityService";
import Map from "../components/Map";
import "leaflet/dist/leaflet.css";

// import Trip Data and do file for

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
    return activities.reduce(
      (group, activity) => {
        const date = activity.date.split("T")[0];
        if (!group[date]) {
          group[date] = [];
        }
        group[date].push(activity);
        return group;
      },
      {} as Record<string, ActivityData[]>,
    );
  };

  const activityDeleted = async (id: number) => {
    try {
      await deleteActivity(id);
      setActivities((oldActivities) =>
        oldActivities.filter((oldActivity) => oldActivity.id !== id),
      );
    } catch (error) {
      console.log(error, "impossible to delete activity");
    }
  };

  const allActivities = groupedActivities(activities);

  if (!trip) return <p>Loading trip...</p>;

  return (
    <div className="bg-mist-100 min-h-screen">
      <div>
        <NavBar />
      </div>
      <div className="relative">
        {/* <img src={image} className="h-60 w-full object-cover mb-10"></img> */}
        <div className="shadow-lg shadow-gray-400 bg-gradient-to-br from-orange-400 to-rose-500 h-50 w-full object-cover mb-10"></div>
        <div className="absolute inset-0 flex-col flex justify-end p-6">
          <h1 className="text-white ml-10 font-bold text-3xl leading-10 z-2000">
            {trip.destination}
          </h1>{" "}
          <h1 className="text-white ml-10 leading-10">
            {new Date(trip.startDate).toLocaleDateString()} -{" "}
            {new Date(trip.endDate).toLocaleDateString()}
          </h1>{" "}
        </div>
      </div>
      <div className="container mx-auto grid lg:grid-cols-[1fr_500px] gap-8 ">
        <div>
          <button
            className=" hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer p-2 border text-center text-lg mb-10 bg-gray-900 text-white rounded-lg inline-flex items-center gap-2"
            onClick={() => setIsSeen(true)}
          >
            <FaPlus /> Add Activity
          </button>
          <div>
            {Object.entries(allActivities).map(([date, activity]) => (
              <div key={date} className="font-serif text-lg">
                {" "}
                <details
                  open
                  className=" mb-5 justify-center group border border-gray-200 rounded-xl p-4 bg-white shadow-sm transition hover:shadow-md"
                >
                  <summary className="font-bold justify-center list-none">
                    {date}
                  </summary>
                  {activity.map((activity) => (
                    <div
                      key={activity.id}
                      className="mt-5 flex justify-between"
                    >
                      {activity.time} - {activity.location}
                      <button
                        onClick={() =>
                          activity.id && activityDeleted(Number(activity.id))
                        }
                        className="inline-flex opacity-0 hover:opacity-100 "
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  ))}
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
        </div>
        <div className="max-w-5xl">
          <div className="flex justify-center mb-5">
            <Map activities={activities} city={trip.destination} />
          </div>
          <div className="flex flex-col justify-end mb-10 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
            <div className="flex flex-row-reverse justify-between">
              <button
                className=" hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer p-2 border text-lg bg-orange-500 text-white rounded-lg inline-flex justify-center items-center gap-2"
                onClick={() => setMembers(true)}
              >
                <FaPlus /> Add Members
              </button>
              {addMembers && (
                <Invite onClose={() => setMembers(false)} tripId={Number(id)} />
              )}
              <h1 className="mt-2.25 font-bold text-2xl mb-2.5">The Crew</h1>
            </div>
            {trip.Users.map((member) => (
              <div className="flex flex-col" key={member.id}>
                <span>{member.name}</span>
                <span className="text-sm text-gray-600">
                  {member.TripMember.role === "owner" ? "Owner" : "Member"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
