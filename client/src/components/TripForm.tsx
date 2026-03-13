import { useState } from "react";
import { useNavigate } from "react-router";
import { createTrip } from "../service-auth/trip";
import type { TripData } from "../types/tripData";

export default function TripForm() {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      await createTrip({ destination, startDate, endDate } as TripData);
      navigate("/dashboard");
    } catch (error) {
      console.log(error, "Error creating new trip");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-1 text-black">Create a Trip</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="destination"
            aria-label="Destination"
            className="block text-sm font-medium text-gray-800"
          >
            Destination
          </label>
          <input
            type="destination"
            id="destination"
            name="destination"
            placeholder="ex: Paris, France"
            className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            value={formData.destination}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="start-date"
            aria-label="Start Date"
            className="block text-sm font-medium text-gray-800"
          >
            Start Date
          </label>
          <input
            type="datetime-local"
            id="start-date"
            name="start-date"
            className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            value={formData.startDate}
            onChange={handleChange}
            required
          ></input>
          <label
            htmlFor="end-date"
            aria-label="End Date"
            className="block text-sm font-medium text-gray-800"
          >
            End Date
          </label>
          <input
            type="datetime-local"
            name="end-date"
            id="end-date"
            className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            value={formData.endDate}
            onChange={handleChange}
            required
          ></input>
        </div>
      </form>
    </div>
  );
}
