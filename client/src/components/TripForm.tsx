import { useState } from "react";
import { createTrip } from "../services/tripService";
import type { TripData } from "../types/tripData";

interface FormProp {
  onClose: () => void;
}
export default function TripForm({ onClose }: FormProp) {
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
      await createTrip(formData as TripData);
      setFormData({ destination: "", startDate: "", endDate: "" });
    } catch (error) {
      console.log(error, "Error creating new trip");
    }
  };

  return (
    <div className="max-w-md w-full px-6 py-8">
      <h1 className="text-3xl font-semibold mb-1 text-black">Create a Trip</h1>
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
            className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            value={formData.destination}
            onChange={handleChange}
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
            className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
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
            className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 mt-4"
        >
          Create Trip
        </button>
      </form>
    </div>
  );
}
