import { useState } from "react";
import { sendInvite } from "../services/emailService";
interface FormInvite {
  onClose: () => void;
  tripId: number;
}

export default function Invite({ onClose, tripId }: FormInvite) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "name") setName(event.target.value);
    if (event.target.name === "email") setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    try {
      await sendInvite(tripId, name, email);
      setName("");
      setEmail("");
      onClose();
    } catch (error) {
      console.log(error, "error no email send");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-2000"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md w-106 h-"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h1 className="text-3xl font-semibold mb-6 text-black">
            Send an invite
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Name
              </label>
              <input
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-text"
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Ex: Joey Smith"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Email
              </label>
              <input
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-pointer"
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter a mail"
                required
              />
            </div>
            <button
              className="w-full mt-3 bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 cursor-pointer"
              type="submit"
            >
              Invite
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
