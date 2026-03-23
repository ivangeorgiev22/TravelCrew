import { useState } from "react";
import { createTrip } from "../services/tripService";
import type { TripData } from "../types/tripData";

interface FormProp {
  onClose: () => void;
  onTripCreate: () => void;
}
export default function TripForm({ onClose, onTripCreate }: FormProp) {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const newTrip = await createTrip(formData as TripData);
      if (new Date(newTrip.startDate).getTime() < Date.now()) {
        console.log("Error creating new trip");
        return;
      }
      onTripCreate();
      onClose();
    } catch (error) {
      console.log(error, "Error creating new trip");
    }
  };

  return (
    <div
      className="fixed inset-0 text-primary-txt backdrop-blur-sm flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div
        className="bg-secondary p-6 rounded-xl w-106 h-106"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="">
          <h1 className="text-2xl font-semibold text-primary-txt mb-6">
            Create a Trip
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-primary-txt"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                placeholder="ex: Paris, France"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-text"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-primary-txt"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="startDate"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-pointer"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="end-date"
                className="block text-sm font-medium text-primary-txt"
              >
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="end-date"
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-pointer"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-3 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer"
            >
              Create Trip
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
