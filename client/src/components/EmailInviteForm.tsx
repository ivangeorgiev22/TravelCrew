import { useState } from "react";
import { sendInvite } from "../services/emailService";
interface InviteProps {
  onClose: () => void;
  tripId: number;
}

export default function Invite({ onClose, tripId }: InviteProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "name") setName(event.target.value);
    else if (event.target.name === "email") setEmail(event.target.value);
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-2000"
      onClick={onClose}
    >
      <div
        className="bg-secondary p-6 rounded-xl w-106 h-85"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h1 className="text-2xl font-semibold mb-6 text-primary-txt">
            Send an Invite
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-primary-txt mb-1"
              >
                Name
              </label>
              <input
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-text"
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
                className="text-primary-txt block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                className="text-primary-txt mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 cursor-pointer"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Ex: joey@example.com"
                required
              />
            </div>
            <button
              className="w-full mt-3 bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-gray-100 transition-colors duration-300 cursor-pointer"
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
