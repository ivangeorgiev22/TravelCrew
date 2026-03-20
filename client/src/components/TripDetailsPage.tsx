import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getActivities } from "../services/activityService";
import { getTrip } from "../services/tripService";
import type { TripData } from "../types/tripData";
import NavBar from "./NavBar";
import type { ActivityData } from "../types/activityData";
import ActivityForm from "./AcitivityForm";
import Invite from "./EmailInviteForm";
import { MdDeleteForever } from "react-icons/md";
import { deleteActivity } from "../services/activityService";
import { deleteTrip } from "../services/tripService";
import Map from "../components/Map";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";
import { IoPersonAdd } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import { GrMapLocation } from "react-icons/gr";

// import Trip Data and do file for

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [isSeen, setIsSeen] = useState(false);
  const [addMembers, setMembers] = useState(false);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editActivity, setEditActivity] = useState<ActivityData | null>(null);
  const navigate = useNavigate();

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
  const allActivities = groupedActivities(activities);

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
  const handleTripDelete = async (id: number) => {
    try {
      await deleteTrip(id);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  //toggle deleteTrip button visibility based on user role
  const userName = localStorage.getItem("userName");
  const isOwner = trip?.Users.some(
    (user) => user.name === userName && user.TripMember.role === "owner",
  );

  //get num of days for each trip
  const getTripDays = (startDate: string, endDate: string) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  if (!trip) return <p>Loading trip...</p>;

  return (
    <div className="bg-mist-100 min-h-screen">
      <div>
        <NavBar />
      </div>
      <div className="relative">
        <div className="shadow-xl bg-linear-to-br from-orange-400 to-rose-500 h-50 w-full object-cover mb-10"></div>
        <div className="absolute inset-0 flex-col flex justify-end p-6">
          <div className="flex justify-end my-10 mx-5 gap-4">
            {isOwner && (
              <>
                <div className="flex gap-1 items-center hover hover:text-white cursor-pointer">
                  <FaEdit className="text-white text-md" />
                  <button className="text-gray-200 text-md">Edit</button>
                </div>
                <div className="flex items-center hover hover:text-white cursor-pointer">
                  <MdDeleteForever className="text-white text-lg" />
                  <button
                    onClick={() => handleTripDelete(Number(id))}
                    className="text-gray-200 text-md"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 pl-10">
            <GrMapLocation className="text-white text-3xl" />
            <h1 className="text-white font-semibold text-3xl">
              {trip.destination}
            </h1>
          </div>
          <div className="flex items-center gap-1 pl-10">
            <CiCalendar className="text-white" />
            <h1 className="text-white leading-10 text-sm">
              {format(new Date(trip.startDate), "MMM dd, yyyy")} –{" "}
              {format(new Date(trip.endDate), "MMM dd, yyyy")}
            </h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto grid lg:grid-cols-[1fr_450px] gap-8">
        <div>
          <div className="p-2">
            <h1 className="font-semibold text-xl">Itinerary</h1>
          </div>
          {getTripDays(trip.startDate, trip.endDate).map((date, index) => {
            const formattedDate = format(date, "yyyy-MM-dd");
            const dailyActivities = allActivities[formattedDate] || [];

            return (
              <details
                open
                key={formattedDate}
                className="mb-5 group border border-gray-200 rounded-xl p-4 bg-white shadow-sm transition hover:shadow-md"
              >
                <summary className="flex justify-between items-center list-none cursor-pointer">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Day {index + 1}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(date, "do MMM")}
                    </p>
                  </div>
                  <button
                    className="text-gray-500 text-sm cursor-pointer hover hover:text-gray-800"
                    onClick={() => {
                      setEditActivity(null);
                      setIsSeen(true);
                      setSelectedDate(formattedDate);
                    }}
                  >
                    + Add Activity
                  </button>
                </summary>
                <div className="mt-4 space-y-3">
                  {dailyActivities.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No activities yet - add one
                    </p>
                  ) : (
                    dailyActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                      >
                        <div>
                          <p className="text-sm">
                            {activity.time} - {activity.location}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditActivity(activity);
                              setIsSeen(true);
                            }}
                            className="cursor-pointer text-gray-700 transition duration-200 hover:scale-110 overflow-hidden"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              activity.id &&
                              activityDeleted(Number(activity.id))
                            }
                            className="cursor-pointer text-lg text-gray-700 transition duration-200 hover:scale-110 overflow-hidden"
                          >
                            <MdDeleteForever />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </details>
            );
          })}
          {isSeen && (
            <ActivityForm
              onClose={() => {
                setIsSeen(false);
                setEditActivity(null);
              }}
              onActivityCreate={refreshActivities}
              tripId={Number(id)}
              defaultDate={selectedDate}
              activity={editActivity}
            />
          )}
        </div>
        <div className=" flex flex-col gap-5 pt-11">
          <div className="flex justify-center">
            <Map activities={activities} city={trip.destination} />
          </div>
          <div className="flex flex-col justify-end mb-10 p-5 border border-gray-200 rounded-xl bg-white shadow-sm transition hover:shadow-md">
            <div className="flex flex-row-reverse justify-between">
              <button
                className="cursor-pointer p-2 text-md text-gray-500 border rounded-lg inline-flex justify-center items-center gap-2 hover:border-gray-700 hover:text-gray-700"
                onClick={() => setMembers(true)}
              >
                <IoPersonAdd /> Invite
              </button>
              {addMembers && (
                <Invite onClose={() => setMembers(false)} tripId={Number(id)} />
              )}
              <h1 className="mt-2.25 font-bold text-xl mb-2.5">The Crew</h1>
            </div>
            {trip.Users.map((member) => (
              <div className="flex items-center gap-3 my-1" key={member.id}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-500 text-white">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <p>{member.name}</p>
                  <p className="text-xs text-gray-400">
                    {member.TripMember.role === "owner" ? "Owner" : "Member"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
