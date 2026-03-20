import { useState } from "react";
import { createTrip, updateTrip } from "../services/tripService";
import type { TripData } from "../types/tripData";

interface FormProp {
  onClose: () => void;
  onTripCreate: () => void;
  onTripUpdate: () => void;
  trip?: TripData; // Optional prop for editing an existing trip
}
export default function TripForm({
  onClose,
  onTripCreate,
  onTripUpdate,
  trip,
}: FormProp) {
  const isEditing = !!trip; // Determine if we are in edit mode based on the presence of a trip prop
  const [formData, setFormData] = useState({
    destination: trip?.destination ?? "",
    startDate: trip?.startDate.split("T")[0] ?? "",
    endDate: trip?.endDate.split("T")[0] ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      if (isEditing && trip?.id) {
        // If editing, call updateTrip with the existing trip data merged with the new form data
        await updateTrip(trip.id, { ...trip, ...formData });
        onTripUpdate();
      } else {
        const newTrip = await createTrip(formData as TripData);
        if (new Date(newTrip.startDate).getTime() < Date.now()) {
          console.log("Error creating new trip");
          return;
        }
        onTripCreate();
      }
      onClose();
    } catch (error) {
      console.log(error, `Error ${isEditing ? "updating" : "creating"} trip`);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-1001"
      onClick={onClose}
    >
      <div
        className="bg-mist-100 p-6 rounded-xl w-106 h-106"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="">
          <h1 className="text-2xl font-semibold text-black mb-6">
            {isEditing ? "Edit Trip" : "Create a Trip"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-800"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                placeholder="ex: Paris, France"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-text"
                value={formData.destination}
                onChange={handleChange}
                disabled={isEditing}
                required
              />
            </div>
            <div>
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-gray-800"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="startDate"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-pointer"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="end-date"
                className="block text-sm font-medium text-gray-800"
              >
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="end-date"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-pointer"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-3 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer"
            >
              {isEditing ? "Save Changes" : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
