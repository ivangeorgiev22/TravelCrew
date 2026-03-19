import { useState } from "react";
import type { ActivityData } from "../types/activityData";
import { createActivity } from "../services/activityService";

interface FormProp {
  onClose: () => void;
  onActivityCreate: () => void;
  tripId: number;
  defaultDate: string | null;
}

export default function ActivityForm({
  onClose,
  onActivityCreate,
  tripId,
  defaultDate,
}: FormProp) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    location: "",
    date: defaultDate || "",
    time: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      await createActivity({ ...formData, tripId } as ActivityData);
      onActivityCreate();
      onClose();
    } catch (error) {
      console.log(error, "Error creating new activity.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center z-2000"
      onClick={onClose}
    >
      <div
        className="bg-mist-100 p-6 rounded-xl w-106 h-125"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h1 className="text-2xl font-semibold mb-6 text-black">
            Add Activity
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-800"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="ex: Museum Visit"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-800"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="ex: The Louvre"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-pointer"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-800"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-800"
              >
                Time
              </label>
              <input
                type="time"
                name="time"
                id="time"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-3 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
